// ── DemandBadge — colored badge for area demand score ────────────────────────

import { cn } from "@/lib/utils";

interface DemandBadgeProps {
  score: number; // 1–100
  className?: string;
}

function getDemandLabel(score: number): string {
  if (score >= 85) return "مرتفع جداً";
  if (score >= 70) return "مرتفع";
  if (score >= 55) return "متوسط";
  return "منخفض";
}

function getDemandStyle(score: number): string {
  if (score >= 85) return "bg-[#EDF4ED] text-[#5B8C5A] border-[#5B8C5A]/20";
  if (score >= 70) return "bg-[#EAF4FB] text-[#2471A3] border-[#2471A3]/20";
  if (score >= 55) return "bg-[#FEF9EC] text-[#C8860A] border-[#C8860A]/20";
  return "bg-[#FEF0F0] text-[#C0392B] border-[#C0392B]/20";
}

export function DemandBadge({ score, className }: DemandBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
        getDemandStyle(score),
        className
      )}
    >
      {getDemandLabel(score)}
    </span>
  );
}
