// ── Server-only Listings Functions ────────────────────────────────────────────
// IMPORTANT: This file is server-only. Never import it from a "use client"
// component or client-side store. It uses next/headers via @/lib/supabase/server.
//
// Intended for: Server Components, Route Handlers.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { dbRowToListing, type DbListingRow } from "@/lib/supabase/listings";
import type { Listing, ListingOwnerContact } from "@/types/listing";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
/**
 * Public-safe seller contact for a listing's owner, for the listing-detail page.
 *
 * Why service role: the `profiles` table RLS (correctly) blocks anonymous reads
 * of individual (non-agent) sellers. But a published listing's owner is meant to
 * be reachable by buyers — that is the whole point of a marketplace listing. So
 * this reads ONLY the public contact/display fields (name, phone, whatsapp,
 * avatar, verified flag, license) — never email, role, status or any private
 * profile data — and is called only from the server listing-detail page.
 *
 * Replaces the old MOCK_AGENTS fallback that showed a fabricated agent + fake
 * phone on every real listing (FP17C-1). Returns null when the owner cannot be
 * resolved, so the UI shows a safe "unavailable" state instead of fake data.
 */
export async function getListingOwnerContact(
  ownerId: string | null | undefined
): Promise<ListingOwnerContact | null> {
  if (!ownerId || !UUID_RE.test(ownerId) || !isSupabaseConfigured()) return null;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name_ar, phone, whatsapp, avatar_url, is_verified, license_number")
      .eq("id", ownerId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id as string,
      nameAr: (data.name_ar as string) ?? "",
      phone: (data.phone as string | null) ?? null,
      // Owners often have no separate WhatsApp number — fall back to phone.
      whatsapp: (data.whatsapp as string | null) ?? (data.phone as string | null) ?? null,
      avatarUrl: (data.avatar_url as string | null) ?? null,
      isVerified: Boolean(data.is_verified),
      licenseNumber: (data.license_number as string | null) ?? null,
    };
  } catch (err) {
    console.error("[Listings] getListingOwnerContact exception:", err);
    return null;
  }
}

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
 * Fetch REAL public listings (active + approved) for the home page sections.
 * RLS only exposes active+approved rows to anon, so this never returns mock or
 * non-public listings. Returns [] when none exist or Supabase is unconfigured —
 * the home sections then hide themselves (clean empty state). Never falls back
 * to mock (FP12 #1).
 */
export async function getPublicListingsServer(limit = 30): Promise<Listing[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        listing_images ( url, is_main, sort_order )
      `)
      .eq("status", "active")
      .eq("review_status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      if (error) console.error("[Listings] getPublicListingsServer error:", error.message);
      return [];
    }
    return data.map((row) => dbRowToListing(row as DbListingRow));
  } catch (err) {
    console.error("[Listings] getPublicListingsServer exception:", err);
    return [];
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
