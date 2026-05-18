// ── Subscriptions Supabase Service — Phase G ─────────────────────────────────
// Browser-client functions for reading subscription, billing, and add-on data.
//
// Security model (mirrors RLS):
//   · fetchUserSubscription     — read own row (user_id = auth.uid())
//   · fetchBillingRecords       — read own rows (user_id = auth.uid())
//   · fetchUserAddOns           — read own rows, paid only
//   · checkActiveListingCount   — counts listings.status='active' for owner
//   · fetchUserUsageLimits      — combines subscription + real listing count
//
// Payment writes (create/activate subscriptions, mark paid) NEVER happen here.
// Those are triggered exclusively by the server-side webhook route using the
// service role key. Clients cannot mutate payment_status or subscription status.
//
// DEV_SKIP_AUTH: all functions return null / [] so pages fall back to mock data.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import type {
  UserSubscription,
  BillingRecord,
  AddOnPurchase,
  UsageLimit,
} from "@/lib/payments/types";
import type { PlanId, SubscriptionStatus, PaymentStatus } from "@/lib/payments/types";
import { PLAN_ENTITLEMENTS } from "@/lib/payments/plans";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

// ── DB row shapes ─────────────────────────────────────────────────────────────

interface DbSubscriptionRow {
  id: string;
  user_id: string | null;
  agency_id: string | null;
  plan_id: string;
  status: string;
  billing_cycle: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  provider: string;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface DbBillingRecordRow {
  id: string;
  subscription_id: string | null;
  user_id: string | null;
  agency_id: string | null;
  amount_omr: number | string;
  currency: string;
  payment_status: string;
  provider: string;
  provider_payment_id: string | null;
  description: string | null;
  invoice_url: string | null;
  paid_at: string | null;
  created_at: string;
}

interface DbAddonRow {
  id: string;
  subscription_id: string | null;
  user_id: string | null;
  addon_type: string;
  listing_id: string | null;
  quantity: number;
  amount_omr: number | string;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  created_at: string;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

/**
 * Maps DB subscription row to the UserSubscription UI type.
 * Key rule: a free plan user has DB status='active' and plan_id='free'.
 * To keep the existing UI components happy (which expect status='free' for
 * free plans), we map plan_id='free' + status='active' → TS status='free'.
 */
function rowToUserSubscription(row: DbSubscriptionRow): UserSubscription {
  const planId = row.plan_id as PlanId;
  let status = row.status as SubscriptionStatus;
  if (planId === "free" && status === "active") {
    status = "free" as SubscriptionStatus;
  }

  // Default period: start = now, end = 30 days out (for free plans with no period set)
  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 30 * 86_400_000);

  return {
    userId: row.user_id ?? "",
    planId,
    status,
    billingCycle: (row.billing_cycle as "monthly" | "annual") ?? "monthly",
    currentPeriodStart: row.current_period_start ?? now.toISOString(),
    currentPeriodEnd:   row.current_period_end   ?? defaultEnd.toISOString(),
    cancelAtPeriodEnd:  row.cancel_at_period_end,
  };
}

/**
 * Maps DB billing_records row to the BillingRecord UI type.
 * DB payment_status 'cancelled' → TypeScript 'failed' (TypeScript type has no 'cancelled').
 */
function rowToBillingRecord(row: DbBillingRecordRow): BillingRecord {
  const rawStatus = row.payment_status;
  const status: PaymentStatus =
    rawStatus === "cancelled" ? "failed"
    : (rawStatus as PaymentStatus);

  return {
    id:         row.id,
    userId:     row.user_id ?? "",
    planId:     "free",                           // enriched below if needed
    description: row.description ?? "—",
    amount:     Number(row.amount_omr),
    status,
    date:       row.paid_at ?? row.created_at,
    invoiceRef: row.invoice_url ?? undefined,
  };
}

/**
 * Maps DB subscription_addons row to the AddOnPurchase UI type.
 * Only 'paid' add-ons are considered active and visible.
 */
function rowToAddOnPurchase(row: DbAddonRow): AddOnPurchase {
  // Map DB addon_type to TypeScript AddOnType
  // 'area_page_placement' in DB → 'area_placement' in TypeScript (existing UI type)
  const addonTypeMap: Record<string, string> = {
    area_page_placement: "area_placement",
  };
  const addOnType =
    (addonTypeMap[row.addon_type] ?? row.addon_type) as AddOnPurchase["addOnType"];

  const now = new Date().toISOString();
  return {
    id:          row.id,
    userId:      row.user_id ?? "",
    addOnType,
    listingId:   row.listing_id ?? undefined,
    amount:      Number(row.amount_omr),
    purchasedAt: row.created_at,
    expiresAt:   row.ends_at   ?? now,
    isActive:    row.status === "paid" && (row.ends_at == null || row.ends_at > now),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchUserSubscription
// Returns the user's current subscription row.
// Returns null if not found or on error (caller uses mock fallback).
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  if (DEV_SKIP_AUTH) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Subscriptions] fetchUserSubscription error:", error);
    return null;
  }
  if (!data) return null;

  return rowToUserSubscription(data as DbSubscriptionRow);
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchBillingRecords
// Returns the user's billing history, newest first.
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchBillingRecords(
  userId: string,
  limit = 20
): Promise<BillingRecord[]> {
  if (DEV_SKIP_AUTH) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("billing_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Subscriptions] fetchBillingRecords error:", error);
    return [];
  }

  return (data ?? []).map((r) => rowToBillingRecord(r as DbBillingRecordRow));
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchUserAddOns
// Returns the user's add-on purchases (all statuses — caller filters by isActive).
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchUserAddOns(userId: string): Promise<AddOnPurchase[]> {
  if (DEV_SKIP_AUTH) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscription_addons")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Subscriptions] fetchUserAddOns error:", error);
    return [];
  }

  return (data ?? []).map((r) => rowToAddOnPurchase(r as DbAddonRow));
}

// ─────────────────────────────────────────────────────────────────────────────
// checkActiveListingCount
// Returns the number of currently active listings owned by the user.
// Used by plan limit enforcement in listing creation flows.
// This is a REAL Supabase query — not a mock.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkActiveListingCount(userId: string): Promise<number> {
  if (DEV_SKIP_AUTH) return 0;

  const supabase = createClient();
  const { count, error } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", userId)
    .eq("status", "active");

  if (error) {
    console.error("[Subscriptions] checkActiveListingCount error:", error);
    return 0;
  }

  return count ?? 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchUserUsageLimits
// Builds UsageLimit[] by combining the real subscription plan with real listing
// counts. AI usage limits show 0 (Phase H will wire AI usage logs).
// Returns [] on error — caller uses mock fallback.
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchUserUsageLimits(userId: string): Promise<UsageLimit[]> {
  if (DEV_SKIP_AUTH) return [];

  // Fetch subscription and active listing count in parallel
  const [sub, listingCount] = await Promise.all([
    fetchUserSubscription(userId),
    checkActiveListingCount(userId),
  ]);

  if (!sub) return [];

  const entitlement = PLAN_ENTITLEMENTS[sub.planId];

  // Featured listing usage this month (paid addons only)
  const supabase = createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: featuredCount } = await supabase
    .from("subscription_addons")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("addon_type", "featured_listing")
    .eq("status", "paid")
    .gte("created_at", startOfMonth.toISOString());

  const limits: UsageLimit[] = [
    {
      feature:  "listing",
      labelAr:  "الإعلانات النشطة",
      current:  listingCount,
      limit:    entitlement.maxActiveListings,
    },
    {
      feature:  "ai_assistant",
      labelAr:  "مساعد ذكي (يومي)",
      current:  0,                              // Phase H: AI usage logs
      limit:    entitlement.aiAssistantDailyLimit === -1
                  ? null : entitlement.aiAssistantDailyLimit,
    },
    {
      feature:  "ai_description",
      labelAr:  "توليد وصف ذكي (يومي)",
      current:  0,                              // Phase H: AI usage logs
      limit:    entitlement.aiDescriptionDailyLimit === -1
                  ? null : entitlement.aiDescriptionDailyLimit,
    },
    {
      feature:  "featured_listing",
      labelAr:  "إعلانات مميزة (شهري)",
      current:  featuredCount ?? 0,
      limit:    entitlement.maxFeaturedListings,
      resetsAt: (() => {
        const end = new Date();
        end.setMonth(end.getMonth() + 1);
        end.setDate(1);
        return end.toISOString().slice(0, 10);
      })(),
    },
  ];

  return limits;
}
