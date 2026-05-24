// AIUsageNotice — shows usage limit info.
// TODO: Phase 13 — wire to real usage count from Supabase.

interface AIUsageNoticeProps {
  feature?: string;
  planId?: string;   // "free" | "agent_pro" | "agency"
  usedCount?: number;
  limitCount?: number;
}

export function AIUsageNotice({ feature: _feature, planId = "free", usedCount, limitCount }: AIUsageNoticeProps) {
  if (usedCount === undefined || limitCount === undefined) return null;

  const remaining = Math.max(0, limitCount - usedCount);
  const isNearLimit = remaining <= 1;
  const isAtLimit = remaining === 0;

  if (planId !== "free" && !isNearLimit) return null; // Only show for free or near-limit users

  return (
    <div
      className={[
        "rounded-xl px-3 py-2 text-xs border",
        isAtLimit
          ? "bg-[#FEF0EE] border-[#C0392B]/25 text-[#C0392B]"
          : isNearLimit
          ? "bg-[#FDF6E3] border-[#C8860A]/25 text-[#C8860A]"
          : "bg-[#F0F4F8] border-[#E2E8F0] text-[#627D98]",
      ].join(" ")}
      dir="rtl"
    >
      {isAtLimit
        ? `لقد استنفدت حصتك اليومية (${limitCount} استخدام). سيتجدد الحد غداً.`
        : `متبقي ${remaining} استخدام من أصل ${limitCount} اليوم.`}
      {isAtLimit && planId === "free" && (
        <span className="block mt-0.5 font-semibold">
          ترقية الخطة لمزيد من الاستخدام — Phase 13
        </span>
      )}
    </div>
  );
}
