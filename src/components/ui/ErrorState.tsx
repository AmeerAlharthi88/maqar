"use client";

import { useTranslation } from "@/i18n/useTranslation";

interface ErrorStateProps {
  /** Locale-aware title — pass the already-translated string from the parent */
  title?: string;
  /** Locale-aware description */
  description?: string;
  /** @deprecated Use `title` with a pre-translated value instead */
  titleAr?: string;
  /** @deprecated Use `description` with a pre-translated value instead */
  descriptionAr?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  description,
  titleAr,
  descriptionAr,
  onRetry,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation();

  const displayTitle       = title       ?? titleAr       ?? t("common.error");
  const displayDescription = description ?? descriptionAr ?? t("common.tryAgain");

  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 px-6 text-center ${className ?? ""}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#FEF0EE] flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold text-[#102A43]">{displayTitle}</p>
        <p className="text-sm text-[#627D98] max-w-xs">{displayDescription}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 h-10 px-5 rounded-xl text-sm font-semibold bg-[#0A3C36] text-white hover:bg-[#082E29] transition-colors"
        >
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}
