import type { PropertyType, FurnishingStatus } from "./listing";

// ── Draft-specific purpose (includes investment as a UI concept) ───────────────
export type DraftPurpose = "sale" | "rent" | "investment";

// ── Rent period ───────────────────────────────────────────────────────────────
export type RentPeriod = "monthly" | "yearly" | "quarterly" | "weekly";

// ── Draft status ──────────────────────────────────────────────────────────────
export type DraftStatus = "draft" | "pending_review" | "submitted";

// ── Document type ─────────────────────────────────────────────────────────────
export type DocumentType =
  | "mulkiya"       // ownership / Mulkiya
  | "agency_auth"   // agency authorization letter
  | "civil_id"      // civil ID copy
  | "cr_number"     // commercial registration
  | "contract_draft"; // optional contract draft

// ── Uploaded file placeholder ─────────────────────────────────────────────────
export interface UploadedFile {
  id: string;
  name: string;
  size: number;          // bytes
  mimeType: string;
  previewUrl?: string;   // local blob URL (not persisted)
  isMain: boolean;
  uploadStatus: "pending" | "uploading" | "done" | "error";
  errorMessage?: string;
}

// ── Draft document entry ──────────────────────────────────────────────────────
export interface DraftDocument {
  type: DocumentType;
  file?: UploadedFile;     // local file (not persisted)
  referenceNumber?: string; // e.g. CR number
}

// ── Main listing draft ────────────────────────────────────────────────────────
export interface ListingDraft {
  id: string;

  // Step 1 — Purpose
  purpose: DraftPurpose | null;

  // Step 2 — Property type (uses extended PropertyType)
  propertyType: PropertyType | null;

  // ── Step 3 — Property details ─────────────────────────────────────────────

  // Core specs (shared across multiple types)
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;          // built-up area sqm (maps to built_up_area_sqm in DB)
  landArea: number | null;      // land/plot area sqm (maps to land_size_sqm in DB)
  parkingSpots: number | null;
  furnishing: FurnishingStatus | null;
  propertyAge: string | null;   // "0","1","2","3-5","5-10","10+"
  availabilityDate: string | null; // ISO date string

  // Floor fields
  floorNumber: number | null;           // which floor is this unit on (apartment, commercial)
  totalFloorsInBuilding: number | null; // total floors in the building (apartment context)
  floors: number | null;                // number of floors IN the property (villa, building)

  // Villa / residential features
  hasMajlis: boolean;
  majlisCount: number | null;
  hasMaidRoom: boolean;
  hasDriverRoom: boolean;
  hasPrivatePool: boolean;
  hasYard: boolean;
  balconyCount: number | null;
  hasCentralAc: boolean;
  kitchenType: string | null;   // 'internal' | 'external' | 'both'
  hasStoreRoom: boolean;

  // Apartment-specific
  hasElevator: boolean;
  hasSecurity: boolean;
  hasSharedPool: boolean;
  hasSharedGym: boolean;
  hasBalcony: boolean;

  // Views (shared)
  hasSeaView: boolean;
  hasMountainView: boolean;

  // Legacy booleans (kept for backward-compat with DB columns + existing code)
  hasOutdoorKitchen: boolean;
  hasIndoorKitchen: boolean;
  isFreehold: boolean;
  isExpatAllowed: boolean;
  isFamilyOnly: boolean;
  isBachelorAllowed: boolean;

  // Land-specific
  landUse: string | null;           // 'residential'|'commercial'|'agricultural'|'industrial'|'mixed'
  roadAccess: string | null;        // 'paved' | 'unpaved'
  isCornerPlot: boolean;
  hasElectricity: boolean;
  hasWater: boolean;
  hasSewage: boolean;
  hasBoundaryWall: boolean;
  plotNumber: string;
  hasNearbyMosque: boolean;
  hasNearbySchool: boolean;

  // Farm-specific
  waterSource: string | null;       // 'well' | 'government' | 'none'
  farmHouseExists: boolean;
  numberOfWells: number | null;
  palmTreesCount: number | null;
  otherTrees: string;
  hasPavedRoad: boolean;
  hasAgriculturalLicense: boolean;

  // Commercial shop-specific
  shopFrontageMeters: number | null;
  hasCommercialLicense: boolean;
  hasDisplayWindow: boolean;
  isMainRoadFacing: boolean;

  // Office-specific
  meetingRoomsCount: number | null;
  hasReceptionArea: boolean;
  isInternetReady: boolean;

  // Warehouse-specific
  ceilingHeightMeters: number | null;
  hasLoadingDock: boolean;
  hasTruckAccess: boolean;
  powerCapacityKw: number | null;
  hasFireSafety: boolean;
  isFenced: boolean;
  hasCrane: boolean;
  hasOfficeSpace: boolean;

  // Building-specific
  totalUnits: number | null;
  hasCommercialGroundFloor: boolean;
  currentRentalIncome: number | null;

  // Chalet-specific
  hasBarbecue: boolean;
  hasSharedBeachAccess: boolean;

  // Step 4 — Price
  price: number | null;
  rentPeriod: RentPeriod | null;
  isNegotiable: boolean;
  depositAmount: number | null;
  serviceCharges: number | null;
  isPriceHidden: boolean;

  // Step 5 — Location
  governorateId: string | null;
  governorateAr: string;
  wilayatId: string | null;
  wilayatAr: string;
  areaId: string | null;
  areaAr: string;
  block: string;
  street: string;
  locationNotes: string;
  hideExactLocation: boolean;
  mapLat: number | null;
  mapLng: number | null;

  // Step 6 — Photos / media
  images: UploadedFile[];
  videoLink: string;
  tourLink: string;

  // Step 7 — Documents
  documents: DraftDocument[];
  requestVerification: boolean;

  // Step 8 — Description
  titleAr: string;
  descriptionAr: string;
  highlights: string[];

  // Extra amenities (selected from list)
  amenities: string[];

  // Draft meta
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
}
