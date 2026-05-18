-- =============================================================================
-- Migration 010 — RLS Policies (Phase B: Listings)
-- Maqar Phase B · Step B5
-- Run AFTER 009_listing_documents.
-- =============================================================================
-- Covers:
--   · listings           (public read active, owner write, admin via service role)
--   · listing_images     (public read when listing active, owner write)
--   · listing_documents  (private: owner read/write only)
--   · storage.objects    (listing-images, documents, avatars buckets)
--
-- Security model:
--   · anon key + RLS  = public browsing (no auth)
--   · anon key + auth = owner operations (insert own listings, manage images)
--   · service role key = admin bypass (all admin routes, webhooks, AI logging)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- LISTINGS
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Public can browse only active + approved listings
CREATE POLICY "listings_public_active_select"
  ON public.listings
  FOR SELECT
  USING (
    status = 'active'
    AND review_status = 'approved'
  );

-- 2. Owners can read ALL their own listings (any status)
--    Allows agents to see their pending/draft/rejected listings in dashboard
CREATE POLICY "listings_owner_select_own"
  ON public.listings
  FOR SELECT
  USING (auth.uid() = owner_id);

-- 3. Owners can INSERT new listings
--    status MUST be 'pending_review' (cannot self-publish)
--    review_status MUST be 'pending' (cannot self-approve)
CREATE POLICY "listings_owner_insert"
  ON public.listings
  FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND status = 'pending_review'
    AND review_status = 'pending'
    -- Admin-controlled flags must be false on create
    AND is_verified = false
    AND is_featured = false
    AND suspicious_price_flag = false
    AND is_below_market = false
  );

-- 4. Owners can UPDATE their own editable listings
--    USING: only if listing is in an owner-editable state
--    WITH CHECK: they cannot self-approve or set admin flags
CREATE POLICY "listings_owner_update"
  ON public.listings
  FOR UPDATE
  USING (
    auth.uid() = owner_id
    AND status IN ('draft', 'pending_review', 'needs_changes', 'rejected')
  )
  WITH CHECK (
    auth.uid() = owner_id
    -- Owner can only set their listing to these statuses (not 'active')
    AND status IN ('draft', 'pending_review')
    -- Admin-controlled flags cannot be set by owner
    AND is_verified = false
    AND is_featured = false
    AND review_status IN ('pending', 'needs_changes')
  );

-- 5. Owners can soft-delete (set status=draft or let admin handle)
--    No hard DELETE from client — only via admin service role
--    (Uncomment below if you want owner deletion; keep commented for audit trail)
-- CREATE POLICY "listings_owner_delete"
--   ON public.listings
--   FOR DELETE
--   USING (
--     auth.uid() = owner_id
--     AND status IN ('draft', 'rejected', 'expired')
--   );

-- Note: Admin full access goes through service role key (bypasses RLS entirely).
-- No explicit admin SELECT/UPDATE/DELETE policy needed here.

-- ─────────────────────────────────────────────────────────────────────────────
-- LISTING IMAGES
-- ─────────────────────────────────────────────────────────────────────────────

-- Public can view images for active/approved listings only
CREATE POLICY "listing_images_public_select"
  ON public.listing_images
  FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM public.listings
      WHERE status = 'active' AND review_status = 'approved'
    )
  );

-- Owners can view images for their own listings (all statuses)
CREATE POLICY "listing_images_owner_select"
  ON public.listing_images
  FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can insert images for their own listings
CREATE POLICY "listing_images_owner_insert"
  ON public.listing_images
  FOR INSERT
  WITH CHECK (
    listing_id IN (
      SELECT id FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can update image metadata (sort_order, is_main) for their own listings
CREATE POLICY "listing_images_owner_update"
  ON public.listing_images
  FOR UPDATE
  USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can delete images from their own listings
CREATE POLICY "listing_images_owner_delete"
  ON public.listing_images
  FOR DELETE
  USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- LISTING DOCUMENTS (private — owner and admin only)
-- ─────────────────────────────────────────────────────────────────────────────

-- Owners can read their own listing documents
CREATE POLICY "listing_documents_owner_select"
  ON public.listing_documents
  FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can upload documents for their own listings
CREATE POLICY "listing_documents_owner_insert"
  ON public.listing_documents
  FOR INSERT
  WITH CHECK (
    listing_id IN (
      SELECT id FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can delete unverified documents (verified docs require admin)
CREATE POLICY "listing_documents_owner_delete"
  ON public.listing_documents
  FOR DELETE
  USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE owner_id = auth.uid()
    )
    AND is_verified = false
  );

-- No public SELECT on listing_documents — these are private ownership proofs.
-- Admin access is via service role key (bypasses RLS).

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE: listing-images bucket (public read, owner write)
-- ─────────────────────────────────────────────────────────────────────────────
-- Storage path convention: {listing_id}/{uuid}.{ext}
-- The first folder segment is the listing_id, owned by the authenticated user.

-- Anyone can read public listing images (CDN serves these)
CREATE POLICY "listing_images_storage_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'listing-images');

-- Authenticated users can upload to their own listing's folder
-- Path format: listing-images/{listing_id}/{filename}
-- The listing_id in the path must correspond to a listing they own.
-- Note: This policy uses (storage.foldername(name))[1] to extract listing_id
-- from the path and verify ownership via listings table.
CREATE POLICY "listing_images_storage_owner_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can update (replace) their own uploaded images
CREATE POLICY "listing_images_storage_owner_update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'listing-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can delete their own images
CREATE POLICY "listing_images_storage_owner_delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'listing-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE: documents bucket (private — owner upload, no public read)
-- ─────────────────────────────────────────────────────────────────────────────
-- Path format: listings/{listing_id}/{filename}
-- No public read — signed URLs required for access (generated server-side).

-- Only the owner of a listing can upload its documents
CREATE POLICY "documents_storage_owner_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[2] IN (
      SELECT id::text FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- Owners can read their own documents (used to generate signed URLs)
CREATE POLICY "documents_storage_owner_read"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[2] IN (
      SELECT id::text FROM public.listings WHERE owner_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE: avatars bucket (public read, owner write)
-- ─────────────────────────────────────────────────────────────────────────────
-- Path format: {user_id}/avatar.{ext}

CREATE POLICY "avatars_storage_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_storage_owner_write"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_storage_owner_update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================================================
-- VERIFICATION QUERY — run after migration to confirm policy count
-- =============================================================================
-- SELECT tablename, policyname, cmd
-- FROM pg_policies
-- WHERE schemaname IN ('public', 'storage')
-- AND tablename IN ('listings', 'listing_images', 'listing_documents', 'objects')
-- ORDER BY tablename, policyname;
-- Expected: 5 listings + 5 listing_images + 3 listing_documents + 7 storage = 20 policies
-- =============================================================================

-- =============================================================================
-- ROLLBACK (run in reverse order)
-- =============================================================================
-- DROP POLICY IF EXISTS "avatars_storage_owner_update" ON storage.objects;
-- DROP POLICY IF EXISTS "avatars_storage_owner_write" ON storage.objects;
-- DROP POLICY IF EXISTS "avatars_storage_public_read" ON storage.objects;
-- DROP POLICY IF EXISTS "documents_storage_owner_read" ON storage.objects;
-- DROP POLICY IF EXISTS "documents_storage_owner_insert" ON storage.objects;
-- DROP POLICY IF EXISTS "listing_images_storage_owner_delete" ON storage.objects;
-- DROP POLICY IF EXISTS "listing_images_storage_owner_update" ON storage.objects;
-- DROP POLICY IF EXISTS "listing_images_storage_owner_insert" ON storage.objects;
-- DROP POLICY IF EXISTS "listing_images_storage_public_read" ON storage.objects;
-- DROP POLICY IF EXISTS "listing_documents_owner_delete" ON public.listing_documents;
-- DROP POLICY IF EXISTS "listing_documents_owner_insert" ON public.listing_documents;
-- DROP POLICY IF EXISTS "listing_documents_owner_select" ON public.listing_documents;
-- DROP POLICY IF EXISTS "listing_images_owner_delete" ON public.listing_images;
-- DROP POLICY IF EXISTS "listing_images_owner_update" ON public.listing_images;
-- DROP POLICY IF EXISTS "listing_images_owner_insert" ON public.listing_images;
-- DROP POLICY IF EXISTS "listing_images_owner_select" ON public.listing_images;
-- DROP POLICY IF EXISTS "listing_images_public_select" ON public.listing_images;
-- DROP POLICY IF EXISTS "listings_owner_update" ON public.listings;
-- DROP POLICY IF EXISTS "listings_owner_insert" ON public.listings;
-- DROP POLICY IF EXISTS "listings_owner_select_own" ON public.listings;
-- DROP POLICY IF EXISTS "listings_public_active_select" ON public.listings;
-- =============================================================================
