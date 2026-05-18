"use server";

// ── Dev bypass listing action ─────────────────────────────────────────────────
// Uses the service role key (bypasses RLS + auth) so Phase B can be tested
// without a working Supabase auth connection.
//
// ONLY runs when NODE_ENV === 'development'.
// NEVER import this in production code paths.
// ─────────────────────────────────────────────────────────────────────────────

import { createServiceClient } from "@/lib/supabase/service";
import { draftToInsertRow } from "@/lib/supabase/listings";
import type { ListingDraft } from "@/types/listing-draft";

export async function createListingDevAction(
  draft: ListingDraft,
  userId: string
): Promise<{ listingId: string | null; error: string | null }> {
  // Hard guard — this action must never run in production
  if (process.env.NODE_ENV !== "development") {
    return { listingId: null, error: "Dev bypass not available in production" };
  }

  try {
    const supabase = createServiceClient();
    const insertRow = draftToInsertRow(draft, userId);

    const { data, error } = await supabase
      .from("listings")
      .insert(insertRow)
      .select("id")
      .single();

    if (error) {
      console.error("[DevAction] createListingDevAction error:", error.message);
      return { listingId: null, error: error.message };
    }

    console.log("[DevAction] Listing created:", data.id);
    return { listingId: data.id, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    console.error("[DevAction] createListingDevAction exception:", msg);
    return { listingId: null, error: msg };
  }
}
