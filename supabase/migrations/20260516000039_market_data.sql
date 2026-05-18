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
