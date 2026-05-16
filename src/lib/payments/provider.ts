// ── Payment provider abstraction — Phase 14 ──────────────────────────────────
// Switch between mock / Stripe / Thawani by changing PAYMENT_PROVIDER env var.
// Currently only "mock" is implemented.

import type { PlanId, AddOnType, CheckoutSession } from "@/lib/payments/types";
import {
  mockCheckoutSession,
  mockCancelSubscription,
  mockUpgradeSubscription,
} from "@/lib/payments/mock-provider";

const PROVIDER = process.env.PAYMENT_PROVIDER ?? "mock";

// ── Provider interface ─────────────────────────────────────────────────────────
interface PaymentProvider {
  createCheckoutSession(params: {
    planId?: PlanId;
    addOnType?: AddOnType;
    listingId?: string;
    durationWeeks?: number;
  }): Promise<CheckoutSession>;

  cancelSubscription(userId: string): Promise<{ success: boolean; message: string }>;

  upgradeSubscription(
    userId: string,
    planId: PlanId
  ): Promise<{ success: boolean; planId: PlanId }>;
}

// ── Active provider ────────────────────────────────────────────────────────────
function getProvider(): PaymentProvider {
  if (PROVIDER === "mock") {
    return {
      createCheckoutSession: mockCheckoutSession,
      cancelSubscription: mockCancelSubscription,
      upgradeSubscription: mockUpgradeSubscription,
    };
  }

  // TODO Phase 15+: Add Stripe or Thawani provider here
  // if (PROVIDER === "stripe") { return stripeProvider; }

  // Fallback to mock if provider is unrecognised
  console.warn(`[payments] Unknown PAYMENT_PROVIDER "${PROVIDER}" — using mock`);
  return {
    createCheckoutSession: mockCheckoutSession,
    cancelSubscription: mockCancelSubscription,
    upgradeSubscription: mockUpgradeSubscription,
  };
}

export const paymentProvider = getProvider();
