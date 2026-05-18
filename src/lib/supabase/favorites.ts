// ── Favorites Supabase Service ────────────────────────────────────────────────
// Browser-client functions for the `favorites` table.
//
// DEV_SKIP_AUTH: when true (no real Supabase auth session), all functions
// return immediately so dev mode keeps local-only behavior.
//
// RLS guarantees that authenticated users only see/write their own rows.
// The caller is responsible for passing the correct userId from auth store.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

/**
 * Fetches all listing IDs that `userId` has favorited.
 * Returns an empty array on error or in dev bypass mode.
 */
export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  if (DEV_SKIP_AUTH) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId);

  if (error) {
    console.error("[favorites] fetchFavoriteIds error:", error.message);
    return [];
  }

  return (data ?? []).map((r: { listing_id: string }) => r.listing_id);
}

/**
 * Inserts a favorite row (upsert — safe to call even if already favorited).
 */
export async function upsertFavorite(
  userId: string,
  listingId: string
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("favorites")
    .upsert(
      { user_id: userId, listing_id: listingId },
      { onConflict: "user_id,listing_id" }
    );

  if (error) {
    console.error("[favorites] upsertFavorite error:", error.message);
  }
}

/**
 * Removes a favorite row for the given user + listing pair.
 */
export async function deleteFavorite(
  userId: string,
  listingId: string
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);

  if (error) {
    console.error("[favorites] deleteFavorite error:", error.message);
  }
}
