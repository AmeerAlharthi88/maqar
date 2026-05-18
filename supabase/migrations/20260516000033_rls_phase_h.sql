-- =============================================================================
-- Migration 033 — RLS Policies: Phase H AI Usage Logs
-- Maqar Phase H · AI Usage Tracking
-- Run AFTER 032_ai_usage_logs.
-- Depends on: public.is_admin() SECURITY DEFINER from migration 024.
-- =============================================================================
-- Security model:
--   · Anonymous users: no access.
--   · Authenticated users: SELECT own rows only (user_id = auth.uid()).
--   · INSERT: no policy for authenticated users — all inserts come from
--     server-side API routes using the service role key (bypasses RLS).
--     This prevents clients from injecting fake usage records or
--     manipulating their own usage count (which would bypass limits).
--   · Admin: SELECT all for auditing and support.
-- =============================================================================

-- Users read their own AI usage logs
CREATE POLICY "ai_usage_logs_read_own"
  ON public.ai_usage_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins read all AI usage logs
CREATE POLICY "ai_usage_logs_admin_read"
  ON public.ai_usage_logs
  FOR SELECT
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- All rows are inserted server-side by the AI route handlers via
-- the Supabase service role client. Clients cannot write to this table.

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP POLICY IF EXISTS "ai_usage_logs_admin_read" ON public.ai_usage_logs;
-- DROP POLICY IF EXISTS "ai_usage_logs_read_own"   ON public.ai_usage_logs;
-- =============================================================================
