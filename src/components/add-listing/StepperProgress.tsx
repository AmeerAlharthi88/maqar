"use client";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/formatters";
import { ADD_LISTING_STEPS, ADD_LISTING_TOTAL_STEPS } from "@/lib/constants/add-listing";
import { useTranslation } from "@/i18n/useTranslation";

interface StepperProgressProps {
  currentStep: number;
  completedSteps: number[];
  /** When provided, renders a "Cancel Listing" button that exits the flow. */
  onCancel?: () => void;
}

export function StepperProgress({ currentStep, completedSteps, onCancel }: StepperProgressProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const step = ADD_LISTING_STEPS.find((s) => s.number === currentStep);
  const progressPct = ((currentStep - 1) / (ADD_LISTING_TOTAL_STEPS - 1)) * 100;

  const stepTitle = isAr ? step?.titleAr : (step?.titleEn ?? step?.titleAr);

  return (
    <div className="bg-white border-b border-[#E2E8F0] px-4 pt-3 pb-4">
      {/* Cancel / exit row — visible on every step so the user can always leave */}
      {onCancel && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-xs font-semibold text-[#C0392B] hover:underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            {isAr ? "إلغاء الإعلان" : "Cancel Listing"}
          </button>
        </div>
      )}

      {/* Step label row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-[#627D98]">
            {t("addListing.common.step")
              .replace("{{current}}", formatNumber(currentStep, locale))
              .replace("{{total}}", formatNumber(ADD_LISTING_TOTAL_STEPS, locale))}
          </p>
          <h2 className="text-sm font-bold text-[#102A43]">{stepTitle}</h2>
        </div>

        {/* Numbered step circles — scroll horizontally on small screens */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] scrollbar-hide">
          {ADD_LISTING_STEPS.map((s) => {
            const isCompleted = completedSteps.includes(s.number);
            const isCurrent = s.number === currentStep;
            const stepLabel = isAr ? s.titleAr : (s.titleEn ?? s.titleAr);

            return (
              <div
                key={s.number}
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                  isCurrent
                    ? "bg-[#0A3C36] text-white ring-2 ring-[#0A3C36]/30 scale-110"
                    : isCompleted
                    ? "bg-[#0A3C36] text-white"
                    : "bg-[#E2E8F0] text-[#627D98]"
                )}
                aria-label={`${isAr ? "الخطوة" : "Step"} ${s.number}: ${stepLabel}${
                  isCompleted ? (isAr ? " (مكتملة)" : " (completed)") : isCurrent ? (isAr ? " (الحالية)" : " (current)") : ""
                }`}
              >
                {isCompleted && !isCurrent ? (
                  // Checkmark for completed steps
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  formatNumber(s.number, locale)
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0A3C36] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
