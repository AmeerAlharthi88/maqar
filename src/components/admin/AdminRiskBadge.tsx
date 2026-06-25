"use client";

import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/admin";
import { RISK_LEVEL_AR, RISK_LEVEL_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";

const RISK_CLASSES: Record<RiskLevel, string> = {
  low:      "bg-[#E6F0EF] text-[#0A3C36]",
  medium:   "bg-[#FFF8E7] text-[#D4A017]",
  high:     "bg-[#FEF0EE] text-[#C0392B]",
  critical: "bg-[#C0392B] text-white",
};

interface AdminRiskBadgeProps {
  level: RiskLevel;
  className?: string;
  size?: "xs" | "sm";
}

export function AdminRiskBadge({ level, className, size = "xs" }: AdminRiskBadgeProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-full px-2",
        size === "xs" ? "text-[10px] py-0.5" : "text-xs py-1",
        RISK_CLASSES[level],
        className
      )}
    >
      {isAr ? RISK_LEVEL_AR[level] : RISK_LEVEL_EN[level]}
    </span>
  );
}
