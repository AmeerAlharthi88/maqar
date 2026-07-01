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
import { HomeCTABanner } from "@/components/home/HomeCTABanner";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { POPULAR_AREAS } from "@/mock/popular-areas";
import { MOCK_MARKET_OVERVIEW } from "@/mock/market-stats";
import { createClient } from "@/lib/supabase/server";
import { getPublicListingsServer } from "@/lib/supabase/listings.server";

export const metadata: Metadata = buildMetadata({
  titleAr: "مقر — منصة العقارات العُمانية",
  descriptionAr:
    "مقر هو تطبيق عقاري عُماني يساعدك على البحث عن العقارات، مقارنة الأسعار، التواصل مع الوسطاء الموثقين، وتحليل السوق العقاري في عُمان.",
  path: "/",
  keywords: ["عقارات عمان", "شقق للبيع مسقط", "فيلات للإيجار عمان", "وسطاء عقاريون عمان"],
});

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

  // Fetch the real listing count + the real public listings in parallel.
  // Real, public (active + approved) listings only — never mock (FP12 #1).
  // The sections hide themselves when empty, so low inventory degrades cleanly.
  const [{ totalListings }, publicListings] = await Promise.all([
    fetchRealCounts(),
    getPublicListingsServer(30),
  ]);
  const marketOverview = { ...MOCK_MARKET_OVERVIEW, totalListings };
  // Prefer listings that actually have a cover image so Featured/rows never lead
  // with a placeholder (FP17F-1). Image-having first, then by views.
  const hasImg = (l: (typeof publicListings)[number]) => Boolean(l.coverImage && l.coverImage.trim());
  const byViews = [...publicListings].sort((a, b) => {
    if (hasImg(a) !== hasImg(b)) return hasImg(a) ? -1 : 1;
    return b.viewCount - a.viewCount;
  });
  // "Featured" = explicitly flagged listings (with an image); if none are flagged
  // yet, fall back to the most-viewed real listings so the hero isn't empty
  // (still 100% real, nothing invented).
  const flagged = publicListings.filter((l) => l.isFeatured && hasImg(l));
  const featuredListings = (flagged.length > 0 ? flagged : byViews).slice(0, 6);
  const featuredIds = new Set(featuredListings.map((l) => l.id));
  const recommendedListings = byViews.filter((l) => !featuredIds.has(l.id)).slice(0, 6);
  const nearYouListings = publicListings
    .filter((l) => l.location.governorateId === "muscat")
    .slice(0, 4);

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

        {/* Most viewed — honest name matching the actual logic (FP17F-1) */}
        <RecommendedListingsSection
          listings={recommendedListings}
          titleAr="الأكثر مشاهدة"
          titleEn="Most viewed"
          subtitleAr="أكثر العقارات مشاهدةً في مسقط"
          subtitleEn="The most viewed listings in Muscat"
        />

        {/* Properties in Muscat — not geolocated, so no "near you" claim (FP17F-1) */}
        <RecommendedListingsSection
          listings={nearYouListings}
          titleAr="عقارات في مسقط"
          titleEn="Properties in Muscat"
          subtitleAr="عقارات في محافظة مسقط"
          subtitleEn="Properties in Muscat Governorate"
        />

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
