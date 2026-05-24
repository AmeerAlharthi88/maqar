# Maqar — Private Beta Test Checklist

**Version:** 1.0  
**Date:** May 2026  
**Staging URL:** https://maqar-sigma.vercel.app  
**Instructions:** Complete each scenario in order. Mark Pass / Fail / Blocked. Add notes for any failures. Submit your results using `PRIVATE_BETA_FEEDBACK_TEMPLATE.md`.

---

## How to Use This Checklist

- **Pass** — scenario completed without errors, UI/UX was clear
- **Fail** — scenario could not be completed, or produced an error/incorrect result
- **Blocked** — scenario could not be tested (prerequisite missing, env issue, etc.)
- Add screenshot or screen recording link in the Notes column for any Fail or Blocked item

---

## A. Guest — No Login Required

> Open the site in a private/incognito browser window. Do not log in.

| # | Scenario | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| A-1 | Browse home page | Navigate to `/` | Hero section loads, featured listings visible, stats display | | |
| A-2 | Scroll home page | Scroll through all home sections | No layout breaks, all sections visible, images load | | |
| A-3 | Basic search | Click search bar, type "شقة مسقط" (or any property type + area), press search | Results page loads with listings | | |
| A-4 | Search — no results | Search for a term unlikely to return results | Empty state shown, not a blank page | | |
| A-5 | Filter by type | On search page, filter by property type (e.g., villa) | Results update to show only that type | | |
| A-6 | Filter by price range | Apply min/max price filter | Results update, out-of-range listings disappear | | |
| A-7 | Filter by bedrooms | Apply bedroom count filter | Results update correctly | | |
| A-8 | Multiple filters | Apply 2–3 filters simultaneously | Results reflect all active filters | | |
| A-9 | Clear filters | Clear all active filters | All listings return | | |
| A-10 | Open map view | Navigate to `/map` | Map loads with markers, no blank screen | | |
| A-11 | Map marker click | Click a listing marker on the map | Preview card appears with listing thumbnail and basic info | | |
| A-12 | Map preview card | Click "عرض التفاصيل" (view details) on preview card | Navigates to listing detail page | | |
| A-13 | Map — list toggle | Toggle between map view and list view | Both views display listings correctly | | |
| A-14 | Map filter | Apply a filter while on map view | Map markers update to match filter | | |
| A-15 | Open listing detail | Click any listing from search results | Listing detail page loads with images, specs, price | | |
| A-16 | Listing gallery | Click through listing images | Gallery works, images load correctly | | |
| A-17 | Listing specs | Check bedrooms, bathrooms, area, price | All values display correctly | | |
| A-18 | Agent card on listing | View agent contact section on listing detail | Agent name and contact options visible | | |
| A-19 | Try favorite (guest) | Click the favorite/heart icon on any listing | Prompted to log in / register | | |
| A-20 | Try book viewing (guest) | Click "حجز معاينة" (book viewing) on listing detail | Prompted to log in / register | | |
| A-21 | Try make offer (guest) | Click "تقديم عرض" (make offer) on listing detail | Prompted to log in / register | | |
| A-22 | Area guide | Navigate to `/areas` | Area list loads correctly | | |
| A-23 | Area detail | Click into any area | Area detail loads with description and listings | | |
| A-24 | Mortgage calculator | Navigate to `/tools/mortgage-calculator` | Calculator loads and computes correctly | | |
| A-25 | About / Terms | Navigate to `/about` and `/terms` | Pages load with content | | |

---

## B. Registered User — Auth Required

> Register with a phone number (or use test number +96892961266 with OTP 123456 if on staging).

| # | Scenario | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| B-1 | Register | Click "تسجيل" (register), enter phone number, receive OTP | Account created, redirected to home or onboarding | | |
| B-2 | Login | Log out, then log back in with same phone number | Successful login, session persists on refresh | | |
| B-3 | View account page | Navigate to `/account` | Account details and menu visible | | |
| B-4 | Favorite a listing | Click heart icon on any listing | Listing saved to favorites, heart becomes filled | | |
| B-5 | View favorites | Navigate to `/account/favorites` | Favorited listing appears in list | | |
| B-6 | Unfavorite | Click filled heart icon again | Listing removed from favorites | | |
| B-7 | Recently viewed | Browse 3–4 listings, then navigate to `/account/recently-viewed` | Browsed listings appear in order | | |
| B-8 | Save search | Perform a search, look for "حفظ البحث" (save search) option | Search saved and accessible from account | | |
| B-9 | Book a viewing | On any listing detail, click "حجز معاينة" | Booking form appears, can submit date/time | | |
| B-10 | Viewing confirmation | Submit booking form | Confirmation message shown, no error | | |
| B-11 | Make an offer | On any listing detail, click "تقديم عرض" | Offer form appears | | |
| B-12 | Submit an offer | Fill offer form and submit | Success message shown, no error | | |
| B-13 | Report a listing | On any listing detail, find the report option | Report form opens with reason options | | |
| B-14 | Submit a report | Select a reason and submit the report | Success message shown | | |
| B-15 | Log out | Use account menu to log out | Session cleared, redirected to home, account pages redirect to login | | |

---

## C. Owner / Agent — Listing Submission

> Must be logged in. An agent or owner account is required to submit listings.

| # | Scenario | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| C-1 | Navigate to add listing | Click "أضف عقار" (add listing) from nav | Listing wizard loads at Step 1 | | |
| C-2 | Step 1 — property type | Select property type and transaction type (sale/rent) | Can advance to Step 2 | | |
| C-3 | Step 2 — location | Enter area/governorate | Can advance to Step 3 | | |
| C-4 | Step 3 — details | Enter bedrooms, bathrooms, area (sqm) | Can advance | | |
| C-5 | Step 4 — pricing | Enter price and currency | Can advance | | |
| C-6 | Step 5 — description | Enter Arabic title and description | Can advance | | |
| C-7 | Step 6 — features/amenities | Select available amenities | Can advance | | |
| C-8 | Image upload — single | Upload one property image | Image appears in preview, no error | | |
| C-9 | Image upload — multiple | Upload 3–5 images | All images appear in preview | | |
| C-10 | Image reorder/delete | Remove one uploaded image | Image removed from list | | |
| C-11 | Wizard navigation | Use back button to go to a previous step | Previous step shows data already entered | | |
| C-12 | Submit listing | Complete all steps and submit | Submission success message shown | | |
| C-13 | Pending state | After submission, check agent dashboard or listings page | Listing shows "قيد المراجعة" (pending review) status | | |
| C-14 | Listing after approval | After admin approves, check the listing | Status changes to "نشط" (active), visible in search/map | | |
| C-15 | Edit listing (if supported) | Find edit option on a submitted listing | Can make changes and resubmit | | |
| C-16 | KYC submission | Navigate to KYC section in agent dashboard | Document upload form is accessible | | |
| C-17 | KYC document upload | Upload a sample ID document | Upload succeeds, status shows "under review" | | |
| C-18 | Agent dashboard | Navigate to `/agent/dashboard` | Dashboard loads with listings count and status | | |
| C-19 | Agent analytics | Navigate to `/agent/analytics` | Analytics page loads with view/click data | | |
| C-20 | Agent subscription | Navigate to `/agent/subscription` | Current plan (Free) is shown, upgrade options visible | | |

---

## D. Admin — Review and Moderation

> Requires admin account credentials. Do not use a shared account.

| # | Scenario | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| D-1 | Admin login | Log in with admin credentials, navigate to `/admin/dashboard` | Dashboard loads showing pending counts | | |
| D-2 | View pending listings | Navigate to `/admin/listings` | Pending listings queue is visible | | |
| D-3 | Review listing | Click into a pending listing | Full listing detail visible for review | | |
| D-4 | Approve listing | Click "موافقة" (approve) on a pending listing | Listing status changes to active, disappears from pending queue | | |
| D-5 | Reject listing | Click "رفض" (reject) on another pending listing, enter a reason | Listing status changes to rejected | | |
| D-6 | Verify approved listing | Navigate to search or map | Approved listing appears publicly | | |
| D-7 | Verify rejected listing | Check if rejected listing is hidden from public | Rejected listing not visible in public search/map | | |
| D-8 | KYC review queue | Find the KYC section in admin panel | Submitted KYC documents are listed | | |
| D-9 | Approve KYC | Mark a submitted KYC as approved | Agent status updates | | |
| D-10 | Reports queue | Find user reports in admin panel | Submitted reports are listed | | |
| D-11 | Dismiss a report | Mark a report as dismissed | Report marked resolved, removed from open queue | | |
| D-12 | Audit logs | Navigate to audit log section | Recent actions (approvals, logins, etc.) appear in log | | |
| D-13 | Analytics overview | Check analytics section in admin panel | View counts and engagement data display | | |
| D-14 | System readiness | Navigate to `/admin/system-readiness` | Readiness checklist page loads | | |

---

## E. Mobile — Responsive and Touch UX

> Test on a real mobile device (iOS or Android). Do not use browser DevTools resize only.

| # | Scenario | Device | Steps | Expected Result | Result | Notes |
|---|----------|--------|-------|----------------|--------|-------|
| E-1 | Home page on mobile | iOS or Android | Navigate to `/` | Page fits screen, no horizontal scroll, text readable | | |
| E-2 | Bottom navigation | Mobile | Scroll down then up | Bottom nav is sticky, all 4–5 icons accessible | | |
| E-3 | Search on mobile | Mobile | Use search bar, enter a term | Keyboard does not break layout, results load | | |
| E-4 | Filter sheet on mobile | Mobile | Open filters from search or map | Filter sheet slides up from bottom, full screen usable | | |
| E-5 | Map on mobile | Mobile | Navigate to `/map` | Map fills screen, markers visible, pinch-to-zoom works | | |
| E-6 | Map marker tap | Mobile | Tap a map marker | Preview card appears without covering full map | | |
| E-7 | Listing detail on mobile | Mobile | Open any listing | Images, specs, and price visible without horizontal scroll | | |
| E-8 | Image gallery on mobile | Mobile | Swipe through listing images | Swipe gesture works, images load | | |
| E-9 | Add listing on mobile | Mobile | Start "أضف عقار" flow | Wizard steps are usable on small screen | | |
| E-10 | Image upload on mobile | Mobile | Upload photo from mobile camera or gallery | Upload works, image preview appears | | |
| E-11 | Login on mobile | Mobile | Log in with phone number | OTP input is accessible, login completes | | |
| E-12 | RTL layout on mobile | Mobile (Arabic locale) | Browse main pages | All text and icons align correctly for RTL | | |
| E-13 | Landscape mode | Mobile | Rotate device to landscape on home and listing pages | No major layout breaks | | |

---

## F. Edge Cases and Error Handling

| # | Scenario | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| F-1 | Invalid phone number | Enter phone in wrong format at login | Validation error shown, not a crash | | |
| F-2 | Wrong OTP | Enter incorrect OTP code | Error message shown, can retry | | |
| F-3 | Submit listing without required fields | Skip required fields in wizard | Validation messages appear per field | | |
| F-4 | Upload unsupported file type | Try uploading a PDF as a listing image | Error message shown, file rejected | | |
| F-5 | Very large image | Upload an image > 10MB | Either accepted or rejected with clear message, no silent failure | | |
| F-6 | Slow network (throttle to 3G) | Browse while throttling network in DevTools | Skeletons/loading states appear, no blank crash | | |
| F-7 | Direct URL to protected page (no auth) | Navigate to `/agent/dashboard` without login | Redirected to login page | | |
| F-8 | Direct URL to admin (non-admin user) | Log in as a regular user, navigate to `/admin/dashboard` | Redirected or access denied | | |
| F-9 | 404 page | Navigate to a non-existent URL | Custom 404 page shown | | |

---

*Complete applicable sections based on your assigned role. Not all testers need to complete all sections.*
