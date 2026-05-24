"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import { useLanguageStore } from "@/store/language.store";
import { ROUTES } from "@/config/routes";
import type { PopularArea } from "@/mock/popular-areas";

interface AreaCardProps {
  area: PopularArea;
  className?: string;
}

function DemandBar({ score }: { score: number }) {
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  const color =
    score >= 90 ? "#0A3C36" : score >= 75 ? "#E5BA73" : "#2D7A4F";
  const label = isAr
    ? (score >= 90 ? "طلب مرتفع جداً" : score >= 75 ? "طلب مرتفع" : "طلب متوسط")
    : (score >= 90 ? "Very High Demand" : score >= 75 ? "High Demand" : "Moderate Demand");
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-[#E2E8F0] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-medium text-[#627D98] whitespace-nowrap">{label}</span>
    </div>
  );
}

export function AreaCard({ area, className }: AreaCardProps) {
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  const priceChange = area.priceChangePct;
  const isPositive = priceChange >= 0;

  const areaName = isAr ? area.nameAr : (area.nameEn ?? area.nameAr);
  const governorateName = isAr ? area.governorateAr : (area.governorateEn ?? area.governorateAr);
  const listingCountStr = isAr
    ? `${toArabicNumerals(area.listingCount)} إعلان متاح`
    : `${area.listingCount} listings`;

  return (
    <Link
      href={ROUTES.area(area.slug)}
      className={cn(
        "block bg-white rounded-2xl border border-[#E2E8F0] p-3",
        "shadow-[0_2px_8px_0_rgb(10_60_54/0.06)] hover:shadow-[0_6px_20px_0_rgb(10_60_54/0.10)]",
        "transition-shadow duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#102A43]">{areaName}</h3>
          <p className="text-xs text-[#627D98]">{governorateName}</p>
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-semibold",
            isPositive ? "text-[#0A3C36]" : "text-[#C0392B]"
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
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#627D98]">
            {isAr ? "متوسط البيع" : "Avg. Sale"}
          </span>
          <span className="text-sm font-bold text-[#102A43]">
            {formatOMR(area.avgSalePrice, { compact: true, arabic: isAr })}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#627D98]">
            {isAr ? "متوسط الإيجار / شهر" : "Avg. Rent / mo"}
          </span>
          <span className="text-xs font-semibold text-[#627D98]">
            {formatOMR(area.avgRentPrice, { arabic: isAr })}
          </span>
        </div>
      </div>

      {/* Demand */}
      <DemandBar score={area.demandScore} />

      {/* Listing count */}
      <p className="text-[10px] text-[#627D98] mt-1.5">{listingCountStr}</p>
    </Link>
  );
}
