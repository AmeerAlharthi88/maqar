// ── Mock subscription data — Phase 14 ────────────────────────────────────────
// All data is illustrative. Not real billing records.

import type {
  UserSubscription,
  BillingRecord,
  AddOnPurchase,
  UsageLimit,
} from "@/lib/payments/types";

// ── Current user subscription (mock — free user) ───────────────────────────────
export const MOCK_USER_SUBSCRIPTION: UserSubscription = {
  userId: "mock-user-001",
  planId: "free",
  status: "free",
  billingCycle: "monthly",
  currentPeriodStart: "2026-05-01",
  currentPeriodEnd: "2026-06-01",
  cancelAtPeriodEnd: false,
};

// ── Mock agent pro subscription ───────────────────────────────────────────────
export const MOCK_AGENT_PRO_SUBSCRIPTION: UserSubscription = {
  userId: "mock-agent-001",
  planId: "agent_pro",
  status: "active",
  billingCycle: "monthly",
  currentPeriodStart: "2026-05-01",
  currentPeriodEnd: "2026-06-01",
  cancelAtPeriodEnd: false,
};

// ── Mock agency subscription ──────────────────────────────────────────────────
export const MOCK_AGENCY_SUBSCRIPTION: UserSubscription = {
  userId: "mock-agency-001",
  planId: "agency",
  status: "active",
  billingCycle: "monthly",
  currentPeriodStart: "2026-05-01",
  currentPeriodEnd: "2026-06-01",
  cancelAtPeriodEnd: false,
};

// ── Mock billing history ──────────────────────────────────────────────────────
export const MOCK_BILLING_HISTORY: BillingRecord[] = [
  {
    id: "inv-0015",
    userId: "mock-agent-001",
    planId: "agent_pro",
    description: "اشتراك وسيط احترافي — مايو ٢٠٢٦",
    amount: 15,
    status: "paid",
    date: "2026-05-01",
    invoiceRef: "MQR-2026-0015",
  },
  {
    id: "inv-0012",
    userId: "mock-agent-001",
    planId: "agent_pro",
    description: "اشتراك وسيط احترافي — أبريل ٢٠٢٦",
    amount: 15,
    status: "paid",
    date: "2026-04-01",
    invoiceRef: "MQR-2026-0012",
  },
  {
    id: "inv-addon-003",
    userId: "mock-agent-001",
    planId: "agent_pro",
    description: "إعلان مميز — أسبوع واحد",
    amount: 5,
    status: "paid",
    date: "2026-04-15",
    invoiceRef: "MQR-2026-A003",
  },
  {
    id: "inv-0009",
    userId: "mock-agent-001",
    planId: "agent_pro",
    description: "اشتراك وسيط احترافي — مارس ٢٠٢٦",
    amount: 15,
    status: "paid",
    date: "2026-03-01",
    invoiceRef: "MQR-2026-0009",
  },
  {
    id: "inv-addon-001",
    userId: "mock-agent-001",
    planId: "agent_pro",
    description: "تعزيز عملاء — مرة واحدة",
    amount: 2,
    status: "paid",
    date: "2026-03-10",
    invoiceRef: "MQR-2026-A001",
  },
];

// ── Mock add-on purchases ─────────────────────────────────────────────────────
export const MOCK_ADDON_PURCHASES: AddOnPurchase[] = [
  {
    id: "addon-001",
    userId: "mock-agent-001",
    addOnType: "featured_listing",
    listingId: "listing-001",
    amount: 5,
    purchasedAt: "2026-05-10",
    expiresAt: "2026-05-17",
    isActive: true,
  },
  {
    id: "addon-002",
    userId: "mock-agent-001",
    addOnType: "lead_boost",
    amount: 2,
    purchasedAt: "2026-05-08",
    expiresAt: "2026-05-15",
    isActive: false,
  },
];

// ── Mock usage counters ────────────────────────────────────────────────────────
// These represent a free-plan user's current daily usage
export const MOCK_FREE_USAGE_LIMITS: UsageLimit[] = [
  {
    feature: "listing",
    labelAr: "الإعلانات النشطة",
    current: 2,
    limit: 3,
  },
  {
    feature: "ai_assistant",
    labelAr: "مساعد ذكي (يومي)",
    current: 3,
    limit: 5,
    resetsAt: "2026-05-17",
  },
  {
    feature: "ai_description",
    labelAr: "توليد وصف ذكي (يومي)",
    current: 1,
    limit: 2,
    resetsAt: "2026-05-17",
  },
  {
    feature: "featured_listing",
    labelAr: "إعلانات مميزة (شهري)",
    current: 0,
    limit: 0,
  },
];

// ── Mock agent pro usage limits ───────────────────────────────────────────────
export const MOCK_AGENT_PRO_USAGE_LIMITS: UsageLimit[] = [
  {
    feature: "listing",
    labelAr: "الإعلانات النشطة",
    current: 8,
    limit: 25,
  },
  {
    feature: "ai_assistant",
    labelAr: "مساعد ذكي (يومي)",
    current: 12,
    limit: 50,
    resetsAt: "2026-05-17",
  },
  {
    feature: "ai_description",
    labelAr: "توليد وصف ذكي (يومي)",
    current: 4,
    limit: 20,
    resetsAt: "2026-05-17",
  },
  {
    feature: "featured_listing",
    labelAr: "إعلانات مميزة (شهري)",
    current: 1,
    limit: 2,
    resetsAt: "2026-06-01",
  },
];

// ── Admin view: plan distribution for dashboard ───────────────────────────────
export const MOCK_PLAN_DISTRIBUTION = {
  free: 412,
  agent_pro: 87,
  agency: 14,
};

export const MOCK_MONTHLY_REVENUE = [
  { month: "ديسمبر", amount: 1750 },
  { month: "يناير",  amount: 1820 },
  { month: "فبراير", amount: 1910 },
  { month: "مارس",   amount: 2050 },
  { month: "أبريل",  amount: 2180 },
  { month: "مايو",   amount: 2310 },
];
