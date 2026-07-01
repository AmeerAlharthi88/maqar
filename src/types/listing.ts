export type PropertyType =
  | "apartment"
  | "villa"
  | "duplex"
  | "townhouse"
  | "land"
  | "commercial"
  | "office"
  | "warehouse"
  | "arabic_house"
  | "farm"
  | "chalet"
  | "building"
  | "hotel_apartment";

export type ListingPurpose = "sale" | "rent";
export type ListingStatus = "active" | "sold" | "rented" | "draft" | "pending";
export type FurnishingStatus = "furnished" | "semi_furnished" | "unfurnished";

export interface PropertySpecs {
  bedrooms: number;
  bathrooms: number;
  area: number;        // sqm — legacy/generic area (area_sqm). Prefer builtUpArea/landArea below.
  landArea?: number;   // sqm — plot/land area (land_size_sqm), when applicable
  builtUpArea?: number; // sqm — built-up / unit area (built_up_area_sqm), when applicable
  floors?: number;
  parkingSpots?: number;
}

// Public-safe seller contact, fetched server-side for the listing-detail page.
// Contains ONLY display/contact fields — never email, role, account status, etc.
export interface ListingOwnerContact {
  id: string;
  nameAr: string;
  phone: string | null;
  whatsapp: string | null;   // falls back to phone when no separate WhatsApp number
  avatarUrl: string | null;
  isVerified: boolean;
  licenseNumber: string | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  titleAr: string;
  titleEn?: string;
  descriptionAr: string;
  descriptionEn?: string;
  propertyType: PropertyType;
  purpose: ListingPurpose;
  status: ListingStatus;
  price: number;           // OMR
  pricePerSqm?: number;    // OMR/sqm
  isPriceHidden?: boolean; // owner chose "Contact for price" — never expose the number
  isNegotiable?: boolean;  // price is negotiable (is_negotiable)
  specs: PropertySpecs;
  furnishing: FurnishingStatus;
  amenities: string[];
  images: string[];
  coverImage: string;
  location: {
    governorateId: string;
    governorateAr: string;
    governorateEn?: string;
    wilayatId: string;
    wilayatAr: string;
    wilayatEn?: string;
    areaId: string;
    areaAr: string;
    areaEn?: string;
    addressAr?: string;
    addressEn?: string;
    coordinates?: Coordinates;
  };
  agentId: string;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  // Oman-specific boolean attributes (optional for mock compatibility)
  isFreehold?: boolean;
  isExpatAllowed?: boolean;
  isFamilyOnly?: boolean;
  // Real below-market flag from the DB (is_below_market). Never derived from mock
  // market stats — the badge shows only when this is a real, stored signal (FP13 #3).
  isBelowMarket?: boolean;
  qualityScore: number;    // 1-100
  roiEstimate?: number;    // % annual for investment
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}
