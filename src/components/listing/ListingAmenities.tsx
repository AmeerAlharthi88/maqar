"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface ListingAmenitiesProps {
  listing: Listing;
}

// Icon map for known amenity strings (amenities are stored as Arabic strings in DB)
function AmenityIcon({ name }: { name: string }) {
  if (name.includes("موقف") || name.includes("سيارات")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    );
  }
  if (name.includes("مصعد")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 12h8M12 8l4 4-4 4" />
      </svg>
    );
  }
  if (name.includes("مسبح")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12h20M2 18h20M4 6l2-2 2 2M10 6l2-2 2 2M16 6l2-2 2 2" />
      </svg>
    );
  }
  if (name.includes("حديقة") || name.includes("خضراء")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22V12M8 6c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4" />
        <path d="M6 14c0 2.2 1.8 4 4 4" />
        <path d="M18 14c0 2.2-1.8 4-4 4" />
      </svg>
    );
  }
  if (name.includes("شرفة") || name.includes("بلكون")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M2 11h20M8 11v10M16 11v10" />
      </svg>
    );
  }
  if (name.includes("بحري") || name.includes("شاطئ")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        <circle cx="12" cy="7" r="3" />
      </svg>
    );
  }
  if (name.includes("مسجد") || name.includes("قبلة")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 4 5 10 7 13 2-3 7-9 7-13 0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }
  if (name.includes("أمن") || name.includes("حارس")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  if (name.includes("مكيف") || name.includes("تكييف")) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="10" rx="2" />
        <path d="M7 17l-2 4M17 17l2 4M12 17v4" />
      </svg>
    );
  }
  // Default dot
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
}

export function ListingAmenities({ listing }: ListingAmenitiesProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  if (listing.amenities.length === 0) return null;

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-3">
        {t("listing.amenities.title")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {listing.amenities.map((amenity) => (
          <span
            key={amenity}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl",
              "bg-[#F0F4F8] text-[#102A43] text-xs font-medium border border-[#E2E8F0]"
            )}
          >
            <AmenityIcon name={amenity} />
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}
