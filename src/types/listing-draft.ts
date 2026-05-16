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

  // Step 3 — Property details
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;          // built-up sqm
  landArea: number | null;      // land sqm
  floors: number | null;
  parkingSpots: number | null;
  furnishing: FurnishingStatus | null;
  propertyAge: string | null;   // "0", "1", "2", "3-5", "5-10", "10+"
  availabilityDate: string | null; // ISO date string

  // Oman-specific boolean features
  hasMajlis: boolean;
  hasMaidRoom: boolean;
  hasDriverRoom: boolean;
  hasOutdoorKitchen: boolean;
  hasIndoorKitchen: boolean;
  hasYard: boolean;
  hasSeaView: boolean;
  hasMountainView: boolean;
  isFreehold: boolean;
  isExpatAllowed: boolean;
  isFamilyOnly: boolean;
  isBachelorAllowed: boolean;

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
