-- =============================================================================
-- Migration 038 — audit_logs Table + Indexes
-- Maqar Phase I · Immutable Admin Audit Trail
-- Run AFTER 037_duplicate_alerts.
-- =============================================================================
-- Security model:
--   · SELECT: admin/service-role only.
--   · INSERT: service-role only (via admin API routes — never from client).
--   · UPDATE/DELETE: nobody (immutable log).
-- audit_logs is append-only. No RLS UPDATE/DELETE policies are created.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who performed the action (nullable for system/automated events)
  actor_id     UUID                    REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- What kind of action
  category     public.audit_category   NOT NULL,
  action       TEXT                    NOT NULL,  -- e.g. "approve_listing", "reject_kyc"

  -- What was acted on
  target_type  TEXT,                              -- e.g. "listing", "kyc_application"
  target_id    UUID,

  -- Structured details (status changes, notes, old/new values, etc.)
  details      JSONB                   NOT NULL DEFAULT '{}',

  -- Network context (stored for security audit; no PII beyond IP)
  ip_address   TEXT,

  -- Severity for filtering in audit log UI
  severity     public.risk_level       NOT NULL DEFAULT 'low',

  -- Immutable timestamp
  created_at   TIMESTAMPTZ             NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- NOTE: No updated_at trigger — audit_logs are immutable (append-only).

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Category filter (admin UI filter)
CREATE INDEX IF NOT EXISTS idx_audit_logs_category
  ON public.audit_logs(category);

-- Actor lookup (find all actions by a specific admin)
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id
  ON public.audit_logs(actor_id)
  WHERE actor_id IS NOT NULL;

-- Target lookup (find all audit events for a specific entity)
CREATE INDEX IF NOT EXISTS idx_audit_logs_target
  ON public.audit_logs(target_type, target_id)
  WHERE target_id IS NOT NULL;

-- Severity filter
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity
  ON public.audit_logs(severity);

-- Time-ordered for audit log UI (primary access pattern)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON public.audit_logs(created_at DESC);

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TABLE IF EXISTS public.audit_logs CASCADE;
-- =============================================================================
