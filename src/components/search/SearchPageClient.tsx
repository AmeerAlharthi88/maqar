"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

// Env vars are fixed at module load time — no need for useRef.
// When false, fall back to local MOCK_LISTINGS filtering.
const SUPABASE_LIVE: boolean = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
})();

type DisplayMode = "grid" | "list";

export function SearchPageClient() {
  const { filters, activeFilterCount, setFilter } = useSearchStore();
  const searchParams = useSearchParams();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Sync ?propertyType URL param to filter store on mount.
  // Handles: direct links, page refresh, and chip-driven navigation from home.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const pt = searchParams.get("propertyType");
    if (pt) {
      setFilter("propertyTypes", [pt]);
    }
  }, []); // run once on mount only
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

  // Decide which list to display
  const displayListings: Listing[] =
    SUPABASE_LIVE && dbListings !== null
      ? dbListings          // DB results (already sorted by Supabase)
      : sortedListings;     // local mock fallback

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky search + filter bar */}
      <div className="sticky top-14 z-[90] bg-white/95 backdrop-blur-md border-b border-[#F0EBE3] px-4 py-3 flex flex-col gap-3">
        <SmartSearch
          size="md"
          onSearch={() => {}}
          placeholder="ابحث بالنوع أو المنطقة أو العنوان..."
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
            aria-label={`فتح الفلاتر${activeFilterCount > 0 ? ` — ${activeFilterCount} نشط` : ""}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            الفلاتر
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
              <span className="font-bold text-[#1E1E1E]">{toArabicNumerals(displayListings.length)}</span> عقار متاح
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
