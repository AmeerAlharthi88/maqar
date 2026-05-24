import type { SubscriptionPlan } from "@/types/subscription";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isCurrent?: boolean;
  onSelect?: (planId: string) => void;
}

export function SubscriptionPlanCard({
  plan,
  isCurrent = false,
  onSelect,
}: SubscriptionPlanCardProps) {
  const isPopular = plan.id === "agent_pro";

  return (
    <div
      className={[
        "rounded-2xl border-2 px-4 py-5 relative",
        isCurrent
          ? "border-[#0A3C36] bg-[#E6F0EF]/40"
          : isPopular
          ? "border-[#0A3C36]/40 bg-white"
          : "border-[#E2E8F0] bg-white",
      ].join(" ")}
      dir="rtl"
    >
      {isPopular && !isCurrent && (
        <span className="absolute -top-3 right-4 bg-[#0A3C36] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          الأكثر طلباً
        </span>
      )}
      {isCurrent && (
        <span className="absolute -top-3 right-4 bg-[#0A3C36] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          خطتك الحالية
        </span>
      )}

      <div className="mb-3">
        <p className="text-base font-bold text-[#102A43]">{plan.nameAr}</p>
        {plan.price === 0 ? (
          <p className="text-2xl font-bold text-[#102A43] mt-1">مجاني</p>
        ) : (
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-[#0A3C36]">{plan.price}</span>
            <span className="text-sm text-[#627D98]">ر.ع / شهر</span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-4">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            {f.included ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5" className="flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2.5" className="flex-shrink-0">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            <span className={["text-xs", f.included ? "text-[#102A43]" : "text-[#627D98]"].join(" ")}>
              {f.labelAr}
            </span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <p className="text-center text-xs text-[#0A3C36] font-semibold py-2">خطتك النشطة</p>
      ) : (
        <button
          onClick={() => onSelect?.(plan.id)}
          className={[
            "w-full py-2.5 rounded-xl text-sm font-bold transition-colors",
            plan.price === 0
              ? "bg-[#F0F4F8] text-[#627D98] border border-[#E2E8F0]"
              : "bg-[#0A3C36] text-white",
          ].join(" ")}
        >
          {plan.price === 0 ? "الخطة الحالية" : `الترقية إلى ${plan.nameAr}`}
        </button>
      )}
    </div>
  );
}
