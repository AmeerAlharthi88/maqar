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
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FBF0EB] text-[#C65D3B]">
          {isAr ? "للبيع" : "For Sale"}
        </span>
      ) : (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EAF4FB] text-[#2471A3]">
          {isAr ? "للإيجار" : "For Rent"}
        </span>
      )}
      {listing.isFeatured && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#1E1E1E] text-[#D4A373]">
          {isAr ? "مميز" : "Featured"}
        </span>
      )}
      {listing.isNew && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EDF4ED] text-[#5B8C5A]">
          {isAr ? "جديد" : "New"}
        </span>
      )}
      {listing.isVerified && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FDF6EE] text-[#C49060] flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {isAr ? "موثوق" : "Verified"}
        </span>
      )}
    </div>
  );
}
