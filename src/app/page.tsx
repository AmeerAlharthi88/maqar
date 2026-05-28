import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { OfflineBanner } from "@/components/shell/OfflineBanner";
import { HeroSearch } from "@/components/home/HeroSearch";
import { serializeJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { FeaturedListingsSection } from "@/components/home/FeaturedListingsSection";
import { RecommendedListingsSection } from "@/components/home/RecommendedListingsSection";
import { PopularAreasSection } from "@/components/home/PopularAreasSection";
import { MarketStatsSection } from "@/components/home/MarketStatsSection";
import { AgentsPreviewSection } from "@/components/home/AgentsPreviewSection";
import { HomeCTABanner } from "@/components/home/HomeCTABanner";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { MOCK_LISTINGS } from "@/mock/listings";
import { MOCK_AGENTS } from "@/mock/agents";
import { POPULAR_AREAS } from "@/mock/popular-areas";
import { MOCK_MARKET_OVERVIEW } from "@/mock/market-stats";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  titleAr: "مقر — منصة العقارات العُمانية",
  descriptionAr:
    "مقر هو تطبيق عقاري عُماني يساعدك على البحث عن العقارات، مقارنة الأسعار، التواصل مع الوسطاء الموثقين، وتحليل السوق العقاري في عُمان.",
  path: "/",
  keywords: ["عقارات عمان", "شقق للبيع مسقط", "فيلات للإيجار عمان", "وسطاء عقاريون عمان"],
});

// Derive featured and recommended from mock data
const featuredListings = MOCK_LISTINGS.filter((l) => l.isFeatured);
const recommendedListings = MOCK_LISTINGS.filter((l) => !l.isFeatured && l.isVerified)
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 6);
const nearYouListings = MOCK_LISTINGS.filter(
  (l) => l.location.governorateId === "muscat" && !l.isFeatured
).slice(0, 4);

/** Fetch real counts from Supabase for the market stats section. */
async function fetchRealCounts(): Promise<{ totalListings: number }> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .eq("review_status", "approved");

    if (error || count === null) return { totalListings: MOCK_MARKET_OVERVIEW.totalListings };
    return { totalListings: count };
  } catch {
    // Supabase not available at build time — fall back to mock
    return { totalListings: MOCK_MARKET_OVERVIEW.totalListings };
  }
}

export default async function HomePage() {
  const orgSchema = organizationJsonLd();
  const siteSchema = websiteJsonLd();

  // Fetch real listing count; keep all other mock market data
  const { totalListings } = await fetchRealCounts();
  const marketOverview = { ...MOCK_MARKET_OVERVIEW, totalListings };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgSchema as Record<string, unknown>) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteSchema as Record<string, unknown>) }}
      />
      <OfflineBanner />

      <HeroSearch />

      <main>
        {/* Featured properties */}
        <FeaturedListingsSection listings={featuredListings} />

        {/* Popular areas */}
        <PopularAreasSection areas={POPULAR_AREAS.slice(0, 7)} />

        {/* Market stats — totalListings is real; price/ROI data is illustrative */}
        <MarketStatsSection overview={marketOverview} />

        {/* Recommended listings */}
        <RecommendedListingsSection
          listings={recommendedListings}
          titleAr="عقارات قد تعجبك"
          titleEn="Recommended for You"
          subtitleAr="بناءً على أكثر العقارات مشاهدةً في مسقط"
          subtitleEn="Based on the most viewed listings in Muscat"
        />

        {/* Near you */}
        <RecommendedListingsSection
          listings={nearYouListings}
          titleAr="قريب منك"
          titleEn="Near You"
          subtitleAr="عقارات في محافظة مسقط"
          subtitleEn="Properties in Muscat Governorate"
        />

        {/* Agents preview */}
        <AgentsPreviewSection agents={MOCK_AGENTS} />

        {/* Recently viewed — client component */}
        <RecentlyViewedSection />

        {/* CTAs */}
        <HomeCTABanner />

        {/* Bottom padding for nav bar */}
        <div className="h-4" />
      </main>
    </AppShell>
  );
}
