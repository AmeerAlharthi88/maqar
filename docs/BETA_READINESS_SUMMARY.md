# Maqar — Beta Readiness Summary

**Date:** May 2026  
**Prepared by:** Engineering (post Phase 6 UAT + DB Drift Fix)  
**Staging URL:** https://maqar-sigma.vercel.app  
**Supabase project:** hlpdezbttkzbicgubuen (Middle East — Bahrain)

---

## 1. Current Readiness Status

**Private beta: READY TO LAUNCH**

All Phase 6 UAT blockers have been resolved. The platform is live on Vercel, connected to a live Supabase instance, and has been verified end-to-end by internal QA. No critical or launch-blocking issues remain.

---

## 2. Infrastructure Status

| Component | Status | Notes |
|-----------|--------|-------|
| Vercel deployment | Live | Auto-deploys from `main` branch |
| Supabase (Postgres) | Live | 17 tables, all migrations applied |
| Supabase Auth (Phone OTP) | Live | Test number +96892961266 / OTP 123456 |
| Supabase Storage | Live | `listing-images`, `documents`, `avatars` buckets |
| RLS (Row Level Security) | Verified | All 11 sensitive tables protected from anon access |
| Service role (server-only) | Verified | Not exposed to client |
| Analytics pipeline | Live | Events → `listing_analytics` → counter RPCs |
| Admin approval workflow | Live | Approve/reject → audit log → status change |

---

## 3. Passed UAT Areas (Phase 6)

All areas below were tested on the live staging environment with a real Supabase-backed session.

### Authentication
- Phone OTP login: **Pass**
- Session persistence across refresh: **Pass**
- Logout and re-login: **Pass**
- Protected route redirect (unauthenticated): **Pass**

### Listings
- Browse listings as guest: **Pass**
- Search with filters (type, price, bedrooms, area): **Pass**
- Listing detail page (images, specs, agent card): **Pass**
- Map view with markers: **Pass** *(real Supabase data, fixed in Pre-Phase 6)*
- Add listing (10-step wizard): **Pass**
- Image upload to Supabase Storage: **Pass**
- Listing submission → pending state: **Pass**
- Admin approval → listing goes live: **Pass**
- Listing visible in public search/map after approval: **Pass**

### Admin
- Pending queue visible: **Pass**
- Approve listing flow: **Pass**
- Reject listing flow: **Pass**
- Audit log written on approval: **Pass**
- RLS blocks anon writes to `listings`: **Pass**

### Analytics
- Analytics event recorded (`listing_view`): **Pass**
- `view_count` RPC increment: **Pass** *(fixed in DB Drift Fix)*
- `whatsapp_clicks` RPC increment: **Pass** *(fixed in DB Drift Fix)*
- `call_clicks` RPC increment: **Pass** *(fixed in DB Drift Fix)*

### Subscriptions
- Free plan created for test user: **Pass**
- `provider` column present with default `'mock'`: **Pass** *(fixed in DB Drift Fix)*
- `provider_customer_id`, `provider_subscription_id` columns present: **Pass**

### Security / RLS
- Anon cannot read: `profiles`, `favorites`, `saved_searches`, `recently_viewed`, `listing_inquiries`, `viewing_requests`, `kyc_applications`, `subscriptions`, `ai_usage`, `audit_logs`, `listing_analytics`: **All Pass**
- Anon cannot INSERT to `listings`: **Pass**

---

## 4. Remaining Non-Blockers

The following items are known gaps that do **not** block private beta. They are tracked for resolution before public launch.

| Item | Priority | Notes |
|------|----------|-------|
| Real SMS OTP (Twilio) | High | Activate by setting Supabase Phone Auth + Twilio credentials in Vercel env |
| Paid subscription plans | High | Thawani Pay or Stripe integration pending |
| Payment webhook | High | `POST /api/payments/webhook` not yet implemented |
| Final legal content | High | Terms, Privacy Policy need legal review |
| PNG app icons | Medium | SVG placeholders in `/public/icons/` — replace before app store / PWA |
| OG image (1200×630 PNG) | Medium | `/public/og/default.svg` — replace for social sharing |
| AI valuation live key | Medium | `ANTHROPIC_API_KEY` needed in Vercel for real AI responses |
| Market data (live feed) | Medium | Area guides use seeded estimates |
| Admin role enforcement | Medium | Admin layout checks auth but not role — any authenticated user can reach `/admin` if they know the URL. Needs `role='admin'` check. |
| Rate limiting on API routes | Medium | `/api/ai/`, `/api/auth/`, `/api/analytics/` need rate limits before public |
| CSP headers | Low | Content-Security-Policy not yet in `next.config.ts` |
| English localization | Low | Arabic is complete; English has gaps |
| Offline queue on staging | Low | PWA service worker cache not optimized for staging |

---

## 5. Live Data State (as of Beta Start)

| Entity | Count | Notes |
|--------|-------|-------|
| Listings (active) | 4 | Approved, visible in search and map |
| Listings (pending) | 2 | Awaiting admin review |
| Users (test) | 1 | Test account +96892961266 |
| Subscriptions | 1 | Free plan, `provider='mock'` |
| Audit log entries | 3 | Phase 5 QA approvals |
| Analytics events | Varies | Test events written and counters verified |

---

## 6. Build and Code Quality

| Check | Result | Date |
|-------|--------|------|
| `npx tsc --noEmit` | 0 errors | Phase 17 |
| `npm run build` | 0 errors | Phase 17 |
| `npx eslint src` | 0 errors (38 warnings, non-critical) | Phase 17 |
| Pages generated | 125 static/dynamic routes | Phase 17 |
| PR #11 (map + audit_logs fix) | Merged to `main` | Pre-Phase 6 |
| DB Drift Fix (RPC + subscriptions) | Applied to live DB | May 2026 |

---

## 7. Next Actions Before Public Launch

In priority order:

1. **Complete private beta** — run for 3–4 weeks, collect feedback via `PRIVATE_BETA_FEEDBACK_TEMPLATE.md`
2. **Fix critical/high bugs** from beta feedback — triage within 48 hours of report
3. **Activate real SMS OTP** — Twilio credentials in Supabase Auth + Vercel env
4. **Legal review** — finalize Terms of Service and Privacy Policy
5. **Replace SVG placeholders** — commission PNG icons (192, 512, 180px) and OG image (1200×630)
6. **Add admin role enforcement** — add `role='admin'` check to `/admin/layout.tsx` (currently auth-only)
7. **Implement payment integration** — Thawani Pay or Stripe, with webhook
8. **Add rate limiting** — middleware on `/api/ai/`, `/api/auth/`, `/api/payments/`
9. **Set production domain** — configure `NEXT_PUBLIC_APP_URL`, update Supabase allowed redirects
10. **Submit sitemap** to Google Search Console after first live domain deployment

---

## 8. Document Index

| Document | Purpose |
|----------|---------|
| `docs/PRIVATE_BETA_PLAN.md` | Objectives, scope, testers, timeline, go/no-go |
| `docs/PRIVATE_BETA_TEST_CHECKLIST.md` | Scenario-by-scenario test matrix for all roles |
| `docs/PRIVATE_BETA_FEEDBACK_TEMPLATE.md` | Structured form for tester feedback |
| `docs/PRIVATE_BETA_KNOWN_LIMITATIONS.md` | What testers should expect and not report as bugs |
| `docs/BETA_READINESS_SUMMARY.md` | This file — engineering readiness snapshot |
| `docs/DEPLOYMENT_CHECKLIST.md` | Full pre-production deploy checklist |
| `docs/SMOKE_TEST_CHECKLIST.md` | Quick post-deploy smoke tests |
| `docs/PRODUCTION_TODOS.md` | Prioritised production gap list |
| `PROJECT_HANDOVER.md` | Full developer handover (code structure, setup, blockers) |

---

*This document reflects the state of the platform as of May 2026 after Phase 6 UAT and DB Drift Fix completion.*
