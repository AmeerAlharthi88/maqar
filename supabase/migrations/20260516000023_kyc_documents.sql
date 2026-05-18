-- ── Phase E: KYC Documents table ─────────────────────────────────────────────
-- Depends on: 022 (kyc_applications)
--             020 (kyc_document_type enum)

CREATE TABLE public.kyc_documents (
  id              uuid                  PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parent application
  application_id  uuid                  NOT NULL REFERENCES public.kyc_applications(id) ON DELETE CASCADE,

  -- Owning user (denormalised for easy RLS)
  user_id         uuid                  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Document classification
  document_type   kyc_document_type     NOT NULL,

  -- Storage reference — full path inside the private 'documents' bucket
  -- Convention: documents/kyc/{user_id}/{document_type}-{timestamp}.{ext}
  storage_path    text                  NOT NULL,

  -- Original file metadata (for display / validation)
  file_name       text                  NOT NULL,
  file_size_bytes bigint,
  mime_type       text,

  -- One document per type per application (re-upload overwrites)
  UNIQUE (application_id, document_type),

  -- Timestamps
  created_at      timestamptz           NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
-- Fast lookup of all documents for an application
CREATE INDEX idx_kyc_docs_application ON public.kyc_documents (application_id);

-- Lookup by user (used in RLS)
CREATE INDEX idx_kyc_docs_user ON public.kyc_documents (user_id);
