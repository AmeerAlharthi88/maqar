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
