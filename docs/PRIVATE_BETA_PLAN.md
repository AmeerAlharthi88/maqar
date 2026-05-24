# Maqar — Private Beta Plan

**Version:** 1.0  
**Date:** May 2026  
**Stage:** Controlled Private Beta — invite-only, pre-marketing  
**Staging URL:** https://maqar-sigma.vercel.app

---

## 1. Beta Objective

Validate the end-to-end experience of the Maqar platform under real-world conditions with a small, trusted group of users before public launch. The goal is to surface usability issues, data integrity problems, and workflow gaps that were not caught in internal UAT — not to test infrastructure scale.

---

## 2. Beta Scope

| Area | In Scope | Out of Scope |
|------|----------|-------------|
| Browse, search, filter, map | Yes | — |
| Listing detail pages | Yes | — |
| Registration and login (phone OTP) | Yes | Real SMS (unless Twilio configured) |
| Favorites, recently viewed | Yes | — |
| Book viewing / make offer | Yes | Payment confirmation |
| Add listing (10-step wizard) | Yes | — |
| Image upload | Yes | — |
| KYC document submission | Yes | Automated KYC verification |
| Agent dashboard and analytics | Yes | — |
| Admin approval workflow | Yes | — |
| Subscription (Free plan) | Yes | Paid plans / billing |
| AI valuation | Yes (if API key set) | — |
| Payments | No | All paid plans — mock only |
| Public marketing pages | No | — |
| Social sharing / OG cards | No | OG image is still SVG placeholder |

**Geographic focus:** Muscat governorate first. Expand to Dhofar, Batinah, and other Omani areas based on tester availability and listing supply.

---

## 3. Who Should Test

| Tester Type | Count | Profile |
|------------|-------|---------|
| Buyers / renters (guests + registered) | 10–15 | Individuals actively looking to buy or rent in Oman |
| Property owners | 2–3 | Owners with 1–3 real properties to list |
| Real estate agents | 2–3 | Licensed agents in Oman, comfortable with mobile/web tools |
| Platform admin (internal) | 1–2 | Team member familiar with admin panel |
| **Total** | **15–23** | — |

**Selection criteria:**
- Arabic-speaking preferred (platform is Arabic-first)
- Mix of mobile (iOS/Android) and desktop users
- Not developers or designers — test with fresh eyes
- At least 2 testers on older/slower devices

---

## 4. Number of Testers

**Target: 15–20 active testers**

- Minimum: 10 (enough to surface common patterns)
- Maximum: 25 (beyond this, support load exceeds current capacity)
- Do not onboard all testers simultaneously — stagger by week to manage feedback volume

---

## 5. User Roles

| Role | Permissions | What They Test |
|------|-------------|----------------|
| Guest | Browse only, no auth | Search, filter, map, listing detail |
| Registered User | Auth required, no listing rights | Favorites, viewed history, book viewing, make offer |
| Owner | Auth + listing submission | Add listing, upload images, check pending state, edit |
| Agent | Auth + agent dashboard | Listings, analytics, KYC, subscription status |
| Admin | Full admin panel | Approve/reject listings, KYC review, audit logs |

---

## 6. Test Duration

| Phase | Duration | Goal |
|-------|----------|------|
| Onboarding (Week 1) | 3–5 days | Walk each tester through login, profile, one core flow |
| Active testing (Weeks 2–3) | 10 days | Cover all assigned scenarios in `PRIVATE_BETA_TEST_CHECKLIST.md` |
| Feedback consolidation (Week 4) | 5 days | Review all submissions, triage bugs, prepare fix list |
| **Total** | **~4 weeks** | — |

---

## 7. Success Criteria

The beta is considered successful if:

- [ ] At least 10 testers complete their assigned scenario checklist
- [ ] At least 5 real listings are submitted, approved, and visible on map + search
- [ ] Zero critical/security bugs found (or all found and fixed before exit)
- [ ] Phone OTP login works reliably for all testers
- [ ] Image upload and display works for at least 3 separate listings
- [ ] Admin approval workflow completes without errors for every submitted listing
- [ ] No tester reports being unable to complete their primary user journey
- [ ] Average feedback rating ≥ 3.5 / 5

---

## 8. Go / No-Go Criteria

### Go (proceed to broader beta or public launch)

- All success criteria above are met
- No open severity-1 bugs (data loss, auth bypass, broken listing submission)
- At least 3 agents/owners have successfully published live listings
- Admin panel is stable under real-use load
- Feedback is net positive with actionable improvement list

### No-Go (pause and fix)

- Any auth bypass or RLS violation discovered
- Listing images fail to upload for > 25% of attempts
- Admin cannot approve/reject listings consistently
- OTP login fails for > 10% of testers
- Multiple testers independently cannot complete a single critical flow

---

## 9. Known Limitations

See `PRIVATE_BETA_KNOWN_LIMITATIONS.md` for the full list. Summary:

- Payments are mock — no real charges occur
- AI valuation may return placeholder responses
- SMS OTP uses test number only unless Twilio is configured
- Some listings are seeded test data
- Map coverage may be sparse until more listings are approved
- Legal content (terms, privacy policy) is still pending final legal review
- English localization is incomplete in some sections

**Testers must be informed of these limitations before they begin.**

---

## 10. Support Process

| Channel | Purpose | Response SLA |
|---------|---------|-------------|
| WhatsApp group (private) | Real-time tester support | < 4 hours (business hours) |
| Email (beta@maqar.om or equivalent) | Bug reports and feedback | < 24 hours |
| Admin panel | Monitor new listings, approvals | Daily check |
| Feedback form | Structured scenario feedback | Reviewed weekly |

**Escalation path:**
1. Tester reports issue via WhatsApp/email
2. Admin reviews — severity assigned (Critical / High / Medium / Low)
3. Critical bugs: fix and redeploy within 24–48 hours
4. High bugs: fix within current beta cycle
5. Medium/Low: log for post-beta sprint

---

## 11. Feedback Collection Method

1. **Structured form** — `PRIVATE_BETA_FEEDBACK_TEMPLATE.md` completed after each scenario
2. **WhatsApp group** — for real-time reactions, screenshots, quick questions
3. **Screen recording** — testers encouraged to record mobile sessions (optional)
4. **Weekly 30-min sync call** — optional group call with active testers (Week 2 and Week 3)
5. **Exit survey** — short Google Form after tester completes all scenarios (NPS + 3 open questions)

All feedback consolidated into a single `BETA_FEEDBACK_LOG.xlsx` or Notion table owned by the PM.

---

## 12. Rollout Plan

| Week | Action |
|------|--------|
| Week 0 (now) | Finalize tester list, prepare onboarding message, confirm admin account |
| Week 1 | Onboard 5 pilot testers (1 admin, 1 agent, 3 buyers) — verify flows work end-to-end |
| Week 2 | Expand to full tester group (15–20) |
| Week 3 | Active testing, daily feedback triage |
| Week 4 | Close new feedback, consolidate bugs, prepare post-beta sprint plan |
| Post-beta | Fix high-priority bugs → prepare for public launch |

---

*This plan is a living document — update it as the beta progresses.*
