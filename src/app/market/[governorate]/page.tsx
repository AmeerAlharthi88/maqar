import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { MarketOverviewCard } from "@/components/market/MarketOverviewCard";
import { MarketTrendChart } from "@/components/market/MarketTrendChart";
import { AreaRankingTable } from "@/components/market/AreaRankingTable";
import { MarketInsightPanel } from "@/components/market/MarketInsightPanel";
import { MarketDisclaimer } from "@/components/market/MarketDisclaimer";
import { DemandBadge } from "@/components/market/DemandBadge";
import { getGovernorateBySlug, ALL_GOVERNORATES } from "@/mock/market-data";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";

interface Props {
  params: Promise<{ governorate: string }>;
}

export async function generateStaticParams() {
  return ALL_GOVERNORATES.map((g) => ({ governorate: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { governorate: slug } = await params;
  const gov = getGovernorateBySlug(slug);

  if (!gov) return { title: "المحافظة غير موجودة | مقر" };

  return {
    title: `سوق العقارات — ${gov.nameAr} | مقر`,
    description: `إحصاءات سوق العقارات في محافظة ${gov.nameAr}: متوسط أسعار البيع ${gov.avgSalePrice.toLocaleString()} ر.ع.، العائد الإيجاري ${gov.rentalYield}٪.`,
  };
}

export default async function GovernoratePage({ params }: Props) {
  const { governorate: slug } = await params;
  const gov = getGovernorateBySlug(slug);

  if (!gov) notFound();

  // All areas across all wilayats for this governorate
  const allAreas = gov.wilayats.flatMap((w) =>
    w.areas.map((a) => ({
      nameAr: `${a.nameAr} — ${w.nameAr}`,
      avgSalePrice: a.avgSalePrice,
      avgRentPrice: a.avgRentPrice,
      rentalYield: a.rentalYield,
      demandScore: a.demandScore,
      priceChangePct: a.priceChangePct,
      listingCount: a.listingCount,
    }))
  );

  return (
    <AppShell>
      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto" dir="rtl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#627D98]">
          <Link href="/market" className="hover:text-[#0A3C36]">
            السوق
          </Link>
          <span>/</span>
          <span className="text-[#102A43] font-semibold">{gov.nameAr}</span>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h1 className="text-xl font-bold text-[#102A43]">
              سوق عقارات {gov.nameAr}
            </h1>
            <DemandBadge score={gov.demandScore} />
          </div>
          <p className="text-sm text-[#627D98]">
            {toArabicNumerals(gov.listingCount)} إعلان · تغيّر سنوي{" "}
            {gov.priceChangePct > 0 ? "+" : ""}
            {toArabicNumerals(gov.priceChangePct)}%
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <MarketOverviewCard
            label="متوسط سعر البيع"
            value={formatOMR(gov.avgSalePrice, { arabic: true, compact: true })}
            trend={gov.priceChangePct}
            sub="تغيّر سنوي"
          />
          <MarketOverviewCard
            label="متوسط الإيجار الشهري"
            value={formatOMR(gov.avgRentPrice, { arabic: true, compact: true })}
          />
          <MarketOverviewCard
            label="العائد الإيجاري التقديري"
            value={`${toArabicNumerals(gov.rentalYield)}%`}
          />
          <MarketOverviewCard
            label="سعر المتر المربع"
            value={`${toArabicNumerals(gov.pricePerSqm)} ر.ع./م²`}
          />
        </div>

        {/* Trend chart */}
        <MarketTrendChart
          data={gov.monthlyTrend}
          mode="sale"
          title="توجه أسعار البيع (آخر ٦ أشهر)"
        />

        {/* Wilayat links */}
        <div>
          <h2 className="text-base font-bold text-[#102A43] mb-3">
            الولايات
          </h2>
          <div className="space-y-2">
            {gov.wilayats.map((w) => (
              <Link
                key={w.slug}
                href={`/market/${gov.slug}/${w.slug}`}
                className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-2xl px-4 py-3 active:bg-[#F8F9FA]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#102A43]">
                    {w.nameAr}
                  </p>
                  <p className="text-xs text-[#627D98]">
                    {toArabicNumerals(w.listingCount)} إعلان ·{" "}
                    {formatOMR(w.avgSalePrice, { arabic: true, compact: true })} متوسط
                  </p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#627D98"
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

        {/* Area ranking */}
        <AreaRankingTable
          rows={allAreas}
          title="ترتيب المناطق حسب الطلب"
        />

        {/* AI insight */}
        <div>
          <h2 className="text-base font-bold text-[#102A43] mb-3">
            تحليل ذكي للسوق
          </h2>
          <MarketInsightPanel
            governorateAr={gov.nameAr}
            avgSalePrice={gov.avgSalePrice}
            avgRentPrice={gov.avgRentPrice}
            rentalYield={gov.rentalYield}
            demandScore={gov.demandScore}
            priceChangePct={gov.priceChangePct}
          />
        </div>

        {/* Tools CTA */}
        <div className="bg-[#E6F0EF] rounded-2xl p-4 border border-[#0A3C36]/20">
          <p className="text-sm font-semibold text-[#0A3C36] mb-1">
            هل تفكّر في الاستثمار؟
          </p>
          <p className="text-xs text-[#627D98] mb-3">
            استخدم حاسبة العائد الإيجاري لتقييم عقارك في {gov.nameAr}.
          </p>
          <div className="flex gap-3">
            <Link
              href="/tools/roi-calculator"
              className="text-xs font-bold text-[#0A3C36]"
            >
              حاسبة العائد
            </Link>
            <Link
              href="/tools/mortgage-calculator"
              className="text-xs font-bold text-[#0A3C36]"
            >
              حاسبة التمويل
            </Link>
          </div>
        </div>

        <MarketDisclaimer variant="banner" />
      </div>
    </AppShell>
  );
}
