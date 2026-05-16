// ── Payment & subscription types — Phase 14 ──────────────────────────────────
// SECURITY NOTE: All entitlements must be validated server-side in production.
// Client-side checks are UX helpers only — never trust them for access control.

import type { PlanId } from "@/types/subscription";
export type { PlanId };

// ── Subscription lifecycle ─────────────────────────────────────────────────────
export type SubscriptionStatus =
  | "free"       // no paid plan
  | "trial"      // trial period active
  | "active"     // paid and current
  | "past_due"   // payment failed, grace period
  | "cancelled"  // will not renew at period end
  | "expired";   // period ended, no renewal

export type BillingCycle = "monthly" | "annual";

// ── Add-on types ───────────────────────────────────────────────────────────────
export type AddOnType =
  | "featured_listing"
  | "lead_boost"
  | "homepage_placement"
  | "area_placement";

// ── Payment statuses ───────────────────────────────────────────────────────────
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// ── Plan entitlements ──────────────────────────────────────────────────────────
export interface PlanEntitlement {
  planId: PlanId;
  maxActiveListings: number | null;  // null = unlimited
  maxFeaturedListings: number;       // included per month
  canAccessAnalytics: boolean;
  canAccessLeads: boolean;
  canManageTeam: boolean;
  verificationEligible: boolean;
  aiAssistantDailyLimit: number;     // -1 = unlimited
  aiDescriptionDailyLimit: number;
  aiSmartReplyDailyLimit: number;
  canPurchaseFeaturedListing: boolean;
  canPurchaseLeadBoost: boolean;
  prioritySupport: boolean;
}

// ── Usage tracking ─────────────────────────────────────────────────────────────
export type UsageFeature =
  | "listing"
  | "ai_assistant"
  | "ai_description"
  | "ai_smart_reply"
  | "featured_listing"
  | "lead_boost";

export interface UsageLimit {
  feature: UsageFeature;
  labelAr: string;
  current: number;
  limit: number | null;  // null = unlimited
  resetsAt?: string;     // ISO date
}

// ── User subscription ──────────────────────────────────────────────────────────
export interface UserSubscription {
  userId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;  // ISO date
  currentPeriodEnd: string;    // ISO date
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;        // ISO date
  // SECURITY: In production, verify via server-side webhook — never trust client
}

// ── Add-on purchases ───────────────────────────────────────────────────────────
export interface AddOnPurchase {
  id: string;
  userId: string;
  addOnType: AddOnType;
  listingId?: string;
  amount: number;       // OMR
  purchasedAt: string;  // ISO date
  expiresAt: string;    // ISO date
  isActive: boolean;
}

// ── Billing records ────────────────────────────────────────────────────────────
export interface BillingRecord {
  id: string;
  userId: string;
  planId: PlanId;
  description: string;
  amount: number;       // OMR
  status: PaymentStatus;
  date: string;         // ISO date
  invoiceRef?: string;
}

// ── Checkout session ───────────────────────────────────────────────────────────
// SECURITY: In production, checkout must be initiated server-side.
// Client must never set payment status directly.
export interface CheckoutSession {
  id: string;
  planId?: PlanId;
  addOnType?: AddOnType;
  listingId?: string;
  durationWeeks?: number;
  amount: number;
  currency: "OMR";
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  note: string;  // always shows this is mock
}
