-- Migration: 20260516000013_saved_searches
-- Creates the saved_searches table for persisted search filters.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.saved_searches (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name                  TEXT        NOT NULL,
  query                 TEXT,
  filters               JSONB       NOT NULL DEFAULT '{}',
  notification_whatsapp BOOLEAN     NOT NULL DEFAULT false,
  notification_email    BOOLEAN     NOT NULL DEFAULT false,
  notification_in_app   BOOLEAN     NOT NULL DEFAULT true,
  last_notified_at      TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fetching a user's saved searches sorted by recency
CREATE INDEX IF NOT EXISTS saved_searches_user_id_idx  ON public.saved_searches (user_id);
CREATE INDEX IF NOT EXISTS saved_searches_created_at_idx ON public.saved_searches (created_at DESC);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.set_saved_searches_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER saved_searches_set_updated_at
  BEFORE UPDATE ON public.saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION public.set_saved_searches_updated_at();
