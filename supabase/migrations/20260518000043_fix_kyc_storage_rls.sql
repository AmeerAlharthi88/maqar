-- =============================================================================
-- Migration 043 — Fix KYC Storage RLS Policies
-- Maqar QA Fix · Phase E Remediation
-- Run AFTER 024_rls_phase_e.
-- =============================================================================
-- Phase E (migration 024) attempted to add KYC storage policies via:
--   INSERT INTO storage.policies (...)
-- This is non-standard. PostgreSQL RLS on storage.objects is the correct
-- approach used by Supabase Storage. This migration adds the proper policies
-- using DO blocks so the statements are idempotent (safe to re-run).
--
-- Storage path convention for KYC docs:
--   bucket: documents
--   path:   kyc/{user_id}/{document_type}-{timestamp}.{ext}
-- =============================================================================

-- ── INSERT (upload own KYC files) ─────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kyc_storage_upload_own'
  ) THEN
    CREATE POLICY "kyc_storage_upload_own"
      ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = 'kyc'
        AND (storage.foldername(name))[2] = auth.uid()::text
      );
  END IF;
END $$;

-- ── SELECT (read own KYC files for preview) ───────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kyc_storage_read_own'
  ) THEN
    CREATE POLICY "kyc_storage_read_own"
      ON storage.objects
      FOR SELECT
      USING (
        bucket_id = 'documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = 'kyc'
        AND (storage.foldername(name))[2] = auth.uid()::text
      );
  END IF;
END $$;

-- ── SELECT (admin reads any KYC file for review) ──────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kyc_storage_admin_read'
  ) THEN
    CREATE POLICY "kyc_storage_admin_read"
      ON storage.objects
      FOR SELECT
      USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1] = 'kyc'
        AND public.is_admin()
      );
  END IF;
END $$;

-- ── UPDATE (replace own KYC file) ─────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kyc_storage_update_own'
  ) THEN
    CREATE POLICY "kyc_storage_update_own"
      ON storage.objects
      FOR UPDATE
      USING (
        bucket_id = 'documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = 'kyc'
        AND (storage.foldername(name))[2] = auth.uid()::text
      );
  END IF;
END $$;

-- ── DELETE (remove own KYC file for re-upload) ────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kyc_storage_delete_own'
  ) THEN
    CREATE POLICY "kyc_storage_delete_own"
      ON storage.objects
      FOR DELETE
      USING (
        bucket_id = 'documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = 'kyc'
        AND (storage.foldername(name))[2] = auth.uid()::text
      );
  END IF;
END $$;

-- =============================================================================
-- VERIFICATION
-- SELECT policyname, cmd FROM pg_policies
-- WHERE schemaname = 'storage' AND tablename = 'objects'
--   AND policyname LIKE 'kyc%'
-- ORDER BY policyname;
-- Expected: 5 rows (kyc_storage_upload_own, read_own, admin_read, update_own, delete_own)
-- =============================================================================

-- =============================================================================
-- ROLLBACK
-- DROP POLICY IF EXISTS "kyc_storage_delete_own"  ON storage.objects;
-- DROP POLICY IF EXISTS "kyc_storage_update_own"  ON storage.objects;
-- DROP POLICY IF EXISTS "kyc_storage_admin_read"  ON storage.objects;
-- DROP POLICY IF EXISTS "kyc_storage_read_own"    ON storage.objects;
-- DROP POLICY IF EXISTS "kyc_storage_upload_own"  ON storage.objects;
-- =============================================================================
