export interface PopularArea {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  governorateAr: string;
  avgSalePrice: number;   // OMR
  avgRentPrice: number;   // OMR/month
  listingCount: number;
  demandScore: number;    // 1–100
  priceChangePct: number; // YoY %
}

export const POPULAR_AREAS: PopularArea[] = [
  {
    id: "al-khuwair",
    slug: "al-khuwair",
    nameAr: "الخوير",
    nameEn: "Al Khuwair",
    governorateAr: "مسقط",
    avgSalePrice: 84000,
    avgRentPrice: 350,
    listingCount: 112,
    demandScore: 91,
    priceChangePct: 4.7,
  },
  {
    id: "al-ghubrah",
    slug: "al-ghubrah",
    nameAr: "الغبرة",
    nameEn: "Al Ghubrah",
    governorateAr: "مسقط",
    avgSalePrice: 94000,
    avgRentPrice: 400,
    listingCount: 89,
    demandScore: 85,
    priceChangePct: 5.3,
  },
  {
    id: "al-maabilah",
    slug: "al-maabilah",
    nameAr: "المعبيلة",
    nameEn: "Al Maabilah",
    governorateAr: "مسقط",
    avgSalePrice: 54000,
    avgRentPrice: 215,
    listingCount: 156,
    demandScore: 87,
    priceChangePct: 3.9,
  },
  {
    id: "al-mawleh",
    slug: "al-mawleh",
    nameAr: "الموالح",
    nameEn: "Al Mawleh",
    governorateAr: "مسقط",
    avgSalePrice: 59000,
    avgRentPrice: 235,
    listingCount: 134,
    demandScore: 89,
    priceChangePct: 4.2,
  },
  {
    id: "al-hail",
    slug: "al-hail",
    nameAr: "الحيل",
    nameEn: "Al Hail",
    governorateAr: "مسقط",
    avgSalePrice: 63000,
    avgRentPrice: 255,
    listingCount: 98,
    demandScore: 86,
    priceChangePct: 5.1,
  },
  {
    id: "madinat-sultan-qaboos",
    slug: "madinat-sultan-qaboos",
    nameAr: "مدينة السلطان قابوس",
    nameEn: "Madinat Sultan Qaboos",
    governorateAr: "مسقط",
    avgSalePrice: 148000,
    avgRentPrice: 680,
    listingCount: 47,
    demandScore: 94,
    priceChangePct: 8.4,
  },
  {
    id: "al-qurm",
    slug: "al-qurm",
    nameAr: "القرم",
    nameEn: "Al Qurm",
    governorateAr: "مسقط",
    avgSalePrice: 128000,
    avgRentPrice: 590,
    listingCount: 63,
    demandScore: 88,
    priceChangePct: 6.1,
  },
  {
    id: "al-nahdha",
    slug: "al-nahdha",
    nameAr: "النهضة",
    nameEn: "Al Nahdha",
    governorateAr: "ظفار",
    avgSalePrice: 45000,
    avgRentPrice: 180,
    listingCount: 41,
    demandScore: 72,
    priceChangePct: 3.1,
  },
  {
    id: "sohar-center",
    slug: "sohar-center",
    nameAr: "صحار",
    nameEn: "Sohar Centre",
    governorateAr: "شمال الباطنة",
    avgSalePrice: 38000,
    avgRentPrice: 160,
    listingCount: 57,
    demandScore: 68,
    priceChangePct: 2.8,
  },
];
