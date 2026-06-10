"use client";

import { useLocaleStore } from "@/store/locale.store";

interface AdminDemoBannerProps {
  /** Optional extra context, e.g. which module is demo. */
  noteAr?: string;
  noteEn?: string;
}

/**
 * Clearly marks a screen (or KPI block) as showing demonstration data, not live
 * operational numbers — so admins never mistake mock figures for production.
 * (UAT-056 / UAT-062 / UAT-063)
 */
export function AdminDemoBanner({ noteAr, noteEn }: AdminDemoBannerProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const title = isAr ? "بيانات تجريبية" : "Demo data";
  const body = isAr
    ? (noteAr ?? "هذه الأرقام للعرض فقط وليست بيانات تشغيلية حقيقية.")
    : (noteEn ?? "These figures are for demonstration only — not live operational data.");

  return (
    <div
      className="flex items-start gap-2.5 bg-[#FFF8E7] border border-[#D4A017]/30 rounded-2xl px-4 py-3"
      dir={isAr ? "rtl" : "ltr"}
      role="note"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2" className="flex-shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        <p className="text-xs font-bold text-[#9A7400]">{title}</p>
        <p className="text-[11px] text-[#9A7400]/80 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
