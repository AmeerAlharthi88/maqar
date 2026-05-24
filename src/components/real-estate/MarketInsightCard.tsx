import { cn } from "@/lib/utils";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import type { AreaMarketStat } from "@/mock/market-stats";

interface MarketInsightCardProps {
  stat: AreaMarketStat;
  className?: string;
}

export function MarketInsightCard({ stat, className }: MarketInsightCardProps) {
  const isPositive = stat.priceChangePct >= 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 border border-[#E2E8F0]",
        "shadow-[0_2px_8px_0_rgb(10_60_54/0.06)]",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-[#102A43]">{stat.areaAr}</h3>
          <p className="text-xs text-[#627D98] mt-0.5">
            {toArabicNumerals(stat.listingCount)} إعلان نشط
          </p>
        </div>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-md",
            isPositive ? "bg-[#E6F0EF] text-[#0A3C36]" : "bg-[#FEF0EE] text-[#C0392B]"
          )}
        >
          {isPositive ? "+" : ""}{toArabicNumerals(stat.priceChangePct.toFixed(1))}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-[#627D98]">متوسط سعر البيع</p>
          <p className="text-sm font-bold text-[#0A3C36]">{formatOMR(stat.avgSalePrice, { compact: true })}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-[#627D98]">متوسط الإيجار</p>
          <p className="text-sm font-bold text-[#2471A3]">{formatOMR(stat.avgRentPrice, { compact: true })}/شهر</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#627D98]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          {toArabicNumerals(stat.avgDaysOnMarket)} يوم متوسط
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0A3C36]"
              style={{ width: `${stat.demandScore}%` }}
            />
          </div>
          <span className="text-xs text-[#627D98]">{toArabicNumerals(stat.demandScore)}%</span>
        </div>
      </div>
    </div>
  );
}
