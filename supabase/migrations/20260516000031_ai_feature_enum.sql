-- =============================================================================
-- Migration 031 — ai_feature Enum
-- Maqar Phase H · AI Usage Tracking
-- Run AFTER 030_rls_phase_g.
-- =============================================================================
-- Note: enum values use underscores (DB convention).
-- TypeScript AIFeature type uses hyphens ("generate-description").
-- The service layer maps between the two with feature.replace(/-/g, '_').
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE public.ai_feature AS ENUM (
    'generate_description',
    'valuation',
    'assistant',
    'roi_explanation',
    'market_summary',
    'duplicate_risk',
    'listing_quality',
    'smart_reply'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- ROLLBACK (only if ai_usage_logs table does not yet exist)
-- =============================================================================
-- DROP TYPE IF EXISTS public.ai_feature;
-- =============================================================================
