"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import type { KYCApplication, KYCDocument, KYCDocumentType } from "@/types/profile";
import { KYC_DOC_LABELS_AR, VERIFICATION_STATUS_LABELS_AR } from "@/types/profile";
import { ROLE_LABELS_AR } from "@/config/roles";
import {
  uploadKYCDocument,
  insertKYCDocument,
  createOrUpdateKYCApplication,
} from "@/lib/supabase/kyc";

// Required documents per agent type
const INDIVIDUAL_DOCS: KYCDocumentType[] = [
  "civil_id_front",
  "civil_id_back",
  "agent_card",
  "selfie",
];
const AGENCY_DOCS: KYCDocumentType[] = [
  "civil_id_front",
  "civil_id_back",
  "cr_number",
  "agency_license",
  "selfie",
];

// ── Status banner ─────────────────────────────────────────────────────────────
function StatusBanner({ status }: { status: KYCApplication["status"] }) {
  const configs = {
    not_started: null,
    draft: null,
    submitted: { bg: "bg-[#EAF4FB]", border: "border-[#2471A3]/20", text: "text-[#2471A3]" },
    under_review: { bg: "bg-[#FFF8E7]", border: "border-[#D4A017]/20", text: "text-[#D4A017]" },
    approved: { bg: "bg-[#E6F0EF]", border: "border-[#0A3C36]/20", text: "text-[#0A3C36]" },
    rejected: { bg: "bg-[#FEF0EE]", border: "border-[#C0392B]/30", text: "text-[#C0392B]" },
    needs_more_info: { bg: "bg-[#FEF0EE]", border: "border-[#C0392B]/30", text: "text-[#C0392B]" },
  };
  const cfg = configs[status];
  if (!cfg) return null;
  return (
    <div className={`rounded-2xl border px-4 py-3 ${cfg.bg} ${cfg.border}`}>
      <p className={`text-sm font-semibold ${cfg.text}`}>
        الحالة: {VERIFICATION_STATUS_LABELS_AR[status]}
      </p>
    </div>
  );
}

// ── Document upload row ───────────────────────────────────────────────────────
function DocRow({
  type,
  doc,
  onUpload,
}: {
  type: KYCDocumentType;
  doc?: KYCDocument;
  onUpload: (type: KYCDocumentType, file: File) => void;
}) {
  const isDone = doc?.uploadStatus === "done";
  const isLoading = doc?.uploadStatus === "uploading";

  return (
    <label className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl px-4 py-3 cursor-pointer">
      {/* Status icon */}
      <div
        className={[
          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
          isDone ? "bg-[#E6F0EF]" : "bg-[#F0F4F8]",
        ].join(" ")}
      >
        {isLoading ? (
          <span className="w-4 h-4 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
        ) : isDone ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#102A43]">{KYC_DOC_LABELS_AR[type]}</p>
        {isDone && doc?.fileName && (
          <p className="text-xs text-[#627D98] truncate mt-0.5">{doc.fileName}</p>
        )}
        {!isDone && (
          <p className="text-xs text-[#627D98] mt-0.5">اضغط لرفع الملف</p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(type, file);
          e.target.value = "";
        }}
      />
    </label>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
export function KYCVerificationForm() {
  const { user } = useAuthStore();

  const [agentType, setAgentType] = useState<"individual" | "agency">("individual");
  const [agencyNameAr, setAgencyNameAr] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredTypes = agentType === "individual" ? INDIVIDUAL_DOCS : AGENCY_DOCS;

  const getDoc = (type: KYCDocumentType) =>
    documents.find((d) => d.type === type);

  const allUploaded = requiredTypes.every((t) => getDoc(t)?.uploadStatus === "done");

  // Upload a single document to Supabase Storage (or fallback for guests)
  const handleUpload = useCallback(async (type: KYCDocumentType, file: File) => {
    const docId = `${type}-${Date.now()}`;

    // Optimistically mark as uploading
    setDocuments((prev) => {
      const next = prev.filter((d) => d.type !== type);
      return [...next, { id: docId, type, fileName: file.name, uploadStatus: "uploading" }];
    });

    if (user?.id) {
      // Real upload to Supabase Storage (private documents bucket)
      const storagePath = await uploadKYCDocument(user.id, type, file);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                uploadStatus: storagePath ? "done" : "error",
                url: storagePath ?? undefined,
              }
            : d
        )
      );
    } else {
      // Guest / dev fallback — simulate delay
      await new Promise((r) => setTimeout(r, 1200));
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId ? { ...d, uploadStatus: "done", url: "pending-upload" } : d
        )
      );
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allUploaded || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    if (user?.id) {
      // 1. Upsert the KYC application record (creates or updates draft → submitted)
      const app = await createOrUpdateKYCApplication(user.id, agentType, "submitted");

      if (app?.id) {
        // 2. Insert DB records for all uploaded documents
        await Promise.all(
          documents
            .filter((d) => d.uploadStatus === "done" && d.url && d.url !== "pending-upload")
            .map((d) =>
              insertKYCDocument({
                applicationId: app.id,
                userId: user.id,
                documentType: d.type,
                storagePath: d.url!,
                fileName: d.fileName,
                fileSizeBytes: undefined,
                mimeType: undefined,
              })
            )
        );
      }
    } else {
      // Guest / dev fallback
      await new Promise((r) => setTimeout(r, 1500));
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  if (isSubmitted) {
    return (
      <div className="px-4 py-10 flex flex-col items-center text-center" dir="rtl">
        <div className="w-20 h-20 rounded-full bg-[#E6F0EF] flex items-center justify-center mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#102A43] mb-2">تم إرسال طلب التوثيق</h2>
        <p className="text-sm text-[#627D98] max-w-xs leading-relaxed">
          سيراجع فريق مقر وثائقك خلال ٢–٥ أيام عمل وسيتم إخطارك بنتيجة المراجعة.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-5 max-w-xl mx-auto" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#102A43] mb-1">التوثيق الرسمي</h1>
        <p className="text-sm text-[#627D98] leading-relaxed">
          وثّق حسابك كوسيط عقاري موثوق واحصل على شارة التحقق في مقر.
        </p>
      </div>

      {/* Current role */}
      {user && (
        <div className="bg-[#F0F4F8] rounded-2xl px-4 py-3">
          <p className="text-xs text-[#627D98]">
            نوع حسابك الحالي:{" "}
            <span className="font-bold text-[#102A43]">{ROLE_LABELS_AR[user.role]}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Agent type */}
        <div>
          <p className="text-xs font-semibold text-[#627D98] mb-2">نوع التوثيق</p>
          <div className="grid grid-cols-2 gap-2">
            {(["individual", "agency"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAgentType(t)}
                className={[
                  "py-3 rounded-2xl border-2 text-sm font-semibold transition-all",
                  agentType === t
                    ? "border-[#0A3C36] bg-[#E6F0EF] text-[#0A3C36]"
                    : "border-[#E2E8F0] bg-white text-[#627D98]",
                ].join(" ")}
              >
                {t === "individual" ? "وسيط فردي" : "وكالة عقارية"}
              </button>
            ))}
          </div>
        </div>

        {/* Agency-specific fields */}
        {agentType === "agency" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#627D98] mb-1.5">
                اسم الوكالة بالعربية
              </label>
              <input
                type="text"
                value={agencyNameAr}
                onChange={(e) => setAgencyNameAr(e.target.value)}
                placeholder="مثال: وكالة النخبة للعقارات"
                className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-white text-sm text-[#102A43] placeholder-[#627D98] outline-none focus:border-[#0A3C36]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#627D98] mb-1.5">
                رقم السجل التجاري
              </label>
              <input
                type="text"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                placeholder="1234567"
                className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-white text-sm text-[#102A43] placeholder-[#627D98] outline-none focus:border-[#0A3C36]"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#627D98] mb-1.5">
                رقم ترخيص الوكالة (اختياري)
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="RE-2024-XXXX"
                className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-white text-sm text-[#102A43] placeholder-[#627D98] outline-none focus:border-[#0A3C36]"
              />
            </div>
          </div>
        )}

        {/* Document uploads */}
        <div>
          <p className="text-xs font-semibold text-[#627D98] mb-2">
            المستندات المطلوبة{" "}
            <span className="text-[#627D98] font-normal">
              ({requiredTypes.filter((t) => getDoc(t)?.uploadStatus === "done").length}/{requiredTypes.length})
            </span>
          </p>
          <div className="space-y-2">
            {requiredTypes.map((type) => (
              <DocRow
                key={type}
                type={type}
                doc={getDoc(type)}
                onUpload={handleUpload}
              />
            ))}
          </div>
        </div>

        {/* Info note */}
        <div className="bg-[#EAF4FB] border border-[#2471A3]/20 rounded-2xl px-4 py-3">
          <p className="text-xs text-[#2471A3] leading-relaxed">
            يُقبل JPG أو PNG أو PDF بحد أقصى 5 ميغابايت لكل ملف. تُستخدم المستندات للتحقق فقط ولن تُشارك مع أطراف ثالثة.
          </p>
        </div>

        {error && (
          <div className="bg-[#FEF0EE] border border-[#C0392B]/30 rounded-xl px-4 py-3">
            <p className="text-xs text-[#C0392B]">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!allUploaded || isSubmitting}
          className="w-full py-4 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            "إرسال طلب التوثيق"
          )}
        </button>
      </form>
    </div>
  );
}
