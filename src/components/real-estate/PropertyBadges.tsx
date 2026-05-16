import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

interface PropertyBadgesProps {
  listing: Pick<Listing, "isNew" | "isFeatured" | "isVerified" | "purpose">;
  className?: string;
}

export function PropertyBadges({ listing, className }: PropertyBadgesProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {listing.purpose === "sale" ? (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FBF0EB] text-[#C65D3B]">
          للبيع
        </span>
      ) : (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EAF4FB] text-[#2471A3]">
          للإيجار
        </span>
      )}
      {listing.isFeatured && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#1E1E1E] text-[#D4A373]">
          مميز
        </span>
      )}
      {listing.isNew && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EDF4ED] text-[#5B8C5A]">
          جديد
        </span>
      )}
      {listing.isVerified && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FDF6EE] text-[#C49060] flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          موثوق
        </span>
      )}
    </div>
  );
}
