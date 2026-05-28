import type { Listing } from "@/types/listing";
import type { SearchFilters, SortOption } from "@/store/search.store";
import type { Locale } from "@/types";
import { MOCK_AREA_STATS } from "@/mock/market-stats";
import { formatNumber } from "@/lib/formatters";

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

// ── Below-market detection ─────────────────────────────────────────────────────

const AREA_STAT_MAP = Object.fromEntries(
  MOCK_AREA_STATS.map((s) => [s.areaId, s])
);

export function isBelowMarket(listing: Listing, thresholdPct = 15): boolean {
  const stat = AREA_STAT_MAP[listing.location.areaId];
  if (!stat) return false;
  const avg =
    listing.purpose === "sale" ? stat.avgSalePrice : stat.avgRentPrice;
  if (!avg) return false;
  return listing.price < avg * (1 - thresholdPct / 100);
}

// ── Filter application ─────────────────────────────────────────────────────────

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
    if (filters.minArea !== null && l.specs.area < filters.minArea) return false;
    if (filters.maxArea !== null && l.specs.area > filters.maxArea) return false;
    if (filters.isVerified !== null && l.isVerified !== filters.isVerified)
      return false;
    if (filters.furnishing.length > 0 && !filters.furnishing.includes(l.furnishing))
      return false;
    if (
      filters.amenities.length > 0 &&
      !filters.amenities.every((a) => l.amenities.includes(a))
    )
      return false;
    if (filters.hasSeaView && !l.amenities.includes("إطلالة بحرية")) return false;
    if (filters.hasMountainView && !l.amenities.includes("إطلالة جبلية")) return false;
    if (filters.hasMajlis && !l.amenities.includes("مجلس")) return false;
    if (filters.hasMaidRoom && !l.amenities.includes("غرفة خادمة")) return false;
    if (filters.hasDriverRoom && !l.amenities.includes("غرفة سائق")) return false;
    if (filters.hasParking && !(l.specs.parkingSpots && l.specs.parkingSpots > 0))
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
    case "below_market":
      return copy.sort((a, b) => {
        const aStat = AREA_STAT_MAP[a.location.areaId];
        const bStat = AREA_STAT_MAP[b.location.areaId];
        const aAvg =
          aStat
            ? a.purpose === "sale"
              ? aStat.avgSalePrice
              : aStat.avgRentPrice
            : a.price;
        const bAvg =
          bStat
            ? b.purpose === "sale"
              ? bStat.avgSalePrice
              : bStat.avgRentPrice
            : b.price;
        const aDiff = (a.price - aAvg) / aAvg;
        const bDiff = (b.price - bAvg) / bAvg;
        return aDiff - bDiff;
      });
    default:
      return copy;
  }
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
    const count = n(filters.propertyTypes.length);
    labels.push({
      key: "propertyTypes",
      label: isAr ? `${count} أنواع` : `${count} types`,
    });
  }

  if (filters.governorateId) {
    labels.push({
      key: "governorateId",
      label: isAr ? "المحافظة" : "Governorate",
    });
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

  if (filters.minArea !== null && filters.maxArea !== null) {
    labels.push({
      key: "area",
      label: `${n(filters.minArea)}–${n(filters.maxArea)} ${sqm}`,
    });
  } else if (filters.minArea !== null) {
    labels.push({
      key: "area",
      label: isAr ? `من ${n(filters.minArea)} ${sqm}` : `From ${n(filters.minArea)} ${sqm}`,
    });
  } else if (filters.maxArea !== null) {
    labels.push({
      key: "area",
      label: isAr ? `حتى ${n(filters.maxArea)} ${sqm}` : `Up to ${n(filters.maxArea)} ${sqm}`,
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
