import type { Listing } from "@/types/listing";
import type { SearchFilters, SortOption } from "@/store/search.store";
import type { Locale } from "@/types";
import { formatNumber } from "@/lib/formatters";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";
import { listingAmenityKeys, type AmenityKey } from "@/lib/constants/amenities";

// ── Text matching ──────────────────────────────────────────────────────────────

export function matchesQuery(listing: Listing, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const haystack = [
    listing.titleAr,
    listing.titleEn ?? "",
    listing.location.areaAr,
    listing.location.wilayatAr,
    listing.location.governorateAr,
    listing.location.addressAr ?? "",
    listing.descriptionAr,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

// ── Property-type categories (area meaning) ─────────────────────────────────────

const LAND_TYPES = new Set(["land", "farm"]);
const APARTMENT_TYPES = new Set(["apartment", "hotel_apartment"]);
const UNIT_TYPES = new Set(["commercial", "office"]);
const BUILT_UP_TYPES = new Set([
  "villa", "duplex", "townhouse", "arabic_house", "chalet", "building", "warehouse",
]);

/**
 * The area meaning depends on the selected property type(s). When the selection
 * is unambiguous we use the type-specific label; mixed/empty selections use a
 * neutral "Area" so the user is never misled (FP13 #1).
 */
export function getAreaFilterLabel(propertyTypes: string[], locale: Locale = "ar"): string {
  const isAr = locale === "ar";
  if (propertyTypes.length === 0) return isAr ? "المساحة" : "Area";
  const all = (s: Set<string>) => propertyTypes.every((t) => s.has(t));
  if (all(LAND_TYPES))      return isAr ? "مساحة الأرض"  : "Land area";
  if (all(APARTMENT_TYPES)) return isAr ? "مساحة الشقة"  : "Apartment area";
  if (all(UNIT_TYPES))      return isAr ? "مساحة الوحدة" : "Unit area";
  if (all(BUILT_UP_TYPES))  return isAr ? "مساحة البناء" : "Built-up area";
  return isAr ? "المساحة" : "Area";
}

/** The area value to compare against, by the listing's own type (land → plot size). */
function relevantArea(l: Listing): number {
  if (LAND_TYPES.has(l.propertyType)) {
    return l.specs.landArea ?? l.specs.area;
  }
  return l.specs.area;
}

// ── Below-market detection (real DB flag only — never mock) ─────────────────────

export function isBelowMarket(listing: Listing): boolean {
  // FP13 #3: the badge reflects the real is_below_market DB signal only. No mock
  // market average is ever used, so a trust badge never appears on fake data.
  return listing.isBelowMarket === true;
}

// ── Filter application (client / mock-fallback path) ────────────────────────────

export function filterListings(
  listings: Listing[],
  filters: SearchFilters
): Listing[] {
  return listings.filter((l) => {
    if (!matchesQuery(l, filters.query)) return false;
    if (filters.purpose !== "all" && l.purpose !== filters.purpose) return false;
    if (
      filters.propertyTypes.length > 0 &&
      !filters.propertyTypes.includes(l.propertyType)
    )
      return false;
    if (
      filters.governorateId &&
      l.location.governorateId !== filters.governorateId
    )
      return false;
    if (
      filters.wilayatId &&
      l.location.wilayatId !== filters.wilayatId
    )
      return false;
    if (filters.areaId && l.location.areaId !== filters.areaId) return false;
    if (filters.minPrice !== null && l.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && l.price > filters.maxPrice) return false;
    if (filters.minBeds > 0 && l.specs.bedrooms < filters.minBeds) return false;
    if (filters.minBaths > 0 && l.specs.bathrooms < filters.minBaths) return false;
    // Area filter is scoped to the listing's own area meaning (land → plot size,
    // everything else → built-up / unit area), so meanings never mix (FP13 #1).
    const area = relevantArea(l);
    if (filters.minArea !== null && area < filters.minArea) return false;
    if (filters.maxArea !== null && area > filters.maxArea) return false;
    if (filters.isVerified !== null && l.isVerified !== filters.isVerified)
      return false;
    if (filters.furnishing.length > 0 && !filters.furnishing.includes(l.furnishing))
      return false;
    // Amenity matching uses stable keys, never display text, so Arabic and English
    // selections return identical results and spelling drift can't break it (FP13 #2).
    const keys = listingAmenityKeys(l.amenities);
    if (
      filters.amenities.length > 0 &&
      !filters.amenities.every((a) => keys.has(a as AmenityKey))
    )
      return false;
    if (filters.hasSeaView && !keys.has("sea_view")) return false;
    if (filters.hasMountainView && !keys.has("mountain_view")) return false;
    if (filters.hasMajlis && !keys.has("majlis")) return false;
    if (filters.hasMaidRoom && !keys.has("maid_room")) return false;
    if (filters.hasDriverRoom && !keys.has("driver_room")) return false;
    if (
      filters.hasParking &&
      !(l.specs.parkingSpots && l.specs.parkingSpots > 0) &&
      !keys.has("parking")
    )
      return false;
    // Oman-specific boolean filters — only applied when the listing declares the field
    if (filters.isFreehold === true && l.isFreehold !== true) return false;
    if (filters.expatAllowed === true && l.isExpatAllowed !== true) return false;
    if (filters.familyOnly === true && l.isFamilyOnly !== true) return false;
    return true;
  });
}

// ── Sorting ────────────────────────────────────────────────────────────────────

export function sortListings(listings: Listing[], sortBy: SortOption): Listing[] {
  const copy = [...listings];
  switch (sortBy) {
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "most_viewed":
      return copy.sort((a, b) => b.viewCount - a.viewCount);
    case "highest_roi":
      return copy.sort(
        (a, b) => (b.roiEstimate ?? 0) - (a.roiEstimate ?? 0)
      );
    default:
      return copy;
  }
}

// ── Name resolvers (id → display name) ──────────────────────────────────────────

const PT_BY_VALUE = new Map(PROPERTY_TYPES.map((p) => [p.value, p]));
function propertyTypeName(value: string, isAr: boolean): string {
  const p = PT_BY_VALUE.get(value as (typeof PROPERTY_TYPES)[number]["value"]);
  return p ? (isAr ? p.labelAr : p.labelEn) : value;
}

const GOV_NAME = new Map<string, { ar: string; en: string }>();
const WIL_NAME = new Map<string, { ar: string; en: string }>();
const AREA_NAME = new Map<string, { ar: string; en: string }>();
for (const g of OMAN_GOVERNORATES) {
  GOV_NAME.set(g.id, { ar: g.nameAr, en: g.nameEn ?? g.nameAr });
  for (const w of g.wilayats ?? []) {
    WIL_NAME.set(w.id, { ar: w.nameAr, en: w.nameEn ?? w.nameAr });
    for (const a of w.areas ?? []) {
      AREA_NAME.set(a.id, { ar: a.nameAr, en: a.nameEn ?? a.nameAr });
    }
  }
}
function locName(
  map: Map<string, { ar: string; en: string }>,
  id: string,
  isAr: boolean
): string {
  const n = map.get(id);
  return n ? (isAr ? n.ar : n.en) : id;
}

// ── Active filter labels ───────────────────────────────────────────────────────

export interface ActiveFilterLabel {
  key: string;
  label: string;
}

export function getActiveFilterLabels(
  filters: SearchFilters,
  locale: Locale = "ar"
): ActiveFilterLabel[] {
  const labels: ActiveFilterLabel[] = [];
  const isAr = locale === "ar";
  const omr = isAr ? "ر.ع" : "OMR";
  const sqm = isAr ? "م²" : "sqm";

  function n(num: number) {
    return formatNumber(num, locale);
  }

  if (filters.purpose !== "all") {
    const purposeLabel =
      filters.purpose === "sale"
        ? (isAr ? "للبيع" : "For Sale")
        : filters.purpose === "rent"
        ? (isAr ? "للإيجار" : "For Rent")
        : (isAr ? "للاستثمار" : "Investment");
    labels.push({ key: "purpose", label: purposeLabel });
  }

  if (filters.propertyTypes.length > 0) {
    // Show the actual type names for 1–2 selections; summarise beyond that (FP13 #6).
    let label: string;
    if (filters.propertyTypes.length <= 2) {
      label = filters.propertyTypes
        .map((t) => propertyTypeName(t, isAr))
        .join(isAr ? "، " : ", ");
    } else {
      label = isAr
        ? `${n(filters.propertyTypes.length)} أنواع محددة`
        : `${n(filters.propertyTypes.length)} property types selected`;
    }
    labels.push({ key: "propertyTypes", label });
  }

  // Location chips — show the real governorate / wilayat / area names (FP13 #4).
  if (filters.governorateId) {
    labels.push({ key: "governorateId", label: locName(GOV_NAME, filters.governorateId, isAr) });
  }
  if (filters.wilayatId) {
    labels.push({ key: "wilayatId", label: locName(WIL_NAME, filters.wilayatId, isAr) });
  }
  if (filters.areaId) {
    labels.push({ key: "areaId", label: locName(AREA_NAME, filters.areaId, isAr) });
  }

  if (filters.minPrice !== null && filters.maxPrice !== null) {
    labels.push({
      key: "price",
      label: isAr
        ? `${n(filters.minPrice)} - ${n(filters.maxPrice)} ${omr}`
        : `${n(filters.minPrice)}–${n(filters.maxPrice)} ${omr}`,
    });
  } else if (filters.minPrice !== null) {
    labels.push({
      key: "price",
      label: isAr
        ? `من ${n(filters.minPrice)} ${omr}`
        : `From ${n(filters.minPrice)} ${omr}`,
    });
  } else if (filters.maxPrice !== null) {
    labels.push({
      key: "price",
      label: isAr
        ? `حتى ${n(filters.maxPrice)} ${omr}`
        : `Up to ${n(filters.maxPrice)} ${omr}`,
    });
  }

  if (filters.minBeds > 0) {
    labels.push({
      key: "minBeds",
      label: isAr ? `${n(filters.minBeds)}+ غرف` : `${n(filters.minBeds)}+ beds`,
    });
  }

  if (filters.minBaths > 0) {
    labels.push({
      key: "minBaths",
      label: isAr ? `${n(filters.minBaths)}+ حمامات` : `${n(filters.minBaths)}+ baths`,
    });
  }

  // Area chip carries its context-aware meaning so the value is never ambiguous (FP13 #1).
  const areaName = getAreaFilterLabel(filters.propertyTypes, locale);
  if (filters.minArea !== null && filters.maxArea !== null) {
    labels.push({
      key: "area",
      label: `${areaName}: ${n(filters.minArea)}–${n(filters.maxArea)} ${sqm}`,
    });
  } else if (filters.minArea !== null) {
    labels.push({
      key: "area",
      label: isAr
        ? `${areaName}: من ${n(filters.minArea)} ${sqm}`
        : `${areaName}: from ${n(filters.minArea)} ${sqm}`,
    });
  } else if (filters.maxArea !== null) {
    labels.push({
      key: "area",
      label: isAr
        ? `${areaName}: حتى ${n(filters.maxArea)} ${sqm}`
        : `${areaName}: up to ${n(filters.maxArea)} ${sqm}`,
    });
  }

  if (filters.furnishing.length > 0) {
    labels.push({ key: "furnishing", label: isAr ? "التأثيث" : "Furnishing" });
  }
  if (filters.isVerified) {
    labels.push({ key: "isVerified", label: isAr ? "موثوق" : "Verified" });
  }
  if (filters.hasSeaView) {
    labels.push({ key: "hasSeaView", label: isAr ? "إطلالة بحرية" : "Sea view" });
  }
  if (filters.hasMountainView) {
    labels.push({ key: "hasMountainView", label: isAr ? "إطلالة جبلية" : "Mountain view" });
  }
  if (filters.hasMajlis) {
    labels.push({ key: "hasMajlis", label: isAr ? "مجلس" : "Majlis" });
  }
  if (filters.hasMaidRoom) {
    labels.push({ key: "hasMaidRoom", label: isAr ? "غرفة خادمة" : "Maid's room" });
  }
  if (filters.hasDriverRoom) {
    labels.push({ key: "hasDriverRoom", label: isAr ? "غرفة سائق" : "Driver's room" });
  }
  if (filters.hasParking) {
    labels.push({ key: "hasParking", label: isAr ? "موقف سيارات" : "Parking" });
  }
  if (filters.isFreehold) {
    labels.push({ key: "isFreehold", label: isAr ? "تملك حر" : "Freehold" });
  }
  if (filters.expatAllowed) {
    labels.push({ key: "expatAllowed", label: isAr ? "متاح للوافدين" : "Expat allowed" });
  }
  if (filters.familyOnly) {
    labels.push({ key: "familyOnly", label: isAr ? "للعائلات" : "Family only" });
  }

  return labels;
}

// ── Slug generation ────────────────────────────────────────────────────────────

export function generateAreaSlug(nameEn: string): string {
  return nameEn
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
