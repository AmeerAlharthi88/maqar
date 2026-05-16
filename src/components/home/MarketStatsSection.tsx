import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import type { MarketOverview } from "@/mock/market-stats";

interface MarketStatsSectionProps {
  overview: MarketOverview;
}

export function MarketStatsSection({ overview }: MarketStatsSectionProps) {
  return (
    <section className="px-4 py-5">
      <SectionHeader
        titleAr="إحصاءات السوق"
        subtitleAr="بيانات سوق العقارات العُماني — مسقط"
        size="md"
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          labelAr="متوسط سعر البيع — مسقط"
          value={formatOMR(overview.avgSalePriceMuscat, { compact: true })}
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
          value={`${formatOMR(overview.avgRentPriceMuscat)} / شهر`}
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
          value={toArabicNumerals(overview.totalListings.toLocaleString())}
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
