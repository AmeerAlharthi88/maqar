import { toArabicNumerals } from "@/lib/formatters";
import type { Listing } from "@/types/listing";
import type { MapCenter } from "@/store/map.store";

// ── Price bubble label ─────────────────────────────────────────────────────────

export function formatPriceBubble(
  price: number,
  purpose: "sale" | "rent"
): string {
  if (purpose === "sale") {
    if (price >= 1_000_000) {
      const val = (price / 1_000_000).toFixed(1).replace(/\.0$/, "");
      return `${toArabicNumerals(val)} م ر.ع`;
    }
    if (price >= 1_000) {
      const val = Math.round(price / 1_000);
      return `${toArabicNumerals(val)}ك ر.ع`;
    }
    return `${toArabicNumerals(price)} ر.ع`;
  }
  // Rent — show monthly price
  if (price >= 1_000) {
    const val = Math.round(price / 1_000);
    return `${toArabicNumerals(val)}ك/شهر`;
  }
  return `${toArabicNumerals(price)} ر.ع/شهر`;
}

// ── Coordinate validation ──────────────────────────────────────────────────────

export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    // Sanity check: coordinates must be non-zero (default/placeholder guard)
    !(lat === 0 && lng === 0)
  );
}

export function hasValidCoordinates(listing: Listing): boolean {
  const coords = listing.location.coordinates;
  if (!coords) return false;
  return isValidCoordinate(coords.lat, coords.lng);
}

export function getListingsWithCoordinates(listings: Listing[]): Listing[] {
  return listings.filter(hasValidCoordinates);
}

// ── Distance calculation (Haversine) ──────────────────────────────────────────
// Returns distance in kilometers

export function calculateDistance(a: MapCenter, b: MapCenter): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const q =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${toArabicNumerals(Math.round(km * 1000))} م`;
  }
  const val = km < 10 ? km.toFixed(1).replace(/\.0$/, "") : Math.round(km).toString();
  return `${toArabicNumerals(val)} كم`;
}

// ── Marker visual state ────────────────────────────────────────────────────────

export type MarkerState = "normal" | "selected" | "featured" | "below_market";

export function getMarkerState(
  listing: Listing,
  isSelected: boolean,
  isBelowMkt: boolean
): MarkerState {
  if (isSelected) return "selected";
  if (isBelowMkt) return "below_market";
  if (listing.isFeatured) return "featured";
  return "normal";
}

// ── Marker color palette ───────────────────────────────────────────────────────

export interface MarkerColors {
  bg: string;
  text: string;
  border: string;
  shadow: string;
}

export function getMarkerColors(state: MarkerState): MarkerColors {
  switch (state) {
    case "selected":
      return {
        bg: "#C65D3B",
        text: "#FFFFFF",
        border: "#A84D2F",
        shadow: "0 4px 16px rgba(198,93,59,0.45)",
      };
    case "below_market":
      return {
        bg: "#5B8C5A",
        text: "#FFFFFF",
        border: "#4A7349",
        shadow: "0 2px 8px rgba(91,140,90,0.35)",
      };
    case "featured":
      return {
        bg: "#FBF0EB",
        text: "#C65D3B",
        border: "#C65D3B",
        shadow: "0 2px 8px rgba(198,93,59,0.22)",
      };
    default:
      return {
        bg: "#FFFFFF",
        text: "#1E1E1E",
        border: "#E8DDD0",
        shadow: "0 2px 8px rgba(30,30,30,0.14)",
      };
  }
}
