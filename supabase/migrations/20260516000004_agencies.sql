-- =============================================================================
-- Migration 004 — Agencies + Agency Members + profiles.agency_id FK
-- Maqar Phase A · Steps A5, A6
-- Run AFTER 003_profiles.
-- =============================================================================
-- Creates:
--   · public.agencies                    agency entity table
--   · public.agency_members              junction: profiles ↔ agencies
--   · FK: profiles.agency_id → agencies.id   (added here, after agencies exists)
--   · updated_at triggers on both tables
-- =============================================================================

-- ── agencies table ────────────────────────────────────────────────────────────
-- Replaces: src/mock/agencies.ts → Agency interface
-- One agency can have many members (via agency_members).
-- The agency owner is also a member with role 'agency_admin'.
CREATE TABLE IF NOT EXISTS public.agencies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,

  -- Identity
  name_ar             TEXT NOT NULL,
  name_en             TEXT,
  logo_url            TEXT,

  -- Contact
  phone               TEXT NOT NULL,
  whatsapp            TEXT,
  email               TEXT,
  website             TEXT,

  -- Registration
  cr_number           TEXT,
  license_number      TEXT,

  -- Verification
  is_verified         BOOLEAN NOT NULL DEFAULT false,
  verification_status public.verification_status NOT NULL DEFAULT 'not_started',

  -- Location (stored flat — no separate location table needed for Phase A)
  governorate_ar      TEXT,
  wilayat_ar          TEXT,
  address_ar          TEXT,

  -- Profile content
  description_ar      TEXT,
  specialization_ar   TEXT[],
  service_areas_ar    TEXT[],
  founded_year        SMALLINT,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- ── agency_members table ──────────────────────────────────────────────────────
-- Replaces: src/types/agency.ts → AgencyMember[]
-- Junction table: one profile can be a member of one agency.
-- (Multi-agency membership is out of scope for Phase A.)
CREATE TABLE IF NOT EXISTS public.agency_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id     UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_role   public.agency_member_role NOT NULL DEFAULT 'agent',
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- A profile can only be a member of one agency once
  UNIQUE (agency_id, profile_id)
);

ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;

-- Index: look up members by agency (common query: "list all members of agency X")
CREATE INDEX IF NOT EXISTS agency_members_agency_idx
  ON public.agency_members(agency_id);

-- Index: look up which agency a profile belongs to (common query: "what agency is agent Y in?")
CREATE INDEX IF NOT EXISTS agency_members_profile_idx
  ON public.agency_members(profile_id);

-- ── Add FK: profiles.agency_id → agencies ────────────────────────────────────
-- This FK could not be added in 003_profiles.sql because agencies didn't exist yet.
-- ON DELETE SET NULL: if an agency is deleted, the agent becomes independent (not deleted).
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_agency_id_fk
  FOREIGN KEY (agency_id)
  REFERENCES public.agencies(id)
  ON DELETE SET NULL;

-- =============================================================================
-- ROLLBACK (run in this order to undo)
-- =============================================================================
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_agency_id_fk;
-- DROP TABLE IF EXISTS public.agency_members;
-- DROP TRIGGER IF EXISTS agencies_updated_at ON public.agencies;
-- DROP TABLE IF EXISTS public.agencies;
-- =============================================================================
