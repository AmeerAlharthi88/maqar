-- =============================================================================
-- Migration 006 — Listing Enums (Phase B)
-- Maqar Phase B · Step B1 (prerequisite)
-- Run AFTER 005_rls_phase_a, BEFORE 007_listings.
-- =============================================================================
-- Only listing-specific enums are added here.
-- Phase A enums (app_role, verification_status, etc.) stay in 002.
-- =============================================================================

-- ── Listing lifecycle status ───────────────────────────────────────────────────
-- Mirrors: src/types/listing.ts → ListingStatus
--          src/mock/agent-analytics.ts → AgentListingMeta.status
-- 'pending_review' maps to 'pending' in the TypeScript type (kept separate in DB
-- for clarity — the TS type is a simplified view for UI display)
CREATE TYPE public.listing_status AS ENUM (
  'draft',
  'pending_review',
  'needs_changes',    -- admin flagged: owner must revise
  'active',           -- live and searchable by public
  'rejected',         -- admin permanently rejected
  'expired',          -- listing period elapsed
  'sold',             -- sale completed
  'rented'            -- rented out
);

-- ── Admin review queue status (separate from lifecycle status) ─────────────────
-- Mirrors: src/types/admin.ts → ListingReviewStatus
CREATE TYPE public.listing_review_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'needs_changes',
  'suspicious'
);

-- ── Listing purpose ────────────────────────────────────────────────────────────
-- Mirrors: src/types/listing.ts → ListingPurpose
-- Note: DraftPurpose includes 'investment' for UI flow, which maps to 'sale'
-- before DB insert (an investment property is a sale listing with ROI metadata).
CREATE TYPE public.listing_purpose AS ENUM ('sale', 'rent');

-- ── Property type ──────────────────────────────────────────────────────────────
-- Mirrors: src/types/listing.ts → PropertyType (all 13 types)
CREATE TYPE public.property_type AS ENUM (
  'apartment',
  'villa',
  'duplex',
  'townhouse',
  'land',
  'commercial',
  'office',
  'warehouse',
  'arabic_house',
  'farm',
  'chalet',
  'building',
  'hotel_apartment'
);

-- ── Furnishing status ──────────────────────────────────────────────────────────
-- Mirrors: src/types/listing.ts → FurnishingStatus
CREATE TYPE public.furnishing_status AS ENUM (
  'furnished',
  'semi_furnished',
  'unfurnished'
);

-- ── Rent period ────────────────────────────────────────────────────────────────
-- Mirrors: src/types/listing-draft.ts → RentPeriod
CREATE TYPE public.rent_period AS ENUM (
  'monthly',
  'yearly',
  'quarterly',
  'weekly'
);

-- ── Listing document type ──────────────────────────────────────────────────────
-- Mirrors: src/types/listing-draft.ts → DocumentType
CREATE TYPE public.listing_document_type AS ENUM (
  'mulkiya',        -- property ownership document
  'agency_auth',    -- agency authorization letter
  'civil_id',       -- civil ID copy
  'cr_number',      -- commercial registration
  'contract_draft'  -- draft contract (optional)
);

-- =============================================================================
-- ROLLBACK (run in this order to undo — only safe before 007_listings)
-- =============================================================================
-- DROP TYPE IF EXISTS public.listing_document_type;
-- DROP TYPE IF EXISTS public.rent_period;
-- DROP TYPE IF EXISTS public.furnishing_status;
-- DROP TYPE IF EXISTS public.property_type;
-- DROP TYPE IF EXISTS public.listing_purpose;
-- DROP TYPE IF EXISTS public.listing_review_status;
-- DROP TYPE IF EXISTS public.listing_status;
-- =============================================================================
