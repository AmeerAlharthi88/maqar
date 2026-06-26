-- =============================================================================
-- Migration: Protect ALL admin-controlled profile fields (FP11)
-- Date: 2026-06-25
-- Severity: CRITICAL
-- Discovered: Full project security audit + reproduced on production (buyer acct)
--
-- Bug:
--   20260525000001_fix_role_escalation added a BEFORE UPDATE trigger that blocks
--   only the `role` column. The profiles_own_update RLS policy
--   (WITH CHECK auth.uid() = id) still let an authenticated user PATCH their own
--   is_verified / account_status / verification_status. Proven on production:
--     update is_verified        → ACCEPTED  (forges the "Verified Agent" badge)
--     update account_status      → ACCEPTED  (a banned/suspended user self-reactivates)
--     update verification_status → ACCEPTED  (forges KYC-approved state)
--   role was already REJECTED by the prior trigger.
--
-- Fix:
--   Replace the role-only guard with a comprehensive BEFORE UPDATE trigger that
--   blocks changes to EVERY admin-controlled column for any non-service-role
--   caller. The service role (server-side admin/KYC actions only — never exposed
--   to the client) bypasses, so legitimate admin assignments keep working.
--   The app's user-side updateProfile() only writes name_ar / preferred_locale /
--   notification_prefs / onboarding_completed, so no legitimate flow is affected.
--
-- Rollback:
--   DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_fields ON public.profiles;
--   DROP FUNCTION IF EXISTS public.protect_profile_sensitive_fields();
-- =============================================================================

-- ── Drop the prior role-only guard and any previous version (idempotent) ─────
DROP TRIGGER  IF EXISTS trg_prevent_role_escalation          ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_role_escalation();
DROP TRIGGER  IF EXISTS trg_protect_profile_sensitive_fields ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_profile_sensitive_fields();

-- ── Comprehensive guard function ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role (server-side admin/KYC operations only) may change anything.
  -- auth.role() reflects the request JWT claim: 'service_role' for the service
  -- key, 'authenticated' for a user JWT, 'anon' for the public key.
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Admin-controlled columns are immutable for every other caller.
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Permission denied: profiles.role is admin-controlled'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    RAISE EXCEPTION 'Permission denied: profiles.is_verified is admin-controlled'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
    RAISE EXCEPTION 'Permission denied: profiles.account_status is admin-controlled'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    RAISE EXCEPTION 'Permission denied: profiles.verification_status is admin-controlled'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

-- ── Attach the trigger ───────────────────────────────────────────────────────
CREATE TRIGGER trg_protect_profile_sensitive_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_fields();

COMMENT ON FUNCTION public.protect_profile_sensitive_fields() IS
  'SECURITY (FP11): blocks non-service-role updates to admin-controlled profile
   columns (role, is_verified, account_status, verification_status). The service
   role bypasses for legitimate server-side admin/KYC actions. Supersedes the
   prior role-only trg_prevent_role_escalation.';
