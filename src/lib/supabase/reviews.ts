// ── Reviews Supabase Service — Phase E ───────────────────────────────────────
// Browser-client functions for reading and writing reviews.
//
// Security model (mirrors RLS):
//   · fetchApprovedReviews  — public (anyone can read approved reviews)
//   · submitReview          — requires authenticated user
//   · fetchPendingReviewsAdmin — requires admin role (gated by RLS is_admin())
//   · updateReviewModeration   — requires admin role
//
// DEV_SKIP_AUTH: all functions return [] / null immediately so pages fall back
// to mock data.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

// ── DB row shapes ──────────────────────────────────────────────────────────────

interface DbReviewRow {
  id: string;
  author_id: string;
  target_id: string;
  target_type: "agent" | "agency";
  rating: number;
  body: string | null;
  moderation_status: "pending" | "approved" | "rejected" | "hidden";
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
}

// ── Public types (camelCase) ───────────────────────────────────────────────────

export interface ReviewItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  targetId: string;
  targetType: "agent" | "agency";
  rating: number;
  body: string | null;
  moderationStatus: "pending" | "approved" | "rejected" | "hidden";
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchApprovedReviews
// Returns approved reviews for a given agent or agency profile.
// Used by: /agents/[id]/page.tsx, /agencies/[id]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchApprovedReviews(
  targetId: string,
  targetType: "agent" | "agency",
  limit = 20
): Promise<ReviewItem[]> {
  if (DEV_SKIP_AUTH) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, author_id, target_id, target_type, rating, body,
      moderation_status, created_at, updated_at,
      profiles ( full_name, avatar_url )
    `)
    .eq("target_id", targetId)
    .eq("target_type", targetType)
    .eq("moderation_status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Reviews] fetchApprovedReviews error:", error);
    return [];
  }

  return (data ?? []).map((r) => rowToReviewItem(r as unknown as DbReviewRow));
}

// ─────────────────────────────────────────────────────────────────────────────
// submitReview
// Inserts a new review. Requires authenticated user (RLS enforced).
// On conflict (same author + target) — returns the existing id without error.
// ─────────────────────────────────────────────────────────────────────────────
export interface SubmitReviewPayload {
  targetId: string;
  targetType: "agent" | "agency";
  rating: number;
  body?: string;
}

export async function submitReview(
  authorId: string,
  payload: SubmitReviewPayload
): Promise<{ id: string } | null> {
  if (DEV_SKIP_AUTH) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      author_id: authorId,
      target_id: payload.targetId,
      target_type: payload.targetType,
      rating: payload.rating,
      body: payload.body ?? null,
      // moderation_status defaults to 'pending' per DB schema
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Reviews] submitReview error:", error);
    return null;
  }
  return { id: data.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchPendingReviewsAdmin
// Returns all reviews ordered by created_at desc. Admin-only (RLS).
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchPendingReviewsAdmin(): Promise<ReviewItem[]> {
  if (DEV_SKIP_AUTH) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, author_id, target_id, target_type, rating, body,
      moderation_status, created_at, updated_at,
      profiles ( full_name, avatar_url )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Reviews] fetchPendingReviewsAdmin error:", error);
    // Throw so the admin page can show a real error state instead of silently
    // falling back to mock reviews (which would hide a real read failure).
    throw new Error("admin_reviews_fetch_failed");
  }

  return (data ?? []).map((r) => rowToReviewItem(r as unknown as DbReviewRow));
}

// ─────────────────────────────────────────────────────────────────────────────
// updateReviewModeration
// Admin sets moderation_status on a review. RLS enforced.
// ─────────────────────────────────────────────────────────────────────────────
export async function updateReviewModeration(
  reviewId: string,
  status: "approved" | "rejected" | "hidden"
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ moderation_status: status })
    .eq("id", reviewId);

  if (error) {
    console.error("[Reviews] updateReviewModeration error:", error);
  }
}

// ── Row mapper ────────────────────────────────────────────────────────────────
function rowToReviewItem(row: DbReviewRow): ReviewItem {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.profiles?.full_name ?? "مستخدم",
    authorAvatarUrl: row.profiles?.avatar_url ?? null,
    targetId: row.target_id,
    targetType: row.target_type,
    rating: row.rating,
    body: row.body,
    moderationStatus: row.moderation_status,
    createdAt: row.created_at,
  };
}
