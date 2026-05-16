import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminRiskBadge } from "./AdminRiskBadge";
import type { AdminReport, ReportStatus } from "@/types/admin";
import { REPORT_REASON_AR, REPORT_STATUS_AR } from "@/types/admin";

const STATUS_VARIANT: Record<ReportStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  new:       "danger",
  reviewing: "warning",
  resolved:  "success",
  dismissed: "neutral",
};

const TARGET_TYPE_AR = {
  listing: "إعلان",
  agent:   "وسيط",
  agency:  "وكالة",
} as const;

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
    <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 bg-[#F5F0EA] text-[#7A6B5E] rounded-lg font-semibold">
              {TARGET_TYPE_AR[report.targetType]}
            </span>
            <p className="text-sm font-bold text-[#1E1E1E] line-clamp-1">{report.targetNameAr}</p>
          </div>
          <p className="text-xs text-[#7A6B5E]">
            بلاغ من: {report.reporterNameAr}
          </p>
          <p className="text-[10px] text-[#A89480] mt-0.5">
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
        <span className="inline-flex px-2.5 py-1 bg-[#F5F0EA] text-[#7A6B5E] text-xs font-semibold rounded-xl">
          {REPORT_REASON_AR[report.reason]}
        </span>
      </div>

      {/* Details */}
      {report.detailsAr && (
        <p className="text-xs text-[#7A6B5E] leading-relaxed mb-3 border-r-2 border-[#F0EBE3] pr-3">
          {report.detailsAr}
        </p>
      )}

      {/* Admin note */}
      {report.adminNote && (
        <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-3">
          <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">ملاحظة الإدارة</p>
          <p className="text-xs text-[#7A6B5E]">{report.adminNote}</p>
        </div>
      )}

      {/* Actions */}
      {isActionable && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onResolve?.(report.id)}
            className="flex-1 min-w-[72px] py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold"
          >
            حل البلاغ
          </button>
          <button
            onClick={() => onDismiss?.(report.id)}
            className="flex-1 min-w-[72px] py-2 rounded-xl bg-[#F5F0EA] text-[#7A6B5E] text-xs font-bold"
          >
            رفض البلاغ
          </button>
          <button
            onClick={() => onEscalate?.(report.id)}
            className="flex-1 min-w-[72px] py-2 rounded-xl bg-[#F3EEFA] text-[#7B5EA7] text-xs font-bold"
          >
            تصعيد
          </button>
        </div>
      )}
    </div>
  );
}
