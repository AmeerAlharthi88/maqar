"use client";

import Link from "next/link";
import { ListingCard } from "./ListingCard";
import { FavoriteButton } from "./FavoriteButton";
import { isBelowMarket } from "@/lib/helpers/listing-filters";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

interface ListingCardInteractiveProps {
  listing: Listing;
  variant?: "card" | "row";
  className?: string;
}

export function ListingCardInteractive({
  listing,
  variant = "card",
  className,
}: ListingCardInteractiveProps) {
  const belowMarket = isBelowMarket(listing);

  // Contact happens on the listing-detail page against the real owner (FP17C-1).
  // The card no longer builds a WhatsApp link from mock agent data (FP17F-1).
  return (
    <div className={cn("relative group", className)}>
      <Link href={ROUTES.listing(listing.id)} className="block">
        <ListingCard
          listing={listing}
          variant={variant}
          belowMarket={belowMarket}
          favoriteButton={<FavoriteButton listingId={listing.id} />}
        />
      </Link>
    </div>
  );
}
