"use client";

import { formatNumber, formatAreaLocale } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { Listing, PropertyType } from "@/types/listing";

interface ListingSpecsProps {
  listing: Listing;
}

const FURNISHING_LABELS: Record<string, { ar: string; en: string }> = {
  furnished:      { ar: "مفروشة بالكامل", en: "Fully Furnished" },
  semi_furnished: { ar: "شبه مفروشة",     en: "Semi-Furnished" },
  unfurnished:    { ar: "غير مفروشة",     en: "Unfurnished" },
};

// ── Property-type categories (display gating) ─────────────────────────────────
const VILLA_TYPES: PropertyType[] = ["villa", "duplex", "townhouse", "arabic_house"];
const APARTMENT_TYPES: PropertyType[] = ["apartment", "hotel_apartment"];
const COMMERCIAL_TYPES: PropertyType[] = ["commercial", "office", "warehouse", "building"];

interface SpecCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

function SpecCard({ icon, label, value, highlight }: SpecCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center",
        highlight
          ? "bg-[#E6F0EF] border-[#B8D8D5] text-[#0A3C36]"
          : "bg-white border-[#E2E8F0] text-[#102A43]"
      )}
    >
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center",
        highlight ? "bg-[#0A3C36]/10 text-[#0A3C36]" : "bg-[#F0F4F8] text-[#627D98]"
      )}>
        {icon}
      </div>
      <span className="text-sm font-bold">{value}</span>
      <span className="text-xs text-[#627D98]">{label}</span>
    </div>
  );
}

// Inline icons
const ICON_BED = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" /><rect x="2" y="9" width="20" height="11" rx="2" /><path d="M7 9v11M17 9v11" />
  </svg>
);
const ICON_BATH = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><line x1="10" x2="8" y1="5" y2="7" /><line x1="2" x2="22" y1="12" y2="12" />
  </svg>
);
const ICON_AREA = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);
const ICON_LAND = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 17l4-8 4 4 4-6 6 10H3z" /><path d="M3 21h18" />
  </svg>
);
const ICON_FLOORS = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 9 12 3 21 9" /><polyline points="3 14 12 8 21 14" /><polyline points="3 19 12 13 21 19" />
  </svg>
);
const ICON_PARKING = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </svg>
);
const ICON_FURNISH = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export function ListingSpecs({ listing }: ListingSpecsProps) {
  const { locale } = useTranslation();
  const isAr = locale === "ar";
  const { specs, propertyType: pt } = listing;

  const isLand        = pt === "land";
  const isFarm        = pt === "farm";
  const isApartment   = APARTMENT_TYPES.includes(pt);
  const isCommercial  = COMMERCIAL_TYPES.includes(pt);
  const isVillaClass  = VILLA_TYPES.includes(pt);
  const isChalet      = pt === "chalet";

  // Rooms/furnishing only for residential-style types (never land/commercial).
  const showRooms     = isVillaClass || isApartment || isChalet || isFarm;
  const showBedrooms  = showRooms && specs.bedrooms > 0;
  const showBathrooms = (showRooms || isCommercial) && specs.bathrooms > 0;
  const showFurnishing = showRooms && Boolean(FURNISHING_LABELS[listing.furnishing]);

  // ── Area cards (typed, labelled — no generic "Area") ────────────────────────
  const builtUp = specs.builtUpArea && specs.builtUpArea > 0 ? specs.builtUpArea : undefined;
  const land    = specs.landArea && specs.landArea > 0 ? specs.landArea : undefined;
  const generic = specs.area && specs.area > 0 ? specs.area : undefined;

  const L = {
    landArea:  isAr ? "مساحة الأرض"  : "Land area",
    builtUp:   isAr ? "مساحة البناء" : "Built-up area",
    unitArea:  isAr ? "مساحة الوحدة" : "Unit area",
  };

  const areaCards: { label: string; value: number; highlight?: boolean }[] = [];
  if (isLand) {
    const v = land ?? generic;
    if (v) areaCards.push({ label: L.landArea, value: v, highlight: true });
  } else if (isFarm) {
    const lv = land ?? generic;
    if (lv) areaCards.push({ label: L.landArea, value: lv, highlight: true });
    if (builtUp) areaCards.push({ label: L.builtUp, value: builtUp });
  } else if (isApartment || isCommercial) {
    const v = builtUp ?? generic;
    if (v) areaCards.push({ label: L.unitArea, value: v, highlight: true });
  } else {
    // villa-class, chalet, and any other residential building
    const bv = builtUp ?? generic;
    if (bv) areaCards.push({ label: L.builtUp, value: bv, highlight: true });
    if (land) areaCards.push({ label: L.landArea, value: land });
  }

  const furnishingLabel = FURNISHING_LABELS[listing.furnishing];

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-3">
        {isAr ? "المواصفات" : "Specifications"}
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {showBedrooms && (
          <SpecCard icon={ICON_BED} label={isAr ? "غرف النوم" : "Bedrooms"} value={formatNumber(specs.bedrooms, locale)} />
        )}
        {showBathrooms && (
          <SpecCard icon={ICON_BATH} label={isAr ? "دورات المياه" : "Bathrooms"} value={formatNumber(specs.bathrooms, locale)} />
        )}
        {areaCards.map((c) => (
          <SpecCard
            key={c.label}
            icon={c.label === L.landArea ? ICON_LAND : ICON_AREA}
            label={c.label}
            value={formatAreaLocale(c.value, locale)}
            highlight={c.highlight}
          />
        ))}
        {specs.floors && specs.floors > 1 && (
          <SpecCard icon={ICON_FLOORS} label={isAr ? "الطوابق" : "Floors"} value={formatNumber(specs.floors, locale)} />
        )}
        {specs.parkingSpots && specs.parkingSpots > 0 && (
          <SpecCard icon={ICON_PARKING} label={isAr ? "مواقف السيارات" : "Parking"} value={formatNumber(specs.parkingSpots, locale)} />
        )}
        {showFurnishing && furnishingLabel && (
          <SpecCard icon={ICON_FURNISH} label={isAr ? "نوع التأثيث" : "Furnishing"} value={isAr ? furnishingLabel.ar : furnishingLabel.en} />
        )}
      </div>
    </div>
  );
}
