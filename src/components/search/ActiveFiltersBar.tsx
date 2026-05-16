"use client";

import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search.store";
import { getActiveFilterLabels } from "@/lib/helpers/listing-filters";

interface ActiveFiltersBarProps {
  className?: string;
}

// Keys that map to a single SearchFilters field reset
const FILTER_KEY_RESETS: Record<string, () => void> = {};

export function ActiveFiltersBar({ className }: ActiveFiltersBarProps) {
  const { filters, setFilter, setFilters, resetFilters, activeFilterCount } = useSearchStore();
  const labels = getActiveFilterLabels(filters);

  if (activeFilterCount === 0) return null;

  function removeFilter(key: string) {
    switch (key) {
      case "purpose":          setFilter("purpose", "all"); break;
      case "propertyTypes":    setFilter("propertyTypes", []); break;
      case "governorateId":    setFilters({ governorateId: "", wilayatId: "", areaId: "" }); break;
      case "price":            setFilters({ minPrice: null, maxPrice: null }); break;
      case "minBeds":          setFilter("minBeds", 0); break;
      case "minBaths":         setFilter("minBaths", 0); break;
      case "furnishing":       setFilter("furnishing", []); break;
      case "isVerified":       setFilter("isVerified", null); break;
      case "hasSeaView":       setFilter("hasSeaView", null); break;
      case "hasMountainView":  setFilter("hasMountainView", null); break;
      case "hasMajlis":        setFilter("hasMajlis", null); break;
      case "hasMaidRoom":      setFilter("hasMaidRoom", null); break;
      case "hasParking":       setFilter("hasParking", null); break;
      case "isFreehold":       setFilter("isFreehold", null); break;
      case "expatAllowed":     setFilter("expatAllowed", null); break;
      case "familyOnly":       setFilter("familyOnly", null); break;
      default: break;
    }
  }

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none", className)}>
      {labels.map((label) => (
        <button
          key={label.key}
          onClick={() => removeFilter(label.key)}
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium",
            "bg-[#FDEEE9] text-[#C65D3B] border border-[#F5C4B0]",
            "hover:bg-[#FAD9CC] transition-colors"
          )}
          aria-label={`إزالة الفلتر: ${label.label}`}
        >
          {label.label}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      ))}

      <button
        onClick={resetFilters}
        className="flex-shrink-0 flex items-center gap-1 px-3 h-8 rounded-full text-xs font-medium text-[#7A6B5E] hover:text-[#C65D3B] transition-colors whitespace-nowrap"
        aria-label="مسح جميع الفلاتر"
      >
        مسح الكل
      </button>
    </div>
  );
}
