-- =============================================================================
-- Migration 008 — Listing Images Table
-- Maqar Phase B · Step B2
-- Run AFTER 007_listings.
-- =============================================================================
-- Stores metadata for each uploaded listing photo.
-- Actual files live in Supabase Storage bucket 'listing-images'.
-- Storage path convention: listing-images/{listing_id}/{uuid}.{ext}
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.listing_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,

  -- Storage reference
  storage_path  TEXT NOT NULL,   -- path within the 'listing-images' bucket
  url           TEXT NOT NULL,   -- full public CDN URL

  -- Display metadata
  is_main       BOOLEAN NOT NULL DEFAULT false,
  sort_order    SMALLINT NOT NULL DEFAULT 0,

  -- File metadata (stored for validation and display)
  width         INTEGER,
  height        INTEGER,
  size_bytes    INTEGER,
  mime_type     TEXT,

  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- Index: all images for a listing in display order
CREATE INDEX IF NOT EXISTS listing_images_listing_order_idx
  ON public.listing_images(listing_id, sort_order ASC);

-- Index: find the main image for a listing quickly (cover image display)
CREATE INDEX IF NOT EXISTS listing_images_main_idx
  ON public.listing_images(listing_id, is_main)
  WHERE is_main = true;

-- ── Enforce single main image per listing ─────────────────────────────────────
-- Unique partial index: at most one row per listing can have is_main = true
CREATE UNIQUE INDEX IF NOT EXISTS listing_images_single_main_idx
  ON public.listing_images(listing_id)
  WHERE is_main = true;

-- ── Sync cover_image_url on listings when images change ───────────────────────
-- When the main image changes, keep listings.cover_image_url in sync.
CREATE OR REPLACE FUNCTION public.sync_listing_cover_image()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_main_url TEXT;
BEGIN
  -- Get the current main image URL for this listing
  SELECT url INTO v_main_url
  FROM public.listing_images
  WHERE listing_id = COALESCE(NEW.listing_id, OLD.listing_id)
    AND is_main = true
  LIMIT 1;

  -- Update the listing's cover_image_url
  UPDATE public.listings
  SET cover_image_url = v_main_url
  WHERE id = COALESCE(NEW.listing_id, OLD.listing_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER listing_images_cover_sync
  AFTER INSERT OR UPDATE OF is_main OR DELETE ON public.listing_images
  FOR EACH ROW EXECUTE FUNCTION public.sync_listing_cover_image();

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TRIGGER IF EXISTS listing_images_cover_sync ON public.listing_images;
-- DROP FUNCTION IF EXISTS public.sync_listing_cover_image();
-- DROP TABLE IF EXISTS public.listing_images CASCADE;
-- =============================================================================
