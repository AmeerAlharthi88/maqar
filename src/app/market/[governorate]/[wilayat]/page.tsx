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
import { YieldBadge } from "@/components/market/YieldBadge";
import { getWilayatBySlug, ALL_GOVERNORATES, getAllWilayats } from "@/mock/market-data";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import { fetchMarketDataByArea } from "@/lib/supabase/market-data";

interface Props {
  params: Promise<{ governorate: string; wilayat: string }>;
}

export async function generateStaticParams() {
  return getAllWilayats().map((w) => ({
    governorate: w.governorateSlug,
    wilayat: w.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { governorate: govSlug, wilayat: wilSlug } = await params;
  const wil = getWilayatBySlug(govSlug, wilSlug);

  if (!wil) return { title: "الولاية غير موجودة | مقر" };

  return {
    title: `سوق عقارات ${wil.nameAr} — ${wil.governorateAr} | مقر`,
    description: `إحصاءات سوق العقارات في ولاية ${wil.nameAr}، محافظة ${wil.governorateAr}: متوسط البيع ${wil.avgSalePrice.toLocaleString()} ر.ع.، عائد إيجاري ${wil.rentalYield}٪.`,
  };
}

export default async function WilayatPage({ params }: Props) {
  const { governorate: govSlug, wilayat: wilSlug } = await params;
  const wil = getWilayatBySlug(govSlug, wilSlug);

  if (!wil) notFound();

  // ── Overlay real DB market stats when available ─────────────────────────────
  // fetchMarketDataByArea returns [] if DB not configured — falls back to mock.
  const dbStats = await fetchMarketDataByArea({
    governorate: wil.governorateAr,
    wilayat:     wil.nameAr,
    // no area → wilayat-level row (area IS NULL)
  });
  const dbRow   = dbStats.find((r) => r.area === null && r.propertyType === null) ?? null;
  const stats   = {
    avgSalePrice: dbRow?.avgSalePriceOmr  ?? wil.avgSalePrice,
    avgRentPrice: dbRow?.avgRentOmr       ?? wil.avgRentPrice,
    pricePerSqm:  dbRow?.pricePerSqmOmr   ?? wil.pricePerSqm,
    rentalYield:  dbRow?.rentalYieldPercent ?? wil.rentalYield,
    demandScore:  dbRow?.demandScore       ?? wil.demandScore,
  };
  // ────────────────────────────────────────────────────────────────────────────

  const areaRows = wil.areas.map((a) => ({
    nameAr: a.nameAr,
    avgSalePrice: a.avgSalePrice,
    avgRentPrice: a.avgRentPrice,
    rentalYield: a.rentalYield,
    demandScore: a.demandScore,
    priceChangePct: a.priceChangePct,
    listingCount: a.listingCount,
  }));

  return (
    <AppShell>
      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto" dir="rtl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#A89480] flex-wrap">
          <Link href="/market" className="hover:text-[#C65D3B]">السوق</Link>
          <span>/</span>
          <Link href={`/market/${govSlug}`} className="hover:text-[#C65D3B]">
            {wil.governorateAr}
          </Link>
          <span>/</span>
          <span className="text-[#1E1E1E] font-semibold">{wil.nameAr}</span>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h1 className="text-xl font-bold text-[#1E1E1E]">
              سوق عقارات {wil.nameAr}
            </h1>
            <div className="flex flex-col items-end gap-1">
              <DemandBadge score={stats.demandScore} />
              <YieldBadge pct={stats.rentalYield} />
            </div>
          </div>
          <p className="text-sm text-[#7A6B5E]">
            {wil.governorateAr} · {toArabicNumerals(wil.listingCount)} إعلان · تغيّر{" "}
            {wil.priceChangePct > 0 ? "+" : ""}
            {toArabicNumerals(wil.priceChangePct)}% سنوياً
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <MarketOverviewCard
            label="متوسط سعر البيع"
            value={formatOMR(stats.avgSalePrice, { arabic: true, compact: true })}
            trend={wil.priceChangePct}
            sub="تغيّر سنوي"
          />
          <MarketOverviewCard
            label="متوسط الإيجار الشهري"
            value={formatOMR(stats.avgRentPrice, { arabic: true, compact: true })}
          />
          <MarketOverviewCard
            label="العائد الإيجاري التقديري"
            value={`${toArabicNumerals(stats.rentalYield)}%`}
          />
          <MarketOverviewCard
            label="سعر المتر المربع"
            value={`${toArabicNumerals(stats.pricePerSqm)} ر.ع./م²`}
          />
        </div>

        {/* Trend chart */}
        <MarketTrendChart
          data={wil.monthlyTrend}
          mode="sale"
          title="توجه أسعار البيع (آخر ٦ أشهر)"
        />

        {/* Area ranking */}
        {areaRows.length > 0 && (
          <AreaRankingTable
            rows={areaRows}
            title="المناطق ضمن الولاية"
          />
        )}

        {/* AI insight */}
        <div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-3">
            تحليل ذكي للسوق
          </h2>
          <MarketInsightPanel
            wilayatAr={wil.nameAr}
            governorateAr={wil.governorateAr}
            avgSalePrice={stats.avgSalePrice}
            avgRentPrice={stats.avgRentPrice}
            rentalYield={stats.rentalYield}
            demandScore={stats.demandScore}
            priceChangePct={wil.priceChangePct}
          />
        </div>

        {/* Other wilayats link */}
        <div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-2">
            ولايات أخرى في {wil.governorateAr}
          </h2>
          <Link
            href={`/market/${govSlug}`}
            className="text-sm text-[#C65D3B] font-semibold"
          >
            عرض جميع ولايات {wil.governorateAr}
          </Link>
        </div>

        {/* Tools CTA */}
        <div className="bg-[#FBF0EB] rounded-2xl p-4 border border-[#C65D3B]/20">
          <p className="text-sm font-semibold text-[#C65D3B] mb-1">
            أدوات مالية لعقاراتك في {wil.nameAr}
          </p>
          <div className="flex gap-3 mt-2">
            <Link href="/tools/roi-calculator" className="text-xs font-bold text-[#C65D3B]">
              حاسبة العائد
            </Link>
            <Link href="/tools/mortgage-calculator" className="text-xs font-bold text-[#C65D3B]">
              حاسبة التمويل
            </Link>
            <Link href="/tools/price-per-sqm" className="text-xs font-bold text-[#C65D3B]">
              سعر المتر
            </Link>
          </div>
        </div>

        <MarketDisclaimer variant="banner" />
      </div>
    </AppShell>
  );
}
