"use client";

import { formatNumber, formatAreaLocale } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

interface ListingSpecsProps {
  listing: Listing;
}

const FURNISHING_LABELS: Record<string, { ar: string; en: string }> = {
  furnished:      { ar: "مفروشة بالكامل", en: "Fully Furnished" },
  semi_furnished: { ar: "شبه مفروشة",     en: "Semi-Furnished" },
  unfurnished:    { ar: "غير مفروشة",     en: "Unfurnished" },
};

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

interface AmenityBoolProps {
  label: string;
  present: boolean;
}

function AmenityBool({ label, present }: AmenityBoolProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium",
      present
        ? "bg-[#E6F0EF] border-[#0A3C36]/30 text-[#0A3C36]"
        : "bg-[#F0F4F8] border-[#E2E8F0] text-[#627D98]"
    )}>
      {present ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      {label}
    </div>
  );
}

export function ListingSpecs({ listing }: ListingSpecsProps) {
  const { locale } = useTranslation();
  const isAr = locale === "ar";
  const { specs } = listing;
  const amenities = listing.amenities;

  // Oman-specific feature detection (amenities stored as Arabic strings)
  const hasMajlis     = amenities.includes("مجلس");
  const hasMaidRoom   = amenities.includes("غرفة خادمة");
  const hasDriverRoom = amenities.includes("غرفة سائق");
  const hasSeaView    = amenities.includes("إطلالة بحرية");
  const hasMtnView    = amenities.includes("إطلالة جبلية");
  const hasGarden     = amenities.includes("حديقة");
  const hasPool       = amenities.includes("مسبح");

  const omanFeatures = isAr
    ? [
        { label: "مجلس",          present: hasMajlis },
        { label: "غرفة خادمة",    present: hasMaidRoom },
        { label: "غرفة سائق",     present: hasDriverRoom },
        { label: "إطلالة بحرية",  present: hasSeaView },
        { label: "إطلالة جبلية",  present: hasMtnView },
        { label: "حديقة",         present: hasGarden },
        { label: "مسبح",          present: hasPool },
      ]
    : [
        { label: "Majlis",        present: hasMajlis },
        { label: "Maid's Room",   present: hasMaidRoom },
        { label: "Driver's Room", present: hasDriverRoom },
        { label: "Sea View",      present: hasSeaView },
        { label: "Mountain View", present: hasMtnView },
        { label: "Garden",        present: hasGarden },
        { label: "Pool",          present: hasPool },
      ];

  const furnishingLabel = FURNISHING_LABELS[listing.furnishing];

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-3">
        {isAr ? "المواصفات" : "Specifications"}
      </h2>

      {/* Main specs grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {specs.bedrooms > 0 && (
          <SpecCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
                <rect x="2" y="9" width="20" height="11" rx="2" />
                <path d="M7 9v11M17 9v11" />
              </svg>
            }
            label={isAr ? "غرف النوم" : "Bedrooms"}
            value={formatNumber(specs.bedrooms, locale)}
          />
        )}
        {specs.bathrooms > 0 && (
          <SpecCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                <line x1="10" x2="8" y1="5" y2="7" />
                <line x1="2" x2="22" y1="12" y2="12" />
              </svg>
            }
            label={isAr ? "دورات المياه" : "Bathrooms"}
            value={formatNumber(specs.bathrooms, locale)}
          />
        )}
        {specs.area > 0 && (
          <SpecCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
              </svg>
            }
            label={isAr ? "المساحة" : "Area"}
            value={formatAreaLocale(specs.area, locale)}
          />
        )}
        {specs.floors && specs.floors > 1 && (
          <SpecCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 9 12 3 21 9" />
                <polyline points="3 14 12 8 21 14" />
                <polyline points="3 19 12 13 21 19" />
              </svg>
            }
            label={isAr ? "الطوابق" : "Floors"}
            value={formatNumber(specs.floors, locale)}
          />
        )}
        {specs.parkingSpots && specs.parkingSpots > 0 && (
          <SpecCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
              </svg>
            }
            label={isAr ? "مواقف السيارات" : "Parking"}
            value={formatNumber(specs.parkingSpots, locale)}
          />
        )}
        {furnishingLabel && (
          <SpecCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            }
            label={isAr ? "نوع التأثيث" : "Furnishing"}
            value={isAr ? furnishingLabel.ar : furnishingLabel.en}
          />
        )}
      </div>

      {/* Oman-specific features */}
      <h3 className="text-sm font-semibold text-[#627D98] mb-2">
        {isAr ? "المميزات" : "Features"}
      </h3>
      <div className="flex flex-wrap gap-2">
        {omanFeatures.map((f) => (
          <AmenityBool key={f.label} label={f.label} present={f.present} />
        ))}
      </div>
    </div>
  );
}
