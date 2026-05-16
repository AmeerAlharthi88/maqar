// ── Usage limit utilities — Phase 14 ─────────────────────────────────────────
// SECURITY: These are client-side UX helpers only.
// All limits MUST be enforced server-side in production.

import type { PlanId, UsageFeature } from "@/lib/payments/types";
import { PLAN_ENTITLEMENTS } from "@/lib/payments/plans";

export function canCreateListing(planId: PlanId, currentActive: number): boolean {
  const limit = PLAN_ENTITLEMENTS[planId].maxActiveListings;
  if (limit === null) return true;  // unlimited
  return currentActive < limit;
}

export function canUseAI(
  planId: PlanId,
  feature: "assistant" | "description" | "smart_reply",
  dailyUsage: number
): boolean {
  const entitlement = PLAN_ENTITLEMENTS[planId];
  let limit: number;

  switch (feature) {
    case "assistant":   limit = entitlement.aiAssistantDailyLimit;   break;
    case "description": limit = entitlement.aiDescriptionDailyLimit; break;
    case "smart_reply": limit = entitlement.aiSmartReplyDailyLimit;  break;
    default:            limit = 0;
  }

  if (limit === -1) return true;   // unlimited
  return dailyUsage < limit;
}

export function canFeatureListing(planId: PlanId): boolean {
  return PLAN_ENTITLEMENTS[planId].canPurchaseFeaturedListing;
}

export function canBoostLead(planId: PlanId): boolean {
  return PLAN_ENTITLEMENTS[planId].canPurchaseLeadBoost;
}

export function canAccessAnalytics(planId: PlanId): boolean {
  return PLAN_ENTITLEMENTS[planId].canAccessAnalytics;
}

export function getAIUsageLimit(
  planId: PlanId,
  feature: "assistant" | "description" | "smart_reply"
): number {
  const e = PLAN_ENTITLEMENTS[planId];
  switch (feature) {
    case "assistant":   return e.aiAssistantDailyLimit;
    case "description": return e.aiDescriptionDailyLimit;
    case "smart_reply": return e.aiSmartReplyDailyLimit;
    default:            return 0;
  }
}

export function getLimitLabel(
  feature: UsageFeature,
  planId: PlanId
): string {
  const e = PLAN_ENTITLEMENTS[planId];
  switch (feature) {
    case "listing":
      return e.maxActiveListings === null
        ? "غير محدود"
        : `${e.maxActiveListings} إعلان`;
    case "ai_assistant":
      return e.aiAssistantDailyLimit === -1
        ? "غير محدود"
        : `${e.aiAssistantDailyLimit} يومياً`;
    case "ai_description":
      return e.aiDescriptionDailyLimit === -1
        ? "غير محدود"
        : `${e.aiDescriptionDailyLimit} يومياً`;
    case "ai_smart_reply":
      return e.aiSmartReplyDailyLimit === -1
        ? "غير محدود"
        : `${e.aiSmartReplyDailyLimit} يومياً`;
    case "featured_listing":
      return `${e.maxFeaturedListings} شهرياً مجاناً`;
    case "lead_boost":
      return e.canPurchaseLeadBoost ? "متاح للشراء" : "يتطلب ترقية";
    default:
      return "—";
  }
}
