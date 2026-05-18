-- ── Phase E: KYC Applications table ──────────────────────────────────────────
-- Depends on: 020 (kyc_entity_type enum)
--             002 (verification_status enum — reused for status column)
--             003 (profiles)  004 (agencies)

CREATE TABLE public.kyc_applications (
  id              uuid                  PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Applicant (always the authenticated user)
  user_id         uuid                  NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Individual agent or agency account
  entity_type     kyc_entity_type       NOT NULL DEFAULT 'individual',

  -- Optional: link to agency if entity_type = 'agency'
  agency_id       uuid                  REFERENCES public.agencies(id) ON DELETE SET NULL,

  -- Lifecycle — reuses the verification_status enum from migration 002
  status          verification_status   NOT NULL DEFAULT 'draft',

  -- Admin feedback on rejection / needs_more_info
  admin_notes     text,

  -- Timestamps
  submitted_at    timestamptz,          -- set when status → 'submitted'
  reviewed_at     timestamptz,          -- set when admin makes a decision
  created_at      timestamptz           NOT NULL DEFAULT now(),
  updated_at      timestamptz           NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
-- Admin queue: submitted applications newest-first
CREATE INDEX idx_kyc_apps_status ON public.kyc_applications (status, created_at DESC);

-- Lookup by user
CREATE INDEX idx_kyc_apps_user ON public.kyc_applications (user_id);

-- ── updated_at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_kyc_applications_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_kyc_applications_updated_at
  BEFORE UPDATE ON public.kyc_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_kyc_applications_updated_at();
