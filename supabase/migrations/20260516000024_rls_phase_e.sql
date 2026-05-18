-- ── Phase E: RLS Policies — Reviews + KYC ────────────────────────────────────

-- ── Helper: is_admin() ────────────────────────────────────────────────────────
-- Returns true when the calling user has admin or super_admin role.
-- Used in RLS policies to gate admin-only reads/writes without exposing the
-- service role key to client components.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- REVIEWS
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public: read approved reviews only
CREATE POLICY "reviews_read_approved"
  ON public.reviews FOR SELECT
  USING (moderation_status = 'approved');

-- Admin: read all reviews (for moderation queue)
CREATE POLICY "reviews_admin_read_all"
  ON public.reviews FOR SELECT
  USING (public.is_admin());

-- Authenticated: submit a review (one per target, enforced by UNIQUE constraint)
CREATE POLICY "reviews_insert_authenticated"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

-- Admin: update moderation status
CREATE POLICY "reviews_admin_update"
  ON public.reviews FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Authors can delete their own review
CREATE POLICY "reviews_delete_own"
  ON public.reviews FOR DELETE
  USING (auth.uid() = author_id);

-- ────────────────────────────────────────────────────────────────────────────
-- KYC APPLICATIONS
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.kyc_applications ENABLE ROW LEVEL SECURITY;

-- User: read own application only
CREATE POLICY "kyc_apps_read_own"
  ON public.kyc_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Admin: read all applications
CREATE POLICY "kyc_apps_admin_read"
  ON public.kyc_applications FOR SELECT
  USING (public.is_admin());

-- User: insert own application (enforced by UNIQUE on user_id)
CREATE POLICY "kyc_apps_insert_own"
  ON public.kyc_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User: update own application (draft/submitted only — cannot self-approve)
CREATE POLICY "kyc_apps_update_own"
  ON public.kyc_applications FOR UPDATE
  USING (auth.uid() = user_id AND status IN ('draft', 'submitted', 'needs_more_info'))
  WITH CHECK (
    auth.uid() = user_id
    -- Users may only transition to draft or submitted; admin controls approved/rejected
    AND NEW.status IN ('draft', 'submitted')
  );

-- Admin: update any application (approve / reject / needs_more_info)
CREATE POLICY "kyc_apps_admin_update"
  ON public.kyc_applications FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- KYC DOCUMENTS
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- User: read own documents only
CREATE POLICY "kyc_docs_read_own"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

-- Admin: read all documents
CREATE POLICY "kyc_docs_admin_read"
  ON public.kyc_documents FOR SELECT
  USING (public.is_admin());

-- User: insert own documents
CREATE POLICY "kyc_docs_insert_own"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User: replace (delete + re-insert) own documents
CREATE POLICY "kyc_docs_delete_own"
  ON public.kyc_documents FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- STORAGE: documents bucket — KYC path policies
-- ────────────────────────────────────────────────────────────────────────────
-- The 'documents' bucket was created as PRIVATE in migration 009.
-- These policies allow authenticated users to upload to their own KYC folder
-- and prevent any public access to KYC files.

-- Allow authenticated user to upload to their own KYC path
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'kyc_upload_own',
  'documents',
  'INSERT',
  $policy$
    auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'kyc'
    AND (storage.foldername(name))[2] = auth.uid()::text
  $policy$
)
ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Allow authenticated user to read their own KYC files (for upload preview)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'kyc_read_own',
  'documents',
  'SELECT',
  $policy$
    auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'kyc'
    AND (storage.foldername(name))[2] = auth.uid()::text
  $policy$
)
ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Allow admin to read any KYC file (for review)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'kyc_admin_read',
  'documents',
  'SELECT',
  $policy$
    public.is_admin()
    AND (storage.foldername(name))[1] = 'kyc'
  $policy$
)
ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Allow user to replace (update) their own KYC files
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'kyc_update_own',
  'documents',
  'UPDATE',
  $policy$
    auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'kyc'
    AND (storage.foldername(name))[2] = auth.uid()::text
  $policy$
)
ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Allow user to delete their own KYC files (re-upload flow)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'kyc_delete_own',
  'documents',
  'DELETE',
  $policy$
    auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'kyc'
    AND (storage.foldername(name))[2] = auth.uid()::text
  $policy$
)
ON CONFLICT (name, bucket_id, operation) DO NOTHING;
