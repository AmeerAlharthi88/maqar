"use client";

import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search.store";
import { useLanguageStore } from "@/store/language.store";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import { ROUTES } from "@/config/routes";
import { usePathname, useRouter } from "next/navigation";
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
  farm: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
    </svg>
  ),
  chalet: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11l9-9 9 9v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  building: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="1"/>
      <path d="M9 22V12h6v10M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>
    </svg>
  ),
  hotel_apartment: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
    </svg>
  ),
};

interface PropertyTypeChipsProps {
  className?: string;
  onSelect?: (type: PropertyType | null) => void;
}

export function PropertyTypeChips({ className, onSelect }: PropertyTypeChipsProps) {
  const { filters, setFilter } = useSearchStore();
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  const pathname = usePathname();
  const router = useRouter();
  const active = filters.propertyTypes[0] as PropertyType | undefined;
  const isHome = pathname === "/";

  function handleSelect(value: PropertyType) {
    const isDeselect = active === value;
    const next: PropertyType[] = isDeselect ? [] : [value];
    setFilter("propertyTypes", next);
    const selected = next.length ? next[0] : null;
    onSelect?.(selected);

    // On the home page a specific chip navigates to /search with the type pre-selected.
    // Deselecting (tapping the active chip again) stays on home and clears the filter.
    if (isHome && !isDeselect) {
      router.push(`${ROUTES.search}?propertyType=${value}`);
    }
  }

  function handleAll() {
    setFilter("propertyTypes", []);
    onSelect?.(null);
    // On home "All" just clears the store — no navigation needed.
  }

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 scrollbar-none",
        "-mx-4 px-4",
        className
      )}
      role="group"
      aria-label={isAr ? "نوع العقار" : "Property Type"}
    >
      {/* All chip */}
      <button
        onClick={handleAll}
        className={cn(
          "flex-shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold",
          "border transition-colors whitespace-nowrap",
          !active
            ? "bg-[#0A3C36] text-white border-[#0A3C36]"
            : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36] hover:text-[#0A3C36]"
        )}
        aria-pressed={!active}
      >
        {isAr ? "الكل" : "All"}
      </button>

      {PROPERTY_TYPES.map((pt) => (
        <button
          key={pt.value}
          onClick={() => handleSelect(pt.value)}
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold",
            "border transition-colors whitespace-nowrap",
            active === pt.value
              ? "bg-[#0A3C36] text-white border-[#0A3C36]"
              : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36] hover:text-[#0A3C36]"
          )}
          aria-pressed={active === pt.value}
        >
          <span className="flex-shrink-0">{CHIP_ICONS[pt.value]}</span>
          {isAr ? pt.labelAr : pt.labelEn}
        </button>
      ))}
    </div>
  );
}
