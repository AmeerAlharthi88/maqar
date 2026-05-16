import { formatOMR, formatRelativeDate, toArabicNumerals } from "@/lib/formatters";
import { isBelowMarket } from "@/lib/helpers/listing-filters";
import { PROPERTY_TYPE_MAP } from "@/lib/constants/property-types";
import type { Listing } from "@/types/listing";

interface ListingHeaderProps {
  listing: Listing;
}

const FURNISHING_AR: Record<string, string> = {
  furnished:      "مفروشة",
  semi_furnished: "شبه مفروشة",
  unfurnished:    "غير مفروشة",
};

export function ListingHeader({ listing }: ListingHeaderProps) {
  const belowMkt = isBelowMarket(listing);
  const propType = PROPERTY_TYPE_MAP[listing.propertyType]?.labelAr ?? listing.propertyType;

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Purpose + type row */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            listing.purpose === "sale"
              ? "bg-[#C65D3B] text-white"
              : "bg-[#2471A3] text-white"
          }`}
        >
          {listing.purpose === "sale" ? "للبيع" : "للإيجار"}
        </span>

        <span className="text-xs text-[#7A6B5E] bg-[#F5F0EA] px-2.5 py-0.5 rounded-full">
          {propType}
        </span>

        {listing.furnishing !== "unfurnished" && (
          <span className="text-xs text-[#7A6B5E] bg-[#F5F0EA] px-2.5 py-0.5 rounded-full">
            {FURNISHING_AR[listing.furnishing]}
          </span>
        )}

        {/* Badges */}
        {listing.isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF4ED] text-[#5B8C5A] text-xs font-semibold">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            موثق
          </span>
        )}
        {belowMkt && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF4ED] text-[#5B8C5A] text-xs font-semibold">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            أقل من السوق
          </span>
        )}
        {listing.isFeatured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FBF0EB] text-[#C65D3B] text-xs font-semibold">
            مميز
          </span>
        )}
        {listing.isNew && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF4FB] text-[#2471A3] text-xs font-semibold">
            جديد
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[#1E1E1E] leading-snug mb-2">
        {listing.titleAr}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-[#C65D3B]">
          {formatOMR(listing.price, { arabic: true, compact: false })}
        </span>
        {listing.purpose === "rent" && (
          <span className="text-sm text-[#7A6B5E]">/ شهر</span>
        )}
        {listing.pricePerSqm && (
          <span className="text-xs text-[#A89480]">
            ({toArabicNumerals(listing.pricePerSqm)} ر.ع/م²)
          </span>
        )}
      </div>

      {/* Location breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#7A6B5E] mb-3 flex-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{listing.location.governorateAr}</span>
        <span className="text-[#E8DDD0]">›</span>
        <span>{listing.location.wilayatAr}</span>
        <span className="text-[#E8DDD0]">›</span>
        <span className="font-medium text-[#1E1E1E]">{listing.location.areaAr}</span>
        {listing.location.addressAr && (
          <>
            <span className="text-[#E8DDD0]">›</span>
            <span className="text-[#A89480]">{listing.location.addressAr}</span>
          </>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-[#A89480]">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {formatRelativeDate(listing.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {toArabicNumerals(listing.viewCount)} مشاهدة
        </span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {toArabicNumerals(listing.favoriteCount)}
        </span>
      </div>
    </div>
  );
}
