"use client";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminRiskBadge } from "./AdminRiskBadge";
import { AdminActionFeedback } from "./AdminActionFeedback";
import type { AdminReport, ReportStatus } from "@/types/admin";
import { REPORT_REASON_AR, REPORT_REASON_EN, REPORT_STATUS_AR, REPORT_STATUS_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

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

const TARGET_TYPE_EN: Record<string, string> = {
  listing: "Listing",
  agent:   "Agent",
  agency:  "Agency",
  review:  "Review",
};

interface ReportCardProps {
  report: AdminReport;
  onReview?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onResolve?: (id: string) => void;
  onEscalate?: (id: string) => void;
  /** An action is in flight for this report — disables buttons + shows loading. */
  pending?: boolean;
  /** The last action for this report failed — shows a retryable error. */
  actionError?: boolean;
  /** Re-runs the failed action. */
  onRetry?: () => void;
}

export function ReportCard({ report, onDismiss, onResolve, onEscalate, pending = false, actionError = false, onRetry }: ReportCardProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const isActionable = report.status === "new" || report.status === "reviewing";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 bg-[#F0F4F8] text-[#627D98] rounded-lg font-semibold">
              {isAr ? TARGET_TYPE_AR[report.targetType] : TARGET_TYPE_EN[report.targetType]}
            </span>
            <p className="text-sm font-bold text-[#102A43] line-clamp-1">{displayMeta(report.targetNameAr, isAr)}</p>
          </div>
          <p className="text-xs text-[#627D98]">
            {bi(isAr, "بلاغ من", "Reported by")}: {displayMeta(report.reporterNameAr, isAr)}
          </p>
          <p className="text-[10px] text-[#627D98] mt-0.5">
            {new Date(report.createdAt).toLocaleDateString(isAr ? "ar-OM" : "en-OM", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge label={isAr ? REPORT_STATUS_AR[report.status] : REPORT_STATUS_EN[report.status]} variant={STATUS_VARIANT[report.status]} size="xs" />
          <AdminRiskBadge level={report.severity} />
        </div>
      </div>

      {/* Reason chip */}
      <div className="mb-2">
        <span className="inline-flex px-2.5 py-1 bg-[#F0F4F8] text-[#627D98] text-xs font-semibold rounded-xl">
          {isAr ? REPORT_REASON_AR[report.reason] : REPORT_REASON_EN[report.reason]}
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
          <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">{bi(isAr, "ملاحظة الإدارة", "Admin note")}</p>
          <p className="text-xs text-[#627D98]">{report.adminNote}</p>
        </div>
      )}

      {/* Actions — min 40px tap targets, comfortable spacing on mobile */}
      {isActionable && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onResolve?.(report.id)}
              disabled={pending}
              className="flex-1 min-w-[88px] min-h-[40px] py-2.5 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {bi(isAr, "حل البلاغ", "Resolve")}
            </button>
            <button
              onClick={() => onDismiss?.(report.id)}
              disabled={pending}
              className="flex-1 min-w-[88px] min-h-[40px] py-2.5 rounded-xl bg-[#F0F4F8] text-[#627D98] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {bi(isAr, "رفض البلاغ", "Dismiss")}
            </button>
            <button
              onClick={() => onEscalate?.(report.id)}
              disabled={pending}
              className="flex-1 min-w-[88px] min-h-[40px] py-2.5 rounded-xl bg-[#F3EEFA] text-[#7B5EA7] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {bi(isAr, "تصعيد", "Escalate")}
            </button>
          </div>
          <AdminActionFeedback pending={pending} error={actionError} onRetry={onRetry} />
        </>
      )}
    </div>
  );
}
