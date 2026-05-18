-- =============================================================================
-- Migration 017 — Appointments Table (Phase D)
-- Run AFTER 016_leads, BEFORE 018_offers.
-- =============================================================================
-- Created when an authenticated user books a property viewing via
-- the BookViewingModal. preferred_date + preferred_time are stored
-- separately because the time is an Arabic text slot (e.g. "١٠:٠٠ ص").
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID          NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id         UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id        UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id       UUID          REFERENCES public.agencies(id) ON DELETE SET NULL,
  preferred_date  DATE          NOT NULL,
  preferred_time  TEXT          NOT NULL,
  status          public.appointment_status NOT NULL DEFAULT 'pending',
  customer_name   TEXT          NOT NULL,
  customer_phone  TEXT          NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS appointments_listing_id_idx    ON public.appointments (listing_id);
CREATE INDEX IF NOT EXISTS appointments_user_id_idx       ON public.appointments (user_id);
CREATE INDEX IF NOT EXISTS appointments_agent_id_idx      ON public.appointments (agent_id);
CREATE INDEX IF NOT EXISTS appointments_status_idx        ON public.appointments (status);
CREATE INDEX IF NOT EXISTS appointments_preferred_date_idx ON public.appointments (preferred_date DESC);
CREATE INDEX IF NOT EXISTS appointments_created_at_idx    ON public.appointments (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_appointments_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER appointments_set_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_appointments_updated_at();
