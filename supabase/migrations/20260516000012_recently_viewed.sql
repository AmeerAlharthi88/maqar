-- Migration: 20260516000012_recently_viewed
-- Creates the recently_viewed table.
-- On conflict (same user + listing), the viewed_at timestamp is updated (upsert).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT recently_viewed_user_listing_unique UNIQUE (user_id, listing_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS recently_viewed_user_id_idx  ON public.recently_viewed (user_id);
CREATE INDEX IF NOT EXISTS recently_viewed_viewed_at_idx ON public.recently_viewed (viewed_at DESC);
