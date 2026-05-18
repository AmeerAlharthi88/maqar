-- =============================================================================
-- Migration 019 — RLS Phase D (CRM)
-- Run AFTER 018_offers.
-- =============================================================================
-- Security model:
--   · Authenticated users can INSERT their own leads/appointments/offers
--     (user_id = auth.uid() enforced by WITH CHECK).
--   · Users can SELECT their own records (buyer view).
--   · Agents can SELECT records where agent_id = auth.uid() (CRM view).
--   · Agents can UPDATE status on their own CRM records.
--   · Anonymous users have ZERO access to CRM tables.
-- =============================================================================

-- ── leads ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert leads for themselves
CREATE POLICY "leads_insert_own"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users see their own leads (buyer view)
CREATE POLICY "leads_select_as_user"
  ON public.leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Agents see leads on their listings (CRM view)
CREATE POLICY "leads_select_as_agent"
  ON public.leads FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

-- Agents update lead status and notes on their own listings
CREATE POLICY "leads_update_as_agent"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

-- ── appointments ──────────────────────────────────────────────────────────────
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_insert_own"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "appointments_select_as_user"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "appointments_select_as_agent"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "appointments_update_as_agent"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

-- ── offers ────────────────────────────────────────────────────────────────────
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers_insert_own"
  ON public.offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "offers_select_as_user"
  ON public.offers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "offers_select_as_agent"
  ON public.offers FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "offers_update_as_agent"
  ON public.offers FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);
