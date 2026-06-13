import { MOCK_LISTINGS } from "@/mock/listings";
import { MOCK_AREA_STATS } from "@/mock/market-stats";
import type { Listing } from "@/types/listing";

// ── Find listing ───────────────────────────────────────────────────────────────

export function getListingById(id: string): Listing | null {
  return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}

// Note: similar listings now come from real data via getSimilarListingsServer()
// in lib/supabase/listings.server.ts — the mock helper was removed.

// ── Market data for a listing ──────────────────────────────────────────────────

export interface ListingMarketData {
  avgPrice: number | null;
  priceDiffPct: number | null; // negative = below market
  pricePerSqm: number | null;
  demandScore: number | null;
  priceChangePct: number | null;
  avgDaysOnMarket: number | null;
  investmentScore: number | null;
  rentalYield: number | null;
}

export function getListingMarketData(listing: Listing): ListingMarketData {
  const stat = MOCK_AREA_STATS.find((s) => s.areaId === listing.location.areaId);

  const avgPrice = stat
    ? listing.purpose === "sale"
      ? stat.avgSalePrice
      : stat.avgRentPrice
    : null;

  const priceDiffPct =
    avgPrice !== null ? ((listing.price - avgPrice) / avgPrice) * 100 : null;

  const pricePerSqm =
    listing.specs.area > 0
      ? Math.round(listing.price / listing.specs.area)
      : null;

  const investmentScore = listing.roiEstimate
    ? Math.min(100, Math.round(listing.roiEstimate * 10 + (stat?.demandScore ?? 50) * 0.2))
    : stat
    ? Math.round(stat.demandScore * 0.65)
    : null;

  const rentalYield = listing.roiEstimate ?? null;

  return {
    avgPrice,
    priceDiffPct,
    pricePerSqm,
    demandScore: stat?.demandScore ?? null,
    priceChangePct: stat?.priceChangePct ?? null,
    avgDaysOnMarket: stat?.avgDaysOnMarket ?? null,
    investmentScore,
    rentalYield,
  };
}

// ── Mock price history (12 months, seeded from listing ID) ─────────────────────

export interface PricePoint {
  month: string;
  price: number;
}

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export function getMockPriceHistory(listing: Listing, months = 12): PricePoint[] {
  const seed = listing.id
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const now = new Date();
  const result: PricePoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = MONTHS_AR[d.getMonth()];
    const pseudo = ((seed * (i + 7)) % 97) / 97; // 0..1 deterministic
    const variance = (pseudo - 0.48) * 0.14; // ±7%
    const trend = (months - 1 - i) * 0.003; // gentle upward drift
    const price = Math.round(listing.price * (1 + variance - trend));
    result.push({ month: label, price });
  }
  // Lock last point to current price
  result[result.length - 1].price = listing.price;
  return result;
}

// ── WhatsApp message (detail page format) ─────────────────────────────────────

export function buildDetailWhatsAppMessage(opts: {
  listingTitle: string;
  price: number;
  purpose: "sale" | "rent";
  locationAr: string;
  listingId: string;
}): string {
  const priceLabel =
    opts.purpose === "sale"
      ? `${opts.price.toLocaleString("en-US")} ر.ع`
      : `${opts.price.toLocaleString("en-US")} ر.ع/شهر`;

  return (
    `السلام عليكم، أنا مهتم بهذا العقار في تطبيق مقر:\n` +
    `${opts.listingTitle}\n` +
    `السعر: ${priceLabel}\n` +
    `الموقع: ${opts.locationAr}\n` +
    `هل ما زال متاحاً؟`
  );
}

// ── Nearby services (placeholder mock) ────────────────────────────────────────

export type NearbyServiceType = "mosque" | "school" | "mall" | "hospital" | "beach" | "fuel";

export interface NearbyService {
  type: NearbyServiceType;
  nameAr: string;
  distanceKm: number;
}

const NEARBY_TEMPLATES: Array<{ type: NearbyServiceType; nameAr: string }> = [
  { type: "mosque",   nameAr: "مسجد" },
  { type: "school",   nameAr: "مدرسة" },
  { type: "mall",     nameAr: "مركز تسوق" },
  { type: "hospital", nameAr: "مستشفى / مركز صحي" },
  { type: "beach",    nameAr: "شاطئ" },
  { type: "fuel",     nameAr: "محطة وقود" },
];

export function getMockNearbyServices(listing: Listing): NearbyService[] {
  const seed = listing.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return NEARBY_TEMPLATES.map((t, i) => ({
    ...t,
    distanceKm: Math.round(((((seed * (i + 3)) % 38) + 4) / 10)) / 1,
  })).map((s) => ({ ...s, distanceKm: Math.max(0.1, s.distanceKm) }));
}
