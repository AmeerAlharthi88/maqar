"use client";

import { formatNumber } from "@/lib/formatters";
import { getQualityLabel, getMissingFields } from "@/lib/helpers/add-listing";
import { useTranslation } from "@/i18n/useTranslation";
import type { ListingDraft } from "@/types/listing-draft";

interface QualityScoreCardProps {
  score: number;
  draft: ListingDraft;
  compact?: boolean;
}

export function QualityScoreCard({ score, draft, compact = false }: QualityScoreCardProps) {
  const { locale } = useTranslation();
  const isAr = locale === "ar";
  const label = getQualityLabel(score);
  const missing = getMissingFields(draft, locale);

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl border"
        style={{ borderColor: label.color + "40", backgroundColor: label.bgColor }}
      >
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={label.color}
              strokeWidth="3"
              strokeDasharray={`${(score / 100) * 94.2} 94.2`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: label.color }}>
            {formatNumber(score, locale)}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: label.color }}>{isAr ? label.labelAr : label.labelEn}</p>
          <p className="text-[10px] text-[#627D98]">{isAr ? "جودة الإعلان" : "Listing quality"}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: label.color + "30", backgroundColor: label.bgColor }}
    >
      {/* Score header */}
      <div className="flex items-center gap-4 mb-4">
        {/* Circular progress */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={label.color}
              strokeWidth="3"
              strokeDasharray={`${(score / 100) * 94.2} 94.2`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-base font-bold"
            style={{ color: label.color }}
          >
            {formatNumber(score, locale)}
          </span>
        </div>

        <div>
          <p className="text-xs text-[#627D98] mb-0.5">{isAr ? "جودة الإعلان" : "Listing quality"}</p>
          <p className="text-xl font-bold" style={{ color: label.color }}>
            {isAr ? label.labelAr : label.labelEn}
          </p>
          <p className="text-xs text-[#627D98]">
            {isAr
              ? score >= 90
                ? "إعلانك ممتاز وجاهز للنشر"
                : score >= 70
                ? "إعلانك جيد — بعض التحسينات ممكنة"
                : score >= 40
                ? "أضف المزيد من التفاصيل لتحسين إعلانك"
                : "إعلانك يحتاج تكملة للحصول على نتائج أفضل"
              : score >= 90
                ? "Your listing is excellent and ready to publish"
                : score >= 70
                ? "Your listing is good — some improvements are possible"
                : score >= 40
                ? "Add more details to improve your listing"
                : "Your listing needs more detail for better results"}
          </p>
        </div>
      </div>

      {/* Missing fields */}
      {missing.length > 0 && (
        <div className="border-t pt-3" style={{ borderColor: label.color + "30" }}>
          <p className="text-xs font-semibold text-[#627D98] mb-2">{isAr ? "تحسينات مقترحة:" : "Suggested improvements:"}</p>
          <ul className="space-y-1">
            {missing.slice(0, 5).map((field, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-[#627D98]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={label.color} strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
