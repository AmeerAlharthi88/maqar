-- Migration: 20260516000014_rls_phase_c
-- Row Level Security policies for Phase C tables:
--   · favorites
--   · recently_viewed
--   · saved_searches
--
-- Rules:
--   · Authenticated users can only SELECT/INSERT/DELETE their own rows.
--   · saved_searches additionally allows UPDATE (for notification prefs).
--   · Anon users have zero access to all three tables.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── favorites ────────────────────────────────────────────────────────────────
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── recently_viewed ──────────────────────────────────────────────────────────
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recently_viewed_select_own"
  ON public.recently_viewed FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "recently_viewed_insert_own"
  ON public.recently_viewed FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE is needed for upsert (conflict update on viewed_at)
CREATE POLICY "recently_viewed_update_own"
  ON public.recently_viewed FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recently_viewed_delete_own"
  ON public.recently_viewed FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── saved_searches ───────────────────────────────────────────────────────────
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_searches_select_own"
  ON public.saved_searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "saved_searches_insert_own"
  ON public.saved_searches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_searches_update_own"
  ON public.saved_searches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_searches_delete_own"
  ON public.saved_searches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
