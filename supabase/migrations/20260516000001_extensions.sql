-- =============================================================================
-- Migration 001 — Extensions
-- Maqar Phase A · Step A2
-- Run this FIRST before any other migration.
-- =============================================================================
-- Safe to run multiple times (IF NOT EXISTS / CREATE EXTENSION IF NOT EXISTS).
-- =============================================================================

-- PostGIS: required for GEOGRAPHY columns (listing coordinates, radius search)
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- pg_trgm: required for fuzzy Arabic text search (similarity matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- uuid-ossp: fallback UUID generation (Supabase usually has gen_random_uuid()
-- built in via pgcrypto, but this ensures compatibility)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- =============================================================================
-- ROLLBACK (run to undo — only if no tables depend on these extensions yet)
-- =============================================================================
-- DROP EXTENSION IF EXISTS postgis CASCADE;
-- DROP EXTENSION IF EXISTS pg_trgm;
-- DROP EXTENSION IF EXISTS "uuid-ossp";
-- =============================================================================
