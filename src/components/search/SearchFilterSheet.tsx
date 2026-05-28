"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { useSearchStore } from "@/store/search.store";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";
import { FURNISHING_LABELS_I18N } from "@/lib/constants/property-types";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

interface SearchFilterSheetProps {
  open: boolean;
  onClose: () => void;
  resultCount?: number;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pb-5 border-b border-[#F0F4F8] last:border-0">
      <p className="text-sm font-bold text-[#102A43] mb-3">{title}</p>
      {children}
    </section>
  );
}

function PurposeBtn({ label, active, onClick }: { label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 h-10 rounded-xl text-sm font-semibold transition-colors border",
        active ? "bg-[#0A3C36] text-white border-[#0A3C36]" : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36]"
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function CounterBtn({ value, onDecrement, onIncrement, min = 0, anyLabel }: { value: number; onDecrement: () => void; onIncrement: () => void; min?: number; anyLabel: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#627D98] disabled:opacity-40 hover:border-[#0A3C36] hover:text-[#0A3C36] transition-colors"
        aria-label="−"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <span className="w-8 text-center text-sm font-bold text-[#102A43]">{value === 0 ? anyLabel : `+${value}`}</span>
      <button
        onClick={onIncrement}
        className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#627D98] hover:border-[#0A3C36] hover:text-[#0A3C36] transition-colors"
        aria-label="+"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
}

function BoolChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 h-8 rounded-full text-xs font-semibold border transition-colors",
        active ? "bg-[#0A3C36] text-white border-[#0A3C36]" : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36]"
      )}
    >
      {label}
    </button>
  );
}

export function SearchFilterSheet({ open, onClose, resultCount }: SearchFilterSheetProps) {
  const { filters, setFilters, resetFilters } = useSearchStore();
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  const [draft, setDraft] = useState(() => ({ ...filters }));

  function update<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function toggleArr(key: "propertyTypes" | "furnishing", val: string) {
    const arr = draft[key] as string[];
    const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
    update(key, next as (typeof draft)[typeof key]);
  }

  function handleApply() {
    setFilters(draft);
    onClose();
  }

  function handleReset() {
    const reset = {
      purpose: "all" as const,
      propertyTypes: [] as string[],
      governorateId: "",
      wilayatId: "",
      areaId: "",
      minPrice: null,
      maxPrice: null,
      minBeds: 0,
      minBaths: 0,
      minArea: null,
      maxArea: null,
      furnishing: [] as string[],
      isVerified: null,
      isFreehold: null,
      hasMajlis: null,
      hasMaidRoom: null,
      hasDriverRoom: null,
      hasParking: null,
      hasSeaView: null,
      hasMountainView: null,
      expatAllowed: null,
      familyOnly: null,
      amenities: [] as string[],
    };
    setDraft((d) => ({ ...d, ...reset }));
  }

  const selectedGov = OMAN_GOVERNORATES.find((g) => g.id === draft.governorateId);
  const wilayats = selectedGov?.wilayats ?? [];
  const selectedWilayat = wilayats.find((w) => w.id === draft.wilayatId);
  const areas = selectedWilayat?.areas ?? [];

  const anyLabel = t("search.filters.any");

  return (
    <BottomSheet open={open} onClose={onClose} title={t("search.filters.title")} snapToContent={false}>
      <div className="flex flex-col gap-5 p-5">

        {/* Purpose */}
        <FilterSection title={t("search.filters.purpose")}>
          <div className="flex gap-2">
            <PurposeBtn label={t("search.filters.any")} value="all" active={draft.purpose === "all"} onClick={() => update("purpose", "all")} />
            <PurposeBtn label={t("addListing.purpose.sale")} value="sale" active={draft.purpose === "sale"} onClick={() => update("purpose", "sale")} />
            <PurposeBtn label={t("addListing.purpose.rent")} value="rent" active={draft.purpose === "rent"} onClick={() => update("purpose", "rent")} />
          </div>
        </FilterSection>

        {/* Property type */}
        <FilterSection title={t("search.filters.propertyType")}>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((pt) => (
              <button
                key={pt.value}
                onClick={() => toggleArr("propertyTypes", pt.value)}
                aria-pressed={draft.propertyTypes.includes(pt.value)}
                className={cn(
                  "px-3 h-9 rounded-full text-xs font-semibold border transition-colors",
                  draft.propertyTypes.includes(pt.value)
                    ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                    : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36]"
                )}
              >
                {isAr ? pt.labelAr : (pt.labelEn ?? pt.labelAr)}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection title={t("addListing.location.title")}>
          <div className="flex flex-col gap-2">
            <select
              value={draft.governorateId}
              onChange={(e) => {
                update("governorateId", e.target.value);
                update("wilayatId", "");
                update("areaId", "");
              }}
              className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] bg-white outline-none focus:border-[#0A3C36]"
              aria-label={t("search.filters.governorate")}
            >
              <option value="">{t("addListing.location.selectGovernorate")}</option>
              {OMAN_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>{isAr ? g.nameAr : (g.nameEn ?? g.nameAr)}</option>
              ))}
            </select>

            {wilayats.length > 0 && (
              <select
                value={draft.wilayatId}
                onChange={(e) => {
                  update("wilayatId", e.target.value);
                  update("areaId", "");
                }}
                className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] bg-white outline-none focus:border-[#0A3C36]"
                aria-label={t("search.filters.wilayat")}
              >
                <option value="">{t("addListing.location.selectWilayat")}</option>
                {wilayats.map((w) => (
                  <option key={w.id} value={w.id}>{isAr ? w.nameAr : (w.nameEn ?? w.nameAr)}</option>
                ))}
              </select>
            )}

            {areas.length > 0 && (
              <select
                value={draft.areaId}
                onChange={(e) => update("areaId", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] bg-white outline-none focus:border-[#0A3C36]"
                aria-label={t("search.filters.area")}
              >
                <option value="">{t("addListing.location.selectArea")}</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{isAr ? a.nameAr : (a.nameEn ?? a.nameAr)}</option>
                ))}
              </select>
            )}
          </div>
        </FilterSection>

        {/* Price range */}
        <FilterSection title={`${t("search.filters.priceRange")} (${t("common.omr")})`}>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={draft.minPrice ?? ""}
              onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : null)}
              placeholder={t("search.filters.from")}
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] outline-none focus:border-[#0A3C36]"
              aria-label={t("search.filters.minPrice")}
              dir="ltr"
            />
            <span className="text-[#627D98] text-sm">—</span>
            <input
              type="number"
              value={draft.maxPrice ?? ""}
              onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : null)}
              placeholder={t("search.filters.to")}
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] outline-none focus:border-[#0A3C36]"
              aria-label={t("search.filters.maxPrice")}
              dir="ltr"
            />
          </div>
        </FilterSection>

        {/* Bedrooms / Bathrooms */}
        <FilterSection title={`${t("search.filters.bedrooms")} & ${t("search.filters.bathrooms")}`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#627D98]">{t("search.filters.bedrooms")}</span>
              <CounterBtn
                value={draft.minBeds}
                onDecrement={() => update("minBeds", Math.max(0, draft.minBeds - 1))}
                onIncrement={() => update("minBeds", draft.minBeds + 1)}
                anyLabel={anyLabel}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#627D98]">{t("search.filters.bathrooms")}</span>
              <CounterBtn
                value={draft.minBaths}
                onDecrement={() => update("minBaths", Math.max(0, draft.minBaths - 1))}
                onIncrement={() => update("minBaths", draft.minBaths + 1)}
                anyLabel={anyLabel}
              />
            </div>
          </div>
        </FilterSection>

        {/* Area size */}
        <FilterSection title={`${t("search.filters.areaSize")} (${t("common.sqm")})`}>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={draft.minArea ?? ""}
              onChange={(e) => update("minArea", e.target.value ? Number(e.target.value) : null)}
              placeholder={t("search.filters.from")}
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#0A3C36]"
              aria-label={t("search.filters.minArea")}
              dir="ltr"
            />
            <span className="text-[#627D98] text-sm">—</span>
            <input
              type="number"
              value={draft.maxArea ?? ""}
              onChange={(e) => update("maxArea", e.target.value ? Number(e.target.value) : null)}
              placeholder={t("search.filters.to")}
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#0A3C36]"
              aria-label={t("search.filters.maxArea")}
              dir="ltr"
            />
          </div>
        </FilterSection>

        {/* Furnishing */}
        <FilterSection title={t("search.filters.furnishing")}>
          <div className="flex flex-wrap gap-2">
            {Object.entries(FURNISHING_LABELS_I18N).map(([val, labels]) => (
              <button
                key={val}
                onClick={() => toggleArr("furnishing", val)}
                aria-pressed={draft.furnishing.includes(val)}
                className={cn(
                  "px-3 h-9 rounded-full text-xs font-semibold border transition-colors",
                  draft.furnishing.includes(val)
                    ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                    : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36]"
                )}
              >
                {isAr ? labels.ar : labels.en}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Features */}
        <FilterSection title={t("search.filters.features.title")}>
          <div className="flex flex-wrap gap-2">
            <BoolChip label={t("search.filters.features.verified")}     active={!!draft.isVerified}      onClick={() => update("isVerified",      draft.isVerified      ? null : true)} />
            <BoolChip label={t("search.filters.features.majlis")}       active={!!draft.hasMajlis}       onClick={() => update("hasMajlis",       draft.hasMajlis       ? null : true)} />
            <BoolChip label={t("search.filters.features.maidRoom")}     active={!!draft.hasMaidRoom}     onClick={() => update("hasMaidRoom",     draft.hasMaidRoom     ? null : true)} />
            <BoolChip label={t("search.filters.features.driverRoom")}   active={!!draft.hasDriverRoom}   onClick={() => update("hasDriverRoom",   draft.hasDriverRoom   ? null : true)} />
            <BoolChip label={t("search.filters.features.parking")}      active={!!draft.hasParking}      onClick={() => update("hasParking",      draft.hasParking      ? null : true)} />
            <BoolChip label={t("search.filters.features.seaView")}      active={!!draft.hasSeaView}      onClick={() => update("hasSeaView",      draft.hasSeaView      ? null : true)} />
            <BoolChip label={t("search.filters.features.mountainView")} active={!!draft.hasMountainView} onClick={() => update("hasMountainView", draft.hasMountainView ? null : true)} />
            <BoolChip label={t("search.filters.features.freehold")}     active={!!draft.isFreehold}      onClick={() => update("isFreehold",      draft.isFreehold      ? null : true)} />
            <BoolChip label={t("search.filters.features.expatAllowed")} active={!!draft.expatAllowed}    onClick={() => update("expatAllowed",    draft.expatAllowed    ? null : true)} />
            <BoolChip label={t("search.filters.features.familyOnly")}   active={!!draft.familyOnly}      onClick={() => update("familyOnly",      draft.familyOnly      ? null : true)} />
          </div>
        </FilterSection>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] p-4 flex items-center gap-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <Button variant="outline" size="md" className="flex-1" onClick={handleReset}>
          {t("search.filters.clearAll")}
        </Button>
        <Button variant="primary" size="md" className="flex-1" onClick={handleApply}>
          {resultCount !== undefined
            ? `${t("common.viewAll")} (${resultCount})`
            : t("search.filters.apply")}
        </Button>
      </div>
    </BottomSheet>
  );
}
