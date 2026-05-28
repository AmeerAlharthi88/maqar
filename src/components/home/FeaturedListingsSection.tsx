"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ListingCardInteractive } from "@/components/real-estate/ListingCardInteractive";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface FeaturedListingsSectionProps {
  listings: Listing[];
}

export function FeaturedListingsSection({ listings }: FeaturedListingsSectionProps) {
  const { t } = useTranslation();

  if (listings.length === 0) return null;

  return (
    <section className="px-4 py-5">
      <SectionHeader
        titleAr="العقارات المميزة"
        titleEn="Featured Properties"
        subtitleAr="أبرز العقارات في السوق العُماني"
        subtitleEn="Top properties in the Oman real estate market"
        size="md"
        action={
          <Link
            href={ROUTES.search}
            className="text-xs font-semibold text-[#0A3C36] hover:underline"
          >
            {t("common.viewAll")}
          </Link>
        }
        className="mb-4"
      />

      {/* Horizontal scroll on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {listings.map((listing) => (
          <div key={listing.id} className="flex-shrink-0 w-[280px] sm:w-[300px]">
            <ListingCardInteractive listing={listing} variant="card" />
          </div>
        ))}
      </div>
    </section>
  );
}
