-- Migration: 20260516000011_favorites
-- Creates the favorites table for user-saved listings.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT favorites_user_listing_unique UNIQUE (user_id, listing_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS favorites_user_id_idx    ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS favorites_listing_id_idx ON public.favorites (listing_id);
CREATE INDEX IF NOT EXISTS favorites_created_at_idx ON public.favorites (created_at DESC);
