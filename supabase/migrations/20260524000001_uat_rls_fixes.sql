-- =============================================================================
-- Migration: UAT RLS Fixes — Private Beta Phase
-- Applied: 2026-05-24
-- Branch: beta/uat-fixes
-- Fixes two HIGH-severity RLS bugs discovered during Private Beta UAT.
-- =============================================================================

-- ── FIX 1 (HIGH — A3): profiles_public_select exposed ALL profiles to anon ──
-- The original policy used qual = true, leaking admin/user phone numbers & roles.
-- Replace with:
--   a) profiles_own_select   — authenticated users see only their own row
--   b) profiles_agents_public_select — anyone can see agent/agency_admin rows
--      (required for /agents and /agencies public directory pages)

DROP POLICY IF EXISTS profiles_public_select          ON public.profiles;
DROP POLICY IF EXISTS profiles_own_select             ON public.profiles;
DROP POLICY IF EXISTS profiles_agents_public_select   ON public.profiles;

CREATE POLICY "profiles_own_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_agents_public_select"
  ON public.profiles FOR SELECT
  USING (role IN ('agent'::app_role, 'agency_admin'::app_role));

-- ── FIX 2 (HIGH — C2): listings_owner_insert blocked draft saves ─────────────
-- The original WITH CHECK forced status = 'pending_review', making it impossible
-- for agents to save draft listings via the 10-step add-listing wizard.
-- Fix: allow status IN ('draft', 'pending_review') while keeping all other guards.

DROP POLICY IF EXISTS listings_owner_insert ON public.listings;

CREATE POLICY "listings_owner_insert"
  ON public.listings FOR INSERT
  WITH CHECK (
    (auth.uid() = owner_id)
    AND (status IN ('draft'::listing_status, 'pending_review'::listing_status))
    AND (review_status = 'pending'::listing_review_status)
    AND (is_verified        = false)
    AND (is_featured        = false)
    AND (suspicious_price_flag = false)
    AND (is_below_market    = false)
  );

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- To revert Fix 1:
--   DROP POLICY IF EXISTS profiles_own_select ON public.profiles;
--   DROP POLICY IF EXISTS profiles_agents_public_select ON public.profiles;
--   CREATE POLICY "profiles_public_select" ON public.profiles FOR SELECT USING (true);
--
-- To revert Fix 2:
--   DROP POLICY IF EXISTS listings_owner_insert ON public.listings;
--   CREATE POLICY "listings_owner_insert" ON public.listings FOR INSERT
--     WITH CHECK (
--       (auth.uid() = owner_id)
--       AND (status = 'pending_review'::listing_status)
--       AND (review_status = 'pending'::listing_review_status)
--       AND (is_verified = false) AND (is_featured = false)
--       AND (suspicious_price_flag = false) AND (is_below_market = false)
--     );
-- =============================================================================
