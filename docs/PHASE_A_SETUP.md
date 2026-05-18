# Phase A Setup Guide — Supabase Foundation

**Phase:** A — Foundation  
**Status:** Migration files created — awaiting manual steps below  
**Blocks:** Phase B (listings), all database-dependent features

---

## Overview

Phase A wires up the Supabase project, creates the database schema for users and agencies, enables Row Level Security, and verifies that phone OTP sign-up auto-creates a profile row.

No UI changes are made in Phase A. Mock data remains intact. Auth will work with real Supabase once env vars are set.

---

## Step A1 — Create the Supabase Project

1. Go to **https://supabase.com/dashboard** → New Project
2. Settings:
   - **Name:** `maqar-production` (or `maqar-dev` for a dev project)
   - **Region:** `Middle East (Bahrain)` — lowest latency from Oman
   - **Database password:** generate a strong password and save it in a password manager
3. Wait ~2 minutes for provisioning
4. Go to **Project Settings → API** and copy:
   - **Project URL** → `https://xxxxxxxxxxxx.supabase.co`
   - **anon public** key → long JWT starting with `eyJ...`
   - **service_role** key → long JWT starting with `eyJ...` (keep secret)

---

## Step A2 — Run Migration 001 (Extensions)

1. In Supabase Dashboard → **SQL Editor** → New query
2. Paste the entire contents of:
   ```
   supabase/migrations/20260516000001_extensions.sql
   ```
3. Click **Run**
4. Expected output: `Success. No rows returned.`

**Verify:**
```sql
SELECT name, installed_version
FROM pg_available_extensions
WHERE name IN ('postgis', 'pg_trgm', 'uuid-ossp')
AND installed_version IS NOT NULL;
```
Should return 3 rows.

---

## Step A3 — Run Migration 002 (Enums)

1. SQL Editor → New query
2. Paste: `supabase/migrations/20260516000002_enums.sql`
3. Click **Run**

**Verify:**
```sql
SELECT typname, typtype
FROM pg_type
WHERE typname IN ('app_role', 'verification_status', 'user_account_status', 'agency_member_role')
AND typtype = 'e'
ORDER BY typname;
```
Should return 4 rows.

---

## Step A4 — Run Migration 003 (Profiles Table + Triggers)

1. SQL Editor → New query
2. Paste: `supabase/migrations/20260516000003_profiles.sql`
3. Click **Run**

**Verify table exists:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;
```
Should return 17 columns.

**Verify trigger exists:**
```sql
SELECT trigger_name, event_object_table, action_timing
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'profiles_updated_at', 'on_profile_created');
```
Should return 3 triggers.

---

## Step A5 — Run Migration 004 (Agencies + Members + FK)

1. SQL Editor → New query
2. Paste: `supabase/migrations/20260516000004_agencies.sql`
3. Click **Run**

**Verify:**
```sql
SELECT table_name, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND table_name IN ('agencies', 'agency_members');
```
Both should show `rowsecurity = true`.

**Verify FK on profiles:**
```sql
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'profiles' AND constraint_name = 'profiles_agency_id_fk';
```
Should return 1 row with `FOREIGN KEY`.

---

## Step A6 — Run Migration 005 (RLS Policies)

1. SQL Editor → New query
2. Paste: `supabase/migrations/20260516000005_rls_phase_a.sql`
3. Click **Run**

**Verify all 3 tables have RLS enabled:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'agencies', 'agency_members');
```
All 3 should show `rowsecurity = true`.

**Verify policies were created:**
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'agencies', 'agency_members')
ORDER BY tablename, policyname;
```
Should return 11 policies total:
- `profiles`: 3 (select, insert, update)
- `agencies`: 4 (select, insert, update, delete)
- `agency_members`: 4 (select, insert, update, delete)

---

## Step A7 — Configure Phone OTP (Twilio)

### In Supabase Dashboard:

1. **Authentication → Providers → Phone** → toggle **Enable Phone Provider**

2. **SMS Provider:** Select **Twilio**

3. Fill in Twilio credentials:
   | Field | Value |
   |-------|-------|
   | Twilio Account SID | From [Twilio Console](https://console.twilio.com) → Account Info |
   | Twilio Auth Token | From Twilio Console → Account Info |
   | Twilio Message Service SID or From | Your Twilio phone number (format: `+1XXXXXXXXXX`) or Messaging Service SID |

4. **OTP Settings:**
   - OTP Expiry: `600` (10 minutes)
   - OTP Length: `6`

5. Click **Save**

### Twilio setup for Oman (+968 numbers):
- Twilio supports Oman (country code 968) on standard numbers
- For production: purchase a Twilio number or use Twilio Messaging Service
- For testing: use Twilio sandbox or verify your own number in the Twilio trial account

### Test without Twilio (development only):
Supabase allows you to set a **test phone number** in Authentication settings that always accepts a fixed OTP code. Use this during development:
1. Authentication → Settings → **Phone Test Numbers**
2. Add `+96812345678` with OTP `123456`

---

## Step A8 — Set Environment Variables

Fill in `.env.local` with real values. Copy from Supabase Dashboard → Project Settings → API:

```env
# ── Supabase (replace placeholders with real values) ──────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# ── Leave these as placeholders for now (Phase B+ configures them) ────────────
ANTHROPIC_API_KEY=your-anthropic-key-here
PAYMENT_PROVIDER=mock
```

**Security rules:**
- `NEXT_PUBLIC_*` keys are safe to expose — they are protected by RLS
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER have the `NEXT_PUBLIC_` prefix
- Only import `src/lib/supabase/service.ts` from API routes and server actions
- `.env.local` is already in `.gitignore` — confirm with `git check-ignore -v .env.local`

---

## Step A9 — Test: Sign Up → OTP → Profile Auto-Created

### Test 1: OTP sign-up creates a profile row

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Tap the sign-in button → enter a phone number
4. Enter the OTP (use `123456` if you set up the test number in A7)
5. Complete the onboarding screen (enter name)

**Verify in Supabase SQL Editor:**
```sql
-- Should return 1 row with your phone number and name
SELECT id, phone, name_ar, role, account_status, created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;
```

### Test 2: RLS — anon user can read profiles, not write

Using the Supabase **Table Editor → profiles** → check that data is visible.

Using SQL Editor with anon role simulation:
```sql
-- This should return rows (public read policy)
SELECT id, name_ar, role FROM public.profiles LIMIT 3;

-- This should FAIL with RLS violation if tried as anon:
-- INSERT INTO public.profiles (id, name_ar) VALUES (gen_random_uuid(), 'test');
```

### Test 3: Updated_at auto-updates

```sql
-- Note the current updated_at
SELECT id, name_ar, updated_at FROM public.profiles LIMIT 1;

-- Update something
UPDATE public.profiles SET name_ar = 'اختبار' WHERE id = '<your-user-id>';

-- Verify updated_at changed
SELECT id, name_ar, updated_at FROM public.profiles WHERE id = '<your-user-id>';
```

### Test 4: Verify triggers are firing

```sql
-- Check the trigger exists on auth.users
SELECT trigger_name, event_object_schema, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
-- Should return 1 row with event_object_schema = 'auth'
```

### Test 5: Auth store still works with mock (regression check)

Sign out, then sign in again. The app should still work even though real Supabase Auth is now in use, because:
- `signInWithPhone()` and `verifyPhoneOtp()` in `src/lib/supabase/auth-actions.ts` were already wired to real Supabase
- Mock data in `src/mock/` is still intact — no mock data was removed
- The auth Zustand store (`src/store/auth.store.ts`) is still used for client-side state

---

## What Was NOT Changed in Phase A

| Item | Status |
|------|--------|
| Mock listings data | ✅ Intact — not touched |
| Mock agents/agencies data | ✅ Intact — not touched |
| UI components | ✅ Intact — no UI changes |
| `src/mock/` files | ✅ Intact — not touched |
| Listings table | ⏳ Phase B |
| Leads/appointments/offers | ⏳ Phase D |
| Subscriptions/payments | ⏳ Phase G |
| AI usage tracking | ⏳ Phase H |

---

## Files Created in Phase A

| File | Purpose |
|------|---------|
| `supabase/migrations/20260516000001_extensions.sql` | PostGIS, pg_trgm, uuid-ossp |
| `supabase/migrations/20260516000002_enums.sql` | app_role, verification_status, user_account_status, agency_member_role |
| `supabase/migrations/20260516000003_profiles.sql` | profiles table, updated_at trigger, handle_new_user trigger, handle_new_profile trigger |
| `supabase/migrations/20260516000004_agencies.sql` | agencies table, agency_members table, profiles.agency_id FK |
| `supabase/migrations/20260516000005_rls_phase_a.sql` | 11 RLS policies across 3 tables |
| `src/lib/supabase/service.ts` | Service role client (server-side only) |
| `docs/PHASE_A_SETUP.md` | This file |

---

## Ready for Phase B?

Before starting Phase B (Listings), confirm all of the following:

- [ ] All 5 migrations ran without errors in Supabase SQL Editor
- [ ] 17 columns visible in `profiles` table
- [ ] 3 triggers present (`on_auth_user_created`, `profiles_updated_at`, `on_profile_created`)
- [ ] 11 RLS policies visible across 3 tables
- [ ] Phone OTP configured (Twilio or test number)
- [ ] `.env.local` has real `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Sign-up flow tested: profile row appears in Supabase after OTP verification
- [ ] `npm run build` still passes (no regressions)

Signal ready for Phase B when all boxes are checked.
