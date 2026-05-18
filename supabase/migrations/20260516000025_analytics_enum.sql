-- =============================================================================
-- Migration 025 — analytics_event_type Enum
-- Maqar Phase F · Analytics
-- Run AFTER 024_rls_phase_e.
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'analytics_event_type'
  ) THEN
    CREATE TYPE public.analytics_event_type AS ENUM (
      'view',
      'whatsapp_click',
      'call_click',
      'save',
      'share',
      'appointment_request',
      'offer_submit'
    );
  END IF;
END;
$$;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP TYPE IF EXISTS public.analytics_event_type;
-- =============================================================================
