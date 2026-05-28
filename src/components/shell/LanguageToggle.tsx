"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, toggleLocale } = useTranslation();
  const isAr = locale === "ar";

  return (
    <button
      onClick={toggleLocale}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold",
        "border border-[#E2E8F0] bg-white hover:bg-[#F0F4F8] transition-colors",
        "text-[#627D98]",
        className
      )}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
    >
      {isAr ? "EN" : "عر"}
    </button>
  );
}
