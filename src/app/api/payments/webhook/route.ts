// ── POST /api/payments/webhook ────────────────────────────────────────────────
// Payment provider webhook handler placeholder.
//
// SECURITY RULES (must all be satisfied before any DB write in production):
//   1. Verify the webhook signature from the provider (Thawani / Stripe).
//      Never trust the body payload without a verified signature.
//   2. Use idempotency keys to prevent double-processing the same event.
//   3. Only the service role key may update subscription or payment_status.
//   4. Log every event (even rejected ones) to the audit log.
//   5. Return 200 quickly — do heavy processing in a background queue.
//
// Current state: PLACEHOLDER ONLY.
//   · Signature verification is a TODO (requires provider SDK + secrets).
//   · No subscription or billing_records are activated.
//   · Returns 400 for all requests until a real provider is configured.
//
// To activate:
//   1. Add PAYMENT_PROVIDER=thawani (or stripe) to server env vars.
//   2. Add PAYMENT_WEBHOOK_SECRET to server env vars.
//   3. Implement verifyWebhookSignature() for the chosen provider.
//   4. Implement handleProviderEvent() to activate subscriptions / mark paid.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

const PAYMENT_PROVIDER    = process.env.PAYMENT_PROVIDER    ?? "mock";
const PAYMENT_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET;

// ── Signature verification (TODO per provider) ────────────────────────────────

/**
 * Verifies that the incoming webhook request was genuinely sent by the provider.
 * Returns true if the signature is valid, false otherwise.
 *
 * TODO: Implement for each provider:
 *   - Thawani: compare HMAC-SHA256 of raw body with X-Thawani-Signature header
 *   - Stripe:  use stripe.webhooks.constructEvent(body, sig, secret)
 *   - Others:  follow provider documentation exactly
 *
 * NEVER skip this check in production. An unsigned webhook could be sent by
 * any attacker to falsely activate subscriptions.
 */
async function verifyWebhookSignature(
  _req: NextRequest,
  _rawBody: string
): Promise<boolean> {
  if (!PAYMENT_WEBHOOK_SECRET) {
    console.warn(
      "[Webhook] PAYMENT_WEBHOOK_SECRET is not set — " +
      "rejecting all webhook requests until the secret is configured."
    );
    return false;
  }

  if (PAYMENT_PROVIDER === "mock") {
    // The mock provider is for local testing only and has no real signature.
    // Never enable mock webhooks in production.
    console.warn(
      "[Webhook] PAYMENT_PROVIDER=mock — " +
      "this endpoint does nothing in mock mode."
    );
    return false;
  }

  // TODO: implement real signature verification
  // if (PAYMENT_PROVIDER === "thawani") { ... }
  // if (PAYMENT_PROVIDER === "stripe")  { ... }

  return false;
}

// ── Event handler (TODO per provider) ─────────────────────────────────────────

/**
 * Processes a verified webhook event and updates the DB via service role.
 *
 * TODO: Implement for each event type:
 *   - payment.completed  → set billing_records.payment_status = 'paid',
 *                          set subscriptions.status = 'active',
 *                          set subscriptions.plan_id = purchased plan,
 *                          set subscriptions.provider_subscription_id
 *   - payment.failed     → set billing_records.payment_status = 'failed'
 *   - subscription.cancelled → set subscriptions.status = 'cancelled'
 *   - addon.purchased    → set subscription_addons.status = 'paid'
 *
 * All DB writes must use createServiceClient() from @/lib/supabase/service.
 * Never use the anon client here.
 */
async function handleProviderEvent(_event: unknown): Promise<void> {
  // TODO: implement
  console.warn("[Webhook] handleProviderEvent is not yet implemented.");
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Read raw body for signature verification (must happen before any parsing)
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400 }
    );
  }

  // ── Step 1: Verify signature ────────────────────────────────────────────────
  const isValid = await verifyWebhookSignature(req, rawBody);

  if (!isValid) {
    console.warn(
      "[Webhook] Rejected — invalid or missing signature. " +
      "Provider:", PAYMENT_PROVIDER
    );
    return NextResponse.json(
      {
        error: "Webhook signature verification failed.",
        hint:
          "Configure PAYMENT_PROVIDER and PAYMENT_WEBHOOK_SECRET in server env vars, " +
          "then implement verifyWebhookSignature() for your provider.",
      },
      { status: 400 }
    );
  }

  // ── Step 2: Parse event ─────────────────────────────────────────────────────
  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in webhook body" },
      { status: 400 }
    );
  }

  // ── Step 3: Handle event ────────────────────────────────────────────────────
  try {
    await handleProviderEvent(event);
  } catch (err) {
    console.error("[Webhook] handleProviderEvent threw:", err);
    return NextResponse.json(
      { error: "Event processing failed" },
      { status: 500 }
    );
  }

  // Acknowledge receipt — providers retry on non-2xx responses.
  return NextResponse.json({ received: true });
}
