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

/**
 * Fetch REAL similar listings for the listing detail page (replaces the old mock
 * helper). Same purpose; same property type OR same wilayat; price within a
 * tolerance; excludes the current listing. RLS only exposes active+approved
 * (public) rows, so this never returns mock or non-public listings.
 * Returns [] when none exist — the Similar section then hides itself.
 */
export async function getSimilarListingsServer(
  listing: Listing,
  limit = 6
): Promise<Listing[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createServerClient();
    const tolerance = 0.45;
    const min = Math.round(listing.price * (1 - tolerance));
    const max = Math.round(listing.price * (1 + tolerance));

    const orParts = [`property_type.eq.${listing.propertyType}`];
    if (listing.location.wilayatId) {
      orParts.push(`wilayat_id.eq.${listing.location.wilayatId}`);
    }

    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        listing_images ( url, is_main, sort_order )
      `)
      .eq("status", "active")
      .eq("review_status", "approved")
      .eq("purpose", listing.purpose)
      .neq("id", listing.id)
      .gte("price_omr", min)
      .lte("price_omr", max)
      .or(orParts.join(","))
      .order("created_at", { ascending: false })
      .limit(limit * 3);

    if (error || !data) {
      if (error) console.error("[Listings] getSimilarListingsServer error:", error.message);
      return [];
    }

    const mapped = data.map((row) => dbRowToListing(row as DbListingRow));
    // Rank: same property type (2) + same wilayat (1).
    mapped.sort((a, b) => {
      const score = (l: Listing) =>
        (l.propertyType === listing.propertyType ? 2 : 0) +
        (l.location.wilayatId === listing.location.wilayatId ? 1 : 0);
      return score(b) - score(a);
    });
    return mapped.slice(0, limit);
  } catch (err) {
    console.error("[Listings] getSimilarListingsServer exception:", err);
    return [];
  }
}
