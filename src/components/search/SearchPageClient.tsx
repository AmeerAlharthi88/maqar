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
import { formatNumber } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";

const SUPABASE_LIVE: boolean = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
})();

const ALLOW_MOCK_FALLBACK: boolean =
  process.env.NEXT_PUBLIC_ALLOW_MOCK_FALLBACK === "true";

type DisplayMode = "grid" | "list";

export function SearchPageClient() {
  const { filters, activeFilterCount, setFilters } = useSearchStore();
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // ── Phase 1: Restore filters from URL on mount ───────────────────────────────
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
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

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
  const [dbListings, setDbListings] = useState<Listing[] | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!SUPABASE_LIVE) return;
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

  const filteredListings = useMemo(
    () => filterListings(MOCK_LISTINGS, filters),
    [filters]
  );
  const sortedListings = useMemo(
    () => sortListings(filteredListings, filters.sortBy),
    [filteredListings, filters.sortBy]
  );

  const displayListings: Listing[] = (() => {
    if (!SUPABASE_LIVE || dbListings === null) return sortedListings;
    if (dbListings.length > 0)               return dbListings;
    return ALLOW_MOCK_FALLBACK ? sortedListings : dbListings;
  })();

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky search + filter bar — pins to the very top on mobile (no mobile
          header exists), and below the lg header on desktop. Solid background (no
          translucent blur) so cards never bleed through while scrolling (FP17D). */}
      <div className="sticky top-0 lg:top-14 z-[90] bg-white border-b border-[#E2E8F0] shadow-sm px-4 py-2.5 flex flex-col gap-2.5">
        <SmartSearch size="md" onSearch={() => {}} />

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => setFilterSheetOpen(true)}
            className={cn(
              "flex items-center gap-2 px-3 h-9 rounded-xl text-xs font-semibold",
              "border transition-colors whitespace-nowrap",
              activeFilterCount > 0
                ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36]"
            )}
            aria-label={`${t("common.filter")}${activeFilterCount > 0 ? ` — ${activeFilterCount}` : ""}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            {t("common.filter")}
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#0A3C36] text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SortDropdown />

          <div className="flex-1" />

          <SaveSearchButton />

          {/* Grid / list toggle — desktop only; mobile is a single column so the
              toggle has no real effect and only crowds the toolbar (FP17D). */}
          <div className="hidden lg:flex border border-[#E2E8F0] rounded-xl overflow-hidden">
            <button
              onClick={() => setDisplayMode("grid")}
              aria-label={isAr ? "عرض شبكي" : "Grid view"}
              aria-pressed={displayMode === "grid"}
              className={cn(
                "w-9 h-9 flex items-center justify-center transition-colors",
                displayMode === "grid" ? "bg-[#0A3C36] text-white" : "bg-white text-[#627D98] hover:bg-[#F0F4F8]"
              )}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              onClick={() => setDisplayMode("list")}
              aria-label={isAr ? "عرض قائمة" : "List view"}
              aria-pressed={displayMode === "list"}
              className={cn(
                "w-9 h-9 flex items-center justify-center transition-colors",
                displayMode === "list" ? "bg-[#0A3C36] text-white" : "bg-white text-[#627D98] hover:bg-[#F0F4F8]"
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
          <SearchEmptyState query={filters.query} locale={locale as "ar" | "en"} />
        ) : (
          <>
            {/* Result count (FP13 #5) */}
            <p className="text-sm text-[#627D98] mb-4" role="status" aria-live="polite">
              {isAr ? (
                <>
                  تم العثور على{" "}
                  <span className="font-bold text-[#102A43]">
                    {formatNumber(displayListings.length, locale)}
                  </span>{" "}
                  عقار
                </>
              ) : (
                <>
                  <span className="font-bold text-[#102A43]">
                    {formatNumber(displayListings.length, locale)}
                  </span>{" "}
                  properties found
                </>
              )}
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
