// ── Mock payment provider — Phase 14 ─────────────────────────────────────────
// MOCK ONLY — no real payment processing occurs.
// Replace with real provider (Stripe, Thawani, etc.) in production.
//
// SECURITY RULES for production:
// 1. Payment sessions must be created server-side only.
// 2. Webhook verification required before activating subscription.
// 3. Never trust client-reported payment status.
// 4. Admin role required for manual subscription adjustments.
// 5. Store all events in audit log.

import type { PlanId, AddOnType, CheckoutSession } from "@/lib/payments/types";
import { PLAN_PRICES, ADDON_PRICES } from "@/lib/payments/plans";

let sessionCounter = 1000;

function generateSessionId(): string {
  return `mock_sess_${Date.now()}_${++sessionCounter}`;
}

export async function mockCheckoutSession(params: {
  planId?: PlanId;
  addOnType?: AddOnType;
  listingId?: string;
  durationWeeks?: number;
}): Promise<CheckoutSession> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  let amount = 0;
  if (params.planId) {
    amount = PLAN_PRICES[params.planId];
  } else if (params.addOnType) {
    const weeks = params.durationWeeks ?? 1;
    amount = ADDON_PRICES[params.addOnType] * weeks;
  }

  return {
    id: generateSessionId(),
    planId: params.planId,
    addOnType: params.addOnType,
    listingId: params.listingId,
    durationWeeks: params.durationWeeks,
    amount,
    currency: "OMR",
    status: "completed",  // mock always succeeds
    createdAt: new Date().toISOString(),
    note:
      "هذه عملية وهمية فقط للمعاينة. لا تتم أي معالجة حقيقية للمدفوعات.",
  };
}

export async function mockCancelSubscription(
  _userId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    message:
      "تم إلغاء الاشتراك وهمياً. في الإنتاج يتم الإلغاء عبر مزود الدفع.",
  };
}

export async function mockUpgradeSubscription(
  _userId: string,
  planId: PlanId
): Promise<{ success: boolean; planId: PlanId }> {
  await new Promise((r) => setTimeout(r, 800));
  return { success: true, planId };
}
