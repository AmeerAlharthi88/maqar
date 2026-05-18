-- =============================================================================
-- Migration 040 — RLS Policies: Phase I Admin Queues + Market Data
-- Maqar Phase I
-- Run AFTER 039_market_data.
-- Depends on: public.is_admin() SECURITY DEFINER from migration 024.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- admin_reports
-- ─────────────────────────────────────────────────────────────────────────────

-- Authenticated users can file reports
CREATE POLICY "admin_reports_insert_auth"
  ON public.admin_reports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can read their own submitted reports
CREATE POLICY "admin_reports_read_own"
  ON public.admin_reports
  FOR SELECT
  USING (reporter_id = auth.uid());

-- Admins can read all reports
CREATE POLICY "admin_reports_admin_read"
  ON public.admin_reports
  FOR SELECT
  USING (public.is_admin());

-- Admins can update reports (status, admin_notes, reviewed_by, reviewed_at)
-- All admin updates go through service-role API routes — this policy is a
-- defense-in-depth layer for any direct client usage by admin role.
CREATE POLICY "admin_reports_admin_update"
  ON public.admin_reports
  FOR UPDATE
  USING (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- aml_flags — admin/service-role only
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "aml_flags_admin_read"
  ON public.aml_flags
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "aml_flags_admin_update"
  ON public.aml_flags
  FOR UPDATE
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- aml_flags are created exclusively by service-role (API routes / triggers).

-- ─────────────────────────────────────────────────────────────────────────────
-- duplicate_alerts — admin/service-role only
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "duplicate_alerts_admin_read"
  ON public.duplicate_alerts
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "duplicate_alerts_admin_update"
  ON public.duplicate_alerts
  FOR UPDATE
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- duplicate_alerts are created exclusively by service-role (duplicate detection pipeline).

-- ─────────────────────────────────────────────────────────────────────────────
-- audit_logs — admin read only, append-only (no UPDATE/DELETE policies)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "audit_logs_admin_read"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- audit_logs are inserted exclusively by service-role from admin API routes.
-- No UPDATE or DELETE policies — audit logs are immutable.

-- ─────────────────────────────────────────────────────────────────────────────
-- market_data — public read, admin write
-- ─────────────────────────────────────────────────────────────────────────────

-- Public read: market statistics are intentionally public
CREATE POLICY "market_data_public_read"
  ON public.market_data
  FOR SELECT
  USING (true);

-- Admins can insert new market data rows
CREATE POLICY "market_data_admin_insert"
  ON public.market_data
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update existing market data
CREATE POLICY "market_data_admin_update"
  ON public.market_data
  FOR UPDATE
  USING (public.is_admin());

-- Admins can delete stale market data
CREATE POLICY "market_data_admin_delete"
  ON public.market_data
  FOR DELETE
  USING (public.is_admin());

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP POLICY IF EXISTS "market_data_admin_delete"    ON public.market_data;
-- DROP POLICY IF EXISTS "market_data_admin_update"    ON public.market_data;
-- DROP POLICY IF EXISTS "market_data_admin_insert"    ON public.market_data;
-- DROP POLICY IF EXISTS "market_data_public_read"     ON public.market_data;
-- DROP POLICY IF EXISTS "audit_logs_admin_read"       ON public.audit_logs;
-- DROP POLICY IF EXISTS "duplicate_alerts_admin_update" ON public.duplicate_alerts;
-- DROP POLICY IF EXISTS "duplicate_alerts_admin_read" ON public.duplicate_alerts;
-- DROP POLICY IF EXISTS "aml_flags_admin_update"      ON public.aml_flags;
-- DROP POLICY IF EXISTS "aml_flags_admin_read"        ON public.aml_flags;
-- DROP POLICY IF EXISTS "admin_reports_admin_update"  ON public.admin_reports;
-- DROP POLICY IF EXISTS "admin_reports_admin_read"    ON public.admin_reports;
-- DROP POLICY IF EXISTS "admin_reports_read_own"      ON public.admin_reports;
-- DROP POLICY IF EXISTS "admin_reports_insert_auth"   ON public.admin_reports;
-- =============================================================================
