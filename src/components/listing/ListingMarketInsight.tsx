import { toArabicNumerals, formatOMR } from "@/lib/formatters";
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

function DemandBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color =
    pct >= 80 ? "#0A3C36" : pct >= 60 ? "#E5BA73" : "#C8860A";
  const label = pct >= 80 ? "مرتفع" : pct >= 60 ? "متوسط" : "منخفض";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-[#627D98]">مؤشر الطلب في المنطقة</span>
        <span className="font-semibold" style={{ color }}>{toArabicNumerals(score)}/١٠٠ — {label}</span>
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
        ? `أقل من المتوسط بـ ${toArabicNumerals(Math.abs(Math.round(priceDiffPct)))}%`
        : priceDiffPct > 0
        ? `أعلى من المتوسط بـ ${toArabicNumerals(Math.round(priceDiffPct))}%`
        : "يساوي المتوسط"
      : "غير متاح";

  const diffHighlight: "good" | "warn" | "neutral" =
    priceDiffPct !== null
      ? priceDiffPct < -5
        ? "good"
        : priceDiffPct > 10
        ? "warn"
        : "neutral"
      : "neutral";

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      {/* Header with disclaimer */}
      <div className="flex items-start justify-between mb-3 gap-3">
        <h2 className="text-base font-bold text-[#102A43]">تحليل السوق التقديري</h2>
        <span className="flex-shrink-0 text-[10px] text-[#627D98] bg-[#F0F4F8] border border-[#E2E8F0] px-2 py-0.5 rounded-full">
          بيانات تقديرية
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-4">
          {avgPrice !== null && (
            <InsightRow
              label="متوسط السعر في المنطقة"
              value={formatOMR(avgPrice, { arabic: true })}
              sub={listing.purpose === "rent" ? "ر.ع / شهر" : "للبيع"}
            />
          )}
          {priceDiffPct !== null && (
            <InsightRow
              label="مقارنة بالسوق"
              value={diffLabel}
              highlight={diffHighlight}
            />
          )}
          {pricePerSqm !== null && (
            <InsightRow
              label="السعر لكل متر مربع"
              value={`${toArabicNumerals(pricePerSqm)} ر.ع/م²`}
            />
          )}
          {priceChangePct !== null && (
            <InsightRow
              label="تغيّر الأسعار (سنوي)"
              value={`${priceChangePct > 0 ? "+" : ""}${toArabicNumerals(priceChangePct)}%`}
              highlight={priceChangePct > 0 ? "good" : "warn"}
            />
          )}
          {avgDaysOnMarket !== null && (
            <InsightRow
              label="متوسط أيام البيع"
              value={`${toArabicNumerals(avgDaysOnMarket)} يوم`}
            />
          )}
          {rentalYield !== null && listing.purpose === "sale" && (
            <InsightRow
              label="العائد الإيجاري المتوقع"
              value={`${toArabicNumerals(rentalYield)}%`}
              highlight="good"
            />
          )}
          {investmentScore !== null && (
            <InsightRow
              label="درجة الجاذبية الاستثمارية"
              value={`${toArabicNumerals(investmentScore)}/١٠٠`}
              highlight={investmentScore >= 70 ? "good" : "neutral"}
            />
          )}
        </div>

        {demandScore !== null && (
          <div className="px-4 pb-4">
            <DemandBar score={demandScore} />
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="mt-2 text-[10px] text-[#627D98] text-center">
        هذه البيانات تقديرية للتوجيه فقط ولا تمثّل قيمة تقييم رسمية
      </p>
    </div>
  );
}
