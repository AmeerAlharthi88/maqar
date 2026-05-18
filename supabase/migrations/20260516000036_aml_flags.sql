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
