// ── Market types — Phase 13 ──────────────────────────────────────────────────
// Hierarchical: Governorate > Wilayat > Area

export interface MonthlyTrendPoint {
  month: string;           // Arabic month name
  avgSalePrice: number;    // OMR
  avgRentPrice: number;    // OMR/month
  listingCount: number;
}

export interface AreaMarketData {
  id: string;
  nameAr: string;
  nameEn: string;
  wilayatId: string;
  avgSalePrice: number;    // OMR
  avgRentPrice: number;    // OMR/month
  pricePerSqm: number;     // OMR/m²
  rentalYield: number;     // percent
  demandScore: number;     // 1–100
  priceChangePct: number;  // YoY %
  listingCount: number;
}

export interface WilayatMarketData {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  governorateId: string;
  governorateAr: string;
  governorateSlug: string;
  avgSalePrice: number;
  avgRentPrice: number;
  pricePerSqm: number;
  rentalYield: number;
  demandScore: number;
  priceChangePct: number;
  listingCount: number;
  areas: AreaMarketData[];
  monthlyTrend: MonthlyTrendPoint[];
}

export interface GovernorateMarketData {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  avgSalePrice: number;
  avgRentPrice: number;
  pricePerSqm: number;
  rentalYield: number;
  demandScore: number;
  priceChangePct: number;
  listingCount: number;
  wilayats: WilayatMarketData[];
  monthlyTrend: MonthlyTrendPoint[];
}

export interface OmanMarketOverview {
  totalListings: number;
  totalSale: number;
  totalRent: number;
  avgSalePrice: number;
  avgRentPrice: number;
  avgRentalYield: number;
  yoyPriceChange: number;
  monthlyTrend: MonthlyTrendPoint[];
}
