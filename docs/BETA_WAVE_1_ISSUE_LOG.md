# Beta Wave 1 — Issue Log

**Status:** 🟢 OPEN — monitoring (no new development for first 48–72h unless Critical/High)
**Production:** https://maqar-sigma.vercel.app
**Live deployment:** `dpl_76w6DX3tcusyGMHTSUEcBkzcsZHS` (main @ `2652c4b`, PR #30)
**Wave opened:** 2026-06-11

---

## Baseline — verified ready before Wave 1

Full agent → admin → buyer E2E passed on production **19/19, no mock data, no errors**:
- Agent creates Villa/Apartment/Land → all `pending_review`/`pending`
- Admin `/admin/listings` shows **real rows only** (no mock); approve publishes (`active`/`approved`)
- Approved listing public to buyer; pending listings stay hidden
- Buyer open / favorite / book viewing / make offer / report — all persist
- Admin `/admin/reports` shows the **real** buyer report (no mock)
- Agent My Listings: 1 approved / 2 pending
- Buyer blocked from `/api/admin/*` (403)

Fixes live: PR #27 (submit schema), #28 (review/type/purpose logic), #29 (admin mobile/profile/nav), #30 + F1 env fix (service-role key BOM + no mock fallback). Preview env key also corrected.

---

## Rules in effect

- Monitor only; **no new dev for 48–72h** unless a Critical or High bug appears.
- ≤ 3–5 testers. **No admin access to external testers.** Admin account stays internal.
- **No PR merged without explicit approval.**
- Critical/High → **pause beta**, prepare a small PR **only after approval**.
- Medium/Low → **backlog only**, do not fix without approval.

## Accounts (controlled beta only — OTP `123456`)

| Role | Number | Notes |
|------|--------|-------|
| Internal admin monitor | 92961260 | **Internal only — never share** |
| Agent / Owner tester | 92961261 | |
| Buyer tester 1 | 92961262 | |
| Buyer tester 2 | 92961263 | |
| Buyer tester 3 | 92961264 | |

---

## Test scope checklist

**Agent:** create Villa-Sale · Apartment-Rent · Land-Sale · check My Listings · confirm status after admin approval
**Buyer:** browse home · search/filter · open approved listing · favorite · book viewing · make offer · report listing · check account/profile · switch AR/EN
**Admin (internal):** monitor `/admin/listings` · approve/reject · monitor `/admin/reports` · watch audit logs · confirm no mock data · confirm pending stay hidden

---

## Severity rules

**Critical** — login/OTP fails · listing submission fails · admin cannot approve/reject · approved listings not public · pending listings appear publicly · buyer can access admin · report/booking/offer data lost · any security/data exposure.
**High** — main flow works but serious confusion/wrong data · wrong price/type/status shown · admin page shows wrong operational data · mobile flow blocked for normal testers.
**Medium/Low** — wording · spacing · minor UI polish · optional features · small localization.

---

## Issue log

> One row per reported issue. Fill from tester feedback. Critical/High block continuation.

| ID | Severity | Role | Page | Expected | Actual | Evidence | Blocks beta? | Status |
|----|----------|------|------|----------|--------|----------|--------------|--------|
| — | — | — | — | _No issues reported yet_ | — | — | — | — |

### Critical / High (active blockers)
_None._

### Medium / Low (backlog — no action without approval)
_None._

---

## Monitoring notes (running)

| When | Note |
|------|------|
| Wave open | Baseline verified 19/19 on production; awaiting tester feedback. |

---

## Resolution log (PRs raised from Wave 1 — only after approval)
_None yet._
