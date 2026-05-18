-- ── Phase E: Reviews + KYC — Enums ──────────────────────────────────────────

-- Review target: who is being reviewed
CREATE TYPE review_target_type AS ENUM (
  'agent',
  'agency'
);

-- Review moderation lifecycle
CREATE TYPE review_moderation_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'hidden'
);

-- KYC: who is the subject of the application
CREATE TYPE kyc_entity_type AS ENUM (
  'individual',  -- solo agent
  'agency'       -- agency account
);

-- KYC document types (what the user uploads)
CREATE TYPE kyc_document_type AS ENUM (
  'civil_id_front',
  'civil_id_back',
  'cr_number',         -- Commercial Registration
  'agency_license',
  'agent_card',
  'selfie'
);
