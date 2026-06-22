"use client";

import { useLocaleStore } from "@/store/locale.store";

interface AdminActionFeedbackProps {
  /** An admin action (approve/reject/resolve…) is in flight for this row. */
  pending?: boolean;
  /** The last action for this row failed (PATCH error/network/malformed). */
  error?: boolean;
  /** Re-runs the failed action. */
  onRetry?: () => void;
}

/**
 * Per-row feedback for live admin queue actions. Shows a loading state while a
 * PATCH is in flight and a clear bilingual error + retry when it fails — so a
 * failed approve/reject/resolve is never presented as a silent success.
 */
export function AdminActionFeedback({ pending, error, onRetry }: AdminActionFeedbackProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";

  if (pending) {
    return (
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[#627D98]" role="status">
        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" aria-hidden="true" />
        {isAr ? "جارٍ تنفيذ الإجراء…" : "Processing…"}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-[#FEF0EE] border border-[#C0392B]/30 px-3 py-2"
        role="alert"
      >
        <p className="text-[11px] text-[#C0392B] leading-snug">
          <span className="font-bold">{isAr ? "تعذر تنفيذ الإجراء" : "Unable to complete the action"}</span>
          {" — "}
          {isAr ? "يرجى المحاولة مرة أخرى." : "Please try again."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 px-3 py-1.5 min-h-[32px] rounded-lg bg-[#0A3C36] text-white text-[11px] font-bold hover:bg-[#082E29] transition-colors"
          >
            {isAr ? "إعادة المحاولة" : "Retry"}
          </button>
        )}
      </div>
    );
  }

  return null;
}
