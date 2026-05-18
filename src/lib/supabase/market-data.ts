// ── Market Data — Public Read Service ─────────────────────────────────────────
// Uses the anon/server client — market_data has public SELECT RLS policy.
// No auth required.  All data is labeled 'admin_managed' (estimated values).
//
// Import from server components and API routes.
// Safe to use with the server-side Supabase client (no service role needed).
// ─────────────────────────────────────────────────────────────────────────────

import { createServiceClient } from "@/lib/supabase/service";

export interface MarketDataPoint {
  id:                   string;
  governorate:          string;
  wilayat:              string;
  area:                 string | null;
  propertyType:         string | null;
  avgSalePriceOmr:      number | null;
  avgRentOmr:           number | null;
  pricePerSqmOmr:       number | null;
  rentalYieldPercent:   number | null;
  demandScore:          number | null;
  dataSource:           string;
  lastUpdated:          string;
}

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
}

function mapRow(row: Record<string, unknown>): MarketDataPoint {
  return {
    id:                 (row.id as string) ?? "",
    governorate:        (row.governorate as string) ?? "",
    wilayat:            (row.wilayat as string) ?? "",
    area:               (row.area as string | null) ?? null,
    propertyType:       (row.property_type as string | null) ?? null,
    avgSalePriceOmr:    row.average_sale_price_omr != null ? Number(row.average_sale_price_omr) : null,
    avgRentOmr:         row.average_rent_omr != null ? Number(row.average_rent_omr) : null,
    pricePerSqmOmr:     row.price_per_sqm_omr != null ? Number(row.price_per_sqm_omr) : null,
    rentalYieldPercent: row.rental_yield_percent != null ? Number(row.rental_yield_percent) : null,
    demandScore:        row.demand_score != null ? Number(row.demand_score) : null,
    dataSource:         (row.data_source as string) ?? "admin_managed",
    lastUpdated:        (row.last_updated as string) ?? (row.updated_at as string) ?? "",
  };
}

/**
 * Fetch all market data for a specific area.
 * Used by area pages (/areas/[slug]).
 * Returns [] if not configured or not found.
 */
export async function fetchMarketDataByArea(opts: {
  governorate: string;
  wilayat:     string;
  area?:       string;
}): Promise<MarketDataPoint[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    let query = sb
      .from("market_data")
      .select("*")
      .eq("governorate", opts.governorate)
      .eq("wilayat", opts.wilayat);

    if (opts.area) {
      query = query.eq("area", opts.area);
    } else {
      query = query.is("area", null);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[MarketData] fetchMarketDataByArea:", error.message);
      return [];
    }

    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("[MarketData] fetchMarketDataByArea exception:", err);
    return [];
  }
}

/**
 * Fetch market data for a governorate (all wilayats).
 * Used by market overview pages.
 */
export async function fetchMarketDataByGovernorate(
  governorate: string
): Promise<MarketDataPoint[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("market_data")
      .select("*")
      .eq("governorate", governorate)
      .order("wilayat", { ascending: true });

    if (error) {
      console.error("[MarketData] fetchMarketDataByGovernorate:", error.message);
      return [];
    }

    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("[MarketData] fetchMarketDataByGovernorate exception:", err);
    return [];
  }
}

/**
 * Fetch wilayat-level summary rows (area IS NULL).
 * Used by the market overview page to show top-level stats per wilayat.
 */
export async function fetchWilayatMarketSummaries(): Promise<MarketDataPoint[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("market_data")
      .select("*")
      .is("area", null)
      .order("demand_score", { ascending: false });

    if (error) {
      console.error("[MarketData] fetchWilayatMarketSummaries:", error.message);
      return [];
    }

    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("[MarketData] fetchWilayatMarketSummaries exception:", err);
    return [];
  }
}
