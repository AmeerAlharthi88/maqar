"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/types/listing";

const DynamicMapPreview = dynamic(() => import("./MapPreviewInner"), { ssr: false });

interface ListingMapPreviewProps {
  listing: Listing;
}

export function ListingMapPreview({ listing }: ListingMapPreviewProps) {
  const coords = listing.location.coordinates;
  const hasCoords =
    coords &&
    typeof coords.lat === "number" &&
    typeof coords.lng === "number" &&
    !(coords.lat === 0 && coords.lng === 0);

  if (!hasCoords) return null;

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-3">موقع العقار على الخريطة</h2>
      <div className="h-52 w-full rounded-2xl overflow-hidden border border-[#E2E8F0]">
        <DynamicMapPreview listing={listing} />
      </div>
      <p className="mt-2 text-[10px] text-[#627D98] text-center">
        الموقع تقريبي للحفاظ على خصوصية المالك
      </p>
    </div>
  );
}
