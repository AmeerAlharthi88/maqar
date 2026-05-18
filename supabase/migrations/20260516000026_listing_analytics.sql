-- =============================================================================
-- Migration 026 — listing_analytics Table + DB Functions + Indexes
-- Maqar Phase F · Analytics
-- Run AFTER 025_analytics_enum.
-- =============================================================================
-- Creates:
--   · public.listing_analytics          event log for listing activity
--   · increment_listing_view_count()    atomically bumps listings.view_count
--   · increment_listing_whatsapp_clicks() bumps listings.whatsapp_clicks
--   · increment_listing_call_clicks()   bumps listings.call_clicks
--   · Search/aggregate indexes
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.listing_analytics (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id   UUID          NOT NULL REFERENCES public.listings(id)  ON DELETE CASCADE,
  agent_id     UUID          REFERENCES public.profiles(id)            ON DELETE SET NULL,
  agency_id    UUID          REFERENCES public.agencies(id)            ON DELETE SET NULL,
  user_id      UUID          REFERENCES public.profiles(id)            ON DELETE SET NULL,
  event_type   public.analytics_event_type NOT NULL,
  source       TEXT,
  session_id   TEXT,
  metadata     JSONB         NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_analytics ENABLE ROW LEVEL SECURITY;

-- ── Indexes ────────────────────────────────────────────────────────────────────

-- Core lookup: all events for a listing
CREATE INDEX IF NOT EXISTS idx_listing_analytics_listing_id
  ON public.listing_analytics(listing_id);

-- Agent analytics dashboard: all events owned by agent
CREATE INDEX IF NOT EXISTS idx_listing_analytics_agent_id
  ON public.listing_analytics(agent_id)
  WHERE agent_id IS NOT NULL;

-- Event type filtering
CREATE INDEX IF NOT EXISTS idx_listing_analytics_event_type
  ON public.listing_analytics(event_type);

-- Date-range queries
CREATE INDEX IF NOT EXISTS idx_listing_analytics_created_at
  ON public.listing_analytics(created_at DESC);

-- Compound: agent + event + date (most common analytics query pattern)
CREATE INDEX IF NOT EXISTS idx_listing_analytics_agent_event_created
  ON public.listing_analytics(agent_id, event_type, created_at DESC)
  WHERE agent_id IS NOT NULL;

-- ── DB functions for denormalized counter increments ──────────────────────────
-- SECURITY DEFINER so the API route (service role) and these functions can
-- both atomically update the listings row without triggering RLS on listings.
-- The functions are intentionally narrow: one row update, no reads.

CREATE OR REPLACE FUNCTION public.increment_listing_view_count(p_listing_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.listings
  SET view_count = view_count + 1
  WHERE id = p_listing_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_listing_whatsapp_clicks(p_listing_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.listings
  SET whatsapp_clicks = whatsapp_clicks + 1
  WHERE id = p_listing_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_listing_call_clicks(p_listing_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.listings
  SET call_clicks = call_clicks + 1
  WHERE id = p_listing_id;
END;
$$;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP FUNCTION IF EXISTS public.increment_listing_call_clicks(UUID);
-- DROP FUNCTION IF EXISTS public.increment_listing_whatsapp_clicks(UUID);
-- DROP FUNCTION IF EXISTS public.increment_listing_view_count(UUID);
-- DROP TABLE IF EXISTS public.listing_analytics CASCADE;
-- =============================================================================
