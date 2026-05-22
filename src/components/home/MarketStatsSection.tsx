"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import { useLanguageStore } from "@/store/language.store";
import type { MarketOverview } from "@/mock/market-stats";

interface MarketStatsSectionProps {
  overview: MarketOverview;
}

export function MarketStatsSection({ overview }: MarketStatsSectionProps) {
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";

  const avgSaleFormatted = formatOMR(overview.avgSalePriceMuscat, { compact: true, arabic: isAr });
  const avgRentFormatted = formatOMR(overview.avgRentPriceMuscat, { arabic: isAr });
  const totalListings = isAr
    ? toArabicNumerals(overview.totalListings.toLocaleString())
    : overview.totalListings.toLocaleString();

  return (
    <section className="px-4 py-5">
      <SectionHeader
        titleAr={isAr ? "إحصاءات السوق" : "Market Statistics"}
        subtitleAr={isAr ? "بيانات سوق العقارات العُماني — مسقط" : "Oman real estate market data — Muscat"}
        size="md"
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          labelAr="متوسط سعر البيع — مسقط"
          labelEn="Avg. Sale Price — Muscat"
          value={avgSaleFormatted}
          change={{ pct: overview.yoyPriceChange, direction: "up" }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
            </svg>
          }
        />

        <StatCard
          labelAr="متوسط الإيجار الشهري"
          labelEn="Avg. Monthly Rent"
          value={isAr ? `${avgRentFormatted} / شهر` : `${avgRentFormatted} / mo`}
          change={{ pct: 3.2, direction: "up" }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18M3 9h18M3 15h18"/>
            </svg>
          }
        />

        <StatCard
          labelAr="إجمالي الإعلانات النشطة"
          labelEn="Total Active Listings"
          value={totalListings}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          }
        />

        <StatCard
          labelAr="متوسط العائد الاستثماري"
          labelEn="Avg. Investment ROI"
          value="٦٫٢٪"
          change={{ pct: 0.8, direction: "up" }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          }
        />
      </div>
    </section>
  );
}
