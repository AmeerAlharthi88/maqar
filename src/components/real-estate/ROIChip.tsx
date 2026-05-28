import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import type { Locale } from "@/i18n/types";

interface ROIChipProps {
  roiPct: number;
  locale?: Locale;
  className?: string;
}

export function ROIChip({ roiPct, locale = "ar", className }: ROIChipProps) {
  const isAr = locale === "ar";
  const numStr = roiPct.toFixed(1);
  const formatted = isAr ? toArabicNumerals(numStr) : numStr;
  // Arabic uses Arabic-Indic percent sign ٪; English uses %
  const label = isAr ? `عائد ${formatted}٪` : `${formatted}% yield`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md",
        "bg-[#E6F0EF] text-[#0A3C36]",
        className
      )}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
      {label}
    </span>
  );
}
