import { cn } from "@/lib/utils";
import { PropertyImage } from "./PropertyImage";
import { PropertyBadges } from "./PropertyBadges";
import { PropertySpecs } from "./PropertySpecs";
import { PropertyPrice } from "./PropertyPrice";
import { LocationBreadcrumb } from "./LocationBreadcrumb";
import { ROIChip } from "./ROIChip";
import { formatRelativeDate } from "@/lib/formatters";
import { PROPERTY_TYPE_MAP } from "@/lib/constants/property-types";
import type { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
  variant?: "card" | "row";
  className?: string;
  isFavorited?: boolean;
  favoriteButton?: React.ReactNode;
  belowMarket?: boolean;
}

export function ListingCard({ listing, variant = "card", className, favoriteButton, belowMarket }: ListingCardProps) {
  if (variant === "row") {
    return <ListingRow listing={listing} className={className} favoriteButton={favoriteButton} />;
  }

  return (
    <article
      className={cn(
        "group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden",
        "shadow-[0_2px_8px_0_rgb(10_60_54/0.06)] hover:shadow-[0_8px_24px_0_rgb(10_60_54/0.10)]",
        "transition-shadow duration-200 cursor-pointer",
        className
      )}
    >
      {/* Image */}
      <div className="relative">
        <PropertyImage
          src={listing.coverImage}
          alt={listing.titleAr}
          imageCount={listing.images.length}
          aspectRatio="listing"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 end-3 flex flex-col gap-1.5 items-end">
          <PropertyBadges listing={listing} />
          {belowMarket && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5B8C5A] text-white text-[10px] font-semibold">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              أقل من السوق
            </span>
          )}
        </div>
        {/* Favorite slot */}
        <div className="absolute top-3 start-3">
          {favoriteButton ?? (
            <button
              aria-label="حفظ في المفضلة"
              className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-[#627D98] shadow-sm"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5">
        {/* Property type + date */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#627D98]">
            {PROPERTY_TYPE_MAP[listing.propertyType]?.labelAr ?? listing.propertyType}
          </span>
          <span className="text-xs text-[#627D98]">{formatRelativeDate(listing.createdAt)}</span>
        </div>

        {/* Title — min-h prevents collapse during font-load or hydration */}
        <h3 className="text-sm font-semibold text-[#102A43] leading-snug line-clamp-2 min-h-[2.5rem]">
          {listing.titleAr}
        </h3>

        {/* Location */}
        <LocationBreadcrumb
          governorateAr={listing.location.governorateAr}
          wilayatAr={listing.location.wilayatAr}
          areaAr={listing.location.areaAr}
        />

        {/* Specs */}
        <PropertySpecs specs={listing.specs} propertyType={listing.propertyType} size="sm" />

        {/* Price row */}
        <div className="flex items-end justify-between pt-1 border-t border-[#F0F4F8]">
          <PropertyPrice
            amount={listing.price}
            purpose={listing.purpose}
            pricePerSqm={listing.pricePerSqm}
            size="sm"
            compact
          />
          {listing.roiEstimate && <ROIChip roiPct={listing.roiEstimate} />}
        </div>
      </div>
    </article>
  );
}

function ListingRow({ listing, className, favoriteButton }: { listing: Listing; className?: string; favoriteButton?: React.ReactNode }) {
  return (
    <article
      className={cn(
        "group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex gap-0",
        "shadow-[0_2px_8px_0_rgb(10_60_54/0.06)] hover:shadow-[0_8px_24px_0_rgb(10_60_54/0.10)]",
        "transition-shadow duration-200 cursor-pointer",
        className
      )}
    >
      <div className="w-28 flex-shrink-0">
        <PropertyImage src={listing.coverImage} alt={listing.titleAr} aspectRatio="square" className="h-full rounded-none" />
      </div>
      <div className="flex-1 p-3 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <PropertyBadges listing={listing} />
          </div>
          {favoriteButton && <div className="flex-shrink-0">{favoriteButton}</div>}
        </div>
        <h3 className="text-sm font-semibold text-[#102A43] line-clamp-1">{listing.titleAr}</h3>
        <LocationBreadcrumb
          governorateAr={listing.location.governorateAr}
          wilayatAr={listing.location.wilayatAr}
          areaAr={listing.location.areaAr}
        />
        <PropertySpecs specs={listing.specs} propertyType={listing.propertyType} size="sm" />
        <PropertyPrice amount={listing.price} purpose={listing.purpose} size="sm" compact />
      </div>
    </article>
  );
}
