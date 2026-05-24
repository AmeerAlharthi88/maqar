# Maqar — Private Beta Known Limitations

**Version:** 1.0  
**Date:** May 2026  
**Audience:** Beta testers, admin team, internal stakeholders

This document lists known limitations of the Maqar platform during the private beta phase. These are **not bugs** — they are intentional constraints that reflect the current stage of the product. All items here are planned for resolution before public launch unless otherwise noted.

**Share this document with every tester before they begin testing.**

---

## 1. Payments — Mock Only

**What this means:** No real payments are processed anywhere in the platform. Clicking "Subscribe", "Upgrade Plan", or any billing-related action will either show a mock confirmation or display placeholder UI.

**Impact:** Subscription upgrades (Agent Pro, Agency plan) are not functional. Only the Free plan is active.

**What to test:** The subscription UI, plan display, and billing page layout can still be tested for usability. Actual payment flows cannot be tested.

**Timeline:** Real payment integration (Thawani Pay or Stripe) is planned post-beta.

---

## 2. AI Valuation — May Be Mock or Unavailable

**What this means:** The AI property valuation feature ("التقييم الذكي") requires an Anthropic API key configured on the server. If the key is not set or the quota is exceeded, the UI will show a fallback placeholder instead of a real AI estimate.

**Impact:** AI valuation results on listing detail pages may not reflect real market data. Results should be treated as illustrative during beta.

**What to test:** The UI presentation of AI valuation, the loading state, and the fallback state are all testable. Accuracy of the valuation itself cannot be validated in beta.

**Note:** All AI outputs are labeled as estimates and not official appraisals, by design.

---

## 3. Market Data — Estimated / Seeded

**What this means:** Area price statistics, price-per-sqm figures, and market trend data displayed in area guides (`/areas/[slug]`) and market pages (`/market/[governorate]`) are seeded from reference data or manually estimated values. They are not connected to a live real estate data feed.

**Impact:** Market data may not reflect current Oman market conditions accurately.

**What to test:** The presentation, formatting, and navigability of market data pages.

**Timeline:** Live market data integration is a post-launch feature.

---

## 4. Some Listings Are Test / Sample Data

**What this means:** The platform currently contains listings that were created as part of internal QA and seeding during development. These listings may have placeholder descriptions, stock photos, or test pricing that does not reflect real properties.

**How to identify them:** Test listings may have generic titles or unrealistic prices.

**What to do:** Ignore test listings for content quality feedback. Focus on whether the listing display, map, search, and filtering work correctly.

---

## 5. Map Coverage May Be Limited

**What this means:** Map markers only appear for listings that have been submitted and approved with valid GPS coordinates. During early beta, the number of real, approved listings is small (currently 4–5 live listings in Muscat), so the map may appear sparse.

**Impact:** Map view is functional but will feel empty until more real listings are approved.

**What to test:** Map loading, marker interaction, preview cards, layer controls, and the list/map toggle. Do not evaluate the map based on listing density during beta.

---

## 6. SMS OTP — Test Number Only (Unless Twilio Is Configured)

**What this means:** Real phone OTP via SMS (Twilio) may not be enabled on the staging environment. The test phone number `+96892961266` with OTP code `123456` is the guaranteed way to log in during beta testing.

**Impact:** Testers using their real phone numbers may not receive an SMS OTP on staging.

**What to do:** Use the test credentials above during beta testing. If you need a real phone login tested, contact the admin team to arrange it.

**Timeline:** Real Twilio SMS integration is configured and ready — it will be activated with a single environment variable change before public launch.

---

## 7. English Localization Incomplete

**What this means:** Maqar is an Arabic-first platform. Some sections have English text that is incomplete, placeholder, or not yet translated. In some areas, you may see a mix of Arabic and English.

**Impact:** English-language users will have a degraded experience in some flows during beta.

**What to test:** Arabic language flows are the primary test target. Report any Arabic text that appears incorrect or unclear. English gaps are known and lower priority.

**Timeline:** Full bilingual (Arabic/English) localization is planned for a later release.

---

## 8. Legal Content Pending Final Review

**What this means:** The Terms of Service (`/terms`), Privacy Policy (`/privacy`), and other legal content pages are placeholder text. They have not been reviewed or approved by a legal team.

**Impact:** The platform should not be used for legally binding transactions during beta. No real data that requires legal data protection commitments should be entered.

**What to do:** Do not submit real personal ID documents, real financial information, or real contact details unless you are comfortable with the beta / staging context.

**Timeline:** Final legal review and content update is required before public launch.

---

## 9. Image Placeholders and Brand Assets

**What this means:** Some platform icons and social sharing images are SVG placeholders rather than final production-quality PNG assets. The Open Graph image (used when sharing links on social media) is an SVG placeholder.

**Impact:** Link previews on WhatsApp/social media may not display correctly. App install icon on home screen may appear basic.

**What to test:** Image upload functionality for listings (this is a real feature). The placeholder icons above are a known cosmetic issue.

---

## 10. No Public Marketing or SEO Exposure

**What this means:** The staging site is not indexed by search engines (no-index headers). It is not promoted publicly anywhere. Access is invite-only.

**Impact:** Do not share the beta URL publicly. Do not post about it on social media.

**Reason:** We want to control onboarding and protect testers' data until the platform is fully ready.

---

## 11. Rate Limiting and Security Headers

**What this means:** Some production security hardening (rate limiting on API endpoints, Content-Security-Policy headers) may not be fully active on staging.

**Impact:** The staging environment is less hardened than production will be. Do not attempt any security or load testing without explicit permission.

---

## 12. Offline / PWA Features May Behave Differently on Staging

**What this means:** The Progressive Web App (PWA) service worker caches certain content for offline use. On staging, cache behavior may differ from production due to environment differences.

**What to test:** Core online flows only. Skip offline queue testing unless specifically assigned.

---

## Summary Table

| Limitation | Severity | Planned Resolution |
|-----------|----------|-------------------|
| Payments are mock | High | Post-beta (Thawani Pay / Stripe) |
| AI valuation may be placeholder | Medium | Post-beta (API key activation) |
| Market data is seeded/estimated | Medium | Post-launch (live data feed) |
| Some listings are test data | Low | Ongoing (admin moderation) |
| Map coverage is sparse | Low | Resolves as listings grow |
| SMS OTP test number only | High | Pre-public-launch (Twilio activation) |
| English localization incomplete | Medium | Later release |
| Legal content not finalized | High | Pre-public-launch (legal review) |
| SVG placeholder icons/OG | Low | Pre-public-launch (brand assets) |
| No public marketing | N/A — by design | Post-beta |

---

*For questions about any of these limitations, contact the admin team via the private beta WhatsApp group.*
