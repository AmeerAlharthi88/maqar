# Deployment Checklist — مقر

Follow this checklist before every production deployment. Items marked 🔴 are blockers — do not ship without them.

---

## Pre-Deployment: Code Quality

- [ ] 🔴 `npx tsc --noEmit` → 0 errors
- [ ] 🔴 `npm run build` → build succeeds, page count matches expected
- [ ] `npx eslint src --ext .ts,.tsx` → 0 errors (warnings OK)
- [ ] No `console.log` left in production code (grep: `console\.log`)
- [ ] No hardcoded secrets or API keys in source (grep: `sk-ant\|sk_live\|whsec_`)

---

## Pre-Deployment: Environment Variables

Set all of the following in **Vercel → Project Settings → Environment Variables** (Production scope):

### Required (blockers 🔴)
- [ ] 🔴 `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- [ ] 🔴 `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
- [ ] 🔴 `SUPABASE_SERVICE_ROLE_KEY` — **server-side only**, never exposed to client
- [ ] 🔴 `ANTHROPIC_API_KEY` — **server-side only**
- [ ] 🔴 `NEXT_PUBLIC_APP_URL` — your production domain (e.g. `https://maqar.om`)

### Payment (required before taking money)
- [ ] 🔴 `PAYMENT_PROVIDER` — set to `thawani` or `stripe` (not `mock`)
- [ ] 🔴 `THAWANI_API_KEY` or `STRIPE_SECRET_KEY` — server-side only
- [ ] 🔴 `NEXT_PUBLIC_THAWANI_PUBLISHABLE_KEY` or `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] 🔴 `THAWANI_WEBHOOK_SECRET` or `STRIPE_WEBHOOK_SECRET`

### Optional (recommended)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` — analytics
- [ ] `SENTRY_DSN` — error monitoring
- [ ] `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` — push notifications

---

## Pre-Deployment: Assets

- [ ] 🔴 Replace `/public/icons/icon-192.svg` with a real `icon-192.png` (192×192 px)
- [ ] 🔴 Replace `/public/icons/icon-512.svg` with a real `icon-512.png` (512×512 px)
- [ ] 🔴 Replace `/public/icons/maskable-icon-512.svg` with a real maskable PNG
- [ ] Replace `/public/icons/apple-touch-icon.svg` with `apple-touch-icon.png` (180×180 px)
- [ ] Replace `/public/og/default.svg` with a real OG image PNG (1200×630 px)
- [ ] Update `manifest.ts` icon references from `.svg` → `.png` with `type: "image/png"`
- [ ] Update `layout.tsx` apple-touch-icon href from `.svg` → `.png`
- [ ] Update `jsonld.ts` logo reference from `.svg` → `.png`

---

## Pre-Deployment: Database (Supabase)

See `docs/SUPABASE_SETUP.md` for full schema.

- [ ] 🔴 All tables created with correct schema
- [ ] 🔴 RLS enabled on all tables (`ALTER TABLE x ENABLE ROW LEVEL SECURITY`)
- [ ] 🔴 RLS policies created for all tables
- [ ] 🔴 Storage buckets created (`listing-images`, `documents`, `avatars`)
- [ ] Auth Phone OTP configured with SMS provider
- [ ] Realtime enabled on `listings` table (if using live updates)

---

## Pre-Deployment: Domain & SSL

- [ ] 🔴 Custom domain configured in Vercel (maqar.om)
- [ ] 🔴 SSL certificate auto-provisioned by Vercel (automatic)
- [ ] DNS records pointing to Vercel (A record or CNAME)
- [ ] `www` redirect to apex domain configured

---

## Pre-Deployment: SEO

- [ ] Verify sitemap: `https://maqar.om/sitemap.xml`
- [ ] Verify robots: `https://maqar.om/robots.txt`
- [ ] Submit sitemap to Google Search Console
- [ ] Verify structured data with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test OG image with [opengraph.xyz](https://www.opengraph.xyz/)

---

## Post-Deployment: Smoke Tests

See `docs/SMOKE_TEST_CHECKLIST.md` for detailed smoke tests.

Quick checks:
- [ ] 🔴 Homepage loads (/)
- [ ] 🔴 Search works (/search)
- [ ] 🔴 Listing detail loads (/listing/[id])
- [ ] 🔴 Auth OTP flow works end-to-end
- [ ] 🔴 Add listing flow reaches submission
- [ ] 🔴 Payment flow (if `PAYMENT_PROVIDER` ≠ mock)
- [ ] PWA install prompt appears on mobile
- [ ] Offline mode: saved favorites accessible without internet
- [ ] Arabic text renders correctly (RTL, font)

---

## Rollback Plan

If something breaks after deployment:

1. In Vercel → Deployments → find the last good deployment → click **Promote to Production**
2. If database schema was migrated: run rollback migration (always write reversible migrations)
3. Monitor [Vercel Analytics](https://vercel.com/analytics) and Sentry for errors

---

## Post-Launch Monitoring

First 24 hours:
- [ ] Check Vercel function logs for errors
- [ ] Monitor Supabase dashboard for unusual query volumes
- [ ] Check Anthropic API usage dashboard
- [ ] Verify payment webhooks are being received (check provider dashboard)
