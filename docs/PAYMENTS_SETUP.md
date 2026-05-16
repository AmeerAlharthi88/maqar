# Payments Setup Guide — مقر

Currently the app uses `PAYMENT_PROVIDER=mock` — no real charges occur. This document covers transitioning to a real payment provider for production.

---

## Current Mock Mode

All payment flows in the codebase check `PAYMENT_PROVIDER`:

```typescript
// src/lib/payments/provider.ts
if (process.env.PAYMENT_PROVIDER === 'mock') {
  return simulatePayment(amount);
}
```

In mock mode:
- Subscription upgrades appear to succeed immediately
- No actual charges are made
- Useful for development and demo environments

---

## Payment Providers

### Option A: Thawani Pay (Recommended for Oman)

[Thawani](https://thawani.om) is the leading Omani payment gateway with OMR support.

**Environment Variables:**
```env
PAYMENT_PROVIDER=thawani
THAWANI_API_KEY=your-thawani-api-key              # server-side only
THAWANI_PUBLISHABLE_KEY=pk_...                     # can be NEXT_PUBLIC_
THAWANI_WEBHOOK_SECRET=whsec_...                   # server-side only
THAWANI_ENV=sandbox                                # change to 'production' when live
```

**Integration Steps:**
1. Create a Thawani merchant account at [developer.thawani.om](https://developer.thawani.om)
2. Generate API keys in the merchant dashboard
3. Implement `POST /api/payments/checkout` to create a Thawani session
4. Implement `POST /api/payments/webhook` to handle payment confirmations
5. Update `src/lib/payments/provider.ts` with Thawani SDK calls

### Option B: Stripe (International Fallback)

**Environment Variables:**
```env
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_...                      # server-side only — NEVER NEXT_PUBLIC_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...     # safe to expose
STRIPE_WEBHOOK_SECRET=whsec_...                    # server-side only
```

**Integration Steps:**
1. Create products/prices in Stripe Dashboard for each plan:
   - `agent_pro`: 15 OMR/month → ~38.96 USD/month (use OMR if Stripe supports it)
   - `agency`: 50 OMR/month → ~129.87 USD/month
2. Implement Stripe Checkout or Payment Intents
3. Set up webhook endpoint at `POST /api/payments/stripe-webhook`

---

## Subscription Plans

| Plan ID | Price (OMR/month) | Active Listings | Features |
|---------|-------------------|-----------------|---------|
| `free` | 0 | 3 | Basic search, 5 AI analyses/day |
| `agent_pro` | 15 | 25 | Featured listings, advanced analytics |
| `agency` | 50 | Unlimited | Team members, agency profile, white-label |

---

## Add-ons

| Add-on | Price | Duration |
|--------|-------|---------|
| `featured_listing` | 5 OMR | 1 week |
| `lead_boost` | 10 OMR | One-time |

---

## Webhook Implementation

The webhook handler must:

1. Verify the webhook signature (prevent spoofing)
2. Update `subscriptions` table in Supabase
3. Update `profiles.role` if plan changes affect user role
4. Handle idempotency (webhooks can be delivered multiple times)

```typescript
// src/app/api/payments/webhook/route.ts
export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';
  
  // Verify signature
  const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await updateSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object);
      break;
  }
  
  return new Response('OK', { status: 200 });
}
```

---

## Security Requirements

- ✅ Secret keys NEVER in `NEXT_PUBLIC_` variables
- ✅ All payment state verified server-side (never trust client)
- ✅ Webhook signatures always verified before processing
- ✅ Payment routes excluded from SW cache (`NEVER_CACHE_PATTERNS`)
- ✅ No payment data stored offline

---

## Testing

1. Use sandbox/test credentials during development
2. Test the full subscription lifecycle:
   - Free → Agent Pro upgrade
   - Agent Pro → Agency upgrade
   - Cancellation flow
   - Failed payment handling
3. Test webhooks using Stripe CLI: `stripe listen --forward-to localhost:3000/api/payments/stripe-webhook`

---

## Launch Checklist

- [ ] Switch `PAYMENT_PROVIDER` from `mock` to `thawani` or `stripe`
- [ ] Set live API keys in Vercel environment variables
- [ ] Configure webhook URL in payment provider dashboard
- [ ] Test one real OMR charge end-to-end in production
- [ ] Confirm subscription update in Supabase after successful payment
