"use client";

import { useState } from "react";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import { LISTING_PURPOSES, FURNISHING_OPTIONS, RENT_PERIODS } from "@/lib/constants/add-listing";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
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
    <div className="flex items-start justify-between py-2.5 border-b border-[#F5F0EA] last:border-0 gap-3">
      <span className="text-sm text-[#7A6B5E] flex-shrink-0">{label}</span>
      <span className="text-sm font-semibold text-[#1E1E1E] text-end">{value ?? "—"}</span>
    </div>
  );
}

const PRIORITY_BADGE: Record<string, string> = {
  high:   "bg-[#FBF0EB] text-[#C65D3B]",
  medium: "bg-[#FDF6E3] text-[#C8860A]",
  low:    "bg-[#F5F0EA] text-[#7A6B5E]",
};
const PRIORITY_AR: Record<string, string> = { high: "مهم", medium: "محسّن", low: "اختياري" };

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
  const purposeLabel = LISTING_PURPOSES.find((p) => p.value === draft.purpose)?.labelAr ?? "—";
  const typeConfig = PROPERTY_TYPES.find((t) => t.value === draft.propertyType);
  const typeLabel = typeConfig?.labelAr ?? "—";
  const furnishingLabel = FURNISHING_OPTIONS.find((f) => f.value === draft.furnishing)?.labelAr ?? "—";
  const rentPeriodLabel = RENT_PERIODS.find((r) => r.value === draft.rentPeriod)?.labelAr;

  const locationParts = [draft.areaAr, draft.wilayatAr, draft.governorateAr].filter(Boolean);

  const priceDisplay = draft.price
    ? draft.isPriceHidden
      ? "مخفي — تواصل للسعر"
      : `${formatOMR(draft.price, { arabic: true })}${rentPeriodLabel ? ` / ${rentPeriodLabel}` : ""}`
    : "—";

  const isLand = draft.propertyType === "land" || draft.propertyType === "farm";

  return (
    <div className="px-4 py-6 space-y-5" dir="rtl">

      {/* Quality score */}
      <QualityScoreCard score={qualityScore} draft={draft} />

      {/* AI quality suggestions */}
      <div className="space-y-2">
        {!qualityResult && !qualityLoading && (
          <AIButton
            onClick={() => void fetchQuality()}
            label="اقتراحات تحسين الإعلان بالذكاء الاصطناعي"
            loadingLabel="جاري التحليل..."
            variant="subtle"
            aria-label="الحصول على اقتراحات الذكاء الاصطناعي لتحسين الإعلان"
          />
        )}
        {qualityLoading && <AILoadingState messageAr="يحلل الذكاء الاصطناعي جودة إعلانك..." compact />}
        {qualityError && !qualityLoading && (
          <AIErrorState errorCode={qualityError} compact onRetry={() => void fetchQuality()} />
        )}
        {qualityResult && !qualityLoading && (
          <AIResultCard isMockFallback={qualityResult.isMockFallback} title="اقتراحات التحسين">
            {qualityResult.overallFeedbackAr && (
              <p className="text-xs text-[#3D3330] leading-relaxed mb-3">{qualityResult.overallFeedbackAr}</p>
            )}
            {qualityResult.suggestions && qualityResult.suggestions.length > 0 && (
              <div className="space-y-2">
                {qualityResult.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={["text-[10px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 mt-0.5", PRIORITY_BADGE[s.priority] ?? "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}>
                      {s.categoryAr} · {PRIORITY_AR[s.priority] ?? s.priority}
                    </span>
                    <p className="text-xs text-[#7A6B5E] leading-relaxed">{s.suggestionAr}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setQualityResult(null)} className="mt-2 text-[10px] text-[#A89480] underline underline-offset-2">إغلاق</button>
          </AIResultCard>
        )}
      </div>

      {/* AI duplicate risk (only shown if risk is non-zero) */}
      {duplicateRisk !== "none" && (
        <div className="space-y-2">
          {!dupResult && !dupLoading && (
            <AIButton
              onClick={() => void fetchDupRisk()}
              label="تحليل خطر التكرار بالذكاء الاصطناعي"
              loadingLabel="جاري التحليل..."
              variant="subtle"
              aria-label="تحليل خطر تكرار الإعلان"
            />
          )}
          {dupLoading && <AILoadingState messageAr="يحلل الذكاء الاصطناعي احتمال التكرار..." compact />}
          {dupError && !dupLoading && (
            <AIErrorState errorCode={dupError} compact onRetry={() => void fetchDupRisk()} />
          )}
          {dupResult && !dupLoading && (
            <AIResultCard isMockFallback={dupResult.isMockFallback} title="تحليل التكرار">
              {dupResult.summaryAr && <p className="text-xs text-[#3D3330] mb-2 leading-relaxed">{dupResult.summaryAr}</p>}
              {dupResult.similarFieldsAr && dupResult.similarFieldsAr.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {dupResult.similarFieldsAr.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-[#FBF0EB] text-[#C65D3B] rounded-lg font-semibold">{f}</span>
                  ))}
                </div>
              )}
              {dupResult.recommendedActionAr && (
                <p className="text-xs text-[#7A6B5E] font-semibold">{dupResult.recommendedActionAr}</p>
              )}
              <button onClick={() => setDupResult(null)} className="mt-2 text-[10px] text-[#A89480] underline underline-offset-2">إغلاق</button>
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
            <p className="text-xs font-semibold text-[#C8860A] mb-0.5">إعلان مشابه محتمل</p>
            <p className="text-xs text-[#7A6B5E]">
              قد يكون هذا الإعلان مشابهاً لإعلان موجود في نفس المنطقة. يمكنك المتابعة وسيراجعه فريق مقر.
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
            <p className="text-xs font-semibold text-[#C8860A] mb-0.5">ملاحظة حول السعر</p>
            <p className="text-xs text-[#7A6B5E]">{suspiciousMessage}</p>
          </div>
        </div>
      )}

      {/* Summary sections */}
      <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
        <div className="px-4 py-3 bg-[#F5F0EA] border-b border-[#F0EBE3]">
          <p className="text-xs font-bold text-[#7A6B5E] uppercase tracking-wide">ملخص الإعلان</p>
        </div>
        <div className="px-4">
          <ReviewRow label="الغرض" value={purposeLabel} />
          <ReviewRow label="النوع" value={typeLabel} />
          <ReviewRow label="العنوان" value={draft.titleAr || "—"} />
          <ReviewRow label="السعر" value={priceDisplay} />
          <ReviewRow label="الموقع" value={locationParts.join(" › ") || "—"} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
        <div className="px-4 py-3 bg-[#F5F0EA] border-b border-[#F0EBE3]">
          <p className="text-xs font-bold text-[#7A6B5E] uppercase tracking-wide">المواصفات</p>
        </div>
        <div className="px-4">
          {!isLand && (
            <>
              <ReviewRow label="غرف النوم" value={draft.bedrooms !== null ? toArabicNumerals(draft.bedrooms) : "—"} />
              <ReviewRow label="الحمامات" value={draft.bathrooms !== null ? toArabicNumerals(draft.bathrooms) : "—"} />
            </>
          )}
          <ReviewRow label="المساحة" value={draft.area ? `${toArabicNumerals(draft.area)} م²` : "—"} />
          {draft.floors ? <ReviewRow label="الطوابق" value={toArabicNumerals(draft.floors)} /> : null}
          {!isLand && <ReviewRow label="الأثاث" value={furnishingLabel} />}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
        <div className="px-4 py-3 bg-[#F5F0EA] border-b border-[#F0EBE3]">
          <p className="text-xs font-bold text-[#7A6B5E] uppercase tracking-wide">الوسائط والوثائق</p>
        </div>
        <div className="px-4">
          <ReviewRow label="الصور" value={toArabicNumerals(draft.images.length)} />
          <ReviewRow
            label="وثائق مرفقة"
            value={toArabicNumerals(draft.documents.filter((d) => d.file || d.referenceNumber).length)}
          />
          <ReviewRow label="التحقق المطلوب" value={draft.requestVerification ? "نعم" : "لا"} />
        </div>
      </div>

      {/* Publishing rules */}
      <div className="bg-[#F5F0EA] rounded-2xl px-4 py-4">
        <p className="text-xs font-semibold text-[#7A6B5E] mb-2">قواعد النشر في مقر</p>
        <ul className="space-y-1.5">
          {[
            "جميع الإعلانات تخضع للمراجعة قبل النشر (١–٢ يوم عمل)",
            "الإعلانات المخالفة تُوقف فوراً",
            "السعر الظاهر يجب أن يطابق السعر الفعلي",
            "يُمنع نشر إعلانات وهمية أو مكررة",
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#7A6B5E]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A89480" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
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
        className="w-full flex items-start gap-3 text-right"
        role="checkbox"
        aria-checked={termsAccepted}
      >
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            termsAccepted ? "border-[#C65D3B] bg-[#C65D3B]" : "border-[#E8DDD0] bg-white"
          }`}
        >
          {termsAccepted && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
        <span className="text-sm text-[#3D3330] leading-relaxed">
          أوافق على{" "}
          <span className="text-[#C65D3B] font-semibold">شروط النشر في مقر</span>
          {" "}وأؤكد أن المعلومات المقدمة صحيحة ودقيقة
        </span>
      </button>
      {errors.terms && <p className="text-xs text-[#C0392B]">{errors.terms}</p>}
    </div>
  );
}
