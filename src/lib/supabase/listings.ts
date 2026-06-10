// ── Supabase Listings Service ─────────────────────────────────────────────────
// Provides typed DB operations for the listings table.
//
// Exports two client flavours:
//   · Browser client functions  → import in "use client" components / stores
//   · Server client functions   → import in Server Components / Route Handlers
//
// Mock fallback: when NEXT_PUBLIC_SUPABASE_URL is a placeholder string,
// all functions return null / empty arrays so dev mode still works with mock data.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { ListingDraft } from "@/types/listing-draft";
import type { Listing, ListingStatus, PropertyType, FurnishingStatus, ListingPurpose } from "@/types/listing";
import type { SearchFilters, SortOption } from "@/store/search.store";

// ── Environment guard ──────────────────────────────────────────────────────────
// Returns true when real Supabase credentials are configured.
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
}

// ── DB row type (snake_case, as returned by Supabase) ─────────────────────────
export interface DbListingRow {
  id: string;
  owner_id: string;
  agency_id: string | null;
  title_ar: string;
  title_en: string | null;
  description_ar: string;
  description_en: string | null;
  highlights: string[] | null;
  purpose: string;
  property_type: string;
  status: string;
  review_status: string;
  price_omr: number;
  rent_period: string | null;
  is_negotiable: boolean;
  is_price_hidden: boolean;
  deposit_amount: number | null;
  service_charges: number | null;
  governorate_id: string | null;
  governorate_ar: string | null;
  wilayat_id: string | null;
  wilayat_ar: string | null;
  area_id: string | null;
  area_ar: string | null;
  address_ar: string | null;
  block: string | null;
  street: string | null;
  location_notes: string | null;
  hide_exact_location: boolean;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  land_size_sqm: number | null;
  built_up_area_sqm: number | null;
  floors: number | null;
  parking_spaces: number | null;
  furnishing_status: string | null;
  property_age: string | null;
  availability_date: string | null;
  has_majlis: boolean;
  has_maid_room: boolean;
  has_driver_room: boolean;
  has_outdoor_kitchen: boolean;
  has_indoor_kitchen: boolean;
  has_yard: boolean;
  has_sea_view: boolean;
  has_mountain_view: boolean;
  is_freehold: boolean;
  is_expat_allowed: boolean;
  is_family_only: boolean;
  is_bachelor_allowed: boolean;
  amenities: string[] | null;
  // NOTE: migration 003 columns (floor_number, total_floors, land_use,
  // road_access, water_source, type_fields) are NOT declared here because they
  // do not exist in the production listings table yet. Re-add once the
  // 20260526000003_listing_fields_extended.sql migration is applied in prod.
  cover_image_url: string | null;
  video_link: string | null;
  tour_link: string | null;
  quality_score: number;
  roi_estimate: number | null;
  duplicate_risk_score: number | null;
  suspicious_price_flag: boolean;
  is_below_market: boolean;
  is_verified: boolean;
  is_featured: boolean;
  admin_note: string | null;
  view_count: number;
  favorite_count: number;
  lead_count: number;
  whatsapp_clicks: number;
  call_clicks: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  expires_at: string | null;
  // joined
  listing_images?: Array<{ url: string; is_main: boolean; sort_order: number }>;
}

// ── Mapper: DB row → TypeScript Listing ───────────────────────────────────────
function dbStatusToTs(dbStatus: string): ListingStatus {
  switch (dbStatus) {
    case "pending_review":
    case "needs_changes":
      return "pending";
    default:
      return dbStatus as ListingStatus;
  }
}

function buildAmenities(row: DbListingRow): string[] {
  const base = (row.amenities as string[]) ?? [];
  const extras: string[] = [];
  if (row.has_majlis)         extras.push("مجلس");
  if (row.has_maid_room)      extras.push("غرفة خادمة");
  if (row.has_driver_room)    extras.push("غرفة سائق");
  if (row.has_sea_view)       extras.push("إطلالة بحرية");
  if (row.has_mountain_view)  extras.push("إطلالة جبلية");
  if (row.has_yard)           extras.push("حديقة");
  if ((row.parking_spaces ?? 0) > 0) extras.push("موقف سيارات");
  // Deduplicate
  const combined = [...base, ...extras];
  return [...new Set(combined)];
}

export function dbRowToListing(row: DbListingRow): Listing {
  const sortedImages = [...(row.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const imageUrls = sortedImages.map((i) => i.url);
  const coverUrl =
    row.cover_image_url ??
    sortedImages.find((i) => i.is_main)?.url ??
    imageUrls[0] ??
    "";

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    id: row.id,
    titleAr: row.title_ar,
    titleEn: row.title_en ?? undefined,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en ?? undefined,
    propertyType: row.property_type as PropertyType,
    purpose: row.purpose as ListingPurpose,
    status: dbStatusToTs(row.status),
    price: Number(row.price_omr),
    pricePerSqm:
      row.area_sqm && Number(row.area_sqm) > 0
        ? Math.round(Number(row.price_omr) / Number(row.area_sqm))
        : undefined,
    specs: {
      bedrooms:     row.bedrooms    ?? 0,
      bathrooms:    row.bathrooms   ?? 0,
      area:         Number(row.area_sqm   ?? 0),
      floors:       row.floors      ?? undefined,
      parkingSpots: row.parking_spaces ?? undefined,
    },
    furnishing: (row.furnishing_status as FurnishingStatus) ?? "unfurnished",
    amenities:  buildAmenities(row),
    images:     imageUrls,
    coverImage: coverUrl,
    location: {
      governorateId: row.governorate_id  ?? "",
      governorateAr: row.governorate_ar  ?? "",
      wilayatId:     row.wilayat_id      ?? "",
      wilayatAr:     row.wilayat_ar      ?? "",
      areaId:        row.area_id         ?? "",
      areaAr:        row.area_ar         ?? "",
      addressAr:     row.address_ar      ?? undefined,
      coordinates:
        row.latitude != null && row.longitude != null
          ? { lat: Number(row.latitude), lng: Number(row.longitude) }
          : undefined,
    },
    agentId:        row.owner_id,
    isVerified:     row.is_verified,
    isFeatured:     row.is_featured,
    isNew:          new Date(row.created_at).getTime() > sevenDaysAgo,
    isFreehold:     row.is_freehold,
    isExpatAllowed: row.is_expat_allowed,
    isFamilyOnly:   row.is_family_only,
    qualityScore:  row.quality_score ?? 0,
    roiEstimate:   row.roi_estimate != null ? Number(row.roi_estimate) : undefined,
    viewCount:     row.view_count     ?? 0,
    favoriteCount: row.favorite_count ?? 0,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  };
}

// ── Mapper: ListingDraft → DB insert row ──────────────────────────────────────
export function draftToInsertRow(
  draft: ListingDraft,
  userId: string
): Omit<DbListingRow, "id" | "listing_images"> {
  // DraftPurpose includes 'investment' → stored as 'sale' with ROI context
  const purpose: "sale" | "rent" =
    draft.purpose === "rent" ? "rent" : "sale";

  return {
    owner_id:             userId,
    agency_id:            null,
    title_ar:             draft.titleAr,
    title_en:             null,
    description_ar:       draft.descriptionAr,
    description_en:       null,
    highlights:           draft.highlights.length > 0 ? draft.highlights : null,
    purpose,
    property_type:        draft.propertyType ?? "apartment",
    status:               "pending_review",
    review_status:        "pending",
    price_omr:            draft.price ?? 0,
    // Rent period only applies to rent listings. Sale/investment store null so
    // a stale draft.rentPeriod never produces a "sale with monthly period".
    rent_period:          purpose === "rent" ? (draft.rentPeriod ?? null) : null,
    is_negotiable:        draft.isNegotiable,
    is_price_hidden:      draft.isPriceHidden,
    deposit_amount:       draft.depositAmount ?? null,
    service_charges:      draft.serviceCharges ?? null,
    governorate_id:       draft.governorateId ?? null,
    governorate_ar:       draft.governorateAr || null,
    wilayat_id:           draft.wilayatId ?? null,
    wilayat_ar:           draft.wilayatAr || null,
    area_id:              draft.areaId ?? null,
    area_ar:              draft.areaAr || null,
    address_ar:           null,
    block:                draft.block  || null,
    street:               draft.street || null,
    location_notes:       draft.locationNotes || null,
    hide_exact_location:  draft.hideExactLocation,
    latitude:             draft.mapLat,
    longitude:            draft.mapLng,
    bedrooms:             draft.bedrooms,
    bathrooms:            draft.bathrooms,
    area_sqm:             draft.area,
    land_size_sqm:        draft.landArea,
    built_up_area_sqm:    draft.area,
    floors:               draft.floors,
    parking_spaces:       draft.parkingSpots,
    furnishing_status:    draft.furnishing,
    property_age:         draft.propertyAge,
    availability_date:    draft.availabilityDate,
    has_majlis:           draft.hasMajlis,
    has_maid_room:        draft.hasMaidRoom,
    has_driver_room:      draft.hasDriverRoom,
    has_outdoor_kitchen:  draft.hasOutdoorKitchen,
    has_indoor_kitchen:   draft.hasIndoorKitchen,
    has_yard:             draft.hasYard,
    has_sea_view:         draft.hasSeaView,
    has_mountain_view:    draft.hasMountainView,
    is_freehold:          draft.isFreehold,
    is_expat_allowed:     draft.isExpatAllowed,
    is_family_only:       draft.isFamilyOnly,
    is_bachelor_allowed:  draft.isBachelorAllowed,
    amenities:            draft.amenities,
    // NOTE: Type-specific extended columns (floor_number, total_floors,
    // land_use, road_access, water_source, type_fields) are intentionally NOT
    // inserted. Migration 20260526000003_listing_fields_extended.sql that adds
    // them has NOT been applied to the production database, so sending them
    // fails with "Could not find the 'floor_number' column ... in the schema
    // cache" (UAT-001/035/042). The draft still captures these fields in the UI;
    // re-enable persistence here once that migration is live in production.
    cover_image_url:      null,  // set after image upload
    video_link:           draft.videoLink  || null,
    tour_link:            draft.tourLink   || null,
    quality_score:        0,     // recomputed server-side in Phase H
    roi_estimate:         null,
    duplicate_risk_score: null,
    suspicious_price_flag: false,
    is_below_market:      false,
    is_verified:          false,
    is_featured:          false,
    admin_note:           null,
    view_count:           0,
    favorite_count:       0,
    lead_count:           0,
    whatsapp_clicks:      0,
    call_clicks:          0,
    created_at:           new Date().toISOString(),
    updated_at:           new Date().toISOString(),
    published_at:         null,
    expires_at:           null,
  };
}

// ── Build Supabase query from SearchFilters ────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, filters: SearchFilters): any {
  // Status: only active + approved for public search
  query = query
    .eq("status", "active")
    .eq("review_status", "approved");

  if (filters.purpose !== "all") {
    query = query.eq("purpose", filters.purpose);
  }
  if (filters.propertyTypes.length > 0) {
    query = query.in("property_type", filters.propertyTypes);
  }
  if (filters.governorateId) {
    query = query.eq("governorate_id", filters.governorateId);
  }
  if (filters.wilayatId) {
    query = query.eq("wilayat_id", filters.wilayatId);
  }
  if (filters.areaId) {
    query = query.eq("area_id", filters.areaId);
  }
  if (filters.minPrice !== null) {
    query = query.gte("price_omr", filters.minPrice);
  }
  if (filters.maxPrice !== null) {
    query = query.lte("price_omr", filters.maxPrice);
  }
  if (filters.minBeds > 0) {
    query = query.gte("bedrooms", filters.minBeds);
  }
  if (filters.minBaths > 0) {
    query = query.gte("bathrooms", filters.minBaths);
  }
  if (filters.minArea !== null) {
    query = query.gte("area_sqm", filters.minArea);
  }
  if (filters.maxArea !== null) {
    query = query.lte("area_sqm", filters.maxArea);
  }
  if (filters.furnishing.length > 0) {
    query = query.in("furnishing_status", filters.furnishing);
  }
  if (filters.isVerified !== null) {
    query = query.eq("is_verified", filters.isVerified);
  }
  if (filters.isFreehold !== null) {
    query = query.eq("is_freehold", filters.isFreehold);
  }
  if (filters.hasMajlis) {
    query = query.eq("has_majlis", true);
  }
  if (filters.hasMaidRoom) {
    query = query.eq("has_maid_room", true);
  }
  if (filters.hasDriverRoom) {
    query = query.eq("has_driver_room", true);
  }
  if (filters.hasParking) {
    query = query.gt("parking_spaces", 0);
  }
  if (filters.hasSeaView) {
    query = query.eq("has_sea_view", true);
  }
  if (filters.hasMountainView) {
    query = query.eq("has_mountain_view", true);
  }
  if (filters.expatAllowed !== null) {
    query = query.eq("is_expat_allowed", filters.expatAllowed);
  }
  if (filters.familyOnly !== null) {
    query = query.eq("is_family_only", filters.familyOnly);
  }
  if (filters.query.trim()) {
    // Trigram similarity search on title_ar (requires pg_trgm extension)
    query = query.ilike("title_ar", `%${filters.query.trim()}%`);
  }
  return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySort(query: any, sortBy: SortOption): any {
  switch (sortBy) {
    case "newest":
      return query.order("created_at", { ascending: false });
    case "price_asc":
      return query.order("price_omr", { ascending: true });
    case "price_desc":
      return query.order("price_omr", { ascending: false });
    case "most_viewed":
      return query.order("view_count", { ascending: false });
    case "highest_roi":
      return query.order("roi_estimate", { ascending: false, nullsFirst: false });
    case "below_market":
      return query
        .eq("is_below_market", true)
        .order("price_omr", { ascending: true });
    default:
      return query.order("created_at", { ascending: false });
  }
}

// ── BROWSER CLIENT FUNCTIONS ───────────────────────────────────────────────────

/**
 * Search listings using filter + sort criteria.
 * Called from SearchPageClient (browser).
 * Returns [] when Supabase is not configured (mock mode).
 */
export async function searchListingsClient(
  filters: SearchFilters,
  limit = 50
): Promise<{ listings: Listing[]; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { listings: [], error: null }; // caller uses MOCK_LISTINGS fallback
  }

  try {
    const supabase = createBrowserClient();
    let query = supabase
      .from("listings")
      .select(`
        *,
        listing_images (
          url,
          is_main,
          sort_order
        )
      `)
      .limit(limit);

    query = applyFilters(query, filters);
    query = applySort(query, filters.sortBy);

    const { data, error } = await query;

    if (error) {
      console.error("[Listings] searchListingsClient error:", error.message);
      return { listings: [], error: error.message };
    }

    const listings = (data ?? []).map((row) =>
      dbRowToListing(row as DbListingRow)
    );
    return { listings, error: null };
  } catch (err) {
    console.error("[Listings] searchListingsClient exception:", err);
    return { listings: [], error: "فشل تحميل النتائج" };
  }
}

/**
 * Create a new listing.
 * Called from add-listing.store.ts (browser).
 * Returns { listingId } on success.
 */
export async function createListingClient(
  draft: ListingDraft,
  userId: string
): Promise<{ listingId: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Dev mode: return a fake ID so the rest of the submit flow continues
    return { listingId: `dev-${Date.now()}`, error: null };
  }

  try {
    const supabase = createBrowserClient();
    const insertRow = draftToInsertRow(draft, userId);

    const { data, error } = await supabase
      .from("listings")
      .insert(insertRow)
      .select("id")
      .single();

    if (error) {
      console.error("[Listings] createListingClient error:", error.message);
      return { listingId: null, error: error.message };
    }

    return { listingId: data.id, error: null };
  } catch (err) {
    console.error("[Listings] createListingClient exception:", err);
    return { listingId: null, error: "فشل إنشاء الإعلان" };
  }
}

/**
 * Get the current user's own listings (agent dashboard).
 * Called from agent/listings/page.tsx (browser).
 */
export async function getAgentListingsClient(userId: string): Promise<{
  listings: DbListingRow[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { listings: [], error: null };
  }

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("listings")
      .select("id, title_ar, price_omr, status, view_count, lead_count, created_at, expires_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Listings] getAgentListingsClient error:", error.message);
      return { listings: [], error: error.message };
    }

    return { listings: (data ?? []) as DbListingRow[], error: null };
  } catch (err) {
    console.error("[Listings] getAgentListingsClient exception:", err);
    return { listings: [], error: "فشل تحميل الإعلانات" };
  }
}

/**
 * Fetches a batch of listings by their IDs.
 * Used by FavoritesView to show real listing data for favorited IDs.
 * Returns [] when Supabase is not configured (mock/dev mode).
 */
export async function fetchListingsByIds(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0 || !isSupabaseConfigured()) return [];

  try {
    const supabase = createBrowserClient();
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
      .in("id", ids);

    if (error) {
      console.error("[Listings] fetchListingsByIds error:", error.message);
      return [];
    }

    return (data ?? []).map((row) => dbRowToListing(row as DbListingRow));
  } catch (err) {
    console.error("[Listings] fetchListingsByIds exception:", err);
    return [];
  }
}

// ── SERVER CLIENT FUNCTIONS ────────────────────────────────────────────────────
// Server-only listing functions live in @/lib/supabase/listings.server.ts
// to prevent next/headers from being bundled into client components.
//
// Import getListingByIdServer from there in Server Components / Route Handlers:
//   import { getListingByIdServer } from "@/lib/supabase/listings.server";
