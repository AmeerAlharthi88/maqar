# Maqar — Developer / QA Setup Checklist

Single source of truth so every PR is tested the same way. **No secret values appear in this file.**
Verified against this machine on 2026-06-12.

---

## 0. Access status on this device (verified)

| Capability | Status | Notes |
|------------|--------|-------|
| GitHub repo `AmeerAlharthi88/maqar` | ✅ Working | push + PR via stored git credential token (PRs created through GitHub REST API) |
| `gh` CLI auth | ⚠️ Not logged in | **Not required** — token-via-credential covers PR/push |
| Vercel CLI | ✅ Authenticated (`ameeralharthi2-7381`), project `maqar` linked | deployments, `env ls`, redeploy, logs |
| Supabase data/RLS/auth | ✅ Via SDK + keys in `.env.local` | schema reads, RLS-as-role, auth as test users, service-role for admin/cleanup |
| Supabase CLI | ⚠️ Not installed | **Optional** — only needed for `db diff`/`db pull`/migrations |
| Node / npm / git | ✅ Node 24.15, npm 11.12, git 2.54 | |
| Project deps | ✅ `node_modules` present, Next 16.2.6, `@supabase/supabase-js` | |
| Playwright + Chromium | ✅ 1.60.0 + chromium-1223 | used for browser E2E |
| Browsers | ✅ Chrome, ✅ Edge, ❌ Firefox | Firefox optional |

**Bottom line:** everything needed for build/PR/deploy/DB-validation/browser-E2E is available. The three gaps (gh-auth, Supabase CLI, Firefox) all have working alternatives in use.

---

## 1. Required laptop tools

Minimum (all present): **VS Code · Git · Node LTS · Vercel CLI · Chrome · Playwright + Chromium · project `node_modules`.**
Optional add-ons (not installed; only if you want them): Supabase CLI · Firefox · Android Studio emulator · Docker · Postman/Insomnia · TablePlus/DBeaver.

```
node --version        # v24.x
npm --version
git --version
```

## 2. Required CLI login checks
```
npx vercel whoami                 # -> ameeralharthi2-7381   (auth OK)
git remote -v                     # -> AmeerAlharthi88/maqar (repo linked)
# gh auth is NOT required; PRs go through the REST API with the stored credential.
# Supabase CLI is optional; data access is via the SDK + .env.local keys.
```

## 3. GitHub access check
```
git remote -v                     # origin = AmeerAlharthi88/maqar
git fetch origin main             # confirm reachable
git push -u origin <branch>       # write access (used per PR)
# PR creation: GitHub REST API with the token from `git credential fill` (never printed).
```

## 4. Vercel access check
```
npx vercel whoami
npx vercel ls --prod | head -5            # latest production deployments
npx vercel inspect maqar-sigma.vercel.app # alias -> deployment id
npx vercel env ls                          # names + target only (values stay Encrypted)
```
Rule: confirm env-var **existence/target**, never print values.

## 5. Supabase access check (via SDK, no CLI needed)
A tiny Node script using `.env.local` keys can verify:
- **Schema:** read a sample row of a table to list columns.
- **RLS:** sign in as a test user (anon key) and confirm row visibility / 403s.
- **Auth:** OTP login for each beta number (`123456`).
- **Service role:** admin reads + cleanup of test rows.

```
# Reads keys from .env.local in memory only — never echo the key.
node -e "const{createClient}=require('./node_modules/@supabase/supabase-js');/* ...query... */"
```

## 6. Local dev run command
```
npm run dev            # Next dev (use --port 3099 to avoid clashes)
# health: curl -s -o /dev/null -w '%{http_code}' http://localhost:3099/
```

## 7. TypeScript / build / lint (run before every PR)
```
npx tsc --noEmit       # must be 0 errors
npm run build          # must complete (full route table)
npm run lint           # 0 errors (pre-existing warnings are tracked, not new)
```

## 8. Playwright setup
```
# Chromium already installed (ms-playwright/chromium-1223).
# Scripts run from the project root so node_modules resolve.
# Production is public -> drive maqar-sigma.vercel.app directly.
# Preview is SSO-gated (401) -> verify on localhost (identical commit) instead.
# Auth in tests: SDK OTP login -> inject `sb-<ref>-auth-token` cookie (admin/agent/buyer).
# Fresh context = clean incognito (no SW cache / no localStorage) -> tests the latest build.
```

## 9. Production smoke test checklist (after every prod deploy)
1. `vercel inspect maqar-sigma.vercel.app` → record deployment id; confirm alias = latest main.
2. Home `/`, `/auth/login`, `/account` → 200.
3. Admin (92961260): `/admin/listings` and `/admin/reports` return **real data or real empty/error** — **no mock rows** (all UUIDs), no `ByteString/BOM`.
4. Agent (92961261): create villa-sale / apartment-rent / land-sale → `pending_review`/`pending`.
5. Admin approves 1 → listing `active`/`approved`.
6. Buyer (92961262): approved listing public; 2 pending hidden; open / favorite / book / offer / report all persist.
7. Admin `/admin/reports` shows the real buyer report.
8. Agent My Listings: 1 approved / 2 pending.
9. Security: buyer → `/api/admin/listings` = **403**.
10. **Cleanup:** delete every test row created (offers, appointments, favorites, reports, listings); confirm 0 remaining — leave production clean.

## 10. Rules for handling secrets safely
- **Never print, log, commit, or place a secret on a command line.** Read from `.env.local`/host env in memory; pass via stdin or request body.
- Verify a secret's **existence/shape** (e.g. JWT starts with `eyJ`, no BOM), never its value.
- To change a Production/Preview secret: prefer the secure CLI/API path (value via stdin/body, never echoed). If that's not possible, **give exact UI steps and have the user paste it**, then verify the result without seeing it.
- Secrets that must stay protected: `SUPABASE_SERVICE_ROLE_KEY`, Vercel tokens, Supabase DB password, GitHub PAT, payment/SMS-OTP/AI provider keys.
- Service-role/admin operations are server-side only; never expose service-role via `NEXT_PUBLIC_`.

---

### Optional tooling to add later (not blocking)
- **Supabase CLI** (`db diff`/`db pull`/migrations) — for schema-change PRs.
- **Firefox** — cross-browser parity (Chrome + Edge already cover most).
- **Android Studio emulator** — native mobile testing (real phone + screen recording works today).
