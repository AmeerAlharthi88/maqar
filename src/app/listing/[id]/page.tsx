import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APP_CONFIG } from "@/config/app";
import { AppShell } from "@/components/layout/AppShell";
import { listingJsonLd, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

import {
  getListingById,
  getListingMarketData,
  getMockPriceHistory,
  getMockNearbyServices,
} from "@/lib/helpers/listing-detail";
import { getListingByIdServer, getSimilarListingsServer, getListingOwnerContact } from "@/lib/supabase/listings.server";

import { ListingGallery } from "@/components/listing/ListingGallery";
import { ListingHeader } from "@/components/listing/ListingHeader";
import { ListingSpecs } from "@/components/listing/ListingSpecs";
import { ListingDescription } from "@/components/listing/ListingDescription";
import { ListingAmenities } from "@/components/listing/ListingAmenities";
import { ListingMarketInsight } from "@/components/listing/ListingMarketInsight";
import { ListingROIPreview } from "@/components/listing/ListingROIPreview";
import { ListingPriceHistory } from "@/components/listing/ListingPriceHistory";
import { ListingLocation } from "@/components/listing/ListingLocation";
import { ListingMapPreview } from "@/components/listing/ListingMapPreview";
import { AgentCard } from "@/components/listing/AgentCard";
import { SimilarListings } from "@/components/listing/SimilarListings";
import { ListingDetailClient } from "@/components/listing/ListingDetailClient";
import { ValuationAssistant } from "@/components/ai/ValuationAssistant";

interface Props {
  params: Promise<{ id: string }>;
}

// Mock fallback is dev/demo only. In production this flag is off, so an unknown
// or mock id (e.g. lst-001) resolves to null → notFound() instead of rendering
// fake inventory. Real DB listings are unaffected (FP12 #1).
const ALLOW_MOCK_FALLBACK: boolean =
  process.env.NEXT_PUBLIC_ALLOW_MOCK_FALLBACK === "true";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // Try DB first; fall back to mock data only when the mock flag is on (dev/demo)
  const listing =
    (await getListingByIdServer(id)) ??
    (ALLOW_MOCK_FALLBACK ? getListingById(id) : null);

  if (!listing) {
    // absolute → bypass the layout's "%s | مقر" template (no double brand).
    return { title: { absolute: "العقار غير موجود | مقر" } };
  }

  const purposeLabel = listing.purpose === "sale" ? "للبيع" : "للإيجار";
  const brandedTitle = `${listing.titleAr} | ${APP_CONFIG.nameAr}`;
  const description = `${listing.titleAr} ${purposeLabel} في ${listing.location.areaAr}، ${listing.location.wilayatAr}. ${listing.descriptionAr.slice(0, 120)}...`;
  const canonical = `${APP_CONFIG.url}/listing/${id}`;
  const hasEn = Boolean(listing.titleEn);

  return {
    // Single brand suffix — `absolute` bypasses the parent title template (FP16).
    title: { absolute: brandedTitle },
    description,
    alternates: {
      canonical,
      // Arabic-first; signal English availability only when it exists. There are
      // no locale-routed URLs, so both map to the same canonical (FP16 #4).
      languages: { ar: canonical, ...(hasEn ? { en: canonical } : {}) },
    },
    openGraph: {
      title: brandedTitle,
      description,
      url: canonical,
      images: listing.coverImage ? [{ url: listing.coverImage }] : [],
      locale: "ar_OM",
      ...(hasEn ? { alternateLocale: ["en_OM"] } : {}),
      type: "website",
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  // Try DB first; fall back to mock data only when the mock flag is on (dev/demo)
  const listing =
    (await getListingByIdServer(id)) ??
    (ALLOW_MOCK_FALLBACK ? getListingById(id) : null);

  if (!listing) {
    notFound();
  }

  const marketData = getListingMarketData(listing);
  const priceHistory = getMockPriceHistory(listing);
  // Real similar listings only (active+approved); empty array hides the section.
  const similarListings = await getSimilarListingsServer(listing);
  const nearbyServices = getMockNearbyServices(listing);
  // Real seller contact (replaces the old MOCK_AGENTS fallback) — null → safe
  // unavailable state, never fabricated agent data (FP17C-1).
  const ownerContact = await getListingOwnerContact(listing.agentId);

  const listingSchema = listingJsonLd({
    id: listing.id,
    titleAr: listing.titleAr,
    descriptionAr: listing.descriptionAr,
    price: listing.isPriceHidden ? undefined : listing.price,
    purpose: listing.purpose,
    coverImage: listing.coverImage,
    areaAr: listing.location.areaAr,
    wilayatAr: listing.location.wilayatAr,
    governorateAr: listing.location.governorateAr,
    bedrooms: listing.specs.bedrooms,
    area: listing.specs.area,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { nameAr: "الرئيسية", href: "/" },
    { nameAr: "البحث", href: "/search" },
    { nameAr: listing.titleAr, href: `/listing/${listing.id}` },
  ]);

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(listingSchema as Record<string, unknown>) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema as Record<string, unknown>) }}
      />
      <div
        className="min-h-screen bg-[#F8F9FA]"
        // Direction follows the locale (set on <html> by AppShell) — no hardcoded
        // dir="rtl", so English mode lays out LTR (FP17C-1).
        // Extra bottom padding for the sticky action bar (which itself has 64px nav padding + 3rem content)
        style={{ paddingBottom: "calc(128px + env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Gallery — full width, no horizontal padding */}
        <ListingGallery
          images={listing.images}
          title={listing.titleAr}
          listingId={listing.id}
          coverImage={listing.coverImage}
        />

        {/* Header: price, title, badges, location */}
        <ListingHeader listing={listing} />

        {/* Specs grid */}
        <ListingSpecs listing={listing} />

        {/* Description */}
        <ListingDescription description={listing.descriptionAr} />

        {/* Amenities */}
        <ListingAmenities listing={listing} />

        {/* Market insight */}
        <ListingMarketInsight listing={listing} marketData={marketData} />

        {/* AI Valuation Assistant — renders its own localized heading */}
        <div className="px-4 py-4 border-t border-[#E2E8F0]">
          <ValuationAssistant
            propertyType={listing.propertyType}
            purpose={listing.purpose}
            price={listing.price}
            area={listing.specs.area}
            bedrooms={listing.specs.bedrooms}
            bathrooms={listing.specs.bathrooms}
            areaAr={listing.location.areaAr}
            wilayatAr={listing.location.wilayatAr}
            marketAvgPrice={marketData.avgPrice}
            pricePerSqm={marketData.pricePerSqm}
          />
        </div>

        {/* ROI + Mortgage / Rent cost */}
        <ListingROIPreview listing={listing} />

        {/* Price history chart */}
        <ListingPriceHistory listing={listing} history={priceHistory} />

        {/* Map preview */}
        <ListingMapPreview listing={listing} />

        {/* Location + nearby services */}
        <ListingLocation listing={listing} nearbyServices={nearbyServices} />

        {/* Agent card — real owner contact only */}
        <AgentCard listing={listing} owner={ownerContact} />

        {/* Similar listings */}
        <SimilarListings listings={similarListings} />
      </div>

      {/* Client component: recently-viewed tracking, modals, sticky action bar */}
      <ListingDetailClient listing={listing} owner={ownerContact} />
    </AppShell>
  );
}
