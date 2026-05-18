-- =============================================================================
-- Migration 034 — Phase I Enums: Admin Queues + Market Data
-- Maqar Phase I · Admin infrastructure
-- Run AFTER 033_rls_phase_h.
-- =============================================================================
-- All enums use DO/EXCEPTION idempotency guards.
-- DB enum values use underscores (PostgreSQL convention).
-- TypeScript service layer maps between DB and TS values.
-- =============================================================================

-- ── risk_level ────────────────────────────────────────────────────────────────
-- Shared across admin_reports, aml_flags, audit_logs, duplicate_alerts.
DO $$ BEGIN
  CREATE TYPE public.risk_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── report_reason ─────────────────────────────────────────────────────────────
-- Why a user filed a report.
DO $$ BEGIN
  CREATE TYPE public.report_reason AS ENUM (
    'incorrect_information',
    'unrealistic_price',
    'fake_images',
    'duplicate_listing',
    'sold_or_rented',
    'suspicious_listing',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── report_status ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.report_status AS ENUM (
    'new',
    'reviewing',
    'resolved',
    'dismissed',
    'escalated'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── report_target_type ────────────────────────────────────────────────────────
-- What entity was reported (distinct from review_target_type from Phase E).
DO $$ BEGIN
  CREATE TYPE public.report_target_type AS ENUM (
    'listing',
    'agent',
    'agency',
    'review'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── aml_status ────────────────────────────────────────────────────────────────
-- Anti-Money-Laundering flag lifecycle.
DO $$ BEGIN
  CREATE TYPE public.aml_status AS ENUM (
    'open',
    'cleared',
    'clarification_requested',
    'escalated',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── duplicate_status ──────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.duplicate_status AS ENUM (
    'open',
    'duplicate',
    'not_duplicate',
    'merged',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── audit_category ────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.audit_category AS ENUM (
    'admin_action',
    'listing_action',
    'verification_action',
    'user_action',
    'payment_action',
    'ai_action',
    'security_action',
    'system_action'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- ROLLBACK (only if no Phase I tables exist yet)
-- =============================================================================
-- DROP TYPE IF EXISTS public.audit_category;
-- DROP TYPE IF EXISTS public.duplicate_status;
-- DROP TYPE IF EXISTS public.aml_status;
-- DROP TYPE IF EXISTS public.report_target_type;
-- DROP TYPE IF EXISTS public.report_status;
-- DROP TYPE IF EXISTS public.report_reason;
-- DROP TYPE IF EXISTS public.risk_level;
-- =============================================================================
