export interface AreaMarketStat {
  areaId: string;
  areaAr: string;
  avgSalePrice: number;         // OMR
  avgRentPrice: number;         // OMR/month
  priceChangePct: number;       // YoY %
  listingCount: number;
  avgDaysOnMarket: number;
  demandScore: number;          // 1-100
}

export interface MarketOverview {
  totalListings: number;
  totalSale: number;
  totalRent: number;
  avgSalePriceMuscat: number;
  avgRentPriceMuscat: number;
  yoyPriceChange: number;
  topAreas: AreaMarketStat[];
  monthlyStats: { month: string; sales: number; rents: number; avgPrice: number }[];
}

export const MOCK_AREA_STATS: AreaMarketStat[] = [
  {
    areaId: "madinat-sultan-qaboos",
    areaAr: "مدينة السلطان قابوس",
    avgSalePrice: 148000,
    avgRentPrice: 680,
    priceChangePct: 8.4,
    listingCount: 47,
    avgDaysOnMarket: 42,
    demandScore: 94,
  },
  {
    areaId: "al-qurm",
    areaAr: "القرم",
    avgSalePrice: 128000,
    avgRentPrice: 590,
    priceChangePct: 6.1,
    listingCount: 63,
    avgDaysOnMarket: 55,
    demandScore: 88,
  },
  {
    areaId: "al-ghubrah",
    areaAr: "الغبرة",
    avgSalePrice: 94000,
    avgRentPrice: 400,
    priceChangePct: 5.3,
    listingCount: 89,
    avgDaysOnMarket: 48,
    demandScore: 85,
  },
  {
    areaId: "al-khuwair",
    areaAr: "الخوير",
    avgSalePrice: 84000,
    avgRentPrice: 350,
    priceChangePct: 4.7,
    listingCount: 112,
    avgDaysOnMarket: 38,
    demandScore: 91,
  },
  {
    areaId: "al-maabilah",
    areaAr: "المعبيلة",
    avgSalePrice: 54000,
    avgRentPrice: 215,
    priceChangePct: 3.9,
    listingCount: 156,
    avgDaysOnMarket: 30,
    demandScore: 87,
  },
  {
    areaId: "al-mawleh",
    areaAr: "الموالح",
    avgSalePrice: 59000,
    avgRentPrice: 235,
    priceChangePct: 4.2,
    listingCount: 134,
    avgDaysOnMarket: 28,
    demandScore: 89,
  },
  {
    areaId: "al-hail",
    areaAr: "الحيل",
    avgSalePrice: 63000,
    avgRentPrice: 255,
    priceChangePct: 5.1,
    listingCount: 98,
    avgDaysOnMarket: 33,
    demandScore: 86,
  },
];

export const MOCK_MARKET_OVERVIEW: MarketOverview = {
  totalListings: 4287,
  totalSale: 2341,
  totalRent: 1946,
  avgSalePriceMuscat: 82500,
  avgRentPriceMuscat: 340,
  yoyPriceChange: 5.8,
  topAreas: MOCK_AREA_STATS.slice(0, 5),
  monthlyStats: [
    { month: "ديسمبر", sales: 187, rents: 143, avgPrice: 78000 },
    { month: "يناير",  sales: 201, rents: 158, avgPrice: 79200 },
    { month: "فبراير", sales: 195, rents: 162, avgPrice: 80100 },
    { month: "مارس",   sales: 224, rents: 175, avgPrice: 80800 },
    { month: "أبريل",  sales: 238, rents: 181, avgPrice: 81400 },
    { month: "مايو",   sales: 219, rents: 170, avgPrice: 82500 },
  ],
};
