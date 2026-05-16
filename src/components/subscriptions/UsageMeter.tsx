// ── UsageMeter — shows current usage vs limit with a progress bar ─────────────

import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import type { UsageLimit } from "@/lib/payments/types";

interface UsageMeterProps {
  usage: UsageLimit;
  className?: string;
}

export function UsageMeter({ usage, className }: UsageMeterProps) {
  const isUnlimited = usage.limit === null || usage.limit === -1;
  const pct = isUnlimited || usage.limit === 0
    ? 0
    : Math.min(100, Math.round((usage.current / (usage.limit as number)) * 100));

  const isAtLimit = !isUnlimited && usage.limit !== null && usage.current >= usage.limit;
  const isNearLimit = !isAtLimit && pct >= 75;

  const barColor = isAtLimit
    ? "bg-[#C0392B]"
    : isNearLimit
    ? "bg-[#C8860A]"
    : "bg-[#5B8C5A]";

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#1E1E1E] font-medium">{usage.labelAr}</span>
        <span
          className={cn(
            "text-xs font-semibold",
            isAtLimit ? "text-[#C0392B]" : isNearLimit ? "text-[#C8860A]" : "text-[#7A6B5E]"
          )}
        >
          {isUnlimited ? (
            "غير محدود"
          ) : usage.limit === 0 ? (
            "غير متاح"
          ) : (
            <>
              {toArabicNumerals(usage.current)} / {toArabicNumerals(usage.limit as number)}
            </>
          )}
        </span>
      </div>

      {!isUnlimited && usage.limit !== null && usage.limit > 0 && (
        <div className="h-1.5 bg-[#F0EBE3] rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {usage.resetsAt && (
        <p className="text-[10px] text-[#A89480] mt-1">
          يتجدد:{" "}
          {new Date(usage.resetsAt).toLocaleDateString("ar-OM", {
            day: "numeric",
            month: "long",
          })}
        </p>
      )}
    </div>
  );
}
