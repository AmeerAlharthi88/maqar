import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import { ROUTES } from "@/config/routes";
import type { PopularArea } from "@/mock/popular-areas";

interface AreaCardProps {
  area: PopularArea;
  className?: string;
}

function DemandBar({ score }: { score: number }) {
  const color =
    score >= 90 ? "#C65D3B" : score >= 75 ? "#D4A373" : "#5B8C5A";
  const label =
    score >= 90 ? "طلب مرتفع جداً" : score >= 75 ? "طلب مرتفع" : "طلب متوسط";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#F0EBE3] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-medium text-[#7A6B5E] whitespace-nowrap">{label}</span>
    </div>
  );
}

export function AreaCard({ area, className }: AreaCardProps) {
  const priceChange = area.priceChangePct;
  const isPositive = priceChange >= 0;

  return (
    <Link
      href={ROUTES.area(area.slug)}
      className={cn(
        "block bg-white rounded-2xl border border-[#F0EBE3] p-4",
        "shadow-[0_2px_8px_0_rgb(30_30_30/0.06)] hover:shadow-[0_6px_20px_0_rgb(30_30_30/0.10)]",
        "transition-shadow duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1E1E1E]">{area.nameAr}</h3>
          <p className="text-xs text-[#A89480]">{area.governorateAr}</p>
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-semibold",
            isPositive ? "text-[#5B8C5A]" : "text-[#C0392B]"
          )}
        >
          {isPositive ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          )}
          {Math.abs(priceChange)}%
        </span>
      </div>

      {/* Prices */}
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#A89480]">متوسط البيع</span>
          <span className="text-sm font-bold text-[#1E1E1E]">{formatOMR(area.avgSalePrice, { compact: true })}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#A89480]">متوسط الإيجار / شهر</span>
          <span className="text-xs font-semibold text-[#7A6B5E]">{formatOMR(area.avgRentPrice)}</span>
        </div>
      </div>

      {/* Demand */}
      <DemandBar score={area.demandScore} />

      {/* Listing count */}
      <p className="text-[10px] text-[#A89480] mt-2">
        {toArabicNumerals(area.listingCount)} إعلان متاح
      </p>
    </Link>
  );
}
