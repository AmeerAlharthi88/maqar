import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminRiskBadge } from "./AdminRiskBadge";
import type { AdminReport, ReportStatus } from "@/types/admin";
import { REPORT_REASON_AR, REPORT_STATUS_AR } from "@/types/admin";

const STATUS_VARIANT: Record<ReportStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  new:       "danger",
  reviewing: "warning",
  resolved:  "success",
  dismissed: "neutral",
  escalated: "purple",
};

const TARGET_TYPE_AR: Record<string, string> = {
  listing: "إعلان",
  agent:   "وسيط",
  agency:  "وكالة",
  review:  "تقييم",
};

interface ReportCardProps {
  report: AdminReport;
  onReview?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onResolve?: (id: string) => void;
  onEscalate?: (id: string) => void;
}

export function ReportCard({ report, onReview, onDismiss, onResolve, onEscalate }: ReportCardProps) {
  const isActionable = report.status === "new" || report.status === "reviewing";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 bg-[#F0F4F8] text-[#627D98] rounded-lg font-semibold">
              {TARGET_TYPE_AR[report.targetType]}
            </span>
            <p className="text-sm font-bold text-[#102A43] line-clamp-1">{report.targetNameAr}</p>
          </div>
          <p className="text-xs text-[#627D98]">
            بلاغ من: {report.reporterNameAr}
          </p>
          <p className="text-[10px] text-[#627D98] mt-0.5">
            {new Date(report.createdAt).toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge label={REPORT_STATUS_AR[report.status]} variant={STATUS_VARIANT[report.status]} size="xs" />
          <AdminRiskBadge level={report.severity} />
        </div>
      </div>

      {/* Reason chip */}
      <div className="mb-2">
        <span className="inline-flex px-2.5 py-1 bg-[#F0F4F8] text-[#627D98] text-xs font-semibold rounded-xl">
          {REPORT_REASON_AR[report.reason]}
        </span>
      </div>

      {/* Details */}
      {report.detailsAr && (
        <p className="text-xs text-[#627D98] leading-relaxed mb-3 border-r-2 border-[#E2E8F0] pr-3">
          {report.detailsAr}
        </p>
      )}

      {/* Admin note */}
      {report.adminNote && (
        <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-3">
          <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">ملاحظة الإدارة</p>
          <p className="text-xs text-[#627D98]">{report.adminNote}</p>
        </div>
      )}

      {/* Actions — min 40px tap targets, comfortable spacing on mobile */}
      {isActionable && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onResolve?.(report.id)}
            className="flex-1 min-w-[88px] min-h-[40px] py-2.5 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold active:scale-[0.98] transition-transform"
          >
            حل البلاغ
          </button>
          <button
            onClick={() => onDismiss?.(report.id)}
            className="flex-1 min-w-[88px] min-h-[40px] py-2.5 rounded-xl bg-[#F0F4F8] text-[#627D98] text-xs font-bold active:scale-[0.98] transition-transform"
          >
            رفض البلاغ
          </button>
          <button
            onClick={() => onEscalate?.(report.id)}
            className="flex-1 min-w-[88px] min-h-[40px] py-2.5 rounded-xl bg-[#F3EEFA] text-[#7B5EA7] text-xs font-bold active:scale-[0.98] transition-transform"
          >
            تصعيد
          </button>
        </div>
      )}
    </div>
  );
}
