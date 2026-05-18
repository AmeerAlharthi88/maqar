-- =============================================================================
-- Migration 018 — Offers Table (Phase D)
-- Run AFTER 017_appointments, BEFORE 019_rls_phase_d.
-- =============================================================================
-- Created when an authenticated user submits a price offer via
-- the MakeOfferModal. Both the buyer's offer amount and the
-- listing's asking price are snapshotted at submission time.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.offers (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id          UUID          NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id             UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id            UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id           UUID          REFERENCES public.agencies(id) ON DELETE SET NULL,
  offer_amount_omr    NUMERIC(12,3) NOT NULL CHECK (offer_amount_omr > 0),
  asking_price_omr    NUMERIC(12,3) NOT NULL CHECK (asking_price_omr > 0),
  financing_type      public.financing_type,
  status              public.offer_status NOT NULL DEFAULT 'submitted',
  customer_name       TEXT          NOT NULL,
  customer_phone      TEXT          NOT NULL,
  notes               TEXT,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS offers_listing_id_idx  ON public.offers (listing_id);
CREATE INDEX IF NOT EXISTS offers_user_id_idx     ON public.offers (user_id);
CREATE INDEX IF NOT EXISTS offers_agent_id_idx    ON public.offers (agent_id);
CREATE INDEX IF NOT EXISTS offers_status_idx      ON public.offers (status);
CREATE INDEX IF NOT EXISTS offers_created_at_idx  ON public.offers (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_offers_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER offers_set_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_offers_updated_at();
