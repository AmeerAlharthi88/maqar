"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import { COMMON_AMENITIES } from "@/lib/constants/property-types";
import { useTranslation } from "@/i18n/useTranslation";
import { formatNumber } from "@/lib/formatters";

export interface FilterState {
  purpose: "all" | "sale" | "rent";
  propertyTypes: string[];
  minPrice: string;
  maxPrice: string;
  minBeds: number;
  amenities: string[];
}

const defaultFilters: FilterState = {
  purpose: "all",
  propertyTypes: [],
  minPrice: "",
  maxPrice: "",
  minBeds: 0,
  amenities: [],
};

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export function FilterBottomSheet({ open, onClose, onApply, initialFilters }: FilterBottomSheetProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters, ...initialFilters });

  function toggle<K extends keyof FilterState>(key: K, value: string) {
    const arr = filters[key] as string[];
    setFilters((f) => ({
      ...f,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    }));
  }

  function reset() {
    setFilters(defaultFilters);
  }

  function apply() {
    onApply(filters);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={t("search.filters.title")} snapToContent={false}>
      <div className="flex flex-col gap-6 p-5">
        {/* Purpose */}
        <section>
          <p className="text-sm font-semibold text-[#102A43] mb-3">{t("search.filters.purpose")}</p>
          <div className="flex gap-2">
            {(["all", "sale", "rent"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilters((f) => ({ ...f, purpose: p }))}
                className={`flex-1 h-10 rounded-xl text-sm font-medium transition-colors border ${
                  filters.purpose === p
                    ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                    : "bg-white text-[#627D98] border-[#E2E8F0]"
                }`}
              >
                {p === "all"
                  ? t("search.filters.any")
                  : p === "sale"
                  ? t("addListing.purpose.sale")
                  : t("addListing.purpose.rent")}
              </button>
            ))}
          </div>
        </section>

        {/* Property type */}
        <section>
          <p className="text-sm font-semibold text-[#102A43] mb-3">{t("search.filters.propertyType")}</p>
          <div className="flex flex-col gap-2">
            {PROPERTY_TYPES.slice(0, 5).map((pt) => (
              <Checkbox
                key={pt.value}
                label={isAr ? pt.labelAr : (pt.labelEn ?? pt.labelAr)}
                checked={filters.propertyTypes.includes(pt.value)}
                onChange={() => toggle("propertyTypes", pt.value)}
              />
            ))}
          </div>
        </section>

        {/* Bedrooms */}
        <section>
          <p className="text-sm font-semibold text-[#102A43] mb-3">
            {t("search.filters.minBeds")}
          </p>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setFilters((f) => ({ ...f, minBeds: n }))}
                className={`flex-1 h-10 rounded-xl text-sm font-medium transition-colors border ${
                  filters.minBeds === n
                    ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                    : "bg-white text-[#627D98] border-[#E2E8F0]"
                }`}
              >
                {n === 0
                  ? t("search.filters.any")
                  : n === 5
                  ? `${formatNumber(5, locale)}+`
                  : formatNumber(n, locale)}
              </button>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section>
          <p className="text-sm font-semibold text-[#102A43] mb-3">{t("search.filters.amenities")}</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_AMENITIES.slice(0, 10).map((a) => (
              <button
                key={a}
                onClick={() => toggle("amenities", a)}
                className={`px-3 h-8 rounded-full text-xs font-medium transition-colors border ${
                  filters.amenities.includes(a)
                    ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                    : "bg-white text-[#627D98] border-[#E2E8F0]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 p-5 bg-white border-t border-[#E2E8F0] flex gap-3">
        <Button variant="outline" size="md" className="flex-1" onClick={reset}>
          {t("common.clearAll")}
        </Button>
        <Button variant="primary" size="md" className="flex-1" onClick={apply}>
          {t("search.filters.apply")}
        </Button>
      </div>
    </BottomSheet>
  );
}
