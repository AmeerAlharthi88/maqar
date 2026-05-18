-- ── Phase E: Reviews table ───────────────────────────────────────────────────
-- Depends on: 020 (review_target_type, review_moderation_status enums)
--             003 (profiles)  004 (agencies)

CREATE TABLE public.reviews (
  id              uuid                      PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who wrote the review
  author_id       uuid                      NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- What is being reviewed
  target_id       uuid                      NOT NULL,  -- agent profile uuid OR agency uuid
  target_type     review_target_type        NOT NULL,

  -- Content
  rating          smallint                  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body            text,                               -- optional free-text

  -- Moderation
  moderation_status review_moderation_status NOT NULL DEFAULT 'pending',

  -- Timestamps
  created_at      timestamptz               NOT NULL DEFAULT now(),
  updated_at      timestamptz               NOT NULL DEFAULT now(),

  -- One review per user per target
  UNIQUE (author_id, target_id)
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
-- Fast lookup for approved reviews on a given target
CREATE INDEX idx_reviews_target ON public.reviews (target_id, target_type)
  WHERE moderation_status = 'approved';

-- Admin queue: pending reviews newest-first
CREATE INDEX idx_reviews_moderation ON public.reviews (moderation_status, created_at DESC);

-- ── updated_at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_reviews_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_reviews_updated_at();
