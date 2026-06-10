"use client";

import { useLocaleStore } from "@/store/locale.store";

interface AdminEmptyStateProps {
  titleAr: string;
  /** English title. Falls back to titleAr if omitted (keeps old call sites working). */
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  /** Optional "reset filters" action — shown when results are empty due to filters. */
  onReset?: () => void;
}

export function AdminEmptyState({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  onReset,
}: AdminEmptyStateProps) {
  const locale = useLocaleStore((s) => s.locale);
  const isAr = locale === "ar";

  const title = isAr ? titleAr : (titleEn ?? titleAr);
  const description = isAr ? descriptionAr : (descriptionEn ?? descriptionAr);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" dir={isAr ? "rtl" : "ltr"}>
      <div className="w-16 h-16 rounded-2xl bg-[#F0F4F8] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      </div>
      <p className="text-sm font-bold text-[#102A43] mb-1">{title}</p>
      {description && (
        <p className="text-xs text-[#627D98] max-w-xs leading-relaxed">{description}</p>
      )}
      {onReset && (
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 rounded-xl bg-[#0A3C36] text-white text-xs font-semibold hover:bg-[#082E29] transition-colors"
        >
          {isAr ? "إعادة ضبط عوامل التصفية" : "Reset filters"}
        </button>
      )}
    </div>
  );
}
