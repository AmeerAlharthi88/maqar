# Smoke Test Checklist — مقر

Run these tests manually before every production release. Tests are grouped by flow. Estimated time: ~30 minutes.

---

## Setup

- Test on: Chrome mobile emulation (iPhone 12 Pro), and a real Android device
- Language: Arabic (ensure RTL is correct)
- Network: Test some steps with throttled connection (Slow 3G)

---

## 1. Public Browsing (Unauthenticated)

- [ ] **Homepage** (`/`) loads within 3 seconds
- [ ] Main nav (بحث، خريطة، مفضلة، حسابي) visible
- [ ] Featured listings appear on homepage
- [ ] **Search** (`/search`) → listings grid loads
- [ ] Filter sheet opens and applies correctly (purpose, type, price)
- [ ] Sort options work (الأحدث، السعر، ...)
- [ ] **Listing Detail** (`/listing/[id]`) → all sections load:
  - Gallery, Header, Specs, Description
  - Market insight, AI Valuation (shows placeholder if no API key)
  - Agent card with WhatsApp button
  - Similar listings
- [ ] **Map** (`/map`) → tiles load, listings visible as pins
- [ ] **Agents** (`/agents`) → agent cards load
- [ ] **Agent Profile** (`/agents/[id]`) → profile loads, breadcrumb visible
- [ ] **Agencies** (`/agencies`) → agency list loads
- [ ] **Agency Profile** (`/agencies/[id]`) → profile loads
- [ ] **Area Guides** (`/areas`) → 11 area cards visible
- [ ] **Area Detail** (`/areas/muscat-al-mouj`) → stats, description, listings load
- [ ] **Pricing** (`/pricing`) → 3 plan cards, FAQ accordion works
- [ ] **About** (`/about`) → content loads, breadcrumb visible
- [ ] **Tools** (`/tools`) → calculator links work
- [ ] **Mortgage Calculator** (`/tools/mortgage`) → calculates correctly

---

## 2. Authentication Flow

- [ ] `/auth/login` loads with phone input
- [ ] Enter valid Omani number (+968 XXXXXXXX) → OTP sent (mock: any 6-digit code)
- [ ] Enter OTP → redirect to dashboard or previous page
- [ ] **Logout** → redirect to homepage, auth state cleared
- [ ] **Protected route** while logged out → redirect to `/auth/login?redirectTo=...`
- [ ] After login → redirected back to original destination

---

## 3. Add Listing Flow (Authenticated)

- [ ] `/add-listing` requires auth (redirects if unauthenticated)
- [ ] Step 1: Purpose (بيع/إيجار) → advances
- [ ] Step 2: Property type → advances
- [ ] Step 3: Details (rooms, area) → validation works (required fields)
- [ ] Step 4: Price → suspicious price warning shows for extreme values
- [ ] Step 5: Location → wilayat selector works
- [ ] Step 6: Photos → file upload UI shows (no real upload in mock mode)
- [ ] Step 7: Documents → document type selector works
- [ ] Step 8: Description → AI generate button shows (may fail without API key)
- [ ] Step 9: Review → quality score shows, terms checkbox works
- [ ] Step 10: Submit → disabled when offline, enabled when online with terms accepted
- [ ] **Save Draft** → draft persists on page refresh

---

## 4. Agent Dashboard (Authenticated)

- [ ] `/agent/dashboard` loads for authenticated user
- [ ] Listings tab → listings table visible
- [ ] Analytics → charts render
- [ ] Profile → agent info shows
- [ ] Subscription → current plan shows
- [ ] **Upgrade** button on pricing page → shows payment flow (mock)

---

## 5. Account Features

- [ ] `/account/favorites` → saved listings visible (or empty state)
- [ ] Heart icon on listing card → adds/removes from favorites
- [ ] Favorites persist after page refresh (localStorage)
- [ ] `/account/recently-viewed` → last-visited listings visible
- [ ] `/account/sync` → sync status shows for offline queue
- [ ] `/account/notifications` → notifications list

---

## 6. PWA & Offline

- [ ] **Install prompt** appears on mobile after 30 seconds
- [ ] Add to Home Screen → app opens in standalone mode
- [ ] **Go offline** (DevTools → Network → Offline):
  - [ ] Homepage shows cached version
  - [ ] `/offline` page appears for uncached routes
  - [ ] Favorites still visible
  - [ ] Add listing → offline warning shown on step 9/10
  - [ ] Submit button disabled when offline
- [ ] **Go back online** → sync banner shows pending actions

---

## 7. SEO & Structured Data

- [ ] `https://[domain]/sitemap.xml` returns valid XML with listings/areas/agents
- [ ] `https://[domain]/robots.txt` disallows `/account/`, `/admin/`, `/agent/`
- [ ] View page source on homepage → contains `application/ld+json` Organization schema
- [ ] View page source on listing detail → contains RealEstateListing JSON-LD
- [ ] View page source on `/pricing` → contains FAQPage JSON-LD

---

## 8. Admin (Requires admin role)

- [ ] `/admin/dashboard` loads
- [ ] `/admin/listings` → pending review listings visible
- [ ] `/admin/system-readiness` → checklist loads with Phase 17 items
- [ ] `/admin/reports` → report queue visible

---

## 9. RTL & Arabic

- [ ] All text is RTL-aligned (test on Arabic system locale)
- [ ] Numbers display in Arabic-Indic format where expected (e.g., prices)
- [ ] Date formatting is Arabic (e.g., "١٥ مايو ٢٠٢٦")
- [ ] Form inputs: placeholder text is Arabic, input direction is RTL
- [ ] Toast notifications appear on the correct side (top-center or top-right)

---

## 10. Accessibility Spot Checks

- [ ] Tab through homepage → focus ring visible on all interactive elements
- [ ] Screen reader (VoiceOver/TalkBack): headings are structured (h1 → h2 → h3)
- [ ] Images: listing photos have meaningful alt text
- [ ] Buttons: all icon-only buttons have `aria-label`
- [ ] Modal dialogs: focus trapped inside while open

---

## Known Limitations (Not Tested)

These features require real external services not available in demo mode:

- Real OTP SMS delivery (Twilio/similar)
- Real payment charging (Thawani/Stripe)
- Real map tiles at zoom level > 14 (Mapbox free tier limit)
- Real Supabase data persistence (all data is mock)
- AI valuation (requires `ANTHROPIC_API_KEY`)

---

## Test Sign-Off

| Date | Tester | Build/Commit | Result | Notes |
|------|--------|--------------|--------|-------|
| | | | | |
