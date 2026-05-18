-- =============================================================================
-- Migration 005 — RLS Policies (Phase A tables only)
-- Maqar Phase A · Step A5 (partial)
-- Run AFTER 004_agencies.
-- =============================================================================
-- Covers: profiles, agencies, agency_members
-- Pattern:
--   · Public read where appropriate (profiles, agencies are browseable)
--   · Own-record write (users manage their own data only)
--   · Agency owner manages their agency and members
--   · Admin access goes through the service role key (bypasses RLS entirely)
--     — no separate admin policy needed for Phase A
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────────────────────────

-- All profiles are publicly readable (agent/agency profiles need to be
-- browseable by unauthenticated visitors on /agents, /agencies pages).
CREATE POLICY "profiles_public_select"
  ON public.profiles
  FOR SELECT
  USING (true);

-- A user can only INSERT their own profile row.
-- In practice this is also enforced by the handle_new_user() trigger,
-- but having an explicit policy prevents any direct-insert abuse.
CREATE POLICY "profiles_own_insert"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- A user can only UPDATE their own profile.
-- Critical fields like role, is_verified, account_status must NEVER be
-- updated by the user — enforce this at the application layer (server actions
-- using the service role key for those fields, not the anon key).
CREATE POLICY "profiles_own_update"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles are never deleted via client — only via CASCADE from auth.users deletion.
-- No DELETE policy: default DENY.

-- ─────────────────────────────────────────────────────────────────────────────
-- AGENCIES
-- ─────────────────────────────────────────────────────────────────────────────

-- All agencies are publicly readable (browseable directory).
CREATE POLICY "agencies_public_select"
  ON public.agencies
  FOR SELECT
  USING (true);

-- Only authenticated users can create an agency (and they become the owner).
CREATE POLICY "agencies_auth_insert"
  ON public.agencies
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Only the agency owner can update their agency record.
CREATE POLICY "agencies_owner_update"
  ON public.agencies
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Only the agency owner can delete their agency.
-- Note: listings owned by the agency are NOT deleted (ON DELETE RESTRICT on owner_id).
-- The owner must resolve listings before deleting the agency.
CREATE POLICY "agencies_owner_delete"
  ON public.agencies
  FOR DELETE
  USING (auth.uid() = owner_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- AGENCY_MEMBERS
-- ─────────────────────────────────────────────────────────────────────────────

-- Agency owners can see all members of their agency.
-- Members can see the agency roster they belong to.
CREATE POLICY "agency_members_select"
  ON public.agency_members
  FOR SELECT
  USING (
    -- Agency owner can see all members
    agency_id IN (
      SELECT id FROM public.agencies WHERE owner_id = auth.uid()
    )
    OR
    -- A member can see their own membership record
    profile_id = auth.uid()
  );

-- Only the agency owner can add members.
CREATE POLICY "agency_members_owner_insert"
  ON public.agency_members
  FOR INSERT
  WITH CHECK (
    agency_id IN (
      SELECT id FROM public.agencies WHERE owner_id = auth.uid()
    )
  );

-- Only the agency owner can update member roles.
CREATE POLICY "agency_members_owner_update"
  ON public.agency_members
  FOR UPDATE
  USING (
    agency_id IN (
      SELECT id FROM public.agencies WHERE owner_id = auth.uid()
    )
  );

-- Agency owner can remove members. Members can remove themselves.
CREATE POLICY "agency_members_remove"
  ON public.agency_members
  FOR DELETE
  USING (
    agency_id IN (
      SELECT id FROM public.agencies WHERE owner_id = auth.uid()
    )
    OR profile_id = auth.uid()
  );

-- =============================================================================
-- VERIFICATION NOTE
-- After running this migration, verify RLS is active with:
--
--   SELECT tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--   AND tablename IN ('profiles', 'agencies', 'agency_members');
--
-- All three should show rowsecurity = true.
--
-- Test anon access (should return rows, but only public-readable data):
--   SELECT id, name_ar, role FROM profiles LIMIT 5;
--
-- Test own-write (use anon key in app — should only affect own rows).
-- =============================================================================

-- =============================================================================
-- ROLLBACK (run in this order to undo)
-- =============================================================================
-- DROP POLICY IF EXISTS "agency_members_remove" ON public.agency_members;
-- DROP POLICY IF EXISTS "agency_members_owner_update" ON public.agency_members;
-- DROP POLICY IF EXISTS "agency_members_owner_insert" ON public.agency_members;
-- DROP POLICY IF EXISTS "agency_members_select" ON public.agency_members;
-- DROP POLICY IF EXISTS "agencies_owner_delete" ON public.agencies;
-- DROP POLICY IF EXISTS "agencies_owner_update" ON public.agencies;
-- DROP POLICY IF EXISTS "agencies_auth_insert" ON public.agencies;
-- DROP POLICY IF EXISTS "agencies_public_select" ON public.agencies;
-- DROP POLICY IF EXISTS "profiles_own_update" ON public.profiles;
-- DROP POLICY IF EXISTS "profiles_own_insert" ON public.profiles;
-- DROP POLICY IF EXISTS "profiles_public_select" ON public.profiles;
-- =============================================================================
