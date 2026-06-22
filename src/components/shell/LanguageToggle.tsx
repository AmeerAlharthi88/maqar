"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

/**
 * Segmented AR | EN toggle. Shows BOTH languages with the ACTIVE one highlighted,
 * so it is unambiguous which language is current and that tapping switches — no
 * confusion over whether a lone "EN" means the current or the target language.
 */
export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, toggleLocale } = useTranslation();
  const isAr = locale === "ar";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      // title surfaces the action on hover; aria-label states the switch target.
      title={isAr ? "التبديل إلى الإنجليزية" : "Switch to Arabic"}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-[#E2E8F0] bg-white p-0.5",
        "text-[11px] font-bold leading-none select-none",
        className
      )}
    >
      <span
        className={cn(
          "px-2 py-1 rounded-full transition-colors",
          isAr ? "bg-[#0A3C36] text-white" : "text-[#627D98]"
        )}
      >
        ع
      </span>
      <span
        className={cn(
          "px-2 py-1 rounded-full transition-colors",
          !isAr ? "bg-[#0A3C36] text-white" : "text-[#627D98]"
        )}
      >
        EN
      </span>
    </button>
  );
}
