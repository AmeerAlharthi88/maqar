"use client";

import { useLanguageStore } from "@/store/language.store";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale } = useLanguageStore();
  const isAr = locale === "ar";

  return (
    <button
      onClick={() => setLocale(isAr ? "en" : "ar")}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold",
        "border border-[#E8DDD0] bg-white hover:bg-[#F5F0EA] transition-colors",
        "text-[#7A6B5E]",
        className
      )}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
    >
      {isAr ? "EN" : "عر"}
    </button>
  );
}
