"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/config/routes";
import type { PopularArea } from "@/mock/popular-areas";
import type { Locale } from "@/types";

interface DemandBarProps {
  score: number;
  locale: Locale;
  labelVeryHigh: string;
  labelHigh: string;
  labelMedium: string;
}

function DemandBar({ score, labelVeryHigh, labelHigh, labelMedium }: DemandBarProps) {
  const color =
    score >= 90 ? "#0A3C36" : score >= 75 ? "#E5BA73" : "#2D7A4F";
  const label =
    score >= 90 ? labelVeryHigh : score >= 75 ? labelHigh : labelMedium;
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

interface AreaCardProps {
  area: PopularArea;
  className?: string;
}

export function AreaCard({ area, className }: AreaCardProps) {
  const { locale, t } = useTranslation();
  const isAr = locale === "ar";
  const priceChange = area.priceChangePct;
  const isPositive = priceChange >= 0;

  const areaName = isAr ? area.nameAr : (area.nameEn ?? area.nameAr);
  const governorateName = isAr ? area.governorateAr : (area.governorateEn ?? area.governorateAr);
  const listingCountStr = isAr
    ? `${formatNumber(area.listingCount, "ar")} إعلان متاح`
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
            {t("home.area.avgSale")}
          </span>
          <span className="text-sm font-bold text-[#102A43]">
            {formatCurrency(area.avgSalePrice, locale, { compact: true })}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#627D98]">
            {t("home.area.avgRentPerMonth")}
          </span>
          <span className="text-xs font-semibold text-[#627D98]">
            {formatCurrency(area.avgRentPrice, locale)}
          </span>
        </div>
      </div>

      {/* Demand */}
      <DemandBar
        score={area.demandScore}
        locale={locale}
        labelVeryHigh={t("home.area.demandVeryHigh")}
        labelHigh={t("home.area.demandHigh")}
        labelMedium={t("home.area.demandMedium")}
      />

      {/* Listing count */}
      <p className="text-[10px] text-[#627D98] mt-1.5">{listingCountStr}</p>
    </Link>
  );
}
