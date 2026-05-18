-- =============================================================================
-- Migration 032 — ai_usage_logs Table + Indexes
-- Maqar Phase H · AI Usage Tracking
-- Run AFTER 031_ai_feature_enum.
-- =============================================================================
-- Creates:
--   · public.ai_usage_logs    one row per AI feature invocation
--   · 5 indexes for audit, daily-count, and admin queries
-- =============================================================================
-- Security model:
--   · INSERT: service role only (API route handlers via server-side service).
--             Clients cannot write to this table.
--   · SELECT: users read own rows (RLS in migration 033).
--             Admins read all (RLS in migration 033).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Nullable: guest calls have no user_id
  user_id          UUID           REFERENCES public.profiles(id) ON DELETE SET NULL,

  feature          public.ai_feature NOT NULL,

  -- Plan at time of call (denormalised for audit — plan may change later)
  -- Uses Phase G plan_id enum. Nullable for guest calls.
  plan_id          public.plan_id,

  -- Token estimates for cost tracking (not exact — estimated from prompt length)
  input_token_est  INTEGER,
  output_token_est INTEGER,

  success          BOOLEAN        NOT NULL DEFAULT true,
  is_mock_fallback BOOLEAN        NOT NULL DEFAULT false,

  -- Optional: listing_id when the AI call is scoped to a specific listing
  listing_id       UUID           REFERENCES public.listings(id) ON DELETE SET NULL,

  -- Extensible metadata (error codes, session ids, etc.)
  metadata         JSONB          NOT NULL DEFAULT '{}'::jsonb,

  -- Error message — populated only when success = false and not a mock fallback
  -- NEVER store sensitive prompt content or stack traces here.
  error_message    TEXT,

  created_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- ── Indexes ────────────────────────────────────────────────────────────────────

-- Per-user log lookup
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id
  ON public.ai_usage_logs(user_id)
  WHERE user_id IS NOT NULL;

-- Feature distribution analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_feature
  ON public.ai_usage_logs(feature);

-- Success/failure rate queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_success
  ON public.ai_usage_logs(success);

-- Date-range queries (audit, billing periods)
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at
  ON public.ai_usage_logs(created_at DESC);

-- Compound: daily usage check per user+feature (most frequent query pattern)
-- Used by checkUsageLimit() to count today's calls.
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_feature_created
  ON public.ai_usage_logs(user_id, feature, created_at DESC)
  WHERE user_id IS NOT NULL;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.ai_usage_logs CASCADE;
-- =============================================================================
