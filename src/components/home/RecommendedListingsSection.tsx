import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ListingCardInteractive } from "@/components/real-estate/ListingCardInteractive";
import { ROUTES } from "@/config/routes";
import type { Listing } from "@/types/listing";

interface RecommendedListingsSectionProps {
  listings: Listing[];
  title?: string;
  subtitle?: string;
}

export function RecommendedListingsSection({
  listings,
  title = "عقارات قد تعجبك",
  subtitle = "بناءً على السوق الحالي في مسقط",
}: RecommendedListingsSectionProps) {
  if (listings.length === 0) return null;

  return (
    <section className="px-4 py-5">
      <SectionHeader
        titleAr={title}
        subtitleAr={subtitle}
        size="md"
        action={
          <Link href={ROUTES.search} className="text-xs font-semibold text-[#C65D3B] hover:underline">
            المزيد
          </Link>
        }
        className="mb-4"
      />
      <div className="flex flex-col gap-4">
        {listings.map((listing) => (
          <ListingCardInteractive key={listing.id} listing={listing} variant="card" />
        ))}
      </div>
    </section>
  );
}
