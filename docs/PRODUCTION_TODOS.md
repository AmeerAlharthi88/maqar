# Production TODOs — مقر

This file tracks known gaps between the current development preview and a production-ready system. Each item notes which phase introduced the placeholder and what's needed to ship it.

Items are grouped by priority: 🔴 Launch Blocker, 🟡 Pre-Launch (nice-to-have), 🟢 Post-Launch.

---

## 🔴 Launch Blockers

### Infrastructure

- **Supabase connection** — All data is currently mock. Wire all stores and server actions to real Supabase tables. See `docs/SUPABASE_SETUP.md`.
  - Affects: auth, listings, profiles, subscriptions, analytics

- **Real payment provider** — `PAYMENT_PROVIDER=mock`. Switch to Thawani Pay (preferred for Oman) or Stripe. See `docs/PAYMENTS_SETUP.md`.
  - Affects: `/pricing`, `/agent/subscription`, `/add-listing` (listing limit enforcement)

- **Real PWA icons** — Current SVG placeholders in `/public/icons/`. Replace with proper PNG files before submitting to app stores or Google's PWA requirements.
  - Files needed: `icon-192.png`, `icon-512.png`, `maskable-icon-512.png`, `apple-touch-icon.png` (180×180)
  - Update `manifest.ts` and `layout.tsx` to reference `.png` with correct MIME type

- **Real OG image** — `/public/og/default.svg` is a placeholder. Replace with `default.png` (1200×630 px) for correct social sharing previews.

- **Supabase RLS policies** — Row-level security must be enabled and tested before any real user data is stored.

- **Environment variables on Vercel** — All `NEXT_PUBLIC_` and secret variables must be set in Vercel project settings before first production deploy.

### Auth

- **Real phone OTP** — Currently uses Supabase mock auth. Needs Twilio (or alternative) SMS provider configured for Omani numbers (+968).

- **Session refresh** — Supabase JWT tokens expire. Confirm the server client (`createClient()`) handles token refresh transparently.

### Security

- **Content Security Policy** — Add CSP headers in `next.config.ts`:
  ```javascript
  headers: [{ source: '/(.*)', headers: [{ key: 'Content-Security-Policy', value: "..." }] }]
  ```

- **Rate limiting** — API routes (`/api/ai/`, `/api/auth/`, `/api/payments/`) need rate limiting. Use Vercel Edge Middleware or Supabase Edge Functions.

---

## 🟡 Pre-Launch (Recommended Before Opening to Public)

### Data

- **Real listing data** — Currently all listings are mock data from `src/mock/`. The admin approval flow (`/admin/listings`) needs to feed into real Supabase `listings` table.

- **Real agent profiles** — Agents in `src/mock/agents.ts` are placeholder data. The KYC verification flow needs to be wired to real document upload (Supabase Storage `documents` bucket).

- **Real area price data** — `src/mock/areas.ts` contains estimated market data. Wire to a data source or update manually by the content team quarterly.

- **Real market data** — Market averages in `src/lib/helpers/listing-detail.ts` are computed from mock listings. Production needs real database queries.

### Features

- **Map tiles** — `src/components/map/` uses a placeholder map. Wire to Mapbox GL JS or Google Maps with a production API key.
  - ENV: `NEXT_PUBLIC_MAPBOX_TOKEN` or `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

- **AI valuation** — Set `ANTHROPIC_API_KEY` and test Arabic output quality on real Omani property data.

- **Push notifications** — VAPID keys need to be generated. Wire the existing notification store to a real push service.
  - `scripts/generate-vapid-keys.js` — create this helper
  - ENV: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

- **Image upload** — The add-listing photo step has a UI but no real upload. Wire to Supabase Storage `listing-images` bucket.

- **Search** — Current search is client-side filtering of mock data. Wire to Supabase full-text search or Algolia.

### SEO & Marketing

- **Real reviews** — `src/mock/reviews.ts` contains mock reviews. In production, reviews come from the database.

- **Real agent statistics** — `stats.reviewCount`, `stats.totalListings`, `stats.avgRating` are mock values.

- **Google Search Console** — Submit `sitemap.xml` after first production deployment.

- **Analytics** — Wire PostHog (or alternative) for user behavior analytics:
  - ENV: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

---

## 🟢 Post-Launch (Future Phases)

- **E2E test suite** — Playwright tests for critical user journeys (auth, add listing, payment)
- **Unit tests** — Jest tests for utility functions (price formatting, validation, market calculations)
- **Staging environment** — Separate Supabase project + Vercel preview environment for testing
- **CI/CD pipeline** — GitHub Actions: lint → type-check → build → deploy to staging on PR
- **Error monitoring** — Sentry integration for production error tracking
- **Performance monitoring** — Core Web Vitals tracking (Vercel Analytics or Lighthouse CI)
- **A/B testing** — PostHog feature flags for iterating on listing cards and search UX
- **Mobile apps** — Capacitor.js wrapper for App Store / Google Play submission
- **Arabic NLP search** — Arabic-aware full-text search with stemming (OpenSearch/Algolia Arabic)
- **WhatsApp Business API** — Replace direct WhatsApp links with WhatsApp Business API for analytics
- **Email notifications** — Listing approval, new lead, subscription renewal notifications

---

## Technical Debt

- `<img>` elements in listing gallery, agent card, favorites → should be `next/image` for LCP optimization
- Mock data functions spread across `src/mock/` → consolidate access through a data layer abstraction
- `TODO Phase X` comments throughout the codebase — search and address before launch: `grep -r "TODO Phase" src/`
- Unused imports generating ESLint warnings — clean up before each release
