export interface Area {
  id: string;
  nameAr: string;
  nameEn: string;
  wilayatId: string;
  listingCount?: number;
  avgPriceSale?: number;   // OMR
  avgPriceRent?: number;   // OMR/month
}

export interface Wilayat {
  id: string;
  nameAr: string;
  nameEn: string;
  governorateId: string;
  areas: Area[];
}

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  wilayats: Wilayat[];
}

export interface LocationBreadcrumb {
  governorateAr: string;
  wilayatAr: string;
  areaAr: string;
}
