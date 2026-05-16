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
  area: number;        // sqm
  floors?: number;
  parkingSpots?: number;
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
  specs: PropertySpecs;
  furnishing: FurnishingStatus;
  amenities: string[];
  images: string[];
  coverImage: string;
  location: {
    governorateId: string;
    governorateAr: string;
    wilayatId: string;
    wilayatAr: string;
    areaId: string;
    areaAr: string;
    addressAr?: string;
    coordinates?: Coordinates;
  };
  agentId: string;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  qualityScore: number;    // 1-100
  roiEstimate?: number;    // % annual for investment
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}
