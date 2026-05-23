// ── FeatureComparisonTable — side-by-side plan feature comparison ─────────────

import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import { PLAN_ENTITLEMENTS, PLAN_NAMES_AR } from "@/lib/payments/plans";
import type { PlanId } from "@/lib/payments/types";

interface ComparisonRow {
  labelAr: string;
  getValue: (planId: PlanId) => string | boolean;
}

const ROWS: ComparisonRow[] = [
  {
    labelAr: "الإعلانات النشطة",
    getValue: (p) => {
      const l = PLAN_ENTITLEMENTS[p].maxActiveListings;
      return l === null ? "غير محدود" : `${toArabicNumerals(l)} إعلان`;
    },
  },
  {
    labelAr: "الإعلانات المميزة (شهري)",
    getValue: (p) => {
      const f = PLAN_ENTITLEMENTS[p].maxFeaturedListings;
      return f === 0 ? false : `${toArabicNumerals(f)}`;
    },
  },
  {
    labelAr: "لوحة التحليلات",
    getValue: (p) => PLAN_ENTITLEMENTS[p].canAccessAnalytics,
  },
  {
    labelAr: "إدارة العملاء المحتملين",
    getValue: (p) => PLAN_ENTITLEMENTS[p].canAccessLeads,
  },
  {
    labelAr: "إدارة الفريق",
    getValue: (p) => PLAN_ENTITLEMENTS[p].canManageTeam,
  },
  {
    labelAr: "أهلية التحقق",
    getValue: (p) => PLAN_ENTITLEMENTS[p].verificationEligible,
  },
  {
    labelAr: "المساعد الذكي (يومي)",
    getValue: (p) => {
      const l = PLAN_ENTITLEMENTS[p].aiAssistantDailyLimit;
      return l === -1 ? "غير محدود" : `${toArabicNumerals(l)} استخدام`;
    },
  },
  {
    labelAr: "توليد وصف ذكي (يومي)",
    getValue: (p) => {
      const l = PLAN_ENTITLEMENTS[p].aiDescriptionDailyLimit;
      return l === -1 ? "غير محدود" : `${toArabicNumerals(l)} استخدام`;
    },
  },
  {
    labelAr: "إضافة إعلان مميز",
    getValue: (p) => PLAN_ENTITLEMENTS[p].canPurchaseFeaturedListing,
  },
  {
    labelAr: "تعزيز العملاء",
    getValue: (p) => PLAN_ENTITLEMENTS[p].canPurchaseLeadBoost,
  },
  {
    labelAr: "دعم أولوية",
    getValue: (p) => PLAN_ENTITLEMENTS[p].prioritySupport,
  },
];

const PLANS: PlanId[] = ["free", "agent_pro", "agency"];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5" className="mx-auto" aria-label="متاح">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2.5" className="mx-auto" aria-label="غير متاح">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return <span className="text-xs font-semibold text-[#102A43]">{value}</span>;
}

interface FeatureComparisonTableProps {
  className?: string;
  highlightPlan?: PlanId;
}

export function FeatureComparisonTable({
  className,
  highlightPlan = "agent_pro",
}: FeatureComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)} dir="rtl">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="border-b-2 border-[#E2E8F0]">
            <th className="py-3 px-3 text-xs font-bold text-[#627D98] text-right w-1/2">
              الميزة
            </th>
            {PLANS.map((p) => (
              <th
                key={p}
                className={cn(
                  "py-3 px-2 text-xs font-bold text-center",
                  p === highlightPlan ? "text-[#0A3C36]" : "text-[#102A43]"
                )}
              >
                {PLAN_NAMES_AR[p]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr
              key={row.labelAr}
              className={cn(
                "border-b border-[#E2E8F0]",
                i % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]/50"
              )}
            >
              <td className="py-2.5 px-3 text-xs text-[#102A43]">{row.labelAr}</td>
              {PLANS.map((p) => (
                <td
                  key={p}
                  className={cn(
                    "py-2.5 px-2 text-center",
                    p === highlightPlan && "bg-[#E6F0EF]/30"
                  )}
                >
                  <CellValue value={row.getValue(p)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
