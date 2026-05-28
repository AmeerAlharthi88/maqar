"use client";

import { formatNumber, formatCurrency } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { ListingMarketData } from "@/lib/helpers/listing-detail";
import type { Listing } from "@/types/listing";

interface ListingMarketInsightProps {
  listing: Listing;
  marketData: ListingMarketData;
}

function InsightRow({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "good" | "warn" | "neutral";
}) {
  const colorMap = {
    good: "text-[#0A3C36]",
    warn: "text-[#C0392B]",
    neutral: "text-[#102A43]",
  };
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#627D98]">{label}</span>
      <div className="text-end">
        <span className={cn("text-sm font-semibold", highlight ? colorMap[highlight] : "text-[#102A43]")}>
          {value}
        </span>
        {sub && <p className="text-xs text-[#627D98]">{sub}</p>}
      </div>
    </div>
  );
}

function DemandBar({ score, locale }: { score: number; locale: string }) {
  const isAr = locale === "ar";
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 80 ? "#0A3C36" : pct >= 60 ? "#E5BA73" : "#C8860A";
  const label = isAr
    ? (pct >= 80 ? "مرتفع" : pct >= 60 ? "متوسط" : "منخفض")
    : (pct >= 80 ? "High" : pct >= 60 ? "Medium" : "Low");

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-[#627D98]">
          {isAr ? "مؤشر الطلب في المنطقة" : "Area demand index"}
        </span>
        <span className="font-semibold" style={{ color }}>
          {formatNumber(score, locale as "ar" | "en")}/100 — {label}
        </span>
      </div>
      <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function ListingMarketInsight({
  listing,
  marketData,
}: ListingMarketInsightProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  const {
    avgPrice,
    priceDiffPct,
    pricePerSqm,
    demandScore,
    priceChangePct,
    avgDaysOnMarket,
    investmentScore,
    rentalYield,
  } = marketData;

  const diffLabel =
    priceDiffPct !== null
      ? priceDiffPct < 0
        ? isAr
          ? `أقل من المتوسط بـ ${formatNumber(Math.abs(Math.round(priceDiffPct)), locale)}%`
          : `${formatNumber(Math.abs(Math.round(priceDiffPct)), locale)}% below average`
        : priceDiffPct > 0
        ? isAr
          ? `أعلى من المتوسط بـ ${formatNumber(Math.round(priceDiffPct), locale)}%`
          : `${formatNumber(Math.round(priceDiffPct), locale)}% above average`
        : isAr ? "يساوي المتوسط" : "At market average"
      : isAr ? "غير متاح" : "N/A";

  const diffHighlight: "good" | "warn" | "neutral" =
    priceDiffPct !== null
      ? priceDiffPct < -5 ? "good" : priceDiffPct > 10 ? "warn" : "neutral"
      : "neutral";

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      {/* Header with disclaimer */}
      <div className="flex items-start justify-between mb-3 gap-3">
        <h2 className="text-base font-bold text-[#102A43]">
          {isAr ? "تحليل السوق التقديري" : "Estimated Market Analysis"}
        </h2>
        <span className="flex-shrink-0 text-[10px] text-[#627D98] bg-[#F0F4F8] border border-[#E2E8F0] px-2 py-0.5 rounded-full">
          {isAr ? "بيانات تقديرية" : "Estimated data"}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-4">
          {avgPrice !== null && (
            <InsightRow
              label={isAr ? "متوسط السعر في المنطقة" : "Average area price"}
              value={formatCurrency(avgPrice, locale)}
              sub={listing.purpose === "rent"
                ? (isAr ? "ر.ع / شهر" : "OMR / month")
                : (isAr ? "للبيع" : "for sale")}
            />
          )}
          {priceDiffPct !== null && (
            <InsightRow
              label={isAr ? "مقارنة بالسوق" : "vs. market"}
              value={diffLabel}
              highlight={diffHighlight}
            />
          )}
          {pricePerSqm !== null && (
            <InsightRow
              label={isAr ? "السعر لكل متر مربع" : "Price per sqm"}
              value={isAr
                ? `${formatNumber(pricePerSqm, locale)} ر.ع/م²`
                : `${formatNumber(pricePerSqm, locale)} OMR/sqm`}
            />
          )}
          {priceChangePct !== null && (
            <InsightRow
              label={isAr ? "تغيّر الأسعار (سنوي)" : "Price change (annual)"}
              value={`${priceChangePct > 0 ? "+" : ""}${formatNumber(priceChangePct, locale)}%`}
              highlight={priceChangePct > 0 ? "good" : "warn"}
            />
          )}
          {avgDaysOnMarket !== null && (
            <InsightRow
              label={isAr ? "متوسط أيام البيع" : "Avg. days on market"}
              value={isAr
                ? `${formatNumber(avgDaysOnMarket, locale)} يوم`
                : `${formatNumber(avgDaysOnMarket, locale)} days`}
            />
          )}
          {rentalYield !== null && listing.purpose === "sale" && (
            <InsightRow
              label={isAr ? "العائد الإيجاري المتوقع" : "Expected rental yield"}
              value={`${formatNumber(rentalYield, locale)}%`}
              highlight="good"
            />
          )}
          {investmentScore !== null && (
            <InsightRow
              label={isAr ? "درجة الجاذبية الاستثمارية" : "Investment score"}
              value={`${formatNumber(investmentScore, locale)}/100`}
              highlight={investmentScore >= 70 ? "good" : "neutral"}
            />
          )}
        </div>

        {demandScore !== null && (
          <div className="px-4 pb-4">
            <DemandBar score={demandScore} locale={locale} />
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="mt-2 text-[10px] text-[#627D98] text-center">
        {isAr
          ? "هذه البيانات تقديرية للتوجيه فقط ولا تمثّل قيمة تقييم رسمية"
          : "This data is for guidance only and does not represent an official valuation."}
      </p>
    </div>
  );
}
