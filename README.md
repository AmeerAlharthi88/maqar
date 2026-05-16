# مقر — Maqar

**منصة العقارات العُمانية الأولى** — The first Omani real estate platform.

Arabic-first PWA built with Next.js 15 App Router, Supabase, and the Anthropic Claude API.

---

## Features

- 🏠 **Property listings** — Search, filter, map view for sales and rentals across Oman
- 📍 **Area guides** — Market data and insights for 11 key Omani areas
- 🤖 **AI Valuation** — Claude-powered price analysis in Arabic
- 🔐 **Agent verification** — KYC flow with document upload and manual review
- 💳 **Subscriptions** — Free, Agent Pro (15 OMR/mo), Agency (50 OMR/mo) plans
- 📱 **PWA** — Installable, works partially offline, service worker caching
- 🌐 **SEO** — Dynamic sitemap, structured data (JSON-LD), Arabic metadata
- 🇴🇲 **RTL** — Full Arabic RTL support throughout

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.2.6 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Auth & DB | Supabase (Auth, PostgreSQL, Storage) |
| State | Zustand with `persist` |
| AI | Anthropic Claude API (claude-3-5-haiku) |
| Charts | Recharts (dynamic import, SSR-safe) |
| Font | IBM Plex Sans Arabic |
| PWA | Custom service worker (`public/sw.js`) |
| Deploy | Vercel |

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Clone the repo
git clone https://github.com/your-org/maqar.git
cd maqar

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local — see docs/SUPABASE_SETUP.md for required values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** In development mode, all data is mock. No real Supabase connection is required to run the UI. The app works fully offline with mock data.

---

## Environment Variables

See `.env.example` for all variables with comments. Key ones:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | **Server-side only** — never NEXT_PUBLIC_ |
| `ANTHROPIC_API_KEY` | AI features | **Server-side only** |
| `PAYMENT_PROVIDER` | Production | `mock` (dev) or `thawani`/`stripe` (prod) |
| `NEXT_PUBLIC_APP_URL` | Production | Your domain (e.g. `https://maqar.om`) |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public pages)      # /, /search, /listing/[id], /areas/, ...
│   ├── agent/              # Agent dashboard (private, noindex)
│   ├── agency/             # Agency dashboard (private, noindex)
│   ├── admin/              # Admin panel (private, noindex)
│   ├── account/            # User account (private, noindex)
│   └── auth/               # Auth flows
├── components/             # Reusable UI components
│   ├── ai/                 # AI-powered components
│   ├── listing/            # Listing detail components
│   ├── search/             # Search and filter components
│   ├── seo/                # Breadcrumb, FAQAccordion, TrustBlock
│   └── ui/                 # Design system primitives
├── hooks/                  # Custom React hooks
├── lib/
│   ├── helpers/            # Data helpers for listing detail, market data
│   ├── payments/           # Subscription plans, usage limits
│   └── seo/                # Metadata builders, JSON-LD, sharing helpers
├── mock/                   # All mock data (replace with DB in production)
├── providers/              # React context providers
├── store/                  # Zustand stores
└── types/                  # TypeScript type definitions
public/
├── sw.js                   # Service worker (PWA)
├── icons/                  # App icons (SVG placeholders — replace with PNG for prod)
└── og/                     # Open Graph images (SVG placeholder)
docs/
├── SUPABASE_SETUP.md       # Database setup guide
├── PAYMENTS_SETUP.md       # Payment provider setup
├── AI_SETUP.md             # Anthropic API setup
├── DEPLOYMENT_CHECKLIST.md # Pre-launch checklist
├── SMOKE_TEST_CHECKLIST.md # Manual QA checklist
└── PRODUCTION_TODOS.md     # Known gaps to close before launch
```

---

## Scripts

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
npx tsc --noEmit   # TypeScript type check (no output)
```

---

## Development Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1–5 | Foundation, Auth, Core UI | ✅ Done |
| 6–9 | Listings, Search, Map, Agent flows | ✅ Done |
| 10–13 | AI features, Admin, Analytics | ✅ Done |
| 14 | Subscriptions & Payments (mock) | ✅ Done |
| 15 | PWA & Offline | ✅ Done |
| 16 | SEO & Content pages | ✅ Done |
| 17 | Final hardening & launch readiness | ✅ Done |

**Next Steps:** See `docs/PRODUCTION_TODOS.md` for what's needed before launch.

---

## Production Deployment

See `docs/DEPLOYMENT_CHECKLIST.md` for the full pre-launch checklist.

Quick deploy to Vercel:

```bash
vercel --prod
```

Required before deploying:
1. Set all environment variables in Vercel project settings
2. Create Supabase project and run migrations (see `docs/SUPABASE_SETUP.md`)
3. Replace SVG icon placeholders with real PNG assets
4. Switch `PAYMENT_PROVIDER` from `mock` to a real provider

---

## Contributing

1. Branch off `main`: `git checkout -b feature/my-feature`
2. Run `npx tsc --noEmit && npm run lint` before committing
3. Test against `docs/SMOKE_TEST_CHECKLIST.md`
4. Open a PR with a description of changes

---

## License

Private — All rights reserved. Maqar © 2026.
