// ── Server-only Listings Functions ────────────────────────────────────────────
// IMPORTANT: This file is server-only. Never import it from a "use client"
// component or client-side store. It uses next/headers via @/lib/supabase/server.
//
// Intended for: Server Components, Route Handlers.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient as createServerClient } from "@/lib/supabase/server";
import { dbRowToListing, type DbListingRow } from "@/lib/supabase/listings";
import type { Listing } from "@/types/listing";

// ── Environment guard ──────────────────────────────────────────────────────────
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
}

/**
 * Fetch a single listing by ID from the database.
 * Called from server components (listing/[id]/page.tsx).
 * Returns null when Supabase is not configured OR listing not found.
 *
 * RLS enforces visibility:
 *   · Active + approved listings are visible to everyone (anon key).
 *   · Owner can see their own listings (any status).
 */
export async function getListingByIdServer(
  id: string
): Promise<Listing | null> {
  if (!isSupabaseConfigured()) {
    return null; // caller falls back to mock
  }

  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        listing_images (
          url,
          is_main,
          sort_order
        )
      `)
      .eq("id", id)
      // RLS handles access control — just request the row
      .single();

    if (error || !data) {
      if (error?.code !== "PGRST116") {
        // PGRST116 = row not found, which is normal (not an error)
        console.error("[Listings] getListingByIdServer error:", error?.message);
      }
      return null;
    }

    return dbRowToListing(data as DbListingRow);
  } catch (err) {
    console.error("[Listings] getListingByIdServer exception:", err);
    return null;
  }
}
