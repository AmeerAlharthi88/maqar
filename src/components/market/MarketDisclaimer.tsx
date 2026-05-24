// ── MarketDisclaimer — required on all market and calculator pages ─────────────

import { cn } from "@/lib/utils";

interface MarketDisclaimerProps {
  variant?: "inline" | "banner";
  className?: string;
}

export function MarketDisclaimer({
  variant = "inline",
  className,
}: MarketDisclaimerProps) {
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "bg-[#FEF9EC] border border-[#C8860A]/20 rounded-2xl p-4 text-xs text-[#627D98] leading-relaxed",
          className
        )}
        role="note"
      >
        <p className="font-semibold text-[#C8860A] mb-1">تنبيه مهم</p>
        <p>
          جميع البيانات والحسابات المعروضة هي تقديرية وللتوجيه فقط. لا تمثّل
          تقييماً رسمياً للعقار، ولا موافقة على تمويل، ولا نصيحة استثمارية.
          يُرجى التحقق مع مختصين مرخّصين قبل اتخاذ أي قرار مالي.
        </p>
      </div>
    );
  }

  return (
    <p
      className={cn(
        "text-[10px] text-[#627D98] text-center leading-relaxed",
        className
      )}
      role="note"
    >
      بيانات تقديرية للتوجيه فقط · ليست تقييماً رسمياً · ليست موافقة تمويل ·
      ليست نصيحة استثمارية · تحقّق مع متخصصين مرخّصين
    </p>
  );
}
