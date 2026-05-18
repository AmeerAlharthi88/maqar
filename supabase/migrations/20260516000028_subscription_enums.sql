-- =============================================================================
-- Migration 028 — Subscription & Payment Enums
-- Maqar Phase G · Subscriptions + Payments
-- Run AFTER 027_rls_phase_f.
-- =============================================================================
-- All wrapped in DO blocks for idempotent re-runs.
-- =============================================================================

-- ── plan_id ───────────────────────────────────────────────────────────────────
-- Mirrors: src/types/subscription.ts → PlanId
DO $$ BEGIN
  CREATE TYPE public.plan_id AS ENUM (
    'free',
    'agent_pro',
    'agency'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── subscription_status ────────────────────────────────────────────────────────
-- 'free' is not a status — it is expressed as plan_id='free' with status='active'.
-- Mirrors: src/lib/payments/types.ts → SubscriptionStatus (subset)
DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM (
    'trial',
    'active',
    'past_due',
    'cancelled',
    'expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── billing_cycle ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.billing_cycle AS ENUM (
    'monthly',
    'yearly'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── payment_status ─────────────────────────────────────────────────────────────
-- Used by billing_records and subscription_addons.
DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── addon_type ─────────────────────────────────────────────────────────────────
-- Mirrors: src/lib/payments/types.ts → AddOnType
DO $$ BEGIN
  CREATE TYPE public.addon_type AS ENUM (
    'featured_listing',
    'lead_boost',
    'homepage_placement',
    'area_page_placement'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- ROLLBACK (only if no tables reference these types)
-- =============================================================================
-- DROP TYPE IF EXISTS public.addon_type;
-- DROP TYPE IF EXISTS public.payment_status;
-- DROP TYPE IF EXISTS public.billing_cycle;
-- DROP TYPE IF EXISTS public.subscription_status;
-- DROP TYPE IF EXISTS public.plan_id;
-- =============================================================================
