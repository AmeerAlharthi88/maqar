"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/language.store";
import type { Listing } from "@/types/listing";

interface PropertyBadgesProps {
  listing: Pick<Listing, "isNew" | "isFeatured" | "isVerified" | "purpose">;
  className?: string;
}

export function PropertyBadges({ listing, className }: PropertyBadgesProps) {
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {listing.purpose === "sale" ? (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E6F0EF] text-[#0A3C36]">
          {isAr ? "للبيع" : "For Sale"}
        </span>
      ) : (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EBF4FF] text-[#2B6CB0]">
          {isAr ? "للإيجار" : "For Rent"}
        </span>
      )}
      {listing.isFeatured && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#0A3C36] text-[#E5BA73]">
          {isAr ? "مميز" : "Featured"}
        </span>
      )}
      {listing.isNew && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F0F4F8] text-[#627D98]">
          {isAr ? "جديد" : "New"}
        </span>
      )}
      {listing.isVerified && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E6F0EF] text-[#0A3C36] flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {isAr ? "موثوق" : "Verified"}
        </span>
      )}
    </div>
  );
}
