import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "most_viewed"
  | "highest_roi";

export const SORT_LABELS: Record<SortOption, string> = {
  newest:       "الأحدث",
  price_asc:    "السعر: من الأقل",
  price_desc:   "السعر: من الأعلى",
  most_viewed:  "الأكثر مشاهدة",
  highest_roi:  "الأعلى عائداً",
};

export interface SearchFilters {
  query: string;
  purpose: "all" | "sale" | "rent";
  propertyTypes: string[];
  governorateId: string;
  wilayatId: string;
  areaId: string;
  minPrice: number | null;
  maxPrice: number | null;
  minBeds: number;
  minBaths: number;
  minArea: number | null;
  maxArea: number | null;
  amenities: string[];
  isVerified: boolean | null;
  furnishing: string[];
  directOwner: boolean | null;
  isFreehold: boolean | null;
  hasMajlis: boolean | null;
  hasMaidRoom: boolean | null;
  hasDriverRoom: boolean | null;
  hasParking: boolean | null;
  hasSeaView: boolean | null;
  hasMountainView: boolean | null;
  expatAllowed: boolean | null;
  familyOnly: boolean | null;
  sortBy: SortOption;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  purpose: "all",
  propertyTypes: [],
  governorateId: "",
  wilayatId: "",
  areaId: "",
  minPrice: null,
  maxPrice: null,
  minBeds: 0,
  minBaths: 0,
  minArea: null,
  maxArea: null,
  amenities: [],
  isVerified: null,
  furnishing: [],
  directOwner: null,
  isFreehold: null,
  hasMajlis: null,
  hasMaidRoom: null,
  hasDriverRoom: null,
  hasParking: null,
  hasSeaView: null,
  hasMountainView: null,
  expatAllowed: null,
  familyOnly: null,
  sortBy: "newest",
};

interface SearchState {
  filters: SearchFilters;
  activeFilterCount: number;
  isMapView: boolean;
  recentSearches: RecentSearch[];

  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  setFilters: (partial: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  toggleMapView: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

function countActiveFilters(f: SearchFilters): number {
  let count = 0;
  if (f.purpose !== "all") count++;
  if (f.propertyTypes.length) count++;
  if (f.governorateId) count++;
  if (f.minPrice !== null || f.maxPrice !== null) count++;
  if (f.minBeds > 0) count++;
  if (f.minBaths > 0) count++;
  if (f.minArea !== null || f.maxArea !== null) count++;
  if (f.amenities.length) count++;
  if (f.furnishing.length) count++;
  if (f.isVerified !== null) count++;
  if (f.directOwner !== null) count++;
  if (f.isFreehold !== null) count++;
  if (f.hasMajlis) count++;
  if (f.hasMaidRoom) count++;
  if (f.hasDriverRoom) count++;
  if (f.hasParking) count++;
  if (f.hasSeaView) count++;
  if (f.hasMountainView) count++;
  if (f.expatAllowed !== null) count++;
  if (f.familyOnly !== null) count++;
  return count;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      filters: { ...DEFAULT_FILTERS },
      activeFilterCount: 0,
      isMapView: false,
      recentSearches: [],

      setFilter: (key, value) =>
        set((s) => {
          const filters = { ...s.filters, [key]: value };
          return { filters, activeFilterCount: countActiveFilters(filters) };
        }),

      setFilters: (partial) =>
        set((s) => {
          const filters = { ...s.filters, ...partial };
          return { filters, activeFilterCount: countActiveFilters(filters) };
        }),

      resetFilters: () =>
        set({ filters: { ...DEFAULT_FILTERS }, activeFilterCount: 0 }),

      toggleMapView: () => set((s) => ({ isMapView: !s.isMapView })),

      addRecentSearch: (query) =>
        set((s) => {
          const trimmed = query.trim();
          if (!trimmed) return s;
          const filtered = s.recentSearches.filter((r) => r.query !== trimmed);
          const next: RecentSearch[] = [
            { query: trimmed, timestamp: Date.now() },
            ...filtered,
          ].slice(0, 8);
          return { recentSearches: next };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "maqar-search",
      partialize: (s) => ({
        recentSearches: s.recentSearches,
      }),
    }
  )
);
