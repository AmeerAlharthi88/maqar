"use client";

import { ListingCardInteractive } from "@/components/real-estate/ListingCardInteractive";
import { toArabicNumerals } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

interface MapListViewProps {
  listings: Listing[];
  isFiltered: boolean;
  className?: string;
}

export function MapListView({
  listings,
  isFiltered,
  className,
}: MapListViewProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[55] bg-[#FAF7F2] overflow-y-auto overscroll-contain",
        className
      )}
      style={{
        paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
        // Top padding accounts for toolbar (~62px) + possible filter chips (~44px)
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 62px)",
      }}
    >
      <div className="px-4 pt-3 pb-2">
        {/* Result count */}
        <p
          className="text-xs text-[#7A6B5E] mb-3"
          aria-live="polite"
          aria-atomic="true"
        >
          {listings.length > 0 ? (
            <>
              <span className="font-semibold text-[#1E1E1E]">
                {toArabicNumerals(listings.length)}
              </span>{" "}
              عقار{isFiltered ? " مطابق للفلاتر" : ""}
            </>
          ) : (
            "لا توجد نتائج"
          )}
        </p>

        {/* Listings */}
        {listings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {listings.map((listing) => (
              <ListingCardInteractive
                key={listing.id}
                listing={listing}
                variant="row"
              />
            ))}
          </div>
        ) : (
          <EmptyListState />
        )}
      </div>
    </div>
  );
}

// ── Empty list state ───────────────────────────────────────────────────────────

function EmptyListState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F5F0EA] flex items-center justify-center mb-4">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A89480"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-[#1E1E1E] mb-1">
        لا توجد عقارات مطابقة
      </h3>
      <p className="text-xs text-[#7A6B5E]">
        جرّب تغيير الفلاتر أو البحث في منطقة مختلفة
      </p>
    </div>
  );
}
