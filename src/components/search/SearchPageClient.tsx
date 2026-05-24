"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search.store";
import { filterListings, sortListings } from "@/lib/helpers/listing-filters";
import { MOCK_LISTINGS } from "@/mock/listings";
import { searchListingsClient } from "@/lib/supabase/listings";
import type { Listing } from "@/types/listing";
import { ListingCardInteractive } from "@/components/real-estate/ListingCardInteractive";
import { SmartSearch } from "./SmartSearch";
import { SortDropdown } from "./SortDropdown";
import { ActiveFiltersBar } from "./ActiveFiltersBar";
import { SaveSearchButton } from "./SaveSearchButton";
import { SearchFilterSheet } from "./SearchFilterSheet";
import { SearchEmptyState, SearchResultsSkeletonGrid } from "./SearchSkeletons";
import { toArabicNumerals } from "@/lib/formatters";
import { useLanguageStore } from "@/store/language.store";

// Env vars are fixed at module load time — no need for useRef.
// When false, fall back to local MOCK_LISTINGS filtering.
const SUPABASE_LIVE: boolean = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
})();

// Controls whether an empty Supabase result falls back to filtered mock listings.
//
// Set NEXT_PUBLIC_ALLOW_MOCK_FALLBACK=true in staging / dev environments where
// the Supabase DB has no approved listings yet. This keeps chip-filter navigation
// and QA testing functional without seeding real data.
//
// Must be false (or omitted) in production: a genuine empty Supabase result must
// show the real empty state — never silently serve mock data to real users.
//
// Default: false (safe for production if the var is missing).
const ALLOW_MOCK_FALLBACK: boolean =
  process.env.NEXT_PUBLIC_ALLOW_MOCK_FALLBACK === "true";

type DisplayMode = "grid" | "list";

export function SearchPageClient() {
  const { filters, activeFilterCount, setFilters } = useSearchStore();
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // ── Phase 1: Restore filters from URL on mount ───────────────────────────────
  // Handles: direct links, page refresh, chip-driven navigation from home.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const patch: Parameters<typeof setFilters>[0] = {};

    const purpose = searchParams.get("purpose");
    if (purpose === "sale" || purpose === "rent") patch.purpose = purpose;

    const pt = searchParams.get("propertyType");
    if (pt) patch.propertyTypes = [pt];

    const gov = searchParams.get("governorate");
    if (gov) patch.governorateId = gov;

    const wil = searchParams.get("wilayat");
    if (wil) patch.wilayatId = wil;

    const area = searchParams.get("area");
    if (area) patch.areaId = area;

    const minPrice = searchParams.get("minPrice");
    if (minPrice) patch.minPrice = Number(minPrice);

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) patch.maxPrice = Number(maxPrice);

    const beds = searchParams.get("bedrooms");
    if (beds) patch.minBeds = Number(beds);

    const baths = searchParams.get("bathrooms");
    if (baths) patch.minBaths = Number(baths);

    if (Object.keys(patch).length > 0) setFilters(patch);
  }, []); // run once on mount only
  /* eslint-enable react-hooks/exhaustive-deps */

  // ── Phase 2: Write filters → URL whenever they change (skip first render) ────
  const isFirstRender = useRef(true);
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (filters.purpose !== "all")         params.set("purpose",     filters.purpose);
    if (filters.propertyTypes.length > 0)  params.set("propertyType", filters.propertyTypes[0]);
    if (filters.governorateId)             params.set("governorate",  filters.governorateId);
    if (filters.wilayatId)                 params.set("wilayat",      filters.wilayatId);
    if (filters.areaId)                    params.set("area",         filters.areaId);
    if (filters.minPrice !== null)         params.set("minPrice",     String(filters.minPrice));
    if (filters.maxPrice !== null)         params.set("maxPrice",     String(filters.maxPrice));
    if (filters.minBeds > 0)              params.set("bedrooms",     String(filters.minBeds));
    if (filters.minBaths > 0)             params.set("bathrooms",    String(filters.minBaths));

    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  }, [filters]);
  /* eslint-enable react-hooks/exhaustive-deps */
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");
  const [isLoading, setIsLoading] = useState(false);
  // null = not yet fetched or Supabase not configured → use mock
  const [dbListings, setDbListings] = useState<Listing[] | null>(null);


  // Fetch from Supabase whenever filters change
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!SUPABASE_LIVE) return; // skip if not configured

    let cancelled = false;
    setIsLoading(true);

    searchListingsClient(filters, 50).then(({ listings }) => {
      if (cancelled) return;
      setDbListings(listings);
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [filters]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Mock fallback: local filter + sort (used when Supabase is not configured)
  const filteredListings = useMemo(
    () => filterListings(MOCK_LISTINGS, filters),
    [filters]
  );
  const sortedListings = useMemo(
    () => sortListings(filteredListings, filters.sortBy),
    [filteredListings, filters.sortBy]
  );

  // Decide which list to display.
  //
  // Decision tree:
  //   1. Supabase not configured, or fetch not yet complete → use mock (filtered).
  //   2. Supabase returned ≥1 result → always use DB results.
  //   3. Supabase returned 0 results:
  //        staging (ALLOW_MOCK_FALLBACK=true)  → fall back to filtered mock so QA works.
  //        production (ALLOW_MOCK_FALLBACK=false) → show true empty state.
  const displayListings: Listing[] = (() => {
    if (!SUPABASE_LIVE || dbListings === null) return sortedListings;
    if (dbListings.length > 0)               return dbListings;
    // dbListings is empty — choose based on environment flag
    return ALLOW_MOCK_FALLBACK ? sortedListings : dbListings;
  })();

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky search + filter bar */}
      <div className="sticky top-14 z-[90] bg-white/95 backdrop-blur-md border-b border-[#F0EBE3] px-4 py-3 flex flex-col gap-3">
        <SmartSearch
          size="md"
          onSearch={() => {}}
          placeholder={isAr ? "ابحث بالنوع أو المنطقة أو العنوان..." : "Search by type, area or title..."}
        />

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => setFilterSheetOpen(true)}
            className={cn(
              "flex items-center gap-2 px-3 h-9 rounded-xl text-xs font-semibold",
              "border transition-colors whitespace-nowrap",
              activeFilterCount > 0
                ? "bg-[#C65D3B] text-white border-[#C65D3B]"
                : "bg-white text-[#7A6B5E] border-[#E8DDD0] hover:border-[#C65D3B]"
            )}
            aria-label={isAr ? `فتح الفلاتر${activeFilterCount > 0 ? ` — ${activeFilterCount} نشط` : ""}` : `Open filters${activeFilterCount > 0 ? ` — ${activeFilterCount} active` : ""}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            {isAr ? "الفلاتر" : "Filters"}
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#C65D3B] text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SortDropdown />

          <div className="flex-1" />

          <SaveSearchButton />

          {/* Grid / list toggle */}
          <div className="flex border border-[#E8DDD0] rounded-xl overflow-hidden">
            <button
              onClick={() => setDisplayMode("grid")}
              aria-label="عرض شبكي"
              aria-pressed={displayMode === "grid"}
              className={cn(
                "w-9 h-9 flex items-center justify-center transition-colors",
                displayMode === "grid" ? "bg-[#C65D3B] text-white" : "bg-white text-[#A89480] hover:bg-[#FAF7F2]"
              )}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              onClick={() => setDisplayMode("list")}
              aria-label="عرض قائمة"
              aria-pressed={displayMode === "list"}
              className={cn(
                "w-9 h-9 flex items-center justify-center transition-colors",
                displayMode === "list" ? "bg-[#C65D3B] text-white" : "bg-white text-[#A89480] hover:bg-[#FAF7F2]"
              )}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Active filters */}
        {activeFilterCount > 0 && <ActiveFiltersBar />}
      </div>

      {/* Results area */}
      <div className="flex-1 px-4 py-4">
        {isLoading ? (
          <SearchResultsSkeletonGrid />
        ) : displayListings.length === 0 ? (
          <SearchEmptyState query={filters.query} />
        ) : (
          <>
            {/* Result count */}
            <p className="text-sm text-[#7A6B5E] mb-4">
              <span className="font-bold text-[#1E1E1E]">
                {isAr ? toArabicNumerals(displayListings.length) : displayListings.length}
              </span>{" "}
              {isAr ? "عقار متاح" : "properties found"}
            </p>

            {/* Listings */}
            {displayMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {displayListings.map((listing) => (
                  <ListingCardInteractive key={listing.id} listing={listing} variant="card" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {displayListings.map((listing) => (
                  <ListingCardInteractive key={listing.id} listing={listing} variant="row" />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter sheet */}
      <SearchFilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        resultCount={displayListings.length}
      />
    </div>
  );
}
