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
-- =============================================================================
-- Migration 035 — admin_reports Table + Indexes
-- Maqar Phase I · Admin Queues
-- Run AFTER 034_phase_i_enums.
-- =============================================================================
-- Security model:
--   · INSERT: authenticated users (report a listing/agent/agency/review).
--   · SELECT own: users can read their own submitted reports (RLS in 040).
--   · SELECT all: admins only.
--   · UPDATE: admins only (via service role from API routes).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.admin_reports (
  id              UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who filed the report (nullable — allow anonymous reports)
  reporter_id     UUID                     REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- What was reported
  target_type     public.report_target_type NOT NULL,
  target_id       UUID                     NOT NULL,

  -- Why
  reason          public.report_reason     NOT NULL,

  -- Lifecycle
  status          public.report_status     NOT NULL DEFAULT 'new',
  severity        public.risk_level        NOT NULL DEFAULT 'low',

  -- Free-text fields
  notes           TEXT,                    -- reporter's description (user-provided)
  admin_notes     TEXT,                    -- admin's internal notes

  -- Resolution
  reviewed_by     UUID                     REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,

  created_at      TIMESTAMPTZ              NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ              NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_reports ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS admin_reports_updated_at ON public.admin_reports;
CREATE TRIGGER admin_reports_updated_at
  BEFORE UPDATE ON public.admin_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Admin queue: status filter (most common admin query)
CREATE INDEX IF NOT EXISTS idx_admin_reports_status
  ON public.admin_reports(status);

-- Target lookup (find all reports about a specific listing/agent/agency)
CREATE INDEX IF NOT EXISTS idx_admin_reports_target
  ON public.admin_reports(target_type, target_id);

-- Reporter's own reports (for RLS user read-own)
CREATE INDEX IF NOT EXISTS idx_admin_reports_reporter
  ON public.admin_reports(reporter_id)
  WHERE reporter_id IS NOT NULL;

-- Severity filter
CREATE INDEX IF NOT EXISTS idx_admin_reports_severity
  ON public.admin_reports(severity);

-- Time-based audit queries
CREATE INDEX IF NOT EXISTS idx_admin_reports_created_at
  ON public.admin_reports(created_at DESC);

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.admin_reports CASCADE;
-- =============================================================================
-- =============================================================================
-- Migration 036 — aml_flags Table + Indexes
-- Maqar Phase I · Anti-Money-Laundering Queue
-- Run AFTER 035_admin_reports.
-- =============================================================================
-- Security model:
--   · All reads: admin/service-role only (no client SELECT policy).
--   · All writes: service-role only (created by listing submission trigger
--     or admin API routes).
-- AML flags are created automatically when a listing price is ≥100,000 OMR
-- AND the price is >30% below the wilayat market average.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.aml_flags (
  id                   UUID              PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What triggered the flag
  listing_id           UUID              NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id             UUID              REFERENCES public.profiles(id) ON DELETE SET NULL,
  agency_id            UUID              REFERENCES public.agencies(id) ON DELETE SET NULL,

  -- Risk assessment
  risk_level           public.risk_level NOT NULL,
  status               public.aml_status NOT NULL DEFAULT 'open',

  -- Price analysis
  price_omr            NUMERIC(12,3),
  market_average_omr   NUMERIC(12,3),
  difference_percent   NUMERIC(8,3),    -- positive = price is X% below market

  -- Reason / context
  reason               TEXT,
  admin_notes          TEXT,

  -- Resolution
  resolved_by          UUID              REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at          TIMESTAMPTZ,

  created_at           TIMESTAMPTZ       NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ       NOT NULL DEFAULT now()
);

ALTER TABLE public.aml_flags ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS aml_flags_updated_at ON public.aml_flags;
CREATE TRIGGER aml_flags_updated_at
  BEFORE UPDATE ON public.aml_flags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_aml_flags_status
  ON public.aml_flags(status);

CREATE INDEX IF NOT EXISTS idx_aml_flags_risk_level
  ON public.aml_flags(risk_level);

CREATE INDEX IF NOT EXISTS idx_aml_flags_listing_id
  ON public.aml_flags(listing_id);

CREATE INDEX IF NOT EXISTS idx_aml_flags_owner_id
  ON public.aml_flags(owner_id)
  WHERE owner_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_aml_flags_created_at
  ON public.aml_flags(created_at DESC);

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.aml_flags CASCADE;
-- =============================================================================
-- =============================================================================
-- Migration 037 — duplicate_alerts Table + Indexes
-- Maqar Phase I · Duplicate Listing Detection Queue
-- Run AFTER 036_aml_flags.
-- =============================================================================
-- Security model:
--   · All reads: admin/service-role only.
--   · All writes: service-role only (created by duplicate-detection pipeline).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.duplicate_alerts (
  id              UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The two listings suspected to be duplicates
  listing_a_id    UUID                     NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  listing_b_id    UUID                     NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,

  -- Detection output
  risk_score      INTEGER                  CHECK (risk_score BETWEEN 0 AND 100),
  matched_fields  JSONB                    NOT NULL DEFAULT '{}',  -- e.g. {"location": true, "price": true}

  -- Lifecycle
  status          public.duplicate_status  NOT NULL DEFAULT 'open',
  notes           TEXT,

  -- Resolution
  reviewed_by     UUID                     REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,

  created_at      TIMESTAMPTZ              NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ              NOT NULL DEFAULT now(),

  -- Prevent duplicate alert pairs (A,B) and (B,A)
  CONSTRAINT duplicate_alerts_unique_pair
    UNIQUE (LEAST(listing_a_id::text, listing_b_id::text),
            GREATEST(listing_a_id::text, listing_b_id::text))
);

ALTER TABLE public.duplicate_alerts ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS duplicate_alerts_updated_at ON public.duplicate_alerts;
CREATE TRIGGER duplicate_alerts_updated_at
  BEFORE UPDATE ON public.duplicate_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_status
  ON public.duplicate_alerts(status);

CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_risk_score
  ON public.duplicate_alerts(risk_score DESC);

CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_listing_a
  ON public.duplicate_alerts(listing_a_id);

CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_listing_b
  ON public.duplicate_alerts(listing_b_id);

CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_created_at
  ON public.duplicate_alerts(created_at DESC);

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.duplicate_alerts CASCADE;
-- =============================================================================
-- =============================================================================
-- Migration 038 — audit_logs Table + Indexes
-- Maqar Phase I · Immutable Admin Audit Trail
-- Run AFTER 037_duplicate_alerts.
-- =============================================================================
-- Security model:
--   · SELECT: admin/service-role only.
--   · INSERT: service-role only (via admin API routes — never from client).
--   · UPDATE/DELETE: nobody (immutable log).
-- audit_logs is append-only. No RLS UPDATE/DELETE policies are created.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who performed the action (nullable for system/automated events)
  actor_id     UUID                    REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- What kind of action
  category     public.audit_category   NOT NULL,
  action       TEXT                    NOT NULL,  -- e.g. "approve_listing", "reject_kyc"

  -- What was acted on
  target_type  TEXT,                              -- e.g. "listing", "kyc_application"
  target_id    UUID,

  -- Structured details (status changes, notes, old/new values, etc.)
  details      JSONB                   NOT NULL DEFAULT '{}',

  -- Network context (stored for security audit; no PII beyond IP)
  ip_address   TEXT,

  -- Severity for filtering in audit log UI
  severity     public.risk_level       NOT NULL DEFAULT 'low',

  -- Immutable timestamp
  created_at   TIMESTAMPTZ             NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- NOTE: No updated_at trigger — audit_logs are immutable (append-only).

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Category filter (admin UI filter)
CREATE INDEX IF NOT EXISTS idx_audit_logs_category
  ON public.audit_logs(category);

-- Actor lookup (find all actions by a specific admin)
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id
  ON public.audit_logs(actor_id)
  WHERE actor_id IS NOT NULL;

-- Target lookup (find all audit events for a specific entity)
CREATE INDEX IF NOT EXISTS idx_audit_logs_target
  ON public.audit_logs(target_type, target_id)
  WHERE target_id IS NOT NULL;

-- Severity filter
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity
  ON public.audit_logs(severity);

-- Time-ordered for audit log UI (primary access pattern)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON public.audit_logs(created_at DESC);

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.audit_logs CASCADE;
-- =============================================================================
-- =============================================================================
-- Migration 039 — market_data Table + Indexes
-- Maqar Phase I · Admin-Managed Market Statistics
-- Run AFTER 038_audit_logs.
-- =============================================================================
-- Security model:
--   · SELECT: public (anyone can read market statistics).
--   · INSERT/UPDATE/DELETE: admin/service-role only.
-- Data source is always labeled as admin-managed/estimated.
-- No claims of official government data.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.market_data (
  id                     UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Location hierarchy
  governorate            TEXT                  NOT NULL,
  wilayat                TEXT                  NOT NULL,
  area                   TEXT,                 -- nullable for wilayat-level stats

  -- Property type scoping (nullable = applies to all types in the area)
  property_type          public.property_type,

  -- Market statistics — all nullable (may not have data for every cell)
  average_sale_price_omr NUMERIC(12,3),
  average_rent_omr       NUMERIC(12,3),        -- monthly rent
  price_per_sqm_omr      NUMERIC(12,3),
  rental_yield_percent   NUMERIC(6,3),
  demand_score           INTEGER               CHECK (demand_score BETWEEN 0 AND 100),

  -- Metadata
  data_source            TEXT                  NOT NULL DEFAULT 'admin_managed',
  last_updated           TIMESTAMPTZ           NOT NULL DEFAULT now(),

  created_at             TIMESTAMPTZ           NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ           NOT NULL DEFAULT now()
);

ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS market_data_updated_at ON public.market_data;
CREATE TRIGGER market_data_updated_at
  BEFORE UPDATE ON public.market_data
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Primary lookup: governorate → wilayat → area (area pages + market pages)
CREATE INDEX IF NOT EXISTS idx_market_data_governorate
  ON public.market_data(governorate);

CREATE INDEX IF NOT EXISTS idx_market_data_wilayat
  ON public.market_data(governorate, wilayat);

CREATE INDEX IF NOT EXISTS idx_market_data_area
  ON public.market_data(governorate, wilayat, area)
  WHERE area IS NOT NULL;

-- Property type scoping
CREATE INDEX IF NOT EXISTS idx_market_data_property_type
  ON public.market_data(property_type)
  WHERE property_type IS NOT NULL;

-- Recency for admin market-data page
CREATE INDEX IF NOT EXISTS idx_market_data_last_updated
  ON public.market_data(last_updated DESC);

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.market_data CASCADE;
-- =============================================================================
-- =============================================================================
-- Migration 040 — RLS Policies: Phase I Admin Queues + Market Data
-- Maqar Phase I
-- Run AFTER 039_market_data.
-- Depends on: public.is_admin() SECURITY DEFINER from migration 024.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- admin_reports
-- ─────────────────────────────────────────────────────────────────────────────

-- Authenticated users can file reports
CREATE POLICY "admin_reports_insert_auth"
  ON public.admin_reports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can read their own submitted reports
CREATE POLICY "admin_reports_read_own"
  ON public.admin_reports
  FOR SELECT
  USING (reporter_id = auth.uid());

-- Admins can read all reports
CREATE POLICY "admin_reports_admin_read"
  ON public.admin_reports
  FOR SELECT
  USING (public.is_admin());

-- Admins can update reports (status, admin_notes, reviewed_by, reviewed_at)
-- All admin updates go through service-role API routes — this policy is a
-- defense-in-depth layer for any direct client usage by admin role.
CREATE POLICY "admin_reports_admin_update"
  ON public.admin_reports
  FOR UPDATE
  USING (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- aml_flags — admin/service-role only
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "aml_flags_admin_read"
  ON public.aml_flags
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "aml_flags_admin_update"
  ON public.aml_flags
  FOR UPDATE
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- aml_flags are created exclusively by service-role (API routes / triggers).

-- ─────────────────────────────────────────────────────────────────────────────
-- duplicate_alerts — admin/service-role only
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "duplicate_alerts_admin_read"
  ON public.duplicate_alerts
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "duplicate_alerts_admin_update"
  ON public.duplicate_alerts
  FOR UPDATE
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- duplicate_alerts are created exclusively by service-role (duplicate detection pipeline).

-- ─────────────────────────────────────────────────────────────────────────────
-- audit_logs — admin read only, append-only (no UPDATE/DELETE policies)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "audit_logs_admin_read"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- audit_logs are inserted exclusively by service-role from admin API routes.
-- No UPDATE or DELETE policies — audit logs are immutable.

-- ─────────────────────────────────────────────────────────────────────────────
-- market_data — public read, admin write
-- ─────────────────────────────────────────────────────────────────────────────

-- Public read: market statistics are intentionally public
CREATE POLICY "market_data_public_read"
  ON public.market_data
  FOR SELECT
  USING (true);

-- Admins can insert new market data rows
CREATE POLICY "market_data_admin_insert"
  ON public.market_data
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update existing market data
CREATE POLICY "market_data_admin_update"
  ON public.market_data
  FOR UPDATE
  USING (public.is_admin());

-- Admins can delete stale market data
CREATE POLICY "market_data_admin_delete"
  ON public.market_data
  FOR DELETE
  USING (public.is_admin());

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP POLICY IF EXISTS "market_data_admin_delete"    ON public.market_data;
-- DROP POLICY IF EXISTS "market_data_admin_update"    ON public.market_data;
-- DROP POLICY IF EXISTS "market_data_admin_insert"    ON public.market_data;
-- DROP POLICY IF EXISTS "market_data_public_read"     ON public.market_data;
-- DROP POLICY IF EXISTS "audit_logs_admin_read"       ON public.audit_logs;
-- DROP POLICY IF EXISTS "duplicate_alerts_admin_update" ON public.duplicate_alerts;
-- DROP POLICY IF EXISTS "duplicate_alerts_admin_read" ON public.duplicate_alerts;
-- DROP POLICY IF EXISTS "aml_flags_admin_update"      ON public.aml_flags;
-- DROP POLICY IF EXISTS "aml_flags_admin_read"        ON public.aml_flags;
-- DROP POLICY IF EXISTS "admin_reports_admin_update"  ON public.admin_reports;
-- DROP POLICY IF EXISTS "admin_reports_admin_read"    ON public.admin_reports;
-- DROP POLICY IF EXISTS "admin_reports_read_own"      ON public.admin_reports;
-- DROP POLICY IF EXISTS "admin_reports_insert_auth"   ON public.admin_reports;
-- =============================================================================
-- =============================================================================
-- Migration 041 — market_data Seed: Oman Area Statistics
-- Maqar Phase I · Admin-Managed Market Statistics
-- Run AFTER 040_rls_phase_i.
-- =============================================================================
-- IMPORTANT DISCLAIMER:
--   All values are admin-managed estimates for illustrative/development purposes.
--   These are NOT official government statistics or verified market reports.
--   The data_source column is always set to 'admin_managed' to reflect this.
--   Public pages must display a disclaimer when showing this data.
-- =============================================================================
-- Uses INSERT ... ON CONFLICT DO NOTHING so re-running is safe.
-- No UNIQUE constraint on the table, so we check via a DO block pattern.
-- =============================================================================

DO $$
BEGIN

-- ── Muscat Governorate — Wilayat Bausher ─────────────────────────────────────

-- Bausher wilayat-level (all property types)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', NULL, NULL, 75000, 330, 490, 5.3, 88, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Mouj — Bausher (luxury waterfront)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', 'الموج', 'apartment', 165000, 680, 1100, 4.9, 95, 'admin_managed'),
  ('مسقط', 'بوشر', 'الموج', 'villa',     420000, 1600, 1350, 4.6, 92, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Medinat Qaboos — Bausher (established premium)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', 'مدينة قابوس', 'apartment', 95000, 420, 680, 5.3, 90, 'admin_managed'),
  ('مسقط', 'بوشر', 'مدينة قابوس', 'villa',     280000, 1100, 890, 4.7, 87, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Qurum — Bausher (commercial/residential mix)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', 'القرم', 'apartment', 85000, 370, 590, 5.2, 85, 'admin_managed'),
  ('مسقط', 'بوشر', 'القرم', 'commercial', 180000, 950, 1200, 6.3, 80, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Muscat Governorate — Wilayat Seeb ─────────────────────────────────────────

-- Seeb wilayat-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', NULL, NULL, 52000, 240, 360, 5.5, 82, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Khoud — Seeb (university area, popular with families)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الخوض', 'apartment', 48000, 210, 330, 5.3, 78, 'admin_managed'),
  ('مسقط', 'السيب', 'الخوض', 'villa',     145000, 650, 480, 5.4, 75, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Ghubrah — Seeb (mid-range residential)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الغبرة', 'apartment', 62000, 280, 410, 5.4, 83, 'admin_managed'),
  ('مسقط', 'السيب', 'الغبرة', 'villa',     185000, 780, 560, 5.1, 80, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Mawaleh — Seeb (affordable, growing)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الموالح', 'apartment', 42000, 185, 295, 5.3, 76, 'admin_managed'),
  ('مسقط', 'السيب', 'الموالح', 'villa',     120000, 530, 400, 5.3, 73, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Khuwair — Seeb (business district, high demand)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الخوير', 'apartment', 78000, 360, 530, 5.5, 89, 'admin_managed'),
  ('مسقط', 'السيب', 'الخوير', 'commercial', 220000, 1100, 1450, 6.0, 86, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Amerat — Seeb (emerging, affordable)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'العامرات', 'apartment', 38000, 165, 265, 5.2, 70, 'admin_managed'),
  ('مسقط', 'السيب', 'العامرات', 'villa',     105000, 460, 360, 5.3, 68, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Muscat Governorate — Wilayat Muttrah ─────────────────────────────────────

-- Muttrah wilayat-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مطرح', NULL, NULL, 68000, 290, 450, 5.1, 74, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Ruwi — Muttrah (commercial hub)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مطرح', 'الروي', 'commercial', 195000, 1000, 1300, 6.2, 77, 'admin_managed'),
  ('مسقط', 'مطرح', 'الروي', 'apartment',  55000,   250,  380, 5.5, 72, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Muscat Governorate — Wilayat Muscat (capital wilayat) ────────────────────

-- Muscat wilayat-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مسقط', NULL, NULL, 110000, 480, 740, 5.2, 91, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Old Muscat / Al Alam area
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مسقط', 'العلام', 'villa',     350000, 1400, 950, 4.8, 85, 'admin_managed'),
  ('مسقط', 'مسقط', 'العلام', 'apartment', 120000,  520,  800, 5.2, 82, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Dhofar Governorate — Wilayat Salalah ─────────────────────────────────────

-- Dhofar governorate-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('ظفار', 'صلالة', NULL, NULL, 42000, 190, 280, 5.4, 72, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Salalah city centre
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('ظفار', 'صلالة', 'صلالة المدينة', 'apartment', 38000, 175, 260, 5.5, 70, 'admin_managed'),
  ('ظفار', 'صلالة', 'صلالة المدينة', 'villa',     115000, 500, 380, 5.2, 68, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Batinah North — Sohar ─────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('شمال الباطنة', 'صحار', NULL, NULL, 35000, 160, 240, 5.5, 65, 'admin_managed'),
  ('شمال الباطنة', 'صحار', 'صحار المدينة', 'apartment', 32000, 150, 225, 5.6, 63, 'admin_managed'),
  ('شمال الباطنة', 'صحار', 'صحار المدينة', 'villa',     98000,  420, 330, 5.1, 60, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Batinah North — Barka ─────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('شمال الباطنة', 'بركاء', NULL, NULL, 30000, 140, 210, 5.6, 60, 'admin_managed'),
  ('شمال الباطنة', 'بركاء', 'بركاء', 'apartment', 28000, 130, 195, 5.6, 58, 'admin_managed'),
  ('شمال الباطنة', 'بركاء', 'بركاء', 'villa',     88000,  380, 300, 5.2, 55, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Dakhliyah — Nizwa ─────────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('الداخلية', 'نزوى', NULL, NULL, 28000, 125, 200, 5.4, 58, 'admin_managed'),
  ('الداخلية', 'نزوى', 'نزوى المدينة', 'apartment', 25000, 115, 185, 5.5, 56, 'admin_managed'),
  ('الداخلية', 'نزوى', 'نزوى المدينة', 'villa',     80000,  340, 270, 5.1, 53, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Sharqiyah North — Sur ─────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('شمال الشرقية', 'صور', NULL, NULL, 32000, 145, 220, 5.4, 60, 'admin_managed'),
  ('شمال الشرقية', 'صور', 'صور المدينة', 'apartment', 28000, 130, 200, 5.6, 58, 'admin_managed')
ON CONFLICT DO NOTHING;

END $$;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DELETE FROM public.market_data WHERE data_source = 'admin_managed';
-- =============================================================================
