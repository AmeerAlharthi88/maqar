-- =============================================================================
-- Migration 042 — Create avatars Storage Bucket
-- Maqar Phase J · Avatar Upload
-- Run AFTER 010_rls_phase_b (which defines the storage RLS policies).
-- =============================================================================
-- The RLS policies for storage.objects were created in Phase B (migration 010).
-- This migration creates the bucket itself if it does not already exist.
-- The bucket is public so avatar URLs can be read without authentication.
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,                        -- public bucket: GET requests need no auth
  5242880,                     -- 5 MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- VERIFICATION
-- SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'avatars';
-- =============================================================================
