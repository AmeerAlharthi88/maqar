import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminRiskBadge } from "./AdminRiskBadge";
import type { AdminVerificationRequest, VerificationRequestStatus } from "@/types/admin";
import { VERIFICATION_STATUS_AR } from "@/types/admin";

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
  const typeAr = request.type === "agent" ? "وسيط عقاري" : request.type === "agency" ? "وكالة عقارية" : "عقار";
  const isPending = request.status === "pending" || request.status === "under_review" || request.status === "needs_more_info";

  return (
    <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#1E1E1E]">{request.applicantNameAr}</p>
            <span className="text-[10px] px-2 py-0.5 bg-[#F5F0EA] text-[#7A6B5E] rounded-lg font-semibold">
              {typeAr}
            </span>
          </div>
          <p className="text-xs text-[#7A6B5E] mt-0.5">{request.phone}</p>
          <p className="text-[10px] text-[#A89480] mt-0.5">
            {new Date(request.submittedAt).toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge
            label={VERIFICATION_STATUS_AR[request.status]}
            variant={STATUS_VARIANT[request.status]}
            size="xs"
          />
          <AdminRiskBadge level={request.riskLevel} />
        </div>
      </div>

      {/* Phone verification */}
      <div className="flex items-center gap-2 mb-3">
        {request.isPhoneVerified ? (
          <span className="flex items-center gap-1 text-[10px] text-[#5B8C5A] font-semibold">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#5B8C5A">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            رقم الهاتف موثّق
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-[#C65D3B] font-semibold">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            رقم الهاتف غير موثّق
          </span>
        )}
        {request.licenseNumber && (
          <span className="text-[10px] text-[#A89480]">ترخيص: {request.licenseNumber}</span>
        )}
        {request.crNumber && (
          <span className="text-[10px] text-[#A89480]">س.ت: {request.crNumber}</span>
        )}
      </div>

      {/* Document checklist */}
      <div className="space-y-1.5 mb-3">
        {request.documents.map((doc, i) => (
          <div key={i} className="flex items-center gap-2">
            {doc.verified ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5B8C5A" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : doc.submitted ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            <span className={["text-xs", doc.verified ? "text-[#5B8C5A]" : doc.submitted ? "text-[#1E1E1E]" : "text-[#A89480]"].join(" ")}>
              {doc.labelAr}
              {doc.verified && " — موثّق"}
              {!doc.verified && doc.submitted && " — في المراجعة"}
              {!doc.submitted && " — لم يُرفع"}
            </span>
          </div>
        ))}
      </div>

      {/* Document privacy notice */}
      <div className="bg-[#F5F0EA] rounded-xl px-3 py-2 mb-3 flex items-start gap-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A89480" strokeWidth="2" className="flex-shrink-0 mt-0.5">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-[10px] text-[#7A6B5E] leading-relaxed">
          المستندات الأصلية متاحة فقط للمسؤولين المخوّلين عبر النظام الداخلي. لا تُشارك الروابط خارجياً.
        </p>
      </div>

      {/* Admin note */}
      {request.adminNote && (
        <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-3">
          <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">ملاحظة</p>
          <p className="text-xs text-[#7A6B5E]">{request.adminNote}</p>
        </div>
      )}

      {/* Actions */}
      {isPending && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove?.(request.id)}
            className="flex-1 py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold"
          >
            قبول
          </button>
          <button
            onClick={() => onReject?.(request.id)}
            className="flex-1 py-2 rounded-xl bg-[#FBF0EB] text-[#C65D3B] text-xs font-bold"
          >
            رفض
          </button>
          <button
            onClick={() => onRequestInfo?.(request.id)}
            className="flex-1 py-2 rounded-xl bg-[#FFF8E7] text-[#D4A017] text-xs font-bold"
          >
            طلب معلومات
          </button>
        </div>
      )}
    </div>
  );
}
