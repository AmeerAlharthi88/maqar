"use client";

import { useLocaleStore } from "@/store/locale.store";

interface AdminErrorStateProps {
  /** Optional retry handler — shows a "Try again" button when provided. */
  onRetry?: () => void;
}

/**
 * Shown on real operational admin modules when the live API fails. These pages
 * MUST NOT silently fall back to mock data (which previously hid a Production
 * service-role outage). A clear, bilingual error state with retry is shown so an
 * admin knows the real data could not be loaded.
 */
export function AdminErrorState({ onRetry }: AdminErrorStateProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" dir={isAr ? "rtl" : "ltr"} role="alert">
      <div className="w-16 h-16 rounded-2xl bg-[#FEF0EE] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <p className="text-sm font-bold text-[#102A43] mb-1">
        {isAr ? "تعذّر تحميل البيانات" : "Could not load data"}
      </p>
      <p className="text-xs text-[#627D98] max-w-xs leading-relaxed">
        {isAr
          ? "تعذر تحميل البيانات الحقيقية. يرجى المحاولة مرة أخرى."
          : "Could not load real data. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-xl bg-[#0A3C36] text-white text-xs font-bold hover:bg-[#082E29] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          {isAr ? "إعادة المحاولة" : "Try again"}
        </button>
      )}
    </div>
  );
}
