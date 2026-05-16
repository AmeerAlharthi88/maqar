export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

export type UserRole =
  | "admin"
  | "property_manager"
  | "agent"
  | "tenant"
  | "owner"
  | "guest";

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type { Listing, ListingStatus, ListingPurpose, PropertyType } from "./listing";
export type { Agent, AgentStats } from "./agent";
export type { Governorate, Wilayat, Area, LocationBreadcrumb } from "./location";
