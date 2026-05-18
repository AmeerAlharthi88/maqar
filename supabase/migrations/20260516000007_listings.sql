-- =============================================================================
-- Migration 007 — Listings Table + Indexes + Triggers
-- Maqar Phase B · Steps B1
-- Run AFTER 006_listing_enums.
-- =============================================================================
-- Creates:
--   · public.listings           core property listing table
--   · listings_updated_at       auto-update trigger
--   · All search/filter indexes
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.listings (

  -- ── Identity ──────────────────────────────────────────────────────────────
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  agency_id             UUID REFERENCES public.agencies(id) ON DELETE SET NULL,

  -- ── Content ───────────────────────────────────────────────────────────────
  title_ar              TEXT NOT NULL,
  title_en              TEXT,
  description_ar        TEXT NOT NULL DEFAULT '',
  description_en        TEXT,
  highlights            TEXT[],           -- bullet point highlights from step 8

  -- ── Classification ────────────────────────────────────────────────────────
  purpose               public.listing_purpose NOT NULL,
  property_type         public.property_type NOT NULL,

  -- ── Lifecycle + admin review ───────────────────────────────────────────────
  -- status: public-facing lifecycle state (what owners and buyers see)
  -- review_status: admin queue state (what admins track)
  -- Flow: owner submits (pending_review / pending) → admin approves (active / approved)
  status                public.listing_status NOT NULL DEFAULT 'pending_review',
  review_status         public.listing_review_status NOT NULL DEFAULT 'pending',

  -- ── Pricing ───────────────────────────────────────────────────────────────
  price_omr             NUMERIC(12, 3) NOT NULL,
  rent_period           public.rent_period,           -- null for sale listings
  is_negotiable         BOOLEAN NOT NULL DEFAULT false,
  is_price_hidden       BOOLEAN NOT NULL DEFAULT false,
  deposit_amount        NUMERIC(10, 3),               -- for rent listings
  service_charges       NUMERIC(10, 3),               -- annual service charges

  -- ── Location ──────────────────────────────────────────────────────────────
  governorate_id        TEXT,
  governorate_ar        TEXT,
  wilayat_id            TEXT,
  wilayat_ar            TEXT,
  area_id               TEXT,
  area_ar               TEXT,
  address_ar            TEXT,             -- full street address (shown when hide=false)
  block                 TEXT,
  street                TEXT,
  location_notes        TEXT,
  hide_exact_location   BOOLEAN NOT NULL DEFAULT false,

  -- Coordinates stored as numeric + computed geography for spatial queries
  -- (Kept as numeric for simplicity; upgrade to GEOGRAPHY in a later migration
  --  once PostGIS is confirmed enabled)
  latitude              NUMERIC(10, 7),
  longitude             NUMERIC(10, 7),

  -- ── Property specs ─────────────────────────────────────────────────────────
  bedrooms              SMALLINT,
  bathrooms             SMALLINT,
  area_sqm              NUMERIC(10, 2),          -- built-up area
  land_size_sqm         NUMERIC(10, 2),          -- land/plot area
  built_up_area_sqm     NUMERIC(10, 2),          -- explicit built-up (may differ from area_sqm)
  floors                SMALLINT,
  parking_spaces        SMALLINT,
  furnishing_status     public.furnishing_status,
  property_age          TEXT,                    -- "0","1","2","3-5","5-10","10+"
  availability_date     DATE,

  -- ── Oman-specific boolean features ────────────────────────────────────────
  -- Mirrors all boolean flags in src/types/listing-draft.ts
  has_majlis            BOOLEAN NOT NULL DEFAULT false,
  has_maid_room         BOOLEAN NOT NULL DEFAULT false,
  has_driver_room       BOOLEAN NOT NULL DEFAULT false,
  has_outdoor_kitchen   BOOLEAN NOT NULL DEFAULT false,
  has_indoor_kitchen    BOOLEAN NOT NULL DEFAULT false,
  has_yard              BOOLEAN NOT NULL DEFAULT false,
  has_sea_view          BOOLEAN NOT NULL DEFAULT false,
  has_mountain_view     BOOLEAN NOT NULL DEFAULT false,
  is_freehold           BOOLEAN NOT NULL DEFAULT false,
  is_expat_allowed      BOOLEAN NOT NULL DEFAULT false,
  is_family_only        BOOLEAN NOT NULL DEFAULT false,
  is_bachelor_allowed   BOOLEAN NOT NULL DEFAULT false,

  -- ── Amenities (flexible free-text tags) ───────────────────────────────────
  amenities             JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- ── Media ─────────────────────────────────────────────────────────────────
  cover_image_url       TEXT,                    -- denormalised from listing_images
  video_link            TEXT,
  tour_link             TEXT,

  -- ── Quality + AI signals ──────────────────────────────────────────────────
  quality_score         INTEGER NOT NULL DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
  roi_estimate          NUMERIC(5, 2),            -- % annual, set by AI or manually
  duplicate_risk_score  INTEGER CHECK (duplicate_risk_score BETWEEN 0 AND 100),
  suspicious_price_flag BOOLEAN NOT NULL DEFAULT false,
  is_below_market       BOOLEAN NOT NULL DEFAULT false,

  -- ── Admin-controlled flags ─────────────────────────────────────────────────
  -- These must NEVER be settable by the listing owner via the anon key.
  -- Application layer enforces this; RLS WITH CHECK also restricts owner updates.
  is_verified           BOOLEAN NOT NULL DEFAULT false,
  is_featured           BOOLEAN NOT NULL DEFAULT false,
  admin_note            TEXT,

  -- ── Denormalised counters ──────────────────────────────────────────────────
  -- Incremented by DB functions / triggers (Phase F) — not by client directly.
  view_count            INTEGER NOT NULL DEFAULT 0,
  favorite_count        INTEGER NOT NULL DEFAULT 0,
  lead_count            INTEGER NOT NULL DEFAULT 0,
  whatsapp_clicks       INTEGER NOT NULL DEFAULT 0,
  call_clicks           INTEGER NOT NULL DEFAULT 0,

  -- ── Timestamps ────────────────────────────────────────────────────────────
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at          TIMESTAMPTZ,              -- set when status transitions to 'active'
  expires_at            TIMESTAMPTZ               -- configurable listing expiry (plan-based)
);

-- Auto-update updated_at on every row change
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-set published_at when listing becomes active
CREATE OR REPLACE FUNCTION public.handle_listing_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  -- Set published_at when transitioning TO active for the first time
  IF NEW.status = 'active' AND OLD.status != 'active' AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER listings_status_change
  BEFORE UPDATE OF status ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_listing_status_change();

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- ── Indexes ────────────────────────────────────────────────────────────────────

-- Primary search filters
CREATE INDEX IF NOT EXISTS listings_status_review_idx
  ON public.listings(status, review_status);

CREATE INDEX IF NOT EXISTS listings_purpose_idx
  ON public.listings(purpose);

CREATE INDEX IF NOT EXISTS listings_property_type_idx
  ON public.listings(property_type);

-- Owner / agency lookup
CREATE INDEX IF NOT EXISTS listings_owner_id_idx
  ON public.listings(owner_id);

CREATE INDEX IF NOT EXISTS listings_agency_id_idx
  ON public.listings(agency_id)
  WHERE agency_id IS NOT NULL;

-- Location hierarchy (used by search filters)
CREATE INDEX IF NOT EXISTS listings_governorate_idx
  ON public.listings(governorate_id)
  WHERE governorate_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS listings_wilayat_idx
  ON public.listings(wilayat_id)
  WHERE wilayat_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS listings_area_idx
  ON public.listings(area_id)
  WHERE area_id IS NOT NULL;

-- Price range filtering
CREATE INDEX IF NOT EXISTS listings_price_idx
  ON public.listings(price_omr);

-- Bedroom filter
CREATE INDEX IF NOT EXISTS listings_bedrooms_idx
  ON public.listings(bedrooms)
  WHERE bedrooms IS NOT NULL;

-- Timestamps for sorting + expiry checks
CREATE INDEX IF NOT EXISTS listings_created_at_idx
  ON public.listings(created_at DESC);

CREATE INDEX IF NOT EXISTS listings_published_at_idx
  ON public.listings(published_at DESC)
  WHERE published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS listings_expires_at_idx
  ON public.listings(expires_at)
  WHERE expires_at IS NOT NULL;

-- Featured listings (small set, frequently queried for homepage)
CREATE INDEX IF NOT EXISTS listings_featured_idx
  ON public.listings(is_featured)
  WHERE is_featured = true AND status = 'active';

-- Below-market flag (for "below_market" sort/filter)
CREATE INDEX IF NOT EXISTS listings_below_market_idx
  ON public.listings(is_below_market)
  WHERE is_below_market = true;

-- Coordinates (for bounding-box queries before PostGIS radius search)
CREATE INDEX IF NOT EXISTS listings_coordinates_idx
  ON public.listings(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Arabic full-text search
-- Uses 'simple' configuration (Postgres has no Arabic stemmer built-in)
-- pg_trgm index on title_ar supports ILIKE and trigram similarity
CREATE INDEX IF NOT EXISTS listings_title_ar_trgm_idx
  ON public.listings USING GIN (title_ar extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS listings_description_ar_trgm_idx
  ON public.listings USING GIN (description_ar extensions.gin_trgm_ops);

-- Compound public search index (most common query: active + purpose + type)
CREATE INDEX IF NOT EXISTS listings_public_search_idx
  ON public.listings(status, purpose, property_type, price_omr)
  WHERE status = 'active';

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TRIGGER IF EXISTS listings_status_change ON public.listings;
-- DROP FUNCTION IF EXISTS public.handle_listing_status_change();
-- DROP TRIGGER IF EXISTS listings_updated_at ON public.listings;
-- DROP TABLE IF EXISTS public.listings CASCADE;
-- =============================================================================
