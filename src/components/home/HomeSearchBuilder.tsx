"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/config/routes";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";

// The four most common types for the Home entry point. The full set of 13 lives
// behind "More filters" on the results page (FP17E-1).
const MAIN_TYPES: { value: string; ar: string; en: string }[] = [
  { value: "apartment",  ar: "شقة",  en: "Apartment" },
  { value: "villa",      ar: "فيلا", en: "Villa" },
  { value: "land",       ar: "أرض",  en: "Land" },
  { value: "commercial", ar: "تجاري", en: "Commercial" },
];

/**
 * Guided Home search module: purpose → type → location → "Show results".
 * Builds a /search URL with query params (purpose, propertyType, governorate,
 * wilayat) so the results page opens pre-filtered. Selections are local state —
 * nothing navigates until the user taps the CTA (FP17E-1).
 */
export function HomeSearchBuilder() {
  const router = useRouter();
  const { locale } = useTranslation();
  const isAr = locale === "ar";

  const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [governorateId, setGovernorateId] = useState("");
  const [wilayatId, setWilayatId] = useState("");

  const wilayats = OMAN_GOVERNORATES.find((g) => g.id === governorateId)?.wilayats ?? [];

  function buildParams() {
    const p = new URLSearchParams();
    p.set("purpose", purpose);
    if (propertyType) p.set("propertyType", propertyType);
    if (governorateId) p.set("governorate", governorateId);
    if (wilayatId) p.set("wilayat", wilayatId);
    return p.toString();
  }

  function showResults() {
    router.push(`${ROUTES.search}?${buildParams()}`);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(10,60,54,0.06)] p-3.5 space-y-3">
      {/* Purpose toggle */}
      <div className="grid grid-cols-2 gap-2" role="group" aria-label={isAr ? "الغرض" : "Purpose"}>
        {(["sale", "rent"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setPurpose(v)}
            aria-pressed={purpose === v}
            className={cn(
              "h-10 rounded-xl text-sm font-bold border transition-colors",
              purpose === v
                ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36]"
            )}
          >
            {v === "sale" ? (isAr ? "للبيع" : "For sale") : (isAr ? "للإيجار" : "For rent")}
          </button>
        ))}
      </div>

      {/* Main property-type chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1" role="group" aria-label={isAr ? "نوع العقار" : "Property type"}>
        {MAIN_TYPES.map((tp) => (
          <button
            key={tp.value}
            onClick={() => setPropertyType((prev) => (prev === tp.value ? null : tp.value))}
            aria-pressed={propertyType === tp.value}
            className={cn(
              "flex-shrink-0 h-9 px-4 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors",
              propertyType === tp.value
                ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                : "bg-white text-[#627D98] border-[#E2E8F0] hover:border-[#0A3C36]"
            )}
          >
            {isAr ? tp.ar : tp.en}
          </button>
        ))}
      </div>

      {/* Location selectors */}
      <div className="flex gap-2">
        <select
          value={governorateId}
          onChange={(e) => { setGovernorateId(e.target.value); setWilayatId(""); }}
          className="flex-1 min-w-0 h-11 px-3 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] bg-white outline-none focus:border-[#0A3C36]"
          aria-label={isAr ? "المحافظة" : "Governorate"}
        >
          <option value="">{isAr ? "اختر المحافظة / الولاية" : "Choose governorate / wilayat"}</option>
          {OMAN_GOVERNORATES.map((g) => (
            <option key={g.id} value={g.id}>{isAr ? g.nameAr : (g.nameEn ?? g.nameAr)}</option>
          ))}
        </select>
        {wilayats.length > 0 && (
          <select
            value={wilayatId}
            onChange={(e) => setWilayatId(e.target.value)}
            className="flex-1 min-w-0 h-11 px-3 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] bg-white outline-none focus:border-[#0A3C36]"
            aria-label={isAr ? "الولاية" : "Wilayat"}
          >
            <option value="">{isAr ? "كل الولايات" : "All wilayats"}</option>
            {wilayats.map((w) => (
              <option key={w.id} value={w.id}>{isAr ? w.nameAr : (w.nameEn ?? w.nameAr)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Primary CTA */}
      <button
        onClick={showResults}
        className="w-full h-12 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm hover:bg-[#082E29] transition-colors flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        {isAr ? "عرض النتائج" : "Show results"}
      </button>

      {/* More filters → results page (full filter sheet + all 13 types) */}
      <button
        onClick={showResults}
        className="w-full text-xs text-[#627D98] hover:text-[#0A3C36] font-medium transition-colors"
      >
        {isAr ? "المزيد من الفلاتر" : "More filters"}
      </button>
    </div>
  );
}
