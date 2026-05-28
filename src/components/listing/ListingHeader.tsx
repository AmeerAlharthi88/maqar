"use client";

import { formatCurrency, formatNumber, formatRelativeDateLocale } from "@/lib/formatters";
import { isBelowMarket } from "@/lib/helpers/listing-filters";
import { PROPERTY_TYPE_MAP } from "@/lib/constants/property-types";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface ListingHeaderProps {
  listing: Listing;
}

const FURNISHING_LABELS: Record<string, { ar: string; en: string }> = {
  furnished:      { ar: "مفروشة",       en: "Furnished" },
  semi_furnished: { ar: "شبه مفروشة",   en: "Semi-Furnished" },
  unfurnished:    { ar: "غير مفروشة",   en: "Unfurnished" },
};

export function ListingHeader({ listing }: ListingHeaderProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  const belowMkt = isBelowMarket(listing);
  const propTypeMap = PROPERTY_TYPE_MAP[listing.propertyType];
  const propType = isAr
    ? (propTypeMap?.labelAr ?? listing.propertyType)
    : (propTypeMap?.labelEn ?? listing.propertyType);

  const title = isAr ? listing.titleAr : (listing.titleEn ?? listing.titleAr);
  const furnishingLabel = FURNISHING_LABELS[listing.furnishing];

  const governorate = isAr ? listing.location.governorateAr : (listing.location.governorateEn ?? listing.location.governorateAr);
  const wilayat     = isAr ? listing.location.wilayatAr     : (listing.location.wilayatEn     ?? listing.location.wilayatAr);
  const area        = isAr ? listing.location.areaAr        : (listing.location.areaEn        ?? listing.location.areaAr);
  const address     = isAr ? listing.location.addressAr     : (listing.location.addressEn     ?? listing.location.addressAr);

  const priceFormatted = formatCurrency(listing.price, locale);
  const pricePerSqm = listing.pricePerSqm;
  const pricePerSqmStr = pricePerSqm
    ? isAr
      ? `(${formatNumber(pricePerSqm, locale)} ر.ع/م²)`
      : `(${formatNumber(pricePerSqm, locale)} OMR/sqm)`
    : null;
  const viewsLabel = isAr
    ? `${formatNumber(listing.viewCount, locale)} مشاهدة`
    : `${formatNumber(listing.viewCount, locale)} views`;
  const rentSuffix = listing.purpose === "rent"
    ? (isAr ? "/ شهر" : "/ month")
    : null;

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Purpose + type row */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            listing.purpose === "sale"
              ? "bg-[#0A3C36] text-white"
              : "bg-[#2471A3] text-white"
          }`}
        >
          {listing.purpose === "sale"
            ? t("listing.status.forSale")
            : t("listing.status.forRent")}
        </span>

        <span className="text-xs text-[#627D98] bg-[#F0F4F8] px-2.5 py-0.5 rounded-full">
          {propType}
        </span>

        {listing.furnishing !== "unfurnished" && furnishingLabel && (
          <span className="text-xs text-[#627D98] bg-[#F0F4F8] px-2.5 py-0.5 rounded-full">
            {isAr ? furnishingLabel.ar : furnishingLabel.en}
          </span>
        )}

        {listing.isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6F0EF] text-[#0A3C36] text-xs font-semibold">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t("common.verified")}
          </span>
        )}
        {belowMkt && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6F0EF] text-[#0A3C36] text-xs font-semibold">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            {isAr ? "أقل من السوق" : "Below Market"}
          </span>
        )}
        {listing.isFeatured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#D4A017] text-xs font-semibold">
            {t("common.featured")}
          </span>
        )}
        {listing.isNew && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF4FB] text-[#2471A3] text-xs font-semibold">
            {t("common.new")}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[#102A43] leading-snug mb-2">
        {title}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-[#0A3C36]">{priceFormatted}</span>
        {rentSuffix && (
          <span className="text-sm text-[#627D98]">{rentSuffix}</span>
        )}
        {pricePerSqmStr && (
          <span className="text-xs text-[#627D98]">{pricePerSqmStr}</span>
        )}
      </div>

      {/* Location breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#627D98] mb-3 flex-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{governorate}</span>
        <span className="text-[#E2E8F0]">›</span>
        <span>{wilayat}</span>
        <span className="text-[#E2E8F0]">›</span>
        <span className="font-medium text-[#102A43]">{area}</span>
        {address && (
          <>
            <span className="text-[#E2E8F0]">›</span>
            <span className="text-[#627D98]">{address}</span>
          </>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-[#627D98]">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {formatRelativeDateLocale(listing.createdAt, locale)}
        </span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {viewsLabel}
        </span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {formatNumber(listing.favoriteCount, locale)}
        </span>
      </div>
    </div>
  );
}
