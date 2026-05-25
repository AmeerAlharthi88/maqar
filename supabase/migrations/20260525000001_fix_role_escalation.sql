-- =============================================================================
-- Migration: Fix CRITICAL role self-escalation vulnerability
-- Date: 2026-05-25
-- Severity: CRITICAL
-- Discovered: Private beta auth security check (Step 6A)
--
-- Bug:
--   profiles_own_update policy had WITH CHECK (auth.uid() = id) only.
--   This allowed any authenticated user to PATCH their own profile's `role`
--   column and self-escalate to admin, super_admin, or any other role.
--
-- Fix:
--   Add a BEFORE UPDATE trigger that prevents authenticated users (JWT role
--   = 'authenticated') from changing the `role` column on their own profile.
--   Service role requests (role = 'service_role') bypass this check, allowing
--   legitimate admin role assignments via the backend.
--
-- Rollback:
--   DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
--   DROP FUNCTION IF EXISTS public.prevent_role_escalation();
-- =============================================================================

-- ── Drop existing trigger and function (idempotent) ──────────────────────────
DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_role_escalation();

-- ── Create the guard function ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Block role changes for requests authenticated via JWT (regular users).
  -- auth.role() returns 'authenticated' for user JWTs, 'service_role' for
  -- the service key. The service key is never exposed to the client and is
  -- only used server-side (API routes, admin operations).
  IF auth.role() = 'authenticated' AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Permission denied: you cannot change your own role'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

-- ── Attach the trigger ────────────────────────────────────────────────────────
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- ── Comment ───────────────────────────────────────────────────────────────────
COMMENT ON FUNCTION public.prevent_role_escalation() IS
  'SECURITY: Prevents authenticated users from self-escalating their role.
   Role changes must go through service role (server-side only).';
