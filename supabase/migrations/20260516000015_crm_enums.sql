-- =============================================================================
-- Migration 015 — CRM Enums (Phase D)
-- Run AFTER 014_rls_phase_c, BEFORE 016_leads.
-- =============================================================================
-- These enums mirror the TypeScript types in src/types/lead.ts exactly.
-- =============================================================================

-- ── Lead source ───────────────────────────────────────────────────────────────
-- How the lead arrived (WhatsApp, phone call, viewing booking, etc.)
-- Mirrors: LeadSource in src/types/lead.ts
CREATE TYPE public.lead_source AS ENUM (
  'whatsapp',
  'call',
  'appointment',
  'offer',
  'website'
);

-- ── Lead lifecycle status ─────────────────────────────────────────────────────
-- Mirrors: LeadStatus in src/types/lead.ts
CREATE TYPE public.lead_status AS ENUM (
  'new',
  'contacted',
  'viewing_scheduled',
  'negotiating',
  'closed',
  'lost'
);

-- ── Appointment status ────────────────────────────────────────────────────────
-- Mirrors: AppointmentStatus in src/types/lead.ts
CREATE TYPE public.appointment_status AS ENUM (
  'pending',
  'confirmed',
  'rescheduled',
  'cancelled',
  'completed'
);

-- ── Offer status ──────────────────────────────────────────────────────────────
-- Mirrors: OfferStatus in src/types/lead.ts
CREATE TYPE public.offer_status AS ENUM (
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'countered',
  'withdrawn'
);

-- ── Financing type ────────────────────────────────────────────────────────────
-- Mirrors: FinancingType in src/types/lead.ts
CREATE TYPE public.financing_type AS ENUM (
  'cash',
  'mortgage',
  'installment'
);

-- =============================================================================
-- ROLLBACK (run in reverse before 016_leads is applied)
-- =============================================================================
-- DROP TYPE IF EXISTS public.financing_type;
-- DROP TYPE IF EXISTS public.offer_status;
-- DROP TYPE IF EXISTS public.appointment_status;
-- DROP TYPE IF EXISTS public.lead_status;
-- DROP TYPE IF EXISTS public.lead_source;
-- =============================================================================
