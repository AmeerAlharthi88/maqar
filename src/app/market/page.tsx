import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { MarketOverviewCard } from "@/components/market/MarketOverviewCard";
import { MarketTrendChart } from "@/components/market/MarketTrendChart";
import { GovernorateComparisonChart } from "@/components/market/GovernorateComparisonChart";
import { AreaRankingTable } from "@/components/market/AreaRankingTable";
import { MarketDisclaimer } from "@/components/market/MarketDisclaimer";
import { OMAN_MARKET_OVERVIEW, ALL_GOVERNORATES } from "@/mock/market-data";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "سوق العقارات في سلطنة عُمان | مقر",
  description:
    "إحصاءات وتوجهات سوق العقارات في سلطنة عُمان: متوسطات الأسعار، العوائد الإيجارية، مؤشرات الطلب بالمحافظات والولايات.",
};

export default function MarketPage() {
  const overview = OMAN_MARKET_OVERVIEW;
  const governorates = ALL_GOVERNORATES;

  // Top areas from all governorates, ranked by demand
  const allAreas = governorates.flatMap((g) =>
    g.wilayats.flatMap((w) =>
      w.areas.map((a) => ({
        nameAr: `${a.nameAr} — ${w.nameAr}`,
        avgSalePrice: a.avgSalePrice,
        avgRentPrice: a.avgRentPrice,
        rentalYield: a.rentalYield,
        demandScore: a.demandScore,
        priceChangePct: a.priceChangePct,
        listingCount: a.listingCount,
      }))
    )
  );

  const topAreas = [...allAreas]
    .sort((a, b) => b.demandScore - a.demandScore)
    .slice(0, 8);

  return (
    <AppShell>
      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto" dir="rtl">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-[#1E1E1E]">
              سوق العقارات — سلطنة عُمان
            </h1>
            <span className="text-[10px] text-[#A89480] bg-[#F5F0EA] border border-[#E8DDD0] px-2 py-0.5 rounded-full">
              بيانات تقديرية
            </span>
          </div>
          <p className="text-sm text-[#7A6B5E]">
            نظرة عامة على توجهات السوق في المحافظات والولايات
          </p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 gap-3">
          <MarketOverviewCard
            label="إجمالي الإعلانات"
            value={toArabicNumerals(overview.totalListings.toLocaleString())}
            sub={`${toArabicNumerals(overview.totalSale)} بيع · ${toArabicNumerals(overview.totalRent)} إيجار`}
          />
          <MarketOverviewCard
            label="متوسط سعر البيع"
            value={formatOMR(overview.avgSalePrice, { arabic: true, compact: true })}
            trend={overview.yoyPriceChange}
            sub="تغيّر سنوي"
          />
          <MarketOverviewCard
            label="متوسط الإيجار الشهري"
            value={formatOMR(overview.avgRentPrice, { arabic: true, compact: true })}
          />
          <MarketOverviewCard
            label="متوسط العائد الإيجاري"
            value={`${toArabicNumerals(overview.avgRentalYield)}%`}
            sub="نسبة تقديرية"
          />
        </div>

        {/* Price trend chart */}
        <MarketTrendChart
          data={overview.monthlyTrend}
          mode="sale"
          title="توجه أسعار البيع (آخر ٦ أشهر)"
        />

        {/* Governorate comparison */}
        <GovernorateComparisonChart
          data={governorates}
          metric="avgSalePrice"
          title="متوسط أسعار البيع بالمحافظات"
        />

        {/* Governorate links */}
        <div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-3">
            استعراض بالمحافظة
          </h2>
          <div className="space-y-2">
            {governorates.map((g) => (
              <Link
                key={g.slug}
                href={`/market/${g.slug}`}
                className="flex items-center justify-between bg-white border border-[#F0EBE3] rounded-2xl px-4 py-3 active:bg-[#FAF7F4]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1E1E1E]">
                    {g.nameAr}
                  </p>
                  <p className="text-xs text-[#A89480]">
                    {toArabicNumerals(g.listingCount)} إعلان ·{" "}
                    {formatOMR(g.avgSalePrice, { arabic: true, compact: true })} متوسط
                  </p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A89480"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="rtl:rotate-180"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Top areas ranking */}
        <AreaRankingTable
          rows={topAreas}
          title="أبرز المناطق طلباً"
        />

        {/* Tools CTA */}
        <div className="bg-[#EAF4FB] rounded-2xl p-4 border border-[#2471A3]/20">
          <p className="text-sm font-semibold text-[#2471A3] mb-1">
            الأدوات المالية
          </p>
          <p className="text-xs text-[#7A6B5E] mb-3">
            احسب العائد الإيجاري، القسط الشهري، وسعر المتر لعقارك.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2471A3]"
          >
            استخدام الأدوات المالية
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rtl:rotate-180">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        <MarketDisclaimer variant="banner" />
      </div>
    </AppShell>
  );
}
