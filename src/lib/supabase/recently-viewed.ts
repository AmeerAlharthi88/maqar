// ── Recently Viewed Supabase Service ─────────────────────────────────────────
// Browser-client function for the `recently_viewed` table.
//
// Only one operation is needed from the client:
//   · upsertRecentlyViewed — called on every listing page view.
//     On conflict (same user + listing), updates viewed_at so the row
//     stays at the "most recent" position in the user's history.
//
// DEV_SKIP_AUTH: returns immediately — dev mode stays local-only.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

/**
 * Upserts a recently-viewed row.
 * If the user already has a row for this listing, `viewed_at` is refreshed.
 */
export async function upsertRecentlyViewed(
  userId: string,
  listingId: string
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase.from("recently_viewed").upsert(
    {
      user_id: userId,
      listing_id: listingId,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,listing_id" }
  );

  if (error) {
    console.error("[recently-viewed] upsertRecentlyViewed error:", error.message);
  }
}
