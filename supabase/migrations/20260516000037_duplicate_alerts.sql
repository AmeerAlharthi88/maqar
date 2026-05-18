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
