-- =============================================================================
-- Migration 027 — RLS Policies: Phase F Analytics
-- Maqar Phase F · Analytics
-- Run AFTER 026_listing_analytics.
-- Depends on: public.is_admin() SECURITY DEFINER from migration 024.
-- =============================================================================
-- Security model:
--   · Anonymous users: no SELECT access to listing_analytics
--   · Authenticated (non-agent): no SELECT access
--   · Agents: SELECT only rows where agent_id = auth.uid()
--   · Admins: SELECT all rows
--   · INSERT: No policy for regular users — all inserts flow through the
--     server API route (/api/analytics/event) using the service role key,
--     which bypasses RLS entirely. This prevents clients from injecting
--     fake analytics events directly.
-- =============================================================================

-- ── listing_analytics ─────────────────────────────────────────────────────────

-- Agents may read analytics for their own listings only
CREATE POLICY "analytics_agent_read_own"
  ON public.listing_analytics
  FOR SELECT
  USING (agent_id = auth.uid());

-- Admins may read all analytics
CREATE POLICY "analytics_admin_read_all"
  ON public.listing_analytics
  FOR SELECT
  USING (public.is_admin());

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP POLICY IF EXISTS "analytics_admin_read_all" ON public.listing_analytics;
-- DROP POLICY IF EXISTS "analytics_agent_read_own"  ON public.listing_analytics;
-- =============================================================================
