// ── YieldBadge — colored badge for rental yield quality ──────────────────────

import { cn } from "@/lib/utils";
import type { YieldLabel } from "@/lib/calculators/rental-yield";
import { getYieldLabel } from "@/lib/calculators/rental-yield";

interface YieldBadgeProps {
  pct: number;
  label?: YieldLabel;
  className?: string;
}

const styleMap: Record<YieldLabel, string> = {
  "ممتاز": "bg-[#EDF4ED] text-[#5B8C5A] border-[#5B8C5A]/20",
  "جيد":   "bg-[#EDF4ED] text-[#5B8C5A] border-[#5B8C5A]/20",
  "متوسط": "bg-[#FEF9EC] text-[#C8860A] border-[#C8860A]/20",
  "منخفض": "bg-[#FEF0F0] text-[#C0392B] border-[#C0392B]/20",
};

export function YieldBadge({ pct, label, className }: YieldBadgeProps) {
  const resolvedLabel = label ?? getYieldLabel(pct);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
        styleMap[resolvedLabel],
        className
      )}
    >
      {resolvedLabel}
    </span>
  );
}
