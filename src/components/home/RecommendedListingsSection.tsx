"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ListingCardInteractive } from "@/components/real-estate/ListingCardInteractive";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface RecommendedListingsSectionProps {
  listings: Listing[];
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  /** @deprecated use titleAr/titleEn instead */
  title?: string;
  /** @deprecated use subtitleAr/subtitleEn instead */
  subtitle?: string;
}

export function RecommendedListingsSection({
  listings,
  titleAr = "عقارات قد تعجبك",
  titleEn = "Recommended for You",
  subtitleAr = "بناءً على السوق الحالي في مسقط",
  subtitleEn = "Based on the current Muscat market",
}: RecommendedListingsSectionProps) {
  const { t } = useTranslation();

  if (listings.length === 0) return null;

  return (
    <section className="px-4 py-5">
      <SectionHeader
        titleAr={titleAr}
        titleEn={titleEn}
        subtitleAr={subtitleAr}
        subtitleEn={subtitleEn}
        size="md"
        action={
          <Link href={ROUTES.search} className="text-xs font-semibold text-[#0A3C36] hover:underline">
            {t("common.more")}
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
