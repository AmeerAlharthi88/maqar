"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useSearchStore } from "@/store/search.store";
import { useMapStore } from "@/store/map.store";
import { MOCK_LISTINGS } from "@/mock/listings";
import {
  filterListings,
} from "@/lib/helpers/listing-filters";
import {
  getListingsWithCoordinates,
} from "@/lib/helpers/map-utils";
import { SearchFilterSheet } from "@/components/search/SearchFilterSheet";
import { MapToolbar } from "./MapToolbar";
import { MapFilterChips } from "./MapFilterChips";
import { MapPreviewCard } from "./MapPreviewCard";
import { MapLayerControls } from "./MapLayerControls";
import { MapListView } from "./MapListView";
import {
  MapLoadingState,
  MapEmptyState,
  MapLocationDeniedToast,
  MapNoSelectionHint,
} from "./MapStates";

// ── Dynamic Leaflet import — SSR disabled ──────────────────────────────────────
// Leaflet uses browser APIs (window, document) that are unavailable on the server.

const DynamicMapClient = dynamic(
  () => import("./MapClient").then((m) => ({ default: m.MapClient })),
  {
    ssr: false,
    loading: () => <MapLoadingState />,
  }
);

// ── Main client component ──────────────────────────────────────────────────────

export function MapPageClient() {
  const { filters, activeFilterCount } = useSearchStore();
  const {
    selectedListingId,
    viewMode,
    userLocationStatus,
    selectListing,
    setViewMode,
    setUserLocationStatus,
    resetMap,
  } = useMapStore();

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // ── Derived data ─────────────────────────────────────────────────────────────

  const filteredListings = useMemo(
    () => filterListings(MOCK_LISTINGS, filters),
    [filters]
  );

  // Only show listings that have valid coordinates on the map
  const mapListings = useMemo(
    () => getListingsWithCoordinates(filteredListings),
    [filteredListings]
  );

  const selectedListing = useMemo(
    () =>
      selectedListingId
        ? mapListings.find((l) => l.id === selectedListingId) ?? null
        : null,
    [mapListings, selectedListingId]
  );

  const isFiltered = activeFilterCount > 0;

  // ── Handlers ──────────────────────────────────────────────────────────────────

  function handleSelectListing(id: string | null) {
    selectListing(id);
    if (id) setHasInteracted(true);
  }

  function handleToggleView() {
    setViewMode(viewMode === "map" ? "list" : "map");
    selectListing(null);
  }

  function handleResetFilters() {
    useSearchStore.getState().resetFilters();
    resetMap();
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Map view ─────────────────────────────────────────────────────────── */}
      {viewMode === "map" && (
        <div className="fixed inset-0 z-[50]">
          <DynamicMapClient
            listings={mapListings}
            selectedListingId={selectedListingId}
            onSelectListing={handleSelectListing}
          />
        </div>
      )}

      {/* ── List view ────────────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <MapListView
          listings={filteredListings}
          isFiltered={isFiltered}
        />
      )}

      {/* ── Toolbar (always visible above map / list) ─────────────────────── */}
      <MapToolbar
        viewMode={viewMode}
        onToggleView={handleToggleView}
        onFilterOpen={() => setFilterSheetOpen(true)}
      />

      {/* ── Active filter chips (below toolbar, when filters active) ─────── */}
      <MapFilterChips onFilterOpen={() => setFilterSheetOpen(true)} />

      {/* ── Layer controls (map view only) ───────────────────────────────── */}
      {viewMode === "map" && <MapLayerControls />}

      {/* ── Listing preview card (map view, marker selected) ─────────────── */}
      {viewMode === "map" && selectedListing && (
        <MapPreviewCard
          listing={selectedListing}
          onClose={() => selectListing(null)}
        />
      )}

      {/* ── Hint: tap a marker (map view, nothing selected, first visit) ─── */}
      {viewMode === "map" &&
        !selectedListing &&
        mapListings.length > 0 &&
        !hasInteracted && <MapNoSelectionHint />}

      {/* ── Empty state (map view, no results) ───────────────────────────── */}
      {viewMode === "map" && mapListings.length === 0 && (
        <MapEmptyState onReset={isFiltered ? handleResetFilters : undefined} />
      )}

      {/* ── Location denied toast ─────────────────────────────────────────── */}
      {userLocationStatus === "denied" && (
        <MapLocationDeniedToast
          onDismiss={() => setUserLocationStatus("idle")}
        />
      )}
      {userLocationStatus === "unavailable" && (
        <MapLocationDeniedToast
          onDismiss={() => setUserLocationStatus("idle")}
        />
      )}

      {/* ── Filter sheet (reused from Phase 5) ───────────────────────────── */}
      <SearchFilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        resultCount={filteredListings.length}
      />
    </>
  );
}
