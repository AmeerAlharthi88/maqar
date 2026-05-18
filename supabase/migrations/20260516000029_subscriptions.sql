-- =============================================================================
-- Migration 029 — Subscriptions, Billing Records, Subscription Add-Ons
-- Maqar Phase G · Subscriptions + Payments
-- Run AFTER 028_subscription_enums.
-- =============================================================================
-- Creates:
--   · public.subscriptions           one row per user/agency subscription
--   · public.billing_records         one row per payment attempt / invoice
--   · public.subscription_addons     one row per purchased add-on
--   · Indexes for all three tables
--   · Fixes handle_new_profile() to use status='active' (was 'free', which is
--     not a valid subscription_status enum value)
-- =============================================================================

-- ── subscriptions ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Owner: exactly one of user_id or agency_id must be non-null.
  -- user_id has a UNIQUE constraint so ON CONFLICT (user_id) works in triggers.
  user_id                  UUID         REFERENCES public.profiles(id)  ON DELETE CASCADE,
  agency_id                UUID         REFERENCES public.agencies(id)   ON DELETE CASCADE,

  plan_id                  public.plan_id             NOT NULL DEFAULT 'free',
  status                   public.subscription_status NOT NULL DEFAULT 'active',
  billing_cycle            public.billing_cycle,
  current_period_start     TIMESTAMPTZ,
  current_period_end       TIMESTAMPTZ,
  cancel_at_period_end     BOOLEAN      NOT NULL DEFAULT false,

  -- Payment provider fields (populated by webhook only — never by client)
  provider                 TEXT         NOT NULL DEFAULT 'mock',
  provider_customer_id     TEXT,
  provider_subscription_id TEXT,
  metadata                 JSONB        NOT NULL DEFAULT '{}'::jsonb,

  created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),

  -- Integrity: at least one owner must be set
  CONSTRAINT subscriptions_owner_check CHECK (
    user_id IS NOT NULL OR agency_id IS NOT NULL
  ),

  -- One subscription per user (enables ON CONFLICT (user_id) in trigger)
  UNIQUE (user_id)
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ── billing_records ────────────────────────────────────────────────────────────
-- SECURITY: payment_status = 'paid' must only be set by the webhook handler
-- using the service role key. Clients and the anon key cannot set this.

CREATE TABLE IF NOT EXISTS public.billing_records (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id     UUID            REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  user_id             UUID            REFERENCES public.profiles(id)      ON DELETE SET NULL,
  agency_id           UUID            REFERENCES public.agencies(id)      ON DELETE SET NULL,
  amount_omr          NUMERIC(12, 3)  NOT NULL,
  currency            TEXT            NOT NULL DEFAULT 'OMR',
  payment_status      public.payment_status NOT NULL DEFAULT 'pending',
  provider            TEXT            NOT NULL DEFAULT 'mock',
  provider_payment_id TEXT,
  description         TEXT,
  invoice_url         TEXT,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;

-- ── subscription_addons ────────────────────────────────────────────────────────
-- Tracks purchased add-ons (featured listing, lead boost, etc.).
-- status='pending' is set when a checkout session is created.
-- status='paid' is set ONLY by the webhook handler via service role.
-- A pending add-on must never be treated as active by the application.

CREATE TABLE IF NOT EXISTS public.subscription_addons (
  id                  UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id     UUID           REFERENCES public.subscriptions(id)  ON DELETE SET NULL,
  user_id             UUID           REFERENCES public.profiles(id)        ON DELETE SET NULL,
  agency_id           UUID           REFERENCES public.agencies(id)        ON DELETE SET NULL,
  addon_type          public.addon_type NOT NULL,
  listing_id          UUID           REFERENCES public.listings(id)        ON DELETE SET NULL,
  quantity            INTEGER        NOT NULL DEFAULT 1,
  amount_omr          NUMERIC(12, 3) NOT NULL,
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  status              public.payment_status NOT NULL DEFAULT 'pending',
  provider_payment_id TEXT,
  metadata            JSONB          NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE TRIGGER subscription_addons_updated_at
  BEFORE UPDATE ON public.subscription_addons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.subscription_addons ENABLE ROW LEVEL SECURITY;

-- ── Indexes — subscriptions ────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON public.subscriptions(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_agency_id
  ON public.subscriptions(agency_id)
  WHERE agency_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_status
  ON public.subscriptions(plan_id, status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at
  ON public.subscriptions(created_at DESC);

-- ── Indexes — billing_records ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_billing_records_user_id
  ON public.billing_records(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_billing_records_subscription_id
  ON public.billing_records(subscription_id)
  WHERE subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_billing_records_payment_status
  ON public.billing_records(payment_status);

CREATE INDEX IF NOT EXISTS idx_billing_records_created_at
  ON public.billing_records(created_at DESC);

-- ── Indexes — subscription_addons ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_subscription_addons_user_id
  ON public.subscription_addons(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscription_addons_listing_id
  ON public.subscription_addons(listing_id)
  WHERE listing_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscription_addons_status
  ON public.subscription_addons(status);

CREATE INDEX IF NOT EXISTS idx_subscription_addons_created_at
  ON public.subscription_addons(created_at DESC);

-- ── Fix handle_new_profile() ───────────────────────────────────────────────────
-- The original stub in migration 003 used status = 'free', which is NOT a valid
-- public.subscription_status value (the enum uses 'active' for all active plans).
-- This replaces the function body with the corrected version.
-- Now that the subscriptions table exists, the IF EXISTS check is also simplified.

CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.subscriptions (
    user_id,
    plan_id,
    status,
    current_period_start
  )
  VALUES (
    NEW.id,
    'free',
    'active',
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TRIGGER IF EXISTS subscription_addons_updated_at ON public.subscription_addons;
-- DROP TABLE IF EXISTS public.subscription_addons CASCADE;
-- DROP TABLE IF EXISTS public.billing_records CASCADE;
-- DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
-- DROP TABLE IF EXISTS public.subscriptions CASCADE;
-- (Restore handle_new_profile() from migration 003 if needed)
-- =============================================================================
