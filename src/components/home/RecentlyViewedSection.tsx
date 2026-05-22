"use client";

import Link from "next/link";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MOCK_LISTINGS } from "@/mock/listings";
import { ListingCardInteractive } from "@/components/real-estate/ListingCardInteractive";
import { ROUTES } from "@/config/routes";
import { useLanguageStore } from "@/store/language.store";

export function RecentlyViewedSection() {
  const { items } = useRecentlyViewedStore();
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";

  if (items.length === 0) return null;

  // Cross-reference with mock data
  const listings = items
    .map((item) => MOCK_LISTINGS.find((l) => l.id === item.id))
    .filter(Boolean);

  if (listings.length === 0) return null;

  return (
    <section className="px-4 py-5">
      <SectionHeader
        titleAr="شاهدته مؤخراً"
        titleEn="Recently Viewed"
        size="md"
        action={
          <Link href={ROUTES.recentlyViewed} className="text-xs font-semibold text-[#0A3C36] hover:underline">
            {isAr ? "الكل" : "All"}
          </Link>
        }
        className="mb-4"
      />
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {listings.slice(0, 5).map((listing) =>
          listing ? (
            <div key={listing.id} className="flex-shrink-0 w-[240px]">
              <ListingCardInteractive listing={listing} variant="card" />
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
