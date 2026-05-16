"use client";

import { useSearchStore } from "@/store/search.store";
import { SmartSearch } from "@/components/search/SmartSearch";
import { cn } from "@/lib/utils";
import type { MapViewMode } from "@/store/map.store";

interface MapToolbarProps {
  viewMode: MapViewMode;
  onToggleView: () => void;
  onFilterOpen: () => void;
}

export function MapToolbar({
  viewMode,
  onToggleView,
  onFilterOpen,
}: MapToolbarProps) {
  const { activeFilterCount, setFilter } = useSearchStore();

  return (
    <div
      className="fixed left-0 right-0 z-[70]"
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Search bar — takes remaining space */}
          <SmartSearch
            size="sm"
            className="flex-1 min-w-0"
            placeholder="ابحث في الخريطة..."
            onSearch={(q) => setFilter("query", q)}
          />

          {/* Filter button */}
          <button
            onClick={onFilterOpen}
            aria-label={`الفلاتر${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`}
            className={cn(
              "relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
              "border shadow-sm transition-colors",
              activeFilterCount > 0
                ? "bg-[#C65D3B] border-[#C65D3B] text-white"
                : "bg-white border-[#E8DDD0] text-[#7A6B5E] hover:border-[#C65D3B] hover:text-[#C65D3B]"
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>

            {/* Badge */}
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] rounded-full bg-white text-[#C65D3B] text-[10px] font-bold flex items-center justify-center border border-[#C65D3B] px-1"
                aria-hidden="true"
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Map / List toggle */}
          <button
            onClick={onToggleView}
            aria-label={viewMode === "map" ? "عرض القائمة" : "عرض الخريطة"}
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-white border border-[#E8DDD0] text-[#7A6B5E]",
              "hover:border-[#C65D3B] hover:text-[#C65D3B] transition-colors shadow-sm"
            )}
          >
            {viewMode === "map" ? (
              /* List icon */
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            ) : (
              /* Map icon */
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
