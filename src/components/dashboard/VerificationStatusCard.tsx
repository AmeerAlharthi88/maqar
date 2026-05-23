import Link from "next/link";
import type { VerificationStatus } from "@/types/profile";
import { VERIFICATION_STATUS_LABELS_AR } from "@/types/profile";
import { ROUTES } from "@/config/routes";

interface VerificationStatusCardProps {
  status: VerificationStatus;
  reviewNotes?: string;
}

export function VerificationStatusCard({
  status,
  reviewNotes,
}: VerificationStatusCardProps) {
  if (status === "approved") {
    return (
      <div className="bg-[#E6F0EF] border border-[#0A3C36]/20 rounded-2xl px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#0A3C36] flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0A3C36]">حساب موثّق</p>
          <p className="text-xs text-[#0A3C36]/80 mt-0.5">حسابك معتمد ويحمل شارة الوسيط الموثوق</p>
        </div>
      </div>
    );
  }

  if (status === "under_review" || status === "submitted") {
    return (
      <div className="bg-[#FFF8E7] border border-[#D4A017]/20 rounded-2xl px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#D4A017] flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-[#102A43]">طلب التوثيق قيد المراجعة</p>
          <p className="text-xs text-[#627D98] mt-0.5">سيتم إخطارك خلال ٢–٥ أيام عمل</p>
        </div>
      </div>
    );
  }

  if (status === "rejected" || status === "needs_more_info") {
    return (
      <div className="bg-[#FEF0EE] border border-[#C0392B]/20 rounded-2xl px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#C0392B] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#C0392B]">
              {status === "rejected" ? "تم رفض الطلب" : "يتطلب معلومات إضافية"}
            </p>
          </div>
        </div>
        {reviewNotes && (
          <p className="text-xs text-[#627D98] mb-3 leading-relaxed">{reviewNotes}</p>
        )}
        <Link
          href={ROUTES.agentVerification}
          className="block w-full py-2.5 rounded-xl bg-[#0A3C36] text-white text-xs font-bold text-center"
        >
          إعادة تقديم الطلب
        </Link>
      </div>
    );
  }

  // not_started or draft — prompt to apply
  return (
    <div className="bg-[#F0F4F8] border border-[#E2E8F0] rounded-2xl px-4 py-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#0A3C36]/10 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-[#102A43]">احصل على شارة الوسيط الموثوق</p>
          <p className="text-xs text-[#627D98] mt-0.5 leading-relaxed">
            وثّق حسابك لزيادة ظهورك وثقة العملاء في إعلاناتك
          </p>
        </div>
      </div>
      <Link
        href={ROUTES.agentVerification}
        className="block w-full py-2.5 rounded-xl bg-[#0A3C36] text-white text-xs font-bold text-center"
      >
        تقديم طلب التوثيق
      </Link>
    </div>
  );
}
