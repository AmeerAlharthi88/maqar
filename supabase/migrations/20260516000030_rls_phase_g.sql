-- =============================================================================
-- Migration 030 — RLS Policies: Phase G Subscriptions + Payments
-- Maqar Phase G · Subscriptions + Payments
-- Run AFTER 029_subscriptions.
-- Depends on: public.is_admin() SECURITY DEFINER from migration 024.
-- =============================================================================
-- Security model:
--   · Anonymous users: no access to any billing table.
--   · Authenticated users: SELECT only their own rows via user_id = auth.uid().
--   · Agents/users: CANNOT update subscription status or payment_status.
--   · INSERT/UPDATE for payment activation: service role only (via webhook).
--   · Admin: full access via is_admin() (service role preferred for writes).
-- =============================================================================

-- ── subscriptions ─────────────────────────────────────────────────────────────

-- Users read their own subscription
CREATE POLICY "subscriptions_read_own"
  ON public.subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins read all subscriptions
CREATE POLICY "subscriptions_admin_read"
  ON public.subscriptions
  FOR SELECT
  USING (public.is_admin());

-- Admins update any subscription (service role preferred; this is a fallback)
CREATE POLICY "subscriptions_admin_update"
  ON public.subscriptions
  FOR UPDATE
  USING (public.is_admin());

-- Note: No INSERT policy for authenticated users.
-- New subscriptions are created automatically by the handle_new_profile()
-- trigger (SECURITY DEFINER, bypasses RLS) and by the webhook (service role).
-- Clients cannot create or modify subscriptions directly.

-- ── billing_records ───────────────────────────────────────────────────────────

-- Users read their own billing records
CREATE POLICY "billing_records_read_own"
  ON public.billing_records
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins read all billing records
CREATE POLICY "billing_records_admin_read"
  ON public.billing_records
  FOR SELECT
  USING (public.is_admin());

-- Note: No INSERT or UPDATE policy for authenticated users.
-- billing_records rows are created exclusively by the payment webhook handler
-- using the service role key. Clients CANNOT mark payments as paid.

-- ── subscription_addons ────────────────────────────────────────────────────────

-- Users read their own add-ons
CREATE POLICY "subscription_addons_read_own"
  ON public.subscription_addons
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins read all add-ons
CREATE POLICY "subscription_addons_admin_read"
  ON public.subscription_addons
  FOR SELECT
  USING (public.is_admin());

-- Users may INSERT a pending add-on (status must be 'pending', enforced by CHECK below)
-- This lets the checkout flow create a pending record; the webhook activates it.
CREATE POLICY "subscription_addons_insert_pending"
  ON public.subscription_addons
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
  );

-- Note: No UPDATE policy for authenticated users.
-- Add-on status transitions (pending → paid, etc.) happen only via webhook/service role.

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP POLICY IF EXISTS "subscription_addons_insert_pending"  ON public.subscription_addons;
-- DROP POLICY IF EXISTS "subscription_addons_admin_read"      ON public.subscription_addons;
-- DROP POLICY IF EXISTS "subscription_addons_read_own"        ON public.subscription_addons;
-- DROP POLICY IF EXISTS "billing_records_admin_read"          ON public.billing_records;
-- DROP POLICY IF EXISTS "billing_records_read_own"            ON public.billing_records;
-- DROP POLICY IF EXISTS "subscriptions_admin_update"          ON public.subscriptions;
-- DROP POLICY IF EXISTS "subscriptions_admin_read"            ON public.subscriptions;
-- DROP POLICY IF EXISTS "subscriptions_read_own"              ON public.subscriptions;
-- =============================================================================
