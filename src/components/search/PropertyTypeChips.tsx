"use client";

import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search.store";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import type { PropertyType } from "@/types/listing";

const CHIP_ICONS: Record<string, React.ReactNode> = {
  apartment: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
    </svg>
  ),
  villa: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
    </svg>
  ),
  duplex: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <line x1="3" y1="13" x2="21" y2="13"/>
    </svg>
  ),
  townhouse: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 20V10l5-6 5 6v10M13 20V10l5-6 5 6v10"/>
    </svg>
  ),
  land: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 20h18M5 20V10l7-7 7 7v10"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
  commercial: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 20h20V8l-10-5L2 8v12z"/><path d="M9 20v-8h6v8"/>
    </svg>
  ),
  office: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  warehouse: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 20V8l10-5 10 5v12"/><rect x="7" y="13" width="10" height="7" rx="1"/>
    </svg>
  ),
  arabic_house: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 12a3 3 0 0 0 6 0"/>
    </svg>
  ),
};

interface PropertyTypeChipsProps {
  className?: string;
  onSelect?: (type: PropertyType | null) => void;
}

export function PropertyTypeChips({ className, onSelect }: PropertyTypeChipsProps) {
  const { filters, setFilter } = useSearchStore();
  const active = filters.propertyTypes[0] as PropertyType | undefined;

  function handleSelect(value: PropertyType) {
    const next = active === value ? [] : [value];
    setFilter("propertyTypes", next);
    onSelect?.(next.length ? next[0] : null);
  }

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 scrollbar-none",
        "-mx-4 px-4", // bleed to edges, restore padding inside
        className
      )}
      role="group"
      aria-label="نوع العقار"
    >
      {/* All chip */}
      <button
        onClick={() => {
          setFilter("propertyTypes", []);
          onSelect?.(null);
        }}
        className={cn(
          "flex-shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold",
          "border transition-colors whitespace-nowrap",
          !active
            ? "bg-[#C65D3B] text-white border-[#C65D3B]"
            : "bg-white text-[#7A6B5E] border-[#E8DDD0] hover:border-[#C65D3B]"
        )}
        aria-pressed={!active}
      >
        الكل
      </button>

      {PROPERTY_TYPES.map((pt) => (
        <button
          key={pt.value}
          onClick={() => handleSelect(pt.value)}
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold",
            "border transition-colors whitespace-nowrap",
            active === pt.value
              ? "bg-[#C65D3B] text-white border-[#C65D3B]"
              : "bg-white text-[#7A6B5E] border-[#E8DDD0] hover:border-[#C65D3B]"
          )}
          aria-pressed={active === pt.value}
        >
          <span className="flex-shrink-0">{CHIP_ICONS[pt.value]}</span>
          {pt.labelAr}
        </button>
      ))}
    </div>
  );
}
