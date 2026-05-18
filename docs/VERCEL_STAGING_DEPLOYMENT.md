# Maqar — Vercel Staging Deployment Guide

> **Status:** Ready for staging deployment  
> **Prepared:** 2026-05-18  
> **Build:** ✅ 125 pages, 0 TypeScript errors, 0 ESLint errors  
> **Supabase:** Phases A–J complete · Migrations 042–043 applied  

---

## Table of Contents

1. [Git Commit Plan](#1-git-commit-plan)
2. [Local Build Verification](#2-local-build-verification)
3. [Vercel Deployment Checklist](#3-vercel-deployment-checklist)
4. [Required Environment Variables](#4-required-environment-variables)
5. [Staging URL Plan](#5-staging-url-plan)
6. [Supabase Staging Settings](#6-supabase-staging-settings)
7. [Post-Deployment Smoke Tests](#7-post-deployment-smoke-tests)
8. [Known Mock Systems Still Active](#8-known-mock-systems-still-active)
9. [Production Blockers Before Public Launch](#9-production-blockers-before-public-launch)
10. [Quick Reference](#10-quick-reference)

---

## 1. Git Commit Plan

### Current Status

All Phase A–J Supabase migration work is **uncommitted** since the initial commit.

```
Branch: main (1 commit ahead: Initial commit — Maqar production-ready prototype)
Modified files: 40
Untracked files/dirs: ~25 (new API routes, lib/supabase/*, actions, migrations, docs)
```

### Commit Plan (execute in order)

**Step 1 — Stage all Phase A–J source changes:**
```bash
git add \
  src/app/ \
  src/components/ \
  src/lib/ \
  src/store/ \
  src/types/ \
  src/providers/ \
  supabase/ \
  scripts/ \
  docs/ \
  public/
```

**Step 2 — Verify staged files look right:**
```bash
git diff --cached --stat
```

**Step 3 — Commit:**
```bash
git commit -m "feat: Supabase migration phases A–J — full backend wiring

- Phase A: DB schema (profiles, listings, favorites, etc.)
- Phase B: RLS policies + storage buckets
- Phase C: Listings CRUD + image upload
- Phase D: CRM (leads, appointments, offers)
- Phase E: KYC document upload + storage
- Phase F: Reviews, market data, analytics
- Phase G: Subscriptions + AI usage tracking
- Phase H: Admin API routes (listings, reports, AML, audit)
- Phase I: AI assistant wiring
- Phase J: Profile wiring (getCurrentProfile, updateProfile, avatars)
- Migration 042: avatars storage bucket (public, 5 MB)
- Migration 043: KYC storage RLS fix (proper CREATE POLICY on storage.objects)
- QA: fixed name_ar column bug in admin.server.ts and kyc.ts
- Lint: 0 errors, 38 warnings (all non-blocking)"
```

**Step 4 — Push to GitHub (required before Vercel import):**
```bash
git push origin main
```

> ⚠️ **Do NOT commit `.env.local`** — it is already in `.gitignore`. Confirm with
> `git status` after staging to make sure it is not included.

---

## 2. Local Build Verification

Last verified: **2026-05-18**

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ 0 errors |
| Production build | `npm run build` | ✅ 125 pages |
| ESLint | `npm run lint` | ✅ 0 errors (38 warnings) |

**Build output summary:**
- Static (○): 27 pages (home, search, tools, auth, legal, map, market, areas)
- SSG (●): 31 paths (areas/[slug], market/[gov], market/[gov]/[wilayat])
- Dynamic (ƒ): 67 server-rendered pages + API routes

---

## 3. Vercel Deployment Checklist

### 3.1 Initial Import

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Select **"Import Git Repository"**
- [ ] Connect GitHub and select the `maqar` repository
- [ ] Select branch: `main`

### 3.2 Build & Output Settings

| Setting | Value |
|---------|-------|
| Framework Preset | **Next.js** (auto-detected) |
| Root Directory | `.` (leave blank — repo root) |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output Directory | `.next` (Next.js default — leave blank) |
| Node.js Version | **22.x** (recommended LTS) |

> **Node version note:** Development machine runs Node 24.x. Vercel supports 18.x,
> 20.x, and 22.x. Set to **22.x** in Vercel → Project Settings → General → Node.js Version.
> Next.js 16.2.6 requires Node ≥ 18.17.

### 3.3 Deployment Settings

- [ ] Set all required environment variables (see Section 4) **before** clicking Deploy
- [ ] Confirm Vercel project name matches intended staging URL
- [ ] After first deploy, note the assigned `*.vercel.app` URL
- [ ] Update `NEXT_PUBLIC_APP_URL` to the Vercel staging URL
- [ ] Update Supabase Auth redirect URLs (see Section 6)
- [ ] Re-deploy after updating env vars

### 3.4 Domain (Staging)

For staging, use the auto-assigned Vercel domain:
```
https://maqar-[hash].vercel.app
```
No custom domain needed for staging. Set custom domain only for production.

---

## 4. Required Environment Variables

Set all of these in **Vercel → Project → Settings → Environment Variables**.

> Scope all vars to **Preview** and **Production** environments.
> For staging, targeting **Preview** is sufficient.

### 4.1 Supabase (Required — live values)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ **Required now** | `https://hlpdezbttkzbicgubuen.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ **Required now** | From Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ **Required now** | Server-only. NEVER use `NEXT_PUBLIC_` prefix. |

> ⚠️ **Security rule:** `SUPABASE_SERVICE_ROLE_KEY` must be set as a **server-side only**
> variable in Vercel. Do not prefix with `NEXT_PUBLIC_`. It bypasses RLS.

### 4.2 App URL (Required — update after first deploy)

| Variable | Required | Value for staging |
|----------|----------|-------------------|
| `NEXT_PUBLIC_APP_URL` | ✅ **Required now** | `https://maqar-[hash].vercel.app` (set after first deploy) |
| `NEXT_PUBLIC_APP_ENV` | ✅ **Required now** | `production` (enables service worker, PWA) |

### 4.3 AI / Anthropic (Required for AI features)

| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | ✅ **Required for AI** | Without this, AI routes return 500 / fallback to mock |
| `AI_PROVIDER` | ✅ **Required now** | `anthropic` |
| `AI_MODEL` | ✅ **Required now** | `claude-3-5-haiku-20241022` (cost-efficient for staging) |
| `AI_DAILY_FREE_LIMIT` | ✅ **Required now** | `5` |
| `AI_AGENT_PRO_LIMIT` | ✅ **Required now** | `50` |
| `AI_AGENCY_LIMIT` | ✅ **Required now** | `200` |

> Without `ANTHROPIC_API_KEY`, all AI endpoints gracefully return placeholder/error responses.
> AI features are non-blocking — the rest of the app works without them.

### 4.4 Payments (Placeholder acceptable for staging)

| Variable | Required | Value for staging |
|----------|----------|-------------------|
| `PAYMENT_PROVIDER` | ✅ Required | `mock` |
| `NEXT_PUBLIC_PAYMENT_MODE` | ✅ Required | `mock` |
| `PAYMENT_SUCCESS_URL` | ✅ Required | `https://maqar-[hash].vercel.app/account/billing?success=1` |
| `PAYMENT_CANCEL_URL` | ✅ Required | `https://maqar-[hash].vercel.app/pricing?cancelled=1` |

> Real payment keys (`STRIPE_SECRET_KEY`, `THAWANI_API_KEY`, etc.) are NOT needed for staging.
> Leave them unset or with placeholder values.

### 4.5 PWA / Service Worker

| Variable | Required | Value |
|----------|----------|-------|
| `NEXT_PUBLIC_ENABLE_PWA` | Optional | `true` |
| `NEXT_PUBLIC_SW_VERSION` | Optional | `1` |

### 4.6 Analytics (Optional for staging)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | Optional | Leave unset for staging; add PostHog key for production |

> Without analytics keys, analytics events are silently no-ops.

### 4.7 Full Env Vars Paste Template

Copy this into Vercel's bulk env var editor (fill in real values):

```env
# === REQUIRED NOW ===
NEXT_PUBLIC_SUPABASE_URL=https://hlpdezbttkzbicgubuen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<paste-service-role-key>
NEXT_PUBLIC_APP_URL=https://maqar-REPLACE-WITH-VERCEL-URL.vercel.app
NEXT_PUBLIC_APP_ENV=production
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-haiku-20241022
AI_DAILY_FREE_LIMIT=5
AI_AGENT_PRO_LIMIT=50
AI_AGENCY_LIMIT=200
PAYMENT_PROVIDER=mock
NEXT_PUBLIC_PAYMENT_MODE=mock
PAYMENT_SUCCESS_URL=https://maqar-REPLACE.vercel.app/account/billing?success=1
PAYMENT_CANCEL_URL=https://maqar-REPLACE.vercel.app/pricing?cancelled=1

# === ADD IF USING AI ===
ANTHROPIC_API_KEY=<paste-anthropic-key>

# === OPTIONAL FOR STAGING ===
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_SW_VERSION=1
```

---

## 5. Staging URL Plan

### 5.1 Two-step URL setup

Vercel assigns the staging URL **after** the first deploy. This creates a chicken-and-egg
situation with `NEXT_PUBLIC_APP_URL`. Follow this order:

1. **First deploy:** Set `NEXT_PUBLIC_APP_URL=https://placeholder.vercel.app` temporarily
2. **Note the assigned URL** from the Vercel dashboard (e.g. `maqar-abc123.vercel.app`)
3. **Update env var:** Change `NEXT_PUBLIC_APP_URL` to the real URL
4. **Update Supabase** redirect URLs (see Section 6.1)
5. **Re-deploy** (Vercel → Deployments → Redeploy)

### 5.2 What breaks without the correct APP_URL

| Feature | Impact |
|---------|--------|
| SEO canonical tags | Wrong domain in `<link rel="canonical">` |
| OG/social sharing | Wrong URL in og:url meta tag |
| Payment redirects | Redirects to wrong URL after checkout |
| Sitemap | Wrong domain in sitemap.xml |
| PWA start_url | May fail installation on wrong origin |

### 5.3 OTP Redirect Testing

After updating `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs:

1. Trigger login OTP from the staging URL
2. Check SMS/email for the magic link
3. Confirm the link contains the staging domain (not localhost)
4. Click link — should land on `/auth/verify` on the staging URL
5. Confirm session established and redirect to `/` or `/account`

---

## 6. Supabase Staging Settings Checklist

All settings at: **https://supabase.com/dashboard/project/hlpdezbttkzbicgubuen**

### 6.1 Authentication → URL Configuration

- [ ] **Site URL:** Set to `https://maqar-[hash].vercel.app`
  - Dashboard → Authentication → URL Configuration → Site URL
- [ ] **Redirect URLs:** Add Vercel staging URL
  - Add: `https://maqar-[hash].vercel.app/**`
  - Keep: `http://localhost:3000/**` for local dev
  - Dashboard → Authentication → URL Configuration → Redirect URLs
- [ ] **OTP expiry:** Confirm OTP expiry is set (default 3600s is fine for staging)

### 6.2 Authentication → Providers

- [ ] **Phone OTP** provider is enabled (Supabase built-in)
- [ ] SMS provider configured in Supabase dashboard (if testing real OTP)
  - For staging: Supabase test OTP (`000000`) works without a real SMS provider
- [ ] Confirm email provider is enabled as fallback

### 6.3 Storage Buckets ✅ (already verified)

| Bucket | Public | Notes |
|--------|--------|-------|
| `avatars` | ✅ true | 5 MB limit, JPEG/PNG/WebP/GIF. Created by migration 042. |
| `documents` | ✅ false | Private. KYC docs only. |
| `listing-images` | Verify | Should exist from Phase C. |

- [ ] Confirm `listing-images` bucket exists in Storage dashboard
- [ ] Confirm `avatars` bucket exists (created by migration 042 ✅)
- [ ] Confirm `documents` bucket is private (verified in QA ✅)

### 6.4 RLS Policies ✅ (already verified)

- [ ] Profiles: `profiles_public_select`, `profiles_own_update` active
- [ ] Listings: public select, owner CRUD, admin full access
- [ ] Storage avatars: `avatars_storage_public_read`, `avatars_storage_owner_write`, `avatars_storage_owner_update`
- [ ] Storage documents (KYC): 10 policies active (5 from Phase E + 5 from migration 043 ✅)

### 6.5 Service Role Key Security

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set **only in Vercel server env** (no `NEXT_PUBLIC_` prefix)
- [ ] Service role key does **not** appear anywhere in client-side code
- [ ] Service role key is **not** in any committed file (`.env.local` is gitignored)
- [ ] Rotate the key immediately if it was ever accidentally exposed

### 6.6 Dev Bypass Variables (MUST be disabled for staging)

The following variables are for local dev only. **Do NOT set them in Vercel:**

```env
# DO NOT set in Vercel — local dev only
NEXT_PUBLIC_DEV_SKIP_AUTH=   ← leave unset (defaults to false)
DEV_BYPASS_USER_ID=          ← leave unset
```

---

## 7. Post-Deployment Smoke Tests

Run after the first successful Vercel deployment. Use the staging URL.

### 7.1 Public Pages

| Test | Expected | Pass? |
|------|----------|-------|
| `GET /` | Home page loads, listings grid visible | ☐ |
| `GET /search` | Search page loads, filter chips visible | ☐ |
| `GET /map` | Map page loads, Leaflet tiles render | ☐ |
| `GET /sitemap.xml` | XML sitemap with listing URLs | ☐ |
| `GET /robots.txt` | Robots file with correct domain | ☐ |
| `GET /manifest.webmanifest` | JSON manifest for PWA install | ☐ |
| `GET /offline` | Offline fallback page loads | ☐ |
| `GET /pricing` | Pricing page loads | ☐ |
| `GET /about` | About page loads | ☐ |

### 7.2 Authentication Flow

| Test | Expected | Pass? |
|------|----------|-------|
| Click "تسجيل الدخول" → enter phone | OTP form appears | ☐ |
| Enter OTP (test: `000000` on Supabase test) | Redirects to `/auth/verify` | ☐ |
| Onboarding flow | Profile created, redirects to `/` | ☐ |
| Profile loads at `/account/profile` | Shows name, phone, avatar placeholder | ☐ |

### 7.3 Listings & Search

| Test | Expected | Pass? |
|------|----------|-------|
| Add listing flow at `/add-listing` | Multi-step form completes | ☐ |
| Image upload in add-listing | Images upload to `listing-images` bucket | ☐ |
| Submitted listing status = `pending` | Appears in admin `/admin/listings` | ☐ |
| Admin approves listing | Status changes to `approved` | ☐ |
| Approved listing appears in `/search` | Listing visible to public | ☐ |

### 7.4 Saved / Engagement Features

| Test | Expected | Pass? |
|------|----------|-------|
| Favorite a listing | Heart fills, appears in `/account/favorites` | ☐ |
| View listing detail | Listing appears in `/account/recently-viewed` | ☐ |
| Save a search | Saved search in `/account/saved-searches` | ☐ |

### 7.5 CRM Flows (requires logged-in agent or test account)

| Test | Expected | Pass? |
|------|----------|-------|
| WhatsApp lead button on listing | Creates row in leads table (check `/agent/leads`) | ☐ |
| Book viewing modal → submit | Creates appointment row (check `/agent/appointments`) | ☐ |
| Make offer modal → submit | Creates offer row (check `/agent/offers`) | ☐ |

### 7.6 KYC & Documents

| Test | Expected | Pass? |
|------|----------|-------|
| Upload KYC document at `/agent/verification` | Uploads to `documents/kyc/{uid}/` path | ☐ |
| Direct URL to uploaded KYC file (unauthenticated) | Returns 403/404 (private bucket) | ☐ |
| Admin views KYC doc at `/admin/verification` | Visible to admin via RLS | ☐ |

### 7.7 AI Features

| Test | Expected | Pass? |
|------|----------|-------|
| AI assistant at `/assistant` | Responds (real) or shows error (no key) — no crash | ☐ |
| AI generate description in add-listing | Returns suggestion or graceful fallback | ☐ |
| AI valuation on listing page | Returns estimate or graceful fallback | ☐ |

### 7.8 Admin Panel

| Test | Expected | Pass? |
|------|----------|-------|
| `/admin` loads | Dashboard KPIs visible | ☐ |
| `/admin/listings` | Listing queue loads (real or mock) | ☐ |
| `/admin/reports` | Reports queue loads | ☐ |
| `/admin/audit-logs` | Audit log table loads | ☐ |

### 7.9 Billing & PWA

| Test | Expected | Pass? |
|------|----------|-------|
| `/account/billing` loads | Billing page renders (mock) | ☐ |
| PWA install prompt appears on mobile | Manifest detected by browser | ☐ |
| Service worker registered | DevTools → Application → Service Workers shows active SW | ☐ |

---

## 8. Known Mock Systems Still Active

These systems use **mock/placeholder implementations** at staging. They are intentional
and do not affect app stability.

| System | Status | Notes |
|--------|--------|-------|
| **Payment provider** | 🟡 Mock | `PAYMENT_PROVIDER=mock`. No real transactions. Billing page shows mock UI. |
| **SMS provider** | 🟡 Supabase built-in | Real OTP if Supabase SMS is configured; test OTP `000000` if not. |
| **AI (Anthropic)** | 🟡 Real or error | Works if `ANTHROPIC_API_KEY` is set; returns error gracefully if not. |
| **Market data** | 🟡 Mix | Admin market-data page uses real DB rows if populated; falls back to mock array. |
| **Analytics** | 🟡 Mock | Events logged to console / Supabase table if configured; no real provider. |
| **Mock listing data** | 🟡 Seeded | Various pages fall back to `MOCK_LISTINGS`, `MOCK_AGENTS`, etc. when DB is empty. |
| **Legal content** | 🟡 Draft | `/terms`, `/privacy`, `/listing-policy` show placeholder draft text. |
| **Monitoring / Sentry** | 🔴 Not set up | No error tracking. Errors only visible in Vercel function logs. |
| **Email provider** | 🟡 Supabase | Auth emails via Supabase built-in SMTP. Custom email not configured. |

---

## 9. Production Blockers Before Public Launch

These items **must** be completed before the app goes live to real users.

### 9.1 Legal & Compliance

- [ ] **Legal review** — Terms of Service, Privacy Policy, and Listing Policy reviewed by legal counsel
- [ ] **Arabic translations finalized** — All UI strings reviewed by native Arabic speaker
- [ ] **Market data disclaimer** — Confirm "تنبيه — بيانات تقديرية" notice is sufficient or get legal sign-off
- [ ] **GDPR / Oman PDPL compliance** — Data residency and user rights flow reviewed

### 9.2 Payments

- [ ] **Real payment provider** — Integrate Thawani Pay (OMR, Oman-native) or Stripe
  - Set `PAYMENT_PROVIDER=thawani` or `stripe` and corresponding keys
  - Test end-to-end checkout with real card in sandbox mode
  - Set up webhook: `STRIPE_WEBHOOK_SECRET` or `THAWANI_WEBHOOK_SECRET`
- [ ] **Subscription enforcement** — Verify plan limits enforced after real payment

### 9.3 SMS / OTP

- [ ] **Real SMS provider** — Configure Supabase SMS provider (Twilio, Vonage, etc.) in
  Supabase dashboard → Authentication → SMS Provider
- [ ] **Test OTP with real Omani numbers (+968)**
- [ ] **OTP rate limiting** — Confirm Supabase default limits acceptable

### 9.4 Data Quality

- [ ] **Real market data** — Replace mock market-data rows with validated official/research data
- [ ] **Seed production DB** — Add initial agent profiles, areas, market data rows
- [ ] **Image CDN** — Confirm Supabase Storage is sufficient or configure a CDN for listing images

### 9.5 Security

- [ ] **Security review** — Review all API routes for auth bypass, injection, SSRF
- [ ] **Admin route protection** — Confirm `/admin/*` routes are protected by `is_admin()` check
- [ ] **Rate limiting** — Add rate limiting on AI routes, OTP, and add-listing
- [ ] **CSP headers** — Review Content Security Policy in `next.config.*`
- [ ] **Service role key audit** — Confirm key only in server env, never in client bundle

### 9.6 Infrastructure

- [ ] **Custom domain** — Set up `maqar.om` or staging subdomain `staging.maqar.om`
- [ ] **Monitoring / error tracking** — Set up Sentry or similar
  - Add `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` env vars
- [ ] **Uptime monitoring** — Set up Vercel Analytics or external uptime check
- [ ] **Database backups** — Confirm Supabase automated backups are enabled (paid plan)
- [ ] **Log retention** — Configure Vercel log drain or export

### 9.7 Mobile & QA

- [ ] **Mobile QA (iOS Safari)** — Test on real iPhone with Safari (RTL layout, OTP autofill)
- [ ] **Mobile QA (Android Chrome)** — Test PWA install, service worker, offline
- [ ] **Tablet QA** — Test responsive layout on iPad-size screens
- [ ] **Cross-browser** — Test on Chrome, Firefox, Edge, Safari

### 9.8 Support & Operations

- [ ] **Admin onboarding** — Brief admin users on the review queue workflow
- [ ] **Support channel** — Set up email / WhatsApp support contact
- [ ] **Incident response plan** — Define what to do if Supabase goes down or auth breaks

---

## 10. Quick Reference

### Project Info

| Item | Value |
|------|-------|
| App name | Maqar (مقر) |
| Next.js version | 16.2.6 |
| React version | 19.2.4 |
| Node (local) | 24.x |
| Node (Vercel) | **22.x** (set in Vercel settings) |
| Supabase project | `hlpdezbttkzbicgubuen` |
| Supabase dashboard | https://supabase.com/dashboard/project/hlpdezbttkzbicgubuen |
| Build pages | 125 |
| Last migration | `20260518000043_fix_kyc_storage_rls.sql` |

### Key Vercel Links (after project creation)

| Link | URL pattern |
|------|-------------|
| Vercel dashboard | `https://vercel.com/[org]/maqar` |
| Env vars | `https://vercel.com/[org]/maqar/settings/environment-variables` |
| Deployments | `https://vercel.com/[org]/maqar/deployments` |
| Logs | `https://vercel.com/[org]/maqar/logs` |

### Key Commands

```bash
# Verify before every deploy
npx tsc --noEmit
npm run lint
npm run build

# Stage and commit Phase A–J
git add src/ supabase/ scripts/ docs/ public/
git status  # verify .env.local is NOT included
git commit -m "feat: Supabase migration phases A–J"
git push origin main
```

---

*Document generated: 2026-05-18 · Maqar Staging Deployment*
