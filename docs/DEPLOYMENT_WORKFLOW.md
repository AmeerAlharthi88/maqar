# Deployment Workflow — Maqar

**Production URL:** https://maqar-sigma.vercel.app  
**GitHub Repo:** AmeerAlharthi88/maqar  
**Vercel Project:** maqar  
**Production Branch:** main  

---

## Standard Workflow (GitHub → Vercel Git Integration)

```
branch → PR → Preview Deployment → Review → Merge to main → Production Deployment
```

### Step-by-step

1. **Create a branch** from `main`:
   ```bash
   git checkout -b fix/my-fix
   ```

2. **Make changes, commit**:
   ```bash
   git add <files>
   git commit -m "fix: description"
   ```

3. **Push to GitHub**:
   ```bash
   git push -u origin fix/my-fix
   ```
   → Vercel automatically creates a **Preview Deployment** within ~2 minutes.

4. **Open a Pull Request** on GitHub:
   - https://github.com/AmeerAlharthi88/maqar/pulls → New PR
   - Vercel posts a deployment comment on the PR with the preview URL.

5. **Test the Preview URL**:
   - URL format: `https://maqar-git-<branch>-ameeralharthi2-7381s-projects.vercel.app`
   - Run smoke tests (see below).

6. **Merge to main** (after preview passes):
   - GitHub Merge button, or `gh pr merge <number> --squash`
   - Vercel automatically creates a **Production Deployment** from `main`.

7. **Verify Production Deployment**:
   ```bash
   npx vercel ls --prod | head -5
   ```
   - Confirm the newest deployment shows `● Ready` and `Environment: Production`.
   - Confirm `maqar-sigma.vercel.app` loads the latest code.

---

## Verifying Deployments

### Check that the latest main is live

```bash
# Which deployment is currently aliased to production?
npx vercel inspect maqar-sigma.vercel.app

# Recent production deployments
npx vercel ls --prod | head -5
```

The `id` shown by `inspect` must match the `Age: <recent>` row in `ls --prod`.  
**"merged = live" is only true once the production deployment shows `● Ready`.**

### Check a PR's preview deployment

In the GitHub PR timeline, look for the Vercel bot comment:
> ✅ Preview ready at https://maqar-git-fix-...vercel.app

Or manually:
```bash
npx vercel ls | head -10   # includes Preview rows
```

---

## Post-Deploy Smoke Tests

Run after every production deployment before marking it done:

| # | Test | Expected |
|---|------|----------|
| 1 | `https://maqar-sigma.vercel.app/` loads | Home page renders, no blank screen |
| 2 | AR/EN toggle | Language switches, layout stays intact |
| 3 | OTP login (92961260) | OTP input appears, login completes |
| 4 | Admin `/account` shows مشرف | Role label correct for admin |
| 5 | `/search` loads listings | At least 1 listing card visible |
| 6 | Click any listing → listing detail page | Price, title, gallery visible |
| 7 | Gallery heart icon tappable | Favorite toggled, no intercept by EN button |
| 8 | `/account/favorites` shows saved item | Count > 0 after adding |
| 9 | Admin `/admin/reports` accessible | Not blocked, shows reports page |
| 10 | Report listing button → modal | Modal opens (login required if not authed) |

---

## When Manual `vercel --prod` is Allowed

Manual CLI deployment is the **fallback only** — not the standard flow.

| Situation | Action |
|-----------|--------|
| Git-triggered deploy failed and cause confirmed (infra issue) | `vercel --prod` after fix |
| Emergency hotfix where PR flow would take too long | `vercel --prod`, then retroactively open PR |
| First-time project setup before Git integration | `vercel --prod` acceptable |
| Normal development | **Not allowed** — always use PR → merge |

After any manual `vercel --prod`, you **must**:
1. Confirm the commit on `main` matches what was deployed.
2. Open a PR retroactively if code was deployed from a feature branch.
3. Merge that PR so `main` stays the source of truth.

> ⚠️ **Never say "merged = live" until `vercel inspect maqar-sigma.vercel.app` confirms the deployment ID matches the latest `main` commit.**

---

## If Vercel Auto-Deploy Fails After Merge to main

1. Check Vercel dashboard → project → Deployments for an `Error` status.
2. Click the failed deployment → View build logs.
3. Common causes:
   - Missing environment variable in Production (check Vercel → Settings → Environment Variables).
   - TypeScript error introduced in the PR (run `npx tsc --noEmit` locally first).
   - Next.js build error (run `npm run build` locally first).
4. Fix the issue, push a new commit to `main` (or open a fixup PR).
5. Vercel will auto-deploy again on the new push.
6. If the auto-deploy itself is broken (Vercel infra issue), fall back to `vercel --prod` and report the Vercel incident.

---

## Environment Variables

### Production (required)

| Variable | Purpose | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | ✅ Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | ✅ Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin queries | ✅ Set |
| `NEXT_PUBLIC_APP_URL` | Canonical URL for OG/SEO | ✅ Set |
| `NEXT_PUBLIC_APP_ENV` | Environment identifier | ✅ Set |
| `NEXT_PUBLIC_PAYMENT_MODE` | Payment mode flag | ✅ Set |
| `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK` | Allow mock data fallback | ✅ Set (`true` — beta only) |
| `AI_*` variables | AI service config | ✅ Set |
| `PAYMENT_*` variables | Payment service config | ✅ Set |

> **Note:** `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK=true` is acceptable for private beta.  
> Set to `false` before public launch to prevent mock data leaking to users.

### Preview (required)

| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set |
| `NEXT_PUBLIC_APP_URL` | ✅ Set |
| `NEXT_PUBLIC_APP_ENV` | ✅ Set (`staging`) |
| `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK` | ✅ Set (`true`) |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Not set — server API routes will fail on preview |

> **Action needed:** Add `SUPABASE_SERVICE_ROLE_KEY` to the Preview environment if you want `/api/*` routes to function on preview deployments.

### Security notes

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is intentionally public (embedded in client bundle, protected by Supabase RLS). ✅
- No passwords, private keys, or sensitive credentials should ever use `NEXT_PUBLIC_` prefix.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (no `NEXT_PUBLIC_` prefix). ✅

---

## Git Integration Settings (verified 2026-05-29)

| Setting | Value | Status |
|---------|-------|--------|
| Connected repository | AmeerAlharthi88/maqar | ✅ |
| Production branch | main | ✅ |
| Pull Request Comments | Enabled | ✅ |
| `deployment_status` events | Enabled | ✅ |
| `repository_dispatch` events | Enabled | ✅ |
| Preview deployments on branch push | Auto-triggered | ✅ |
| Production deployment on push to main | Auto-triggered | ✅ (first test pending) |

---

## Known Issues

### `vercel build` CLI validation fails locally (does not affect server builds)

Running `vercel build --yes` locally exits with:
```
Error: Unable to find lambda for route: /areas/al-hail
```

**This is a local CLI validation bug, not a server-side issue.** All Vercel server-side builds (triggered by `vercel --prod` CLI or Git integration) succeed in ~1 minute. Do not use `vercel build` to validate builds locally — use `npm run build` instead.

### First Git-triggered preview deployment failed (2026-05-29)

The first preview deployment after connecting GitHub had `Error` status (0ms). This may be a timing issue from the integration being brand-new. Monitor subsequent pushes to confirm it resolves.

---

## Claude Code Rules (effective 2026-05-29)

Claude must follow this workflow for every code change:

1. Create branch → commit → push
2. Open PR (via GitHub UI or `gh pr create`)
3. Wait for Vercel Preview Deployment (posted as PR comment by Vercel bot)
4. Test preview URL with smoke tests
5. Merge only after preview passes
6. Confirm production deployment: `npx vercel inspect maqar-sigma.vercel.app`
7. Verify deployment ID matches latest `main` commit
8. Only then report "fix is live on production"

Claude must always report:
- PR link
- Preview deployment URL
- Production deployment ID after merge
- Whether maqar-sigma.vercel.app aliases the latest production deployment
- Any deployment failure reason

Claude must not say "merged = live" until production deployment is confirmed as `● Ready` and aliased to `maqar-sigma.vercel.app`.

---

## Test Users (Beta Only)

| Phone | Role | Use |
|-------|------|-----|
| 92961260 | Admin | Admin access, favorites, listings |
| 92961261 | Agent | Agent dashboard |
| 92961262 | Buyer/User | Buyer flow, favorites |
| 92961263 | Agency Admin | Agency dashboard |
| 92961264 | Super Admin | Full admin |

OTP for all test users: `123456`

**Do not use real customer data. Do not use real phone numbers outside this list.**
