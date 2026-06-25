// ── Plan definitions & entitlements — Phase 14 ───────────────────────────────
// Single source of truth for plan limits and features.

import type { PlanId, PlanEntitlement, AddOnType } from "@/lib/payments/types";

// ── Entitlements per plan ──────────────────────────────────────────────────────
export const PLAN_ENTITLEMENTS: Record<PlanId, PlanEntitlement> = {
  free: {
    planId: "free",
    maxActiveListings: 3,
    maxFeaturedListings: 0,
    canAccessAnalytics: false,
    canAccessLeads: false,
    canManageTeam: false,
    verificationEligible: false,
    aiAssistantDailyLimit: 5,
    aiDescriptionDailyLimit: 2,
    aiSmartReplyDailyLimit: 3,
    canPurchaseFeaturedListing: false,
    canPurchaseLeadBoost: false,
    prioritySupport: false,
  },
  agent_pro: {
    planId: "agent_pro",
    maxActiveListings: 25,
    maxFeaturedListings: 2,
    canAccessAnalytics: true,
    canAccessLeads: true,
    canManageTeam: false,
    verificationEligible: true,
    aiAssistantDailyLimit: 50,
    aiDescriptionDailyLimit: 20,
    aiSmartReplyDailyLimit: 30,
    canPurchaseFeaturedListing: true,
    canPurchaseLeadBoost: true,
    prioritySupport: true,
  },
  agency: {
    planId: "agency",
    maxActiveListings: null,       // unlimited
    maxFeaturedListings: 10,
    canAccessAnalytics: true,
    canAccessLeads: true,
    canManageTeam: true,
    verificationEligible: true,
    aiAssistantDailyLimit: -1,     // unlimited
    aiDescriptionDailyLimit: -1,
    aiSmartReplyDailyLimit: -1,
    canPurchaseFeaturedListing: true,
    canPurchaseLeadBoost: true,
    prioritySupport: true,
  },
};

// ── Add-on prices (OMR) ────────────────────────────────────────────────────────
export const ADDON_PRICES: Record<AddOnType, number> = {
  featured_listing: 5,       // per week
  lead_boost: 2,             // per use
  homepage_placement: 25,    // placeholder
  area_placement: 10,        // placeholder
};

export const ADDON_LABELS_AR: Record<AddOnType, string> = {
  featured_listing: "إعلان مميز",
  lead_boost: "تعزيز عملاء",
  homepage_placement: "ظهور في الرئيسية",
  area_placement: "ظهور في صفحة المنطقة",
};

export const ADDON_LABELS_EN: Record<AddOnType, string> = {
  featured_listing: "Featured listing",
  lead_boost: "Lead boost",
  homepage_placement: "Homepage placement",
  area_placement: "Area-page placement",
};

// ── Plan prices ────────────────────────────────────────────────────────────────
export const PLAN_PRICES: Record<PlanId, number> = {
  free: 0,
  agent_pro: 15,
  agency: 50,
};

export const PLAN_NAMES_AR: Record<PlanId, string> = {
  free: "المجاني",
  agent_pro: "وسيط احترافي",
  agency: "وكالة عقارية",
};

export const PLAN_NAMES_EN: Record<PlanId, string> = {
  free: "Free",
  agent_pro: "Agent Pro",
  agency: "Agency",
};

// ── Utilities ──────────────────────────────────────────────────────────────────
export function getPlanEntitlement(planId: PlanId): PlanEntitlement {
  return PLAN_ENTITLEMENTS[planId];
}

export function getListingLimit(planId: PlanId): number | null {
  return PLAN_ENTITLEMENTS[planId].maxActiveListings;
}

export function formatPlanPrice(planId: PlanId): string {
  const price = PLAN_PRICES[planId];
  if (price === 0) return "مجاني";
  return `${price} ر.ع./شهر`;
}

export function calculateAddOnPrice(addOnType: AddOnType, quantity = 1): number {
  return ADDON_PRICES[addOnType] * quantity;
}

export function getUpgradeRecommendation(
  currentPlan: PlanId,
  limitHit: string
): PlanId {
  if (currentPlan === "free") return "agent_pro";
  if (currentPlan === "agent_pro" && limitHit === "team") return "agency";
  return "agent_pro";
}
