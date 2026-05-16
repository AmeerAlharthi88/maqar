import { ListingCardInteractive } from "@/components/real-estate/ListingCardInteractive";
import type { Listing } from "@/types/listing";

interface SimilarListingsProps {
  listings: Listing[];
}

export function SimilarListings({ listings }: SimilarListingsProps) {
  if (listings.length === 0) return null;

  return (
    <div className="px-4 py-4 border-t border-[#F0EBE3]">
      <h2 className="text-base font-bold text-[#1E1E1E] mb-3">عقارات مشابهة</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
        {listings.map((listing) => (
          <div key={listing.id} className="flex-shrink-0 w-64">
            <ListingCardInteractive listing={listing} variant="card" />
          </div>
        ))}
      </div>
    </div>
  );
}
