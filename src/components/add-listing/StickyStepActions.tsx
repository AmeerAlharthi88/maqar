"use client";

import { cn } from "@/lib/utils";
import { ADD_LISTING_TOTAL_STEPS } from "@/lib/constants/add-listing";

interface StickyStepActionsProps {
  currentStep: number;
  isSubmitting?: boolean;
  isDirty?: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSaveDraft: () => void;
  nextLabel?: string;
  disableNext?: boolean;
}

export function StickyStepActions({
  currentStep,
  isSubmitting = false,
  isDirty = false,
  onNext,
  onPrev,
  onSaveDraft,
  nextLabel,
  disableNext = false,
}: StickyStepActionsProps) {
  const isFirst = currentStep === 1;
  const isLast = currentStep === ADD_LISTING_TOTAL_STEPS;

  const nextButtonLabel = nextLabel ?? (isLast ? "إرسال الإعلان" : "التالي");

  return (
    <div
      className="fixed start-0 end-0 bottom-0 z-[110] bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]"
      style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        {/* Back button */}
        {!isFirst && (
          <button
            onClick={onPrev}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 bg-[#F0F4F8] text-[#102A43] text-sm font-semibold py-3 px-4 rounded-2xl border border-[#E2E8F0] flex-shrink-0 disabled:opacity-50"
            aria-label="الخطوة السابقة"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
            رجوع
          </button>
        )}

        {/* Next / Submit button */}
        <button
          onClick={onNext}
          disabled={disableNext || isSubmitting}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-2xl transition-all",
            "bg-[#0A3C36] text-white hover:bg-[#082E29] disabled:bg-[#A0AEC0] disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            nextButtonLabel
          )}
        </button>
      </div>

      {/* Save draft row */}
      <div className="flex items-center justify-between px-4 pb-2">
        {isDirty ? (
          <button
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="text-xs text-[#627D98] flex items-center gap-1 underline underline-offset-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            حفظ كمسودة
          </button>
        ) : (
          <span className="text-xs text-[#627D98]">تم حفظ المسودة تلقائياً</span>
        )}
        <span className="text-xs text-[#627D98]">
          {currentStep} / {ADD_LISTING_TOTAL_STEPS}
        </span>
      </div>
    </div>
  );
}
