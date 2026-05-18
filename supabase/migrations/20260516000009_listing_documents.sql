-- =============================================================================
-- Migration 009 — Listing Documents Table
-- Maqar Phase B · Step B3
-- Run AFTER 008_listing_images.
-- =============================================================================
-- Stores metadata for ownership documents attached to a listing.
-- Actual files live in the PRIVATE Supabase Storage bucket 'documents'.
-- Storage path convention: documents/listings/{listing_id}/{uuid}.{ext}
--
-- SECURITY: This table is private — only the listing owner and admins
-- can access it. RLS policies enforce this in 010_rls_phase_b.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.listing_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id        UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,

  -- Document type (mirrors DocumentType in src/types/listing-draft.ts)
  doc_type          public.listing_document_type NOT NULL,

  -- Storage reference (private bucket — requires signed URL for access)
  storage_path      TEXT NOT NULL,   -- path within the 'documents' bucket
  file_name         TEXT NOT NULL,   -- original filename for display
  mime_type         TEXT,
  size_bytes        INTEGER,

  -- For documents that are reference numbers rather than files
  -- (e.g. CR number entered as text, not uploaded)
  reference_number  TEXT,

  -- Verification tracking (set by admin after review)
  is_verified       BOOLEAN NOT NULL DEFAULT false,
  verified_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at       TIMESTAMPTZ,

  uploaded_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_documents ENABLE ROW LEVEL SECURITY;

-- Index: all documents for a listing
CREATE INDEX IF NOT EXISTS listing_documents_listing_idx
  ON public.listing_documents(listing_id);

-- Index: find unverified documents for admin review queue
CREATE INDEX IF NOT EXISTS listing_documents_unverified_idx
  ON public.listing_documents(listing_id, is_verified)
  WHERE is_verified = false;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.listing_documents CASCADE;
-- =============================================================================
