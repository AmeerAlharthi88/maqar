# Supabase Setup Guide — مقر

This document covers everything needed to wire up a real Supabase project for production.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose the **Middle East (Bahrain)** region for lowest latency from Oman.
3. Save the project's **URL**, **anon key**, and **service role key**.

---

## 2. Environment Variables

Add to `.env.local` (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` must NEVER appear in any `NEXT_PUBLIC_` variable or be sent to the client.

---

## 3. Auth Setup

### Phone OTP (recommended for Oman)

1. In Supabase Dashboard → **Authentication → Providers → Phone**
2. Enable Phone provider
3. Configure SMS provider (Twilio recommended):
   - Account SID
   - Auth Token
   - From number (an Oman-compatible international number)
4. Set OTP expiry to 10 minutes
5. Set rate limit: max 3 OTP requests per phone per hour

### Magic Link (fallback)

Enable Email provider as a secondary auth method for users without phone access.

---

## 4. Database Tables

Create the following tables (run as SQL migrations):

### `profiles`
```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone       TEXT UNIQUE,
  name_ar     TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'agent', 'agency_owner', 'admin')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### `listings`
```sql
CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES profiles(id),
  title_ar        TEXT NOT NULL,
  description_ar  TEXT,
  purpose         TEXT NOT NULL CHECK (purpose IN ('sale', 'rent')),
  property_type   TEXT NOT NULL,
  price           NUMERIC(12,3) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending_review'
                    CHECK (status IN ('active', 'pending_review', 'draft', 'rejected', 'expired')),
  location        JSONB,
  specs           JSONB,
  images          TEXT[],
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ
);
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
```

### `subscriptions`
```sql
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id),
  plan_id         TEXT NOT NULL CHECK (plan_id IN ('free', 'agent_pro', 'agency')),
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end   TIMESTAMPTZ,
  payment_provider     TEXT,
  payment_ref          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
```

---

## 5. Row Level Security (RLS) Policies

### profiles
```sql
-- Anyone can read public profile info
CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### listings
```sql
-- Public can view active listings
CREATE POLICY "Active listings are public" ON listings
  FOR SELECT USING (status = 'active');

-- Owners can view all their own listings
CREATE POLICY "Owners can view own listings" ON listings
  FOR SELECT USING (auth.uid() = owner_id);

-- Owners can insert listings
CREATE POLICY "Owners can insert listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own listings
CREATE POLICY "Owners can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = owner_id);

-- Admins can do anything (use service role key in admin routes)
```

### subscriptions
```sql
-- Users can view own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 6. Storage Buckets

Create the following Storage buckets:

| Bucket | Access | Purpose |
|--------|--------|---------|
| `listing-images` | Public | Property listing photos |
| `documents` | Private | KYC and ownership documents |
| `avatars` | Public | Agent/agency profile photos |

### Storage RLS for `documents` (private):
```sql
-- Only the owner and admins can access documents
CREATE POLICY "Owners can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 7. Edge Functions

For webhook handling (payment confirmations, KYC callbacks):

```bash
supabase functions new handle-payment-webhook
supabase functions deploy handle-payment-webhook
```

---

## 8. Verify Checklist

- [ ] Auth: Phone OTP working (test with Omani number +968...)
- [ ] RLS enabled on all tables (check via Supabase Dashboard → Table Editor → RLS)
- [ ] Service role key only used in server routes (`/app/api/`, `server.ts` files)
- [ ] anon key is safe to expose (it enforces RLS)
- [ ] Storage buckets created with correct policies
- [ ] Webhook URL configured in payment provider settings
