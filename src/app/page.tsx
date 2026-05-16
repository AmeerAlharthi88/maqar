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

export default function HomePage() {
  const orgSchema = organizationJsonLd();
  const siteSchema = websiteJsonLd();

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

        {/* Market stats */}
        <MarketStatsSection overview={MOCK_MARKET_OVERVIEW} />

        {/* Recommended listings */}
        <RecommendedListingsSection
          listings={recommendedListings}
          title="عقارات قد تعجبك"
          subtitle="بناءً على أكثر العقارات مشاهدةً في مسقط"
        />

        {/* Near you */}
        <RecommendedListingsSection
          listings={nearYouListings}
          title="قريب منك"
          subtitle="عقارات في محافظة مسقط"
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
