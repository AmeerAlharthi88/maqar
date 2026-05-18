-- =============================================================================
-- Migration 002 — Enums (Phase A only)
-- Maqar Phase A · Step A3
-- Run AFTER 001_extensions, BEFORE 003_profiles.
-- =============================================================================
-- Only enums required by Phase A tables are created here.
-- Phase B+ enums (listing types, lead status, etc.) are added in later
-- migrations so each phase is independently deployable and rollback-safe.
-- =============================================================================

-- ── User roles ────────────────────────────────────────────────────────────────
-- Mirrors: src/config/roles.ts → AppRole
-- Note: 'guest' represents unauthenticated users and is included for
-- completeness (e.g. if a profile is ever soft-downgraded). Authenticated
-- users will always be at minimum 'user'.
CREATE TYPE public.app_role AS ENUM (
  'guest',
  'user',
  'agent',
  'agency_admin',
  'admin',
  'super_admin'
);

-- ── Verification / KYC status ─────────────────────────────────────────────────
-- Mirrors: src/types/profile.ts → VerificationStatus
CREATE TYPE public.verification_status AS ENUM (
  'not_started',
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'needs_more_info'
);

-- ── User account status (admin control) ───────────────────────────────────────
-- Mirrors: src/types/admin.ts → UserStatus
CREATE TYPE public.user_account_status AS ENUM (
  'active',
  'suspended',
  'banned',
  'pending_verification'
);

-- ── Agency member roles ───────────────────────────────────────────────────────
-- Mirrors: src/types/agency.ts → AgencyMember.role
CREATE TYPE public.agency_member_role AS ENUM (
  'agency_admin',
  'manager',
  'agent',
  'viewer'
);

-- =============================================================================
-- ROLLBACK (run in reverse order to undo — only if no tables use these yet)
-- =============================================================================
-- DROP TYPE IF EXISTS public.agency_member_role;
-- DROP TYPE IF EXISTS public.user_account_status;
-- DROP TYPE IF EXISTS public.verification_status;
-- DROP TYPE IF EXISTS public.app_role;
-- =============================================================================
