-- =============================================================================
-- Migration 003 — Profiles Table + Triggers
-- Maqar Phase A · Steps A4, A5 (partial), A7
-- Run AFTER 002_enums.
-- =============================================================================
-- Creates:
--   · public.update_updated_at()         shared trigger function (reusable)
--   · public.profiles                    user profile table
--   · public.handle_new_user()           auto-insert profile on auth.users INSERT
--   · public.handle_new_profile()        auto-insert free subscription on profile INSERT
--   · Trigger: on_auth_user_created      fires handle_new_user
--   · Trigger: profiles_updated_at       fires update_updated_at
-- =============================================================================

-- ── Shared updated_at trigger function ───────────────────────────────────────
-- Reused by all tables that have an updated_at column.
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── profiles table ────────────────────────────────────────────────────────────
-- Primary user record, 1:1 with auth.users.
-- Mirrors: src/types/profile.ts → UserProfile
--          src/store/auth.store.ts → AuthUser
--          src/lib/supabase/profile.ts (TODO comments now implemented)
CREATE TABLE IF NOT EXISTS public.profiles (
  -- Identity (FK to Supabase Auth — cascades on user deletion)
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contact
  phone                 TEXT UNIQUE,
  name_ar               TEXT NOT NULL DEFAULT 'مستخدم جديد',
  avatar_url            TEXT,

  -- Role & status
  -- Mirrors AppRole in src/config/roles.ts
  role                  public.app_role NOT NULL DEFAULT 'user',
  account_status        public.user_account_status NOT NULL DEFAULT 'active',

  -- Verification (KYC)
  is_verified           BOOLEAN NOT NULL DEFAULT false,
  verification_status   public.verification_status NOT NULL DEFAULT 'not_started',

  -- Onboarding
  onboarding_completed  BOOLEAN NOT NULL DEFAULT false,
  preferred_locale      TEXT NOT NULL DEFAULT 'ar'
                        CHECK (preferred_locale IN ('ar', 'en')),

  -- Notification preferences
  -- Stored as JSONB matching NotificationPreferences in src/types/profile.ts
  -- camelCase keys to match TypeScript interface directly.
  notification_prefs    JSONB NOT NULL DEFAULT '{
    "newListingsInSavedSearch": true,
    "priceDropAlerts": true,
    "appointmentReminders": true,
    "offerUpdates": true,
    "marketDigest": false,
    "smsEnabled": true,
    "pushEnabled": true
  }'::jsonb,

  -- Agent-specific fields (null for regular users)
  license_number        TEXT,
  specialization_ar     TEXT[],
  service_areas_ar      TEXT[],
  whatsapp              TEXT,

  -- Agency membership (FK added in 004_agencies.sql after agencies table exists)
  -- Intentionally left as untyped UUID here; FK constraint added via ALTER TABLE.
  agency_id             UUID,

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── handle_new_user — auto-create profile on signup ──────────────────────────
-- Fires after every INSERT into auth.users (phone OTP signup, magic link, etc.)
-- SECURITY DEFINER: runs as the function owner (postgres), not the calling role,
-- so it can write to public.profiles even when auth system inserts the user.
-- SET search_path = public: prevents search-path injection attacks.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    phone,
    name_ar,
    role
  )
  VALUES (
    NEW.id,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'name_ar', 'مستخدم جديد'),
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::public.app_role,
      'user'::public.app_role
    )
  )
  ON CONFLICT (id) DO NOTHING;   -- idempotent: safe to retry
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
-- Note: Supabase requires this to be on auth.users, not public.profiles.
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── handle_new_profile — auto-create free subscription on profile insert ─────
-- Fires after every INSERT into public.profiles.
-- Creates a 'free' subscription row so subscription queries always return a row
-- (avoids null-handling in the app for new users).
-- Phase G will add the subscriptions table; this trigger is a STUB that will
-- activate automatically once the subscriptions table is created in Phase G.
-- For now, wrap in a DO block that silently skips if subscriptions doesn't exist.
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Only insert if the subscriptions table exists (Phase G+)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'subscriptions'
  ) THEN
    INSERT INTO public.subscriptions (user_id, plan_id, status)
    VALUES (NEW.id, 'free', 'free')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- ── Enable RLS ────────────────────────────────────────────────────────────────
-- RLS policies are in 005_rls_phase_a.sql — always enable RLS before policies.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ROLLBACK (run in this order to undo)
-- =============================================================================
-- DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
-- DROP FUNCTION IF EXISTS public.handle_new_profile();
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
-- DROP TABLE IF EXISTS public.profiles;
-- DROP FUNCTION IF EXISTS public.update_updated_at();
-- =============================================================================
