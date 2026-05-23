// ── AreaRankingTable — table of areas/wilayats ranked by demand or price ──────

import { cn } from "@/lib/utils";
import { toArabicNumerals, formatOMR } from "@/lib/formatters";
import { DemandBadge } from "@/components/market/DemandBadge";

export interface RankingRow {
  nameAr: string;
  avgSalePrice: number;
  avgRentPrice: number;
  rentalYield: number;
  demandScore: number;
  priceChangePct: number;
  listingCount: number;
}

interface AreaRankingTableProps {
  rows: RankingRow[];
  title?: string;
  className?: string;
}

export function AreaRankingTable({
  rows,
  title,
  className,
}: AreaRankingTableProps) {
  const sorted = [...rows].sort((a, b) => b.demandScore - a.demandScore);

  return (
    <div className={cn("", className)}>
      {title && (
        <h2 className="text-base font-bold text-[#102A43] mb-3">{title}</h2>
      )}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        {sorted.map((row, i) => (
          <div
            key={row.nameAr}
            className={cn(
              "px-4 py-3 flex items-center justify-between gap-3",
              i < sorted.length - 1 && "border-b border-[#E2E8F0]"
            )}
          >
            {/* Rank + name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F0F4F8] text-[#627D98] text-xs font-bold flex items-center justify-center">
                {toArabicNumerals(i + 1)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#102A43] truncate">
                  {row.nameAr}
                </p>
                <p className="text-xs text-[#627D98]">
                  {formatOMR(row.avgSalePrice, { arabic: true, compact: true })} متوسط البيع
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-end">
                <p className="text-xs font-semibold text-[#0A3C36]">
                  {toArabicNumerals(row.rentalYield)}%
                </p>
                <p className="text-[10px] text-[#627D98]">عائد</p>
              </div>
              <DemandBadge score={row.demandScore} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
