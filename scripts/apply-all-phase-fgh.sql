-- ============================================================
-- MAQAR — Apply Phase F + G + H migrations in one shot
-- Paste this entire file into:
--   Supabase Dashboard → SQL Editor → New query → Run
-- All statements use IF NOT EXISTS / DO/EXCEPTION guards
-- so re-running is safe (idempotent).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- PHASE F — Analytics
-- ────────────────────────────────────────────────────────────

-- Migration 025: analytics_event_type enum
DO $$ BEGIN
  CREATE TYPE public.analytics_event_type AS ENUM (
    'view',
    'whatsapp_click',
    'call_click',
    'save',
    'share',
    'appointment_request',
    'offer_submit'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Migration 026: listing_analytics table
CREATE TABLE IF NOT EXISTS public.listing_analytics (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID         REFERENCES public.listings(id) ON DELETE CASCADE,
  agent_id    UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  agency_id   UUID         REFERENCES public.agencies(id) ON DELETE SET NULL,
  user_id     UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type  public.analytics_event_type NOT NULL,
  source      TEXT,
  session_id  TEXT,
  metadata    JSONB        NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_analytics ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_listing_analytics_listing_id  ON public.listing_analytics(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_analytics_agent_id    ON public.listing_analytics(agent_id)   WHERE agent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listing_analytics_event_type  ON public.listing_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_listing_analytics_created_at  ON public.listing_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_analytics_agent_event ON public.listing_analytics(agent_id, event_type, created_at DESC) WHERE agent_id IS NOT NULL;

-- Migration 027: RLS Phase F
DO $$ BEGIN
  CREATE POLICY "analytics_agent_read_own"
    ON public.listing_analytics FOR SELECT
    USING (agent_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "analytics_admin_read_all"
    ON public.listing_analytics FOR SELECT
    USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ────────────────────────────────────────────────────────────
-- PHASE G — Subscriptions + Payments
-- ────────────────────────────────────────────────────────────

-- Migration 028: subscription enums
DO $$ BEGIN
  CREATE TYPE public.plan_id AS ENUM ('free','agent_pro','agency');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('trial','active','past_due','cancelled','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.billing_cycle AS ENUM ('monthly','yearly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.addon_type AS ENUM ('featured_listing','lead_boost','homepage_placement','area_page_placement');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Migration 029: subscriptions, billing_records, subscription_addons
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID           UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id            UUID           REFERENCES public.agencies(id)        ON DELETE CASCADE,
  plan_id              public.plan_id NOT NULL DEFAULT 'free',
  status               public.subscription_status NOT NULL DEFAULT 'active',
  billing_cycle        public.billing_cycle,
  current_period_start TIMESTAMPTZ    NOT NULL DEFAULT now(),
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN        NOT NULL DEFAULT false,
  trial_ends_at        TIMESTAMPTZ,
  metadata             JSONB          NOT NULL DEFAULT '{}'::jsonb,
  created_at           TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ    NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_owner_check CHECK (
    user_id IS NOT NULL OR agency_id IS NOT NULL
  )
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id    ON public.subscriptions(user_id)    WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_agency_id  ON public.subscriptions(agency_id)  WHERE agency_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id    ON public.subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status     ON public.subscriptions(status);

CREATE TABLE IF NOT EXISTS public.billing_records (
  id               UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID                 REFERENCES public.profiles(id) ON DELETE SET NULL,
  agency_id        UUID                 REFERENCES public.agencies(id) ON DELETE SET NULL,
  subscription_id  UUID                 REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount           NUMERIC(10,3)        NOT NULL,
  currency         TEXT                 NOT NULL DEFAULT 'OMR',
  payment_status   public.payment_status NOT NULL DEFAULT 'pending',
  provider         TEXT,
  provider_ref     TEXT,
  description      TEXT,
  metadata         JSONB                NOT NULL DEFAULT '{}'::jsonb,
  paid_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ          NOT NULL DEFAULT now()
);

ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_billing_records_user_id        ON public.billing_records(user_id)       WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_billing_records_subscription_id ON public.billing_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_payment_status  ON public.billing_records(payment_status);
CREATE INDEX IF NOT EXISTS idx_billing_records_created_at      ON public.billing_records(created_at DESC);

CREATE TABLE IF NOT EXISTS public.subscription_addons (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID            REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id       UUID            REFERENCES public.agencies(id) ON DELETE CASCADE,
  addon_type      public.addon_type NOT NULL,
  listing_id      UUID            REFERENCES public.listings(id) ON DELETE SET NULL,
  quantity        INTEGER         NOT NULL DEFAULT 1 CHECK (quantity > 0),
  status          public.payment_status NOT NULL DEFAULT 'pending',
  expires_at      TIMESTAMPTZ,
  billing_record_id UUID          REFERENCES public.billing_records(id) ON DELETE SET NULL,
  metadata        JSONB           NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_addons ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_subscription_addons_user_id    ON public.subscription_addons(user_id)   WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscription_addons_agency_id  ON public.subscription_addons(agency_id) WHERE agency_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscription_addons_type       ON public.subscription_addons(addon_type);
CREATE INDEX IF NOT EXISTS idx_subscription_addons_listing_id ON public.subscription_addons(listing_id) WHERE listing_id IS NOT NULL;

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS subscription_addons_updated_at ON public.subscription_addons;
CREATE TRIGGER subscription_addons_updated_at
  BEFORE UPDATE ON public.subscription_addons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Fix handle_new_profile() trigger to use valid enum value
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start)
  VALUES (NEW.id, 'free', 'active', now())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Migration 030: RLS Phase G
DO $$ BEGIN
  CREATE POLICY "subscriptions_read_own"
    ON public.subscriptions FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "subscriptions_admin_read"
    ON public.subscriptions FOR SELECT USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "subscriptions_admin_update"
    ON public.subscriptions FOR UPDATE USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "billing_records_read_own"
    ON public.billing_records FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "billing_records_admin_read"
    ON public.billing_records FOR SELECT USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "subscription_addons_read_own"
    ON public.subscription_addons FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "subscription_addons_admin_read"
    ON public.subscription_addons FOR SELECT USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "subscription_addons_insert_pending"
    ON public.subscription_addons FOR INSERT
    WITH CHECK (user_id = auth.uid() AND status = 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ────────────────────────────────────────────────────────────
-- PHASE H — AI Usage Tracking
-- ────────────────────────────────────────────────────────────

-- Migration 031: ai_feature enum
DO $$ BEGIN
  CREATE TYPE public.ai_feature AS ENUM (
    'generate_description',
    'valuation',
    'assistant',
    'roi_explanation',
    'market_summary',
    'duplicate_risk',
    'listing_quality',
    'smart_reply'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Migration 032: ai_usage_logs table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id               UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID              REFERENCES public.profiles(id) ON DELETE SET NULL,
  feature          public.ai_feature NOT NULL,
  plan_id          public.plan_id,
  input_token_est  INTEGER,
  output_token_est INTEGER,
  success          BOOLEAN           NOT NULL DEFAULT true,
  is_mock_fallback BOOLEAN           NOT NULL DEFAULT false,
  listing_id       UUID              REFERENCES public.listings(id) ON DELETE SET NULL,
  metadata         JSONB             NOT NULL DEFAULT '{}'::jsonb,
  error_message    TEXT,
  created_at       TIMESTAMPTZ       NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id
  ON public.ai_usage_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_feature
  ON public.ai_usage_logs(feature);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_success
  ON public.ai_usage_logs(success);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at
  ON public.ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_feature_created
  ON public.ai_usage_logs(user_id, feature, created_at DESC)
  WHERE user_id IS NOT NULL;

-- Migration 033: RLS Phase H
DO $$ BEGIN
  CREATE POLICY "ai_usage_logs_read_own"
    ON public.ai_usage_logs FOR SELECT
    USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "ai_usage_logs_admin_read"
    ON public.ai_usage_logs FOR SELECT
    USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- Done. All Phase F, G, H objects created.
-- ============================================================
