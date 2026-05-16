# PROJECT HANDOVER — مقر (Maqar)

**Date:** May 2026  
**Status:** Development complete — launch-ready pending infrastructure wiring  
**Handover type:** Developer → Ops / Next developer

---

## 1. Current Project Status

The application is **feature-complete across all 17 planned phases**. The codebase builds cleanly, passes TypeScript and ESLint checks, and generates 117 static/dynamic pages. All UI flows are implemented with mock data. No real external services (Supabase, payments, Anthropic) are required to run the app locally.

**The app is NOT production-ready yet** — all backend services are mocked. See Section 12 (Production Blockers) before going live.

---

## 2. Completed Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1–5 | Project foundation, design system, auth shell, core UI | ✅ Done |
| 6–9 | Listings CRUD, search/filter, map view, agent dashboard | ✅ Done |
| 10–13 | AI valuation, admin panel, analytics, KYC verification | ✅ Done |
| 14 | Subscriptions & payments (mock provider) | ✅ Done |
| 15 | PWA, offline queue, service worker, sync center | ✅ Done |
| 16 | SEO, JSON-LD structured data, area guides, content pages | ✅ Done |
| 17 | Final hardening: lint fixes, assets, docs, build validation | ✅ Done |

---

## 3. How to Run Locally

**Prerequisites:** Node.js 20+, npm 10+

```bash
# Install dependencies
npm install

# Copy env file (no real values needed for local dev — mock mode works out of the box)
cp .env.example .env.local

# Start dev server (Turbopack)
npm run dev
```

Open **http://localhost:3000**

> All data is mock. Auth uses a simulated OTP flow (enter any 6-digit code). No Supabase or payment credentials needed for local development.

---

## 4. How to Build

```bash
# Clean build (clear cache first if you hit EPERM on Windows/OneDrive)
rm -rf .next
npm run build

# Type check only (no output = clean)
npx tsc --noEmit

# Lint check
npx eslint src --ext .ts,.tsx
```

---

## 5. Build Verification (as of Phase 17 completion)

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ **0 errors** |
| `npm run build` | ✅ **0 errors**, compiled successfully |
| `npx eslint src --ext .ts,.tsx` | ✅ **0 errors** (38 warnings — unused imports, non-critical) |
| Pages generated | ✅ **117 pages** |

---

## 6. Key Routes

### Public (no auth required)

| Route | Description |
|-------|-------------|
| `/` | Homepage — featured listings, stats, hero |
| `/search` | Property search with filters and sort |
| `/listing/[id]` | Listing detail — gallery, specs, AI valuation, agent card |
| `/map` | Map view of listings |
| `/agents` | Agent directory |
| `/agents/[id]` | Agent profile |
| `/agencies` | Agency directory |
| `/agencies/[id]` | Agency profile |
| `/areas` | Area guides landing (11 Omani areas) |
| `/areas/[slug]` | Area detail — market stats, listings, services |
| `/market/[governorate]` | Governorate market overview |
| `/pricing` | Subscription plans and add-ons |
| `/tools/mortgage-calculator` | Mortgage calculator |
| `/tools/rental-yield` | Rental yield calculator |
| `/tools/roi-calculator` | ROI calculator |
| `/about`, `/privacy`, `/terms` | Content pages |
| `/listing-policy`, `/agent-verification-policy` | Policy pages |
| `/offline` | Offline fallback (served by service worker) |

### Private (auth required)

| Route | Description |
|-------|-------------|
| `/add-listing` | 10-step listing creation wizard |
| `/account/favorites` | Saved listings |
| `/account/recently-viewed` | Browsing history |
| `/account/sync` | Offline queue sync center |
| `/agent/dashboard` | Agent main dashboard |
| `/agent/listings` | Agent's listings management |
| `/agent/analytics` | Performance analytics |
| `/agent/subscription` | Subscription management |
| `/agency/dashboard` | Agency admin dashboard |
| `/admin/dashboard` | Platform admin |
| `/admin/listings` | Listing review queue |
| `/admin/system-readiness` | Production readiness checklist |

### SEO / System Routes

| Route | Description |
|-------|-------------|
| `/sitemap.xml` | Dynamic sitemap (all public pages) |
| `/robots.txt` | Disallows all private routes |
| `/manifest.webmanifest` | PWA manifest |

---

## 7. Mock Systems Still in Use

Every one of these must be replaced before production launch:

| System | Mock Location | What it replaces |
|--------|--------------|-----------------|
| **Auth** | `src/store/auth.store.ts` | Real Supabase Auth (phone OTP) |
| **Listings data** | `src/mock/listings.ts` | Supabase `listings` table |
| **Agents data** | `src/mock/agents.ts` | Supabase `profiles` table (role=agent) |
| **Agencies data** | `src/mock/agencies.ts` | Supabase `agencies` table |
| **Reviews** | `src/mock/reviews.ts` | Supabase `reviews` table |
| **Subscriptions** | `src/mock/subscriptions.ts` | Supabase `subscriptions` table |
| **Analytics** | `src/mock/agent-analytics.ts` | Supabase aggregated metrics |
| **Area prices** | `src/mock/areas.ts` | Real market data (manual or API) |
| **Payments** | `PAYMENT_PROVIDER=mock` | Thawani Pay or Stripe |
| **AI limits** | Hardcoded constants | Supabase `ai_usage` table |
| **Map** | Placeholder tiles | Mapbox GL JS or Google Maps |
| **Image upload** | UI only, no actual upload | Supabase Storage `listing-images` |
| **OTP SMS** | Any 6-digit code accepted | Twilio via Supabase Auth |
| **Push notifications** | UI only | VAPID + Web Push API |

---

## 8. Supabase Setup Summary

Full details: `docs/SUPABASE_SETUP.md`

**Quick steps:**
1. Create project at supabase.com → choose Middle East (Bahrain) region
2. Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Create tables: `profiles`, `listings`, `subscriptions`, `ai_usage`, `reviews`
4. Enable RLS on every table and add policies (examples in the setup doc)
5. Create Storage buckets: `listing-images` (public), `documents` (private), `avatars` (public)
6. Configure Phone OTP in Auth → Providers → Phone (Twilio recommended for Oman)

**Critical:** `SUPABASE_SERVICE_ROLE_KEY` is server-side only — it bypasses RLS. Never expose it to the client.

---

## 9. Payment Setup Summary

Full details: `docs/PAYMENTS_SETUP.md`

**Current state:** `PAYMENT_PROVIDER=mock` — no real charges occur anywhere in the app.

**To enable real payments:**
1. Choose provider: **Thawani Pay** (recommended — supports OMR, based in Oman) or **Stripe**
2. Set `PAYMENT_PROVIDER=thawani` (or `stripe`) in Vercel env vars
3. Add the provider's secret key (server-side only) and publishable key
4. Implement `POST /api/payments/webhook` to receive payment confirmations
5. Verify webhook signatures before processing
6. Update Supabase `subscriptions` table on successful payment events

**Plans:** Free (0 OMR), Agent Pro (15 OMR/mo), Agency (50 OMR/mo)  
**Add-ons:** Featured Listing (5 OMR/week), Lead Boost (10 OMR/one-time)

---

## 10. AI Setup Summary

Full details: `docs/AI_SETUP.md`

**Current state:** AI features (Valuation Assistant, Description Generator) work when `ANTHROPIC_API_KEY` is set. If the key is missing, UI shows a graceful fallback placeholder.

**To enable:**
1. Get API key from console.anthropic.com
2. Set `ANTHROPIC_API_KEY` in Vercel env vars (server-side only — no `NEXT_PUBLIC_` prefix)
3. Current model: `claude-3-5-haiku-20241022` — fast and affordable (~$0.0012/call)
4. Wire AI usage limits to Supabase `ai_usage` table (currently uses hardcoded mock limits)

**All AI prompts** include explicit instructions to label output as estimates, not official appraisals.

---

## 11. PWA / SEO Status

### PWA
| Item | Status | Note |
|------|--------|------|
| `public/sw.js` service worker | ✅ Done | Cache-first, network-first, SWR strategies |
| `/offline` fallback page | ✅ Done | Pre-cached by SW |
| `manifest.webmanifest` | ✅ Done | 4 app shortcuts, RTL, Arabic |
| Offline queue (add/sync) | ✅ Done | Zustand persist + sync center |
| App icons | ⚠️ SVG placeholders | Replace with PNG before app store submission |
| OG image | ⚠️ SVG placeholder | Replace with PNG (1200×630) for social sharing |

### SEO
| Item | Status |
|------|--------|
| Dynamic `sitemap.xml` | ✅ Done — includes all listings, agents, agencies, areas |
| `robots.txt` | ✅ Done — disallows /account/, /admin/, /agent/, /auth/, /api/ |
| `noindex` on private layouts | ✅ Done — account, admin, agent layouts |
| JSON-LD structured data | ✅ Done — Organization, WebSite, RealEstateListing, RealEstateAgent, FAQPage, BreadcrumbList |
| Arabic `<html lang="ar" dir="rtl">` | ✅ Done |
| Area guides (11 areas) | ✅ Done — SSG with generateStaticParams |
| Open Graph / Twitter Cards | ✅ Done — per-page metadata |

---

## 12. Production Blockers

These **must** be resolved before accepting real users or real money:

1. 🔴 **Supabase connection** — all data is mock; wire all stores to real DB
2. 🔴 **Real auth** — OTP currently accepts any 6-digit code; Twilio SMS needed
3. 🔴 **RLS policies** — Supabase Row Level Security must be enabled and tested on all tables
4. 🔴 **Payment provider** — switch from `PAYMENT_PROVIDER=mock` to Thawani/Stripe
5. 🔴 **Payment webhook** — implement `POST /api/payments/webhook` with signature verification
6. 🔴 **PNG icons** — replace SVG placeholders in `/public/icons/` with real PNG files; update manifest
7. 🔴 **Production domain** — set `NEXT_PUBLIC_APP_URL` to real domain; configure in Vercel
8. 🔴 **All env vars in Vercel** — every variable in `.env.example` must be set for production scope
9. 🟡 **Map tiles** — set `NEXT_PUBLIC_MAPBOX_TOKEN` or equivalent for real map rendering
10. 🟡 **Image upload** — wire add-listing photo step to Supabase Storage
11. 🟡 **Real OG PNG** — replace `/public/og/default.svg` with 1200×630 PNG
12. 🟡 **Rate limiting** — add rate limits to `/api/ai/`, `/api/auth/`, `/api/payments/`
13. 🟡 **CSP headers** — add Content-Security-Policy in `next.config.ts`

---

## 13. Recommended Next 10 Actions

In priority order:

1. **Create Supabase project** and run schema migrations (`docs/SUPABASE_SETUP.md`)
2. **Enable Supabase RLS** on all tables and test with anon + authenticated roles
3. **Wire auth store** (`src/store/auth.store.ts`) to real Supabase Auth with phone OTP
4. **Wire listings** — replace `MOCK_LISTINGS` reads with Supabase queries in key pages
5. **Sign up with Thawani Pay** (or Stripe) and implement the webhook endpoint
6. **Set all env vars in Vercel** for the production environment before first deploy
7. **Commission real brand assets** — PNG icons at 192px, 512px, 180px (apple), and OG image 1200×630
8. **Deploy to Vercel** with production env vars → run `docs/SMOKE_TEST_CHECKLIST.md`
9. **Submit sitemap** to Google Search Console after first live deployment
10. **Wire AI usage limits** to Supabase `ai_usage` table so plan enforcement is real

---

## 14. Key Files Reference

```
src/
├── app/                        Next.js App Router
│   ├── page.tsx                Homepage
│   ├── layout.tsx              Root layout (font, PWA links, providers)
│   ├── manifest.ts             PWA manifest (update icons to PNG for prod)
│   ├── sitemap.ts              Dynamic sitemap
│   ├── robots.ts               robots.txt
│   └── admin/system-readiness/ Live readiness checklist
├── store/
│   ├── auth.store.ts           Auth state (swap mock for Supabase)
│   ├── add-listing.store.ts    Listing wizard state
│   ├── offline.store.ts        Offline queue (Zustand persist)
│   └── favorites.store.ts      Favorites (Zustand persist)
├── lib/
│   ├── supabase/               Supabase client (server + browser)
│   ├── payments/plans.ts       Plan definitions and limits
│   ├── seo/metadata.ts         Metadata builders
│   ├── seo/jsonld.ts           JSON-LD structured data
│   └── helpers/listing-detail  Market data helpers (wire to DB)
├── mock/                       ALL mock data — replace with DB queries
public/
├── sw.js                       Service worker (cache strategies)
├── icons/                      SVG placeholders → replace with PNG
└── og/                         SVG placeholder → replace with PNG
docs/
├── SUPABASE_SETUP.md
├── PAYMENTS_SETUP.md
├── AI_SETUP.md
├── DEPLOYMENT_CHECKLIST.md     Full pre-launch checklist
├── SMOKE_TEST_CHECKLIST.md     Manual QA guide
└── PRODUCTION_TODOS.md         Prioritised gap list
.env.example                    All env vars with comments
```

---

## 15. Support Notes

- **Arabic RTL:** The app is Arabic-first. All new components need `dir="rtl"`. Test on Arabic locale.
- **Strict React rules:** The project uses `react-hooks/purity`, `react-hooks/refs`, and `react-hooks/set-state-in-effect` lint rules. Use lazy `useState` initializers, avoid `Date.now()` / `Math.random()` in render, use `useId()` for stable IDs.
- **Next.js App Router:** All pages default to server components. Add `"use client"` only when needed (event handlers, browser APIs, hooks).
- **Mock data location:** Everything in `src/mock/` is placeholder. Never import from `src/mock/` in server actions that will run in production — replace with Supabase queries.
- **OneDrive conflict (Windows):** The `.next/` build cache can hit file-lock issues on OneDrive. Always `rm -rf .next` before a clean build.
