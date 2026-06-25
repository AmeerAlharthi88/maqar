"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { HeaderHomeButton } from "@/components/shell/HeaderHomeButton";

interface AddListingHeaderProps {
  /** When set, renders the "continue draft" variant with the draft id. */
  draftId?: string;
}

/**
 * Compact, localized add-listing header. Replaces the previously hardcoded-Arabic
 * bar so English mode shows English (FP5 #1), and trims the mobile vertical
 * footprint + reserves end-padding for the fixed language toggle so the header
 * never feels cramped or clipped (FP5 #5).
 */
export function AddListingHeader({ draftId }: AddListingHeaderProps) {
  const { locale, dir } = useTranslation();
  const isAr = locale === "ar";

  const title = draftId
    ? (isAr ? "متابعة المسودة" : "Continue draft")
    : (isAr ? "نشر إعلان عقاري" : "Post a property listing");
  const subtitle = draftId
    ? (isAr ? `المسودة: ${draftId}` : `Draft: ${draftId}`)
    : (isAr ? "أكمل الخطوات لنشر إعلانك" : "Complete the steps to publish your listing");

  return (
    <div
      className="bg-white border-b border-[#E2E8F0] px-4 py-2.5 pe-16 lg:pe-4 flex items-center gap-2.5"
      dir={dir}
    >
      <div className="w-7 h-7 rounded-lg bg-[#0A3C36] flex items-center justify-center flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div className="min-w-0">
        <h1 className="text-sm font-bold text-[#102A43] truncate">{title}</h1>
        <p className="text-[11px] text-[#627D98] truncate">{subtitle}</p>
      </div>

      {/* Home shortcut — the add-listing flow has no clickable logo; this gives a
          one-tap path to the main page. The persisted draft stays scoped to its
          owner, so leaving does not lose or leak it (FP9). */}
      <HeaderHomeButton className="ms-auto" />
    </div>
  );
}
