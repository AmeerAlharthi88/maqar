"use client";

import { useState } from "react";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import { LISTING_PURPOSES, FURNISHING_OPTIONS, RENT_PERIODS } from "@/lib/constants/add-listing";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import { QualityScoreCard } from "@/components/add-listing/QualityScoreCard";
import { AIButton } from "@/components/ai/AIButton";
import { AILoadingState } from "@/components/ai/AILoadingState";
import { AIResultCard } from "@/components/ai/AIResultCard";
import { AIErrorState } from "@/components/ai/AIErrorState";
import type { ListingQualityResponse, DuplicateRiskResponse } from "@/lib/ai/types";
import type { AIErrorCode } from "@/lib/ai/types";
import type { ListingDraft } from "@/types/listing-draft";

interface StepReviewProps {
  draft: ListingDraft;
  qualityScore: number;
  duplicateRisk: "none" | "low" | "medium" | "high";
  suspiciousPrice: boolean;
  suspiciousMessage: string | null;
  termsAccepted: boolean;
  onTermsChange: (v: boolean) => void;
  errors: Record<string, string>;
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#F0F4F8] last:border-0 gap-3">
      <span className="text-sm text-[#627D98] flex-shrink-0">{label}</span>
      <span className="text-sm font-semibold text-[#102A43] text-end">{value ?? "—"}</span>
    </div>
  );
}

const PRIORITY_BADGE: Record<string, string> = {
  high:   "bg-[#FEF0EE] text-[#C0392B]",
  medium: "bg-[#FDF6E3] text-[#C8860A]",
  low:    "bg-[#F0F4F8] text-[#627D98]",
};
const PRIORITY_AR: Record<string, string> = { high: "مهم", medium: "محسّن", low: "اختياري" };
const PRIORITY_EN: Record<string, string> = { high: "Important", medium: "Improved", low: "Optional" };

export function StepReview({
  draft,
  qualityScore,
  duplicateRisk,
  suspiciousPrice,
  suspiciousMessage,
  termsAccepted,
  onTermsChange,
  errors,
}: StepReviewProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  // AI quality suggestions
  const [qualityResult, setQualityResult] = useState<ListingQualityResponse | null>(null);
  const [qualityLoading, setQualityLoading] = useState(false);
  const [qualityError, setQualityError] = useState<AIErrorCode | undefined>();

  // AI duplicate risk
  const [dupResult, setDupResult] = useState<DuplicateRiskResponse | null>(null);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupError, setDupError] = useState<AIErrorCode | undefined>();

  async function fetchQuality() {
    setQualityLoading(true);
    setQualityError(undefined);
    try {
      const res = await fetch("/api/ai/listing-quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qualityScore,
          titleAr:       draft.titleAr,
          descriptionAr: draft.descriptionAr,
          imageCount:    draft.images.length,
          hasDocuments:  draft.documents.some((d) => d.file || d.referenceNumber),
          hasHighlights: draft.highlights.length > 0,
          price:         draft.price ?? undefined,
          areaAr:        draft.areaAr ?? undefined,
          bedrooms:      draft.bedrooms,
          area:          draft.area ?? undefined,
          purpose:       draft.purpose ?? "sale",
          propertyType:  draft.propertyType ?? "apartment",
        }),
      });
      const data: ListingQualityResponse = await res.json();
      if (data.success) setQualityResult(data);
      else setQualityError(data.errorCode ?? "unknown");
    } catch {
      setQualityError("provider_error");
    } finally {
      setQualityLoading(false);
    }
  }

  async function fetchDupRisk() {
    if (duplicateRisk === "none") return;
    setDupLoading(true);
    setDupError(undefined);
    try {
      const res = await fetch("/api/ai/duplicate-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingTitleAr: draft.titleAr || "إعلان عقاري",
          areaAr:         draft.areaAr ?? "",
          price:          draft.price ?? 0,
          bedrooms:       draft.bedrooms,
          area:           draft.area ?? undefined,
          descriptionAr:  draft.descriptionAr.slice(0, 400),
          duplicateRisk,
        }),
      });
      const data: DuplicateRiskResponse = await res.json();
      if (data.success) setDupResult(data);
      else setDupError(data.errorCode ?? "unknown");
    } catch {
      setDupError("provider_error");
    } finally {
      setDupLoading(false);
    }
  }

  const purposeOpt = LISTING_PURPOSES.find((p) => p.value === draft.purpose);
  const purposeLabel = isAr ? (purposeOpt?.labelAr ?? "—") : (purposeOpt?.labelEn ?? purposeOpt?.labelAr ?? "—");

  const typeConfig = PROPERTY_TYPES.find((t) => t.value === draft.propertyType);
  const typeLabel = isAr ? (typeConfig?.labelAr ?? "—") : (typeConfig?.labelEn ?? typeConfig?.labelAr ?? "—");

  const furnishOpt = FURNISHING_OPTIONS.find((f) => f.value === draft.furnishing);
  const furnishingLabel = isAr ? (furnishOpt?.labelAr ?? "—") : (furnishOpt?.labelEn ?? furnishOpt?.labelAr ?? "—");

  // Rent period is shown ONLY for rent listings. Sale and investment never
  // display a "/ period" suffix even if a stale rentPeriod remains in the draft.
  const isRentListing = draft.purpose === "rent";
  const rentPeriodOpt = RENT_PERIODS.find((r) => r.value === draft.rentPeriod);
  const rentPeriodLabel = isRentListing
    ? (isAr ? rentPeriodOpt?.labelAr : (rentPeriodOpt?.labelEn ?? rentPeriodOpt?.labelAr))
    : null;

  const locationParts = [draft.areaAr, draft.wilayatAr, draft.governorateAr].filter(Boolean);

  const priceDisplay = draft.price
    ? draft.isPriceHidden
      ? (isAr ? "مخفي — تواصل للسعر" : "Hidden — contact for price")
      : `${formatCurrency(draft.price, locale)}${rentPeriodLabel ? ` / ${rentPeriodLabel}` : ""}`
    : "—";

  const isLand = draft.propertyType === "land" || draft.propertyType === "farm";

  const publishingRules = isAr
    ? [
        "جميع الإعلانات تخضع للمراجعة قبل النشر (١–٢ يوم عمل)",
        "الإعلانات المخالفة تُوقف فوراً",
        "السعر الظاهر يجب أن يطابق السعر الفعلي",
        "يُمنع نشر إعلانات وهمية أو مكررة",
      ]
    : [
        "All listings are reviewed before publication (1–2 business days)",
        "Listings that violate policies are suspended immediately",
        "The displayed price must match the actual asking price",
        "Fake or duplicate listings are prohibited",
      ];

  return (
    <div className="px-4 py-6 space-y-5">

      {/* Quality score */}
      <QualityScoreCard score={qualityScore} draft={draft} />

      {/* AI quality suggestions */}
      <div className="space-y-2">
        {!qualityResult && !qualityLoading && (
          <AIButton
            onClick={() => void fetchQuality()}
            label={isAr ? "اقتراحات تحسين الإعلان بالذكاء الاصطناعي" : "AI listing improvement suggestions"}
            loadingLabel={isAr ? "جاري التحليل..." : "Analyzing..."}
            variant="subtle"
            aria-label={isAr ? "الحصول على اقتراحات الذكاء الاصطناعي لتحسين الإعلان" : "Get AI suggestions to improve listing"}
          />
        )}
        {qualityLoading && (
          <AILoadingState
            messageAr={isAr ? "يحلل الذكاء الاصطناعي جودة إعلانك..." : "AI is analyzing your listing quality..."}
            compact
          />
        )}
        {qualityError && !qualityLoading && (
          <AIErrorState errorCode={qualityError} compact onRetry={() => void fetchQuality()} />
        )}
        {qualityResult && !qualityLoading && (
          <AIResultCard isMockFallback={qualityResult.isMockFallback} title={isAr ? "اقتراحات التحسين" : "Improvement suggestions"}>
            {qualityResult.overallFeedbackAr && (
              <p className="text-xs text-[#102A43] leading-relaxed mb-3">{qualityResult.overallFeedbackAr}</p>
            )}
            {qualityResult.suggestions && qualityResult.suggestions.length > 0 && (
              <div className="space-y-2">
                {qualityResult.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={["text-[10px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 mt-0.5", PRIORITY_BADGE[s.priority] ?? "bg-[#F0F4F8] text-[#627D98]"].join(" ")}>
                      {s.categoryAr} · {(isAr ? PRIORITY_AR : PRIORITY_EN)[s.priority] ?? s.priority}
                    </span>
                    <p className="text-xs text-[#627D98] leading-relaxed">{s.suggestionAr}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setQualityResult(null)} className="mt-2 text-[10px] text-[#627D98] underline underline-offset-2">
              {t("common.close")}
            </button>
          </AIResultCard>
        )}
      </div>

      {/* AI duplicate risk (only shown if risk is non-zero) */}
      {duplicateRisk !== "none" && (
        <div className="space-y-2">
          {!dupResult && !dupLoading && (
            <AIButton
              onClick={() => void fetchDupRisk()}
              label={isAr ? "تحليل خطر التكرار بالذكاء الاصطناعي" : "AI duplicate risk analysis"}
              loadingLabel={isAr ? "جاري التحليل..." : "Analyzing..."}
              variant="subtle"
              aria-label={isAr ? "تحليل خطر تكرار الإعلان" : "Analyze listing duplicate risk"}
            />
          )}
          {dupLoading && (
            <AILoadingState
              messageAr={isAr ? "يحلل الذكاء الاصطناعي احتمال التكرار..." : "AI is analyzing duplication probability..."}
              compact
            />
          )}
          {dupError && !dupLoading && (
            <AIErrorState errorCode={dupError} compact onRetry={() => void fetchDupRisk()} />
          )}
          {dupResult && !dupLoading && (
            <AIResultCard isMockFallback={dupResult.isMockFallback} title={isAr ? "تحليل التكرار" : "Duplicate analysis"}>
              {dupResult.summaryAr && <p className="text-xs text-[#102A43] mb-2 leading-relaxed">{dupResult.summaryAr}</p>}
              {dupResult.similarFieldsAr && dupResult.similarFieldsAr.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {dupResult.similarFieldsAr.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-[#E6F0EF] text-[#0A3C36] rounded-lg font-semibold">{f}</span>
                  ))}
                </div>
              )}
              {dupResult.recommendedActionAr && (
                <p className="text-xs text-[#627D98] font-semibold">{dupResult.recommendedActionAr}</p>
              )}
              <button onClick={() => setDupResult(null)} className="mt-2 text-[10px] text-[#627D98] underline underline-offset-2">
                {t("common.close")}
              </button>
            </AIResultCard>
          )}
        </div>
      )}

      {/* Warnings */}
      {duplicateRisk !== "none" && (
        <div className="bg-[#FDF6E3] border border-[#C8860A]/30 rounded-xl px-4 py-3 flex gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8860A" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-[#C8860A] mb-0.5">
              {isAr ? "إعلان مشابه محتمل" : "Possible similar listing"}
            </p>
            <p className="text-xs text-[#627D98]">
              {isAr
                ? "قد يكون هذا الإعلان مشابهاً لإعلان موجود في نفس المنطقة. يمكنك المتابعة وسيراجعه فريق مقر."
                : "This listing may be similar to an existing one in the same area. You may proceed and the Maqar team will review it."}
            </p>
          </div>
        </div>
      )}

      {suspiciousPrice && suspiciousMessage && (
        <div className="bg-[#FDF6E3] border border-[#C8860A]/30 rounded-xl px-4 py-3 flex gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8860A" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-[#C8860A] mb-0.5">
              {isAr ? "ملاحظة حول السعر" : "Price note"}
            </p>
            <p className="text-xs text-[#627D98]">{suspiciousMessage}</p>
          </div>
        </div>
      )}

      {/* Summary sections */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-4 py-3 bg-[#F0F4F8] border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-[#627D98] uppercase tracking-wide">
            {isAr ? "ملخص الإعلان" : "Listing summary"}
          </p>
        </div>
        <div className="px-4">
          <ReviewRow label={isAr ? "الغرض" : "Purpose"} value={purposeLabel} />
          <ReviewRow label={isAr ? "النوع" : "Type"} value={typeLabel} />
          <ReviewRow label={isAr ? "العنوان" : "Title"} value={draft.titleAr || "—"} />
          <ReviewRow label={isAr ? "السعر" : "Price"} value={priceDisplay} />
          <ReviewRow label={isAr ? "الموقع" : "Location"} value={locationParts.join(" › ") || "—"} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-4 py-3 bg-[#F0F4F8] border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-[#627D98] uppercase tracking-wide">
            {isAr ? "المواصفات" : "Specifications"}
          </p>
        </div>
        <div className="px-4">
          {!isLand && (
            <>
              <ReviewRow
                label={isAr ? "غرف النوم" : "Bedrooms"}
                value={draft.bedrooms !== null ? formatNumber(draft.bedrooms, locale) : "—"}
              />
              <ReviewRow
                label={isAr ? "الحمامات" : "Bathrooms"}
                value={draft.bathrooms !== null ? formatNumber(draft.bathrooms, locale) : "—"}
              />
            </>
          )}
          <ReviewRow
            label={isAr ? "المساحة" : "Area"}
            value={draft.area ? `${formatNumber(draft.area, locale)} م²` : "—"}
          />
          {draft.floors ? (
            <ReviewRow
              label={isAr ? "الطوابق" : "Floors"}
              value={formatNumber(draft.floors, locale)}
            />
          ) : null}
          {!isLand && (
            <ReviewRow label={isAr ? "الأثاث" : "Furnishing"} value={furnishingLabel} />
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-4 py-3 bg-[#F0F4F8] border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-[#627D98] uppercase tracking-wide">
            {isAr ? "الوسائط والوثائق" : "Media & documents"}
          </p>
        </div>
        <div className="px-4">
          <ReviewRow
            label={isAr ? "الصور" : "Photos"}
            value={formatNumber(draft.images.length, locale)}
          />
          <ReviewRow
            label={isAr ? "وثائق مرفقة" : "Attached docs"}
            value={formatNumber(draft.documents.filter((d) => d.file || d.referenceNumber).length, locale)}
          />
          <ReviewRow
            label={isAr ? "التحقق المطلوب" : "Verification requested"}
            value={draft.requestVerification ? (isAr ? "نعم" : "Yes") : (isAr ? "لا" : "No")}
          />
        </div>
      </div>

      {/* Publishing rules */}
      <div className="bg-[#F0F4F8] rounded-2xl px-4 py-4">
        <p className="text-xs font-semibold text-[#627D98] mb-2">
          {isAr ? "قواعد النشر في مقر" : "Maqar publishing rules"}
        </p>
        <ul className="space-y-1.5">
          {publishingRules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#627D98]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* Terms acceptance */}
      <button
        onClick={() => onTermsChange(!termsAccepted)}
        className="w-full flex items-start gap-3 text-start"
        role="checkbox"
        aria-checked={termsAccepted}
      >
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            termsAccepted ? "border-[#0A3C36] bg-[#0A3C36]" : "border-[#E2E8F0] bg-white"
          }`}
        >
          {termsAccepted && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
        <span className="text-sm text-[#102A43] leading-relaxed">
          {isAr ? (
            <>
              أوافق على{" "}
              <span className="text-[#0A3C36] font-semibold">شروط النشر في مقر</span>
              {" "}وأؤكد أن المعلومات المقدمة صحيحة ودقيقة
            </>
          ) : (
            <>
              I agree to{" "}
              <span className="text-[#0A3C36] font-semibold">Maqar&apos;s publishing terms</span>
              {" "}and confirm that the information provided is accurate
            </>
          )}
        </span>
      </button>
      {errors.terms && <p className="text-xs text-[#C0392B]">{errors.terms}</p>}
    </div>
  );
}
