"use client";

import { useSearchStore } from "@/store/search.store";
import { getActiveFilterLabels } from "@/lib/helpers/listing-filters";
import { cn } from "@/lib/utils";

interface MapFilterChipsProps {
  onFilterOpen: () => void;
}

export function MapFilterChips({ onFilterOpen }: MapFilterChipsProps) {
  const { filters, activeFilterCount, setFilter, setFilters, resetFilters } =
    useSearchStore();

  if (activeFilterCount === 0) return null;

  const labels = getActiveFilterLabels(filters);

  function removeFilter(key: string) {
    switch (key) {
      case "purpose":         setFilter("purpose", "all"); break;
      case "propertyTypes":   setFilter("propertyTypes", []); break;
      case "governorateId":   setFilters({ governorateId: "", wilayatId: "", areaId: "" }); break;
      case "price":           setFilters({ minPrice: null, maxPrice: null }); break;
      case "minBeds":         setFilter("minBeds", 0); break;
      case "minBaths":        setFilter("minBaths", 0); break;
      case "furnishing":      setFilter("furnishing", []); break;
      case "isVerified":      setFilter("isVerified", null); break;
      case "hasSeaView":      setFilter("hasSeaView", null); break;
      case "hasMountainView": setFilter("hasMountainView", null); break;
      case "hasMajlis":       setFilter("hasMajlis", null); break;
      case "hasMaidRoom":     setFilter("hasMaidRoom", null); break;
      case "hasParking":      setFilter("hasParking", null); break;
      case "isFreehold":      setFilter("isFreehold", null); break;
      case "expatAllowed":    setFilter("expatAllowed", null); break;
      case "familyOnly":      setFilter("familyOnly", null); break;
      case "directOwner":     setFilter("directOwner", null); break;
      case "area":            setFilters({ minArea: null, maxArea: null }); break;
      case "hasDriverRoom":   setFilter("hasDriverRoom", null); break;
      default: break;
    }
  }

  return (
    <div
      className="fixed left-0 right-0 z-[68]"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 62px)" }}
      aria-label="الفلاتر النشطة"
    >
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-3 py-1.5">
        {/* All-filters chip that opens the sheet */}
        <button
          onClick={onFilterOpen}
          aria-label="فتح لوحة الفلاتر"
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-semibold",
            "bg-[#C65D3B] text-white border border-[#C65D3B]",
            "hover:bg-[#B34F2F] transition-colors"
          )}
        >
          <svg
            width="11"
            height="11"
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
          {activeFilterCount} فلاتر
        </button>

        {/* Individual filter chips */}
        {labels.map((label) => (
          <button
            key={label.key}
            onClick={() => removeFilter(label.key)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium",
              "bg-white text-[#C65D3B] border border-[#F5C4B0]",
              "hover:bg-[#FDEEE9] transition-colors shadow-sm"
            )}
            aria-label={`إزالة فلتر: ${label.label}`}
          >
            {label.label}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ))}

        {/* Clear all */}
        <button
          onClick={resetFilters}
          className="flex-shrink-0 flex items-center gap-1 px-3 h-8 rounded-full text-xs font-medium text-[#7A6B5E] bg-white border border-[#E8DDD0] hover:border-[#C65D3B] hover:text-[#C65D3B] transition-colors shadow-sm whitespace-nowrap"
          aria-label="مسح جميع الفلاتر"
        >
          مسح الكل
        </button>
      </div>
    </div>
  );
}
