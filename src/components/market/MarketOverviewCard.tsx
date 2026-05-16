// ── MarketOverviewCard — single key metric card ───────────────────────────────

import { cn } from "@/lib/utils";

interface MarketOverviewCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;  // positive = up, negative = down
  className?: string;
}

export function MarketOverviewCard({
  label,
  value,
  sub,
  trend,
  className,
}: MarketOverviewCardProps) {
  const hasTrend = trend !== undefined && trend !== 0;
  const isUp = hasTrend && trend! > 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#F0EBE3] p-4",
        className
      )}
    >
      <p className="text-xs text-[#7A6B5E] mb-1">{label}</p>
      <p className="text-xl font-bold text-[#1E1E1E]">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        {sub && <p className="text-xs text-[#A89480]">{sub}</p>}
        {hasTrend && (
          <span
            className={cn(
              "text-xs font-semibold",
              isUp ? "text-[#5B8C5A]" : "text-[#C0392B]"
            )}
          >
            {isUp ? "+" : ""}
            {trend!.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
