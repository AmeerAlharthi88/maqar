"use client";

import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import { ADD_LISTING_STEPS, ADD_LISTING_TOTAL_STEPS } from "@/lib/constants/add-listing";

interface StepperProgressProps {
  currentStep: number;
  completedSteps: number[];
}

export function StepperProgress({ currentStep, completedSteps }: StepperProgressProps) {
  const step = ADD_LISTING_STEPS.find((s) => s.number === currentStep);
  const progressPct = ((currentStep - 1) / (ADD_LISTING_TOTAL_STEPS - 1)) * 100;

  return (
    <div className="bg-white border-b border-[#F0EBE3] px-4 pt-3 pb-4">
      {/* Step label row */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-[#A89480]">
            الخطوة {toArabicNumerals(currentStep)} من {toArabicNumerals(ADD_LISTING_TOTAL_STEPS)}
          </p>
          <h2 className="text-sm font-bold text-[#1E1E1E]">{step?.titleAr}</h2>
        </div>
        {/* Dot indicators — show last 5 steps around current */}
        <div className="flex items-center gap-1.5">
          {ADD_LISTING_STEPS.map((s) => {
            const isCompleted = completedSteps.includes(s.number);
            const isCurrent = s.number === currentStep;
            return (
              <div
                key={s.number}
                className={cn(
                  "rounded-full transition-all",
                  isCurrent
                    ? "w-4 h-2 bg-[#C65D3B]"
                    : isCompleted
                    ? "w-2 h-2 bg-[#5B8C5A]"
                    : "w-2 h-2 bg-[#E8DDD0]"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#F0EBE3] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C65D3B] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
