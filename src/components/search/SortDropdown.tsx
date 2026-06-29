"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search.store";
import { useTranslation } from "@/i18n/useTranslation";
import type { SortOption } from "@/store/search.store";

interface SortDropdownProps {
  className?: string;
}

export function SortDropdown({ className }: SortDropdownProps) {
  const { filters, setFilter } = useSearchStore();
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Bilingual sort labels
  const SORT_OPTIONS: { value: SortOption; labelAr: string; labelEn: string }[] = [
    { value: "newest",       labelAr: "الأحدث",                labelEn: "Newest" },
    { value: "price_asc",   labelAr: "السعر: من الأقل",       labelEn: "Price: Low to High" },
    { value: "price_desc",  labelAr: "السعر: من الأعلى",      labelEn: "Price: High to Low" },
    { value: "most_viewed", labelAr: "الأكثر مشاهدة",         labelEn: "Most Viewed" },
    { value: "highest_roi", labelAr: "الأعلى عائداً",          labelEn: "Highest ROI" },
  ];

  const currentLabel = SORT_OPTIONS.find((o) => o.value === filters.sortBy);
  const optionLabel = isAr ? (currentLabel?.labelAr ?? "الأحدث") : (currentLabel?.labelEn ?? "Newest");
  // Prefix so the toolbar button reads as a sort control, not a filter (FP17D).
  const displayLabel = `${isAr ? "الترتيب: " : "Sort: "}${optionLabel}`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-2 px-3 h-9 rounded-xl text-xs font-semibold",
          "border border-[#E2E8F0] bg-white text-[#627D98] hover:border-[#0A3C36] transition-colors",
          "whitespace-nowrap"
        )}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        {displayLabel}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={cn("transition-transform", open && "rotate-180")}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("search.sort.label")}
          className="absolute top-full end-0 mt-1 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_8px_24px_0_rgb(10_60_54/0.10)] z-50 min-w-[180px] overflow-hidden"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={filters.sortBy === opt.value}
              onClick={() => {
                setFilter("sortBy", opt.value);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors text-start",
                filters.sortBy === opt.value
                  ? "bg-[#E6F0EF] text-[#0A3C36] font-semibold"
                  : "text-[#102A43] hover:bg-[#F0F4F8]"
              )}
            >
              {isAr ? opt.labelAr : opt.labelEn}
              {filters.sortBy === opt.value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
