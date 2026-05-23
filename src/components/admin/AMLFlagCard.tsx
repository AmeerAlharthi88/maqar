import { AdminRiskBadge } from "./AdminRiskBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { AMLFlag, AMLStatus } from "@/types/admin";
import { AML_STATUS_AR } from "@/types/admin";

const STATUS_VARIANT: Record<AMLStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  flagged:          "danger",
  cleared:          "success",
  escalated:        "purple",
  rejected_listing: "neutral",
};

interface AMLFlagCardProps {
  flag: AMLFlag;
  onClear?: (id: string) => void;
  onEscalate?: (id: string) => void;
  onRequestClarification?: (id: string) => void;
  onRejectListing?: (id: string) => void;
}

export function AMLFlagCard({
  flag,
  onClear,
  onEscalate,
  onRequestClarification,
  onRejectListing,
}: AMLFlagCardProps) {
  const isActionable = flag.status === "flagged";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#102A43] line-clamp-2">{flag.listingTitleAr}</p>
          <p className="text-xs text-[#627D98] mt-0.5">{flag.agentNameAr} · {flag.areaAr}</p>
          <p className="text-[10px] text-[#627D98] mt-0.5">
            {new Date(flag.submittedAt).toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge label={AML_STATUS_AR[flag.status]} variant={STATUS_VARIANT[flag.status]} size="xs" />
          <AdminRiskBadge level={flag.riskLevel} />
        </div>
      </div>

      {/* Price comparison */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#0A3C36]">
            {flag.listingPrice.toLocaleString("ar-OM")}
          </p>
          <p className="text-[10px] text-[#627D98]">سعر الإعلان</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#102A43]">
            {flag.marketAvgPrice.toLocaleString("ar-OM")}
          </p>
          <p className="text-[10px] text-[#627D98]">متوسط السوق</p>
        </div>
        <div className="bg-[#FEF0EE] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#C0392B]">-{flag.diffPct}٪</p>
          <p className="text-[10px] text-[#627D98]">أقل من السوق</p>
        </div>
      </div>

      {/* Threshold notice */}
      <div className="bg-[#FEF0EE] rounded-xl px-3 py-2 mb-3 flex items-start gap-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" className="flex-shrink-0 mt-0.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p className="text-[10px] text-[#C0392B] leading-relaxed">
          السعر أعلى من ١٠٠،٠٠٠ ر.ع. وأقل من المتوسط بأكثر من ٣٠٪. يستوجب مراجعة امتثال.
        </p>
      </div>

      {/* Admin note */}
      {flag.adminNote && (
        <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-3">
          <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">ملاحظة</p>
          <p className="text-xs text-[#627D98]">{flag.adminNote}</p>
        </div>
      )}

      {/* Actions */}
      {isActionable && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onClear?.(flag.id)}
            className="flex-1 min-w-[72px] py-2 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold"
          >
            تخليص
          </button>
          <button
            onClick={() => onRequestClarification?.(flag.id)}
            className="flex-1 min-w-[72px] py-2 rounded-xl bg-[#FFF8E7] text-[#D4A017] text-xs font-bold"
          >
            طلب توضيح
          </button>
          <button
            onClick={() => onEscalate?.(flag.id)}
            className="flex-1 min-w-[72px] py-2 rounded-xl bg-[#F3EEFA] text-[#7B5EA7] text-xs font-bold"
          >
            تصعيد
          </button>
          <button
            onClick={() => onRejectListing?.(flag.id)}
            className="flex-1 min-w-[72px] py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold"
          >
            رفض الإعلان
          </button>
        </div>
      )}
    </div>
  );
}
