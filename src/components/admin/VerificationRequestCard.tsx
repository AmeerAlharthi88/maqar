"use client";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminRiskBadge } from "./AdminRiskBadge";
import type { AdminVerificationRequest, VerificationRequestStatus } from "@/types/admin";
import { VERIFICATION_STATUS_AR, VERIFICATION_STATUS_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

const STATUS_VARIANT: Record<VerificationRequestStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  pending:         "warning",
  under_review:    "info",
  approved:        "success",
  rejected:        "danger",
  needs_more_info: "purple",
};

interface VerificationRequestCardProps {
  request: AdminVerificationRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestInfo?: (id: string) => void;
}

export function VerificationRequestCard({
  request,
  onApprove,
  onReject,
  onRequestInfo,
}: VerificationRequestCardProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const typeLabel =
    request.type === "agent"  ? bi(isAr, "وسيط عقاري", "Real-estate agent") :
    request.type === "agency" ? bi(isAr, "وكالة عقارية", "Real-estate agency") :
                                bi(isAr, "عقار", "Property");
  const isPending = request.status === "pending" || request.status === "under_review" || request.status === "needs_more_info";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#102A43]">{displayMeta(request.applicantNameAr, isAr)}</p>
            <span className="text-[10px] px-2 py-0.5 bg-[#F0F4F8] text-[#627D98] rounded-lg font-semibold">
              {typeLabel}
            </span>
          </div>
          <p className="text-xs text-[#627D98] mt-0.5">{request.phone}</p>
          <p className="text-[10px] text-[#627D98] mt-0.5">
            {new Date(request.submittedAt).toLocaleDateString(isAr ? "ar-OM" : "en-OM", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge
            label={isAr ? VERIFICATION_STATUS_AR[request.status] : VERIFICATION_STATUS_EN[request.status]}
            variant={STATUS_VARIANT[request.status]}
            size="xs"
          />
          <AdminRiskBadge level={request.riskLevel} />
        </div>
      </div>

      {/* Phone verification */}
      <div className="flex items-center gap-2 mb-3">
        {request.isPhoneVerified ? (
          <span className="flex items-center gap-1 text-[10px] text-[#0A3C36] font-semibold">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#0A3C36">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            {bi(isAr, "رقم الهاتف موثّق", "Phone verified")}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-[#C0392B] font-semibold">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {bi(isAr, "رقم الهاتف غير موثّق", "Phone not verified")}
          </span>
        )}
        {request.licenseNumber && (
          <span className="text-[10px] text-[#627D98]">{bi(isAr, "ترخيص", "License")}: {request.licenseNumber}</span>
        )}
        {request.crNumber && (
          <span className="text-[10px] text-[#627D98]">{bi(isAr, "س.ت", "CR")}: {request.crNumber}</span>
        )}
      </div>

      {/* Document checklist */}
      <div className="space-y-1.5 mb-3">
        {request.documents.map((doc, i) => (
          <div key={i} className="flex items-center gap-2">
            {doc.verified ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : doc.submitted ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            <span className={["text-xs", doc.verified ? "text-[#0A3C36]" : doc.submitted ? "text-[#102A43]" : "text-[#627D98]"].join(" ")}>
              {doc.labelAr}
              {doc.verified && ` — ${bi(isAr, "موثّق", "Verified")}`}
              {!doc.verified && doc.submitted && ` — ${bi(isAr, "في المراجعة", "Under review")}`}
              {!doc.submitted && ` — ${bi(isAr, "لم يُرفع", "Not uploaded")}`}
            </span>
          </div>
        ))}
      </div>

      {/* Document privacy notice */}
      <div className="bg-[#F0F4F8] rounded-xl px-3 py-2 mb-3 flex items-start gap-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2" className="flex-shrink-0 mt-0.5">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-[10px] text-[#627D98] leading-relaxed">
          {bi(
            isAr,
            "المستندات الأصلية متاحة فقط للمسؤولين المخوّلين عبر النظام الداخلي. لا تُشارك الروابط خارجياً.",
            "Original documents are available only to authorized admins via the internal system. Do not share links externally."
          )}
        </p>
      </div>

      {/* Admin note */}
      {request.adminNote && (
        <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-3">
          <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">{bi(isAr, "ملاحظة", "Note")}</p>
          <p className="text-xs text-[#627D98]">{request.adminNote}</p>
        </div>
      )}

      {/* Actions */}
      {isPending && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove?.(request.id)}
            className="flex-1 py-2 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold"
          >
            {bi(isAr, "قبول", "Approve")}
          </button>
          <button
            onClick={() => onReject?.(request.id)}
            className="flex-1 py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold"
          >
            {bi(isAr, "رفض", "Reject")}
          </button>
          <button
            onClick={() => onRequestInfo?.(request.id)}
            className="flex-1 py-2 rounded-xl bg-[#FFF8E7] text-[#D4A017] text-xs font-bold"
          >
            {bi(isAr, "طلب معلومات", "Request info")}
          </button>
        </div>
      )}
    </div>
  );
}
