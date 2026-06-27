"use client";

import { cn } from "@/lib/utils";
import { LISTING_PURPOSES } from "@/lib/constants/add-listing";
import type { DraftPurpose } from "@/types/listing-draft";
import { useTranslation } from "@/i18n/useTranslation";

interface StepPurposeProps {
  value: DraftPurpose | null;
  onChange: (v: DraftPurpose) => void;
  error?: string;
}

const PURPOSE_ICONS: Record<DraftPurpose, React.ReactNode> = {
  sale: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  rent: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 12V22H4V12" />
      <path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  investment: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
};

export function StepPurpose({ value, onChange, error }: StepPurposeProps) {
  const { locale, dir } = useTranslation();
  const isAr = locale === "ar";
  return (
    <div className="px-4 py-6" dir={dir}>
      <p className="text-sm text-[#627D98] mb-6 leading-relaxed">
        {isAr
          ? "حدد الغرض من إعلانك العقاري. يمكنك تغيير هذا الاختيار لاحقاً."
          : "Choose the purpose of your listing. You can change this later."}
      </p>

      <div className="flex flex-col gap-3">
        {LISTING_PURPOSES.map((purpose) => {
          const selected = value === purpose.value;
          return (
            <button
              key={purpose.value}
              onClick={() => onChange(purpose.value)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-start transition-all",
                selected
                  ? "border-[#0A3C36] bg-[#E6F0EF]"
                  : "border-[#E2E8F0] bg-white active:bg-[#F0F4F8]"
              )}
              aria-pressed={selected}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all",
                  selected ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"
                )}
              >
                {PURPOSE_ICONS[purpose.value]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-base font-bold mb-0.5", selected ? "text-[#0A3C36]" : "text-[#102A43]")}>
                  {isAr ? purpose.labelAr : purpose.labelEn}
                </p>
                <p className="text-xs text-[#627D98] leading-relaxed">{isAr ? purpose.descAr : purpose.descEn}</p>
              </div>
              {selected && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5" className="flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-sm text-[#C0392B] flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
