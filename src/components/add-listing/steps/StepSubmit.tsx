"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { QualityScoreCard } from "@/components/add-listing/QualityScoreCard";
import type { ListingDraft } from "@/types/listing-draft";

interface StepSubmitProps {
  draft: ListingDraft;
  qualityScore: number;
  isSubmitting: boolean;
  submitSuccess: boolean;
  termsAccepted: boolean;
  submitError: string | null;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onReset: () => void;
}

export function StepSubmit({
  draft,
  qualityScore,
  isSubmitting,
  submitSuccess,
  termsAccepted,
  submitError,
  onSubmit,
  onSaveDraft,
  onReset,
}: StepSubmitProps) {
  // ── Success state ────────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="px-4 py-8 flex flex-col items-center text-center" dir="rtl">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-[#E6F0EF] flex items-center justify-center mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#102A43] mb-2">تم إرسال إعلانك للمراجعة</h2>
        <p className="text-sm text-[#627D98] max-w-xs leading-relaxed mb-6">
          سيراجع فريق مقر إعلانك خلال ١–٢ يوم عمل وسيتم إخطارك بقرار النشر.
        </p>

        {/* Next steps */}
        <div className="w-full max-w-sm bg-[#F0F4F8] rounded-2xl p-4 mb-6 text-right">
          <p className="text-xs font-bold text-[#627D98] mb-3">الخطوات التالية</p>
          <div className="space-y-3">
            {[
              { title: "مراجعة الوثائق", desc: "يتحقق الفريق من صحة وثائق الملكية" },
              { title: "التدقيق في المحتوى", desc: "مراجعة الصور والوصف والسعر" },
              { title: "الموافقة والنشر", desc: "تلقي إشعار بنشر الإعلان" },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0A3C36] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#102A43]">{step.title}</p>
                  <p className="text-xs text-[#627D98]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <Link
            href={ROUTES.myListings}
            className="w-full py-3.5 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm text-center hover:bg-[#082E29] transition-colors"
          >
            عرض إعلاناتي
          </Link>
          <button
            onClick={onReset}
            className="w-full py-3 rounded-2xl bg-[#F0F4F8] text-[#102A43] font-semibold text-sm border border-[#E2E8F0]"
          >
            نشر إعلان جديد
          </button>
          <Link
            href={ROUTES.home}
            className="w-full py-3 text-[#627D98] font-medium text-sm text-center"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // ── Pre-submit state ─────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6 space-y-5" dir="rtl">
      {/* Quality score */}
      <QualityScoreCard score={qualityScore} draft={draft} />

      {/* Listing title preview */}
      {draft.titleAr && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4">
          <p className="text-xs text-[#627D98] mb-1">سيُنشر إعلانك بهذا العنوان</p>
          <p className="text-base font-bold text-[#102A43]">{draft.titleAr}</p>
        </div>
      )}

      {/* Review process info */}
      <div className="bg-[#EAF4FB] border border-[#2471A3]/20 rounded-2xl px-4 py-4">
        <div className="flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2471A3" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="text-xs font-bold text-[#2471A3] mb-1">عملية المراجعة</p>
            <p className="text-xs text-[#2471A3]/80 leading-relaxed">
              يخضع كل إعلان لمراجعة خلال ١–٢ يوم عمل. لا تتردد في التواصل مع الدعم إن تجاوز وقت المراجعة ذلك.
            </p>
          </div>
        </div>
      </div>

      {!termsAccepted && (
        <div className="bg-[#FEF0EE] border border-[#C0392B]/30 rounded-xl px-4 py-3">
          <p className="text-xs text-[#C0392B] font-semibold">
            يرجى قبول شروط النشر في الخطوة السابقة للمتابعة
          </p>
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <div className="bg-[#FEF0EE] border border-[#C0392B]/40 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-[#C0392B] mb-1">فشل إرسال الإعلان</p>
          <p className="text-xs text-[#627D98] font-mono break-all">{submitError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !termsAccepted}
          className="w-full py-4 rounded-2xl bg-[#0A3C36] text-white font-bold text-base hover:bg-[#082E29] disabled:bg-[#A0AEC0] disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              إرسال الإعلان للمراجعة
            </>
          )}
        </button>
        <button
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="w-full py-3 rounded-2xl bg-[#F0F4F8] text-[#102A43] font-semibold text-sm border border-[#E2E8F0] disabled:opacity-50"
        >
          حفظ كمسودة والمتابعة لاحقاً
        </button>
      </div>

      <p className="text-[10px] text-[#627D98] text-center leading-relaxed">
        بالضغط على &quot;إرسال&quot; تؤكد أن المعلومات صحيحة وتوافق على سياسة النشر في مقر.
      </p>
    </div>
  );
}
