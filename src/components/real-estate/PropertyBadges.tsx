"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface PropertyBadgesProps {
  listing: Pick<Listing, "isNew" | "isFeatured" | "isVerified" | "purpose" | "isNegotiable">;
  className?: string;
}

export function PropertyBadges({ listing, className }: PropertyBadgesProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {listing.purpose === "sale" ? (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E6F0EF] text-[#0A3C36]">
          {t("listing.status.forSale")}
        </span>
      ) : (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EBF4FF] text-[#2B6CB0]">
          {t("listing.status.forRent")}
        </span>
      )}
      {listing.isFeatured && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#0A3C36] text-[#E5BA73]">
          {t("common.featured")}
        </span>
      )}
      {listing.isNew && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F0F4F8] text-[#627D98]">
          {t("common.new")}
        </span>
      )}
      {listing.isVerified && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E6F0EF] text-[#0A3C36] flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {t("common.verified")}
        </span>
      )}
      {listing.isNegotiable && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFF7E6] text-[#C8860A]">
          {isAr ? "قابل للتفاوض" : "Negotiable"}
        </span>
      )}
    </div>
  );
}
