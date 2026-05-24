import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/admin";
import { RISK_LEVEL_AR } from "@/types/admin";

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
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-full px-2",
        size === "xs" ? "text-[10px] py-0.5" : "text-xs py-1",
        RISK_CLASSES[level],
        className
      )}
    >
      {RISK_LEVEL_AR[level]}
    </span>
  );
}
