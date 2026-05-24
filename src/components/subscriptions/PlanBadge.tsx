// ── PlanBadge — compact badge showing current plan ────────────────────────────

import { cn } from "@/lib/utils";
import type { PlanId } from "@/lib/payments/types";
import { PLAN_NAMES_AR } from "@/lib/payments/plans";

interface PlanBadgeProps {
  planId: PlanId;
  className?: string;
  size?: "xs" | "sm";
}

const styleMap: Record<PlanId, string> = {
  free:      "bg-[#F0F4F8] text-[#627D98] border-[#E2E8F0]",
  agent_pro: "bg-[#EAF4FB] text-[#2471A3] border-[#2471A3]/20",
  agency:    "bg-[#E6F0EF] text-[#0A3C36] border-[#0A3C36]/20",
};

export function PlanBadge({ planId, className, size = "xs" }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border rounded-full font-semibold",
        size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        styleMap[planId],
        className
      )}
    >
      {PLAN_NAMES_AR[planId]}
    </span>
  );
}
