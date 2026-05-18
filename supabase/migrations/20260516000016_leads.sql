-- =============================================================================
-- Migration 016 — Leads Table (Phase D)
-- Run AFTER 015_crm_enums, BEFORE 017_appointments.
-- =============================================================================
-- A lead is created whenever a user contacts a listing agent
-- (WhatsApp click, phone call intent, or from booking/offer flow).
--
-- user_id is nullable to support guest-originated leads created server-side.
-- Client-side inserts always set user_id = auth.uid() (enforced by RLS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID          NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id         UUID          REFERENCES public.profiles(id) ON DELETE SET NULL, -- nullable: guest or server-side
  agent_id        UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id       UUID          REFERENCES public.agencies(id) ON DELETE SET NULL,
  source          public.lead_source   NOT NULL,
  status          public.lead_status   NOT NULL DEFAULT 'new',
  customer_name   TEXT,
  customer_phone  TEXT,
  message         TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS leads_listing_id_idx  ON public.leads (listing_id);
CREATE INDEX IF NOT EXISTS leads_user_id_idx     ON public.leads (user_id);
CREATE INDEX IF NOT EXISTS leads_agent_id_idx    ON public.leads (agent_id);
CREATE INDEX IF NOT EXISTS leads_status_idx      ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx  ON public.leads (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_leads_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_leads_updated_at();
