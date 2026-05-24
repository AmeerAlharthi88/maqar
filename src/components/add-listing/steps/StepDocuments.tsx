"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { DOCUMENT_TYPES } from "@/lib/constants/add-listing";
import type { ListingDraft, UploadedFile, DocumentType } from "@/types/listing-draft";

interface StepDocumentsProps {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
}

function generateFileId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function StepDocuments({ draft, onChange }: StepDocumentsProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function handleFile(docType: DocumentType, file: File | null) {
    if (!file) return;
    const uploaded: UploadedFile = {
      id: generateFileId(),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      isMain: false,
      uploadStatus: "pending",
    };
    const updated = draft.documents.filter((d) => d.type !== docType);
    updated.push({ type: docType, file: uploaded });
    onChange({ documents: updated });
  }

  function removeDocument(docType: DocumentType) {
    onChange({ documents: draft.documents.filter((d) => d.type !== docType) });
  }

  function getDoc(docType: DocumentType) {
    return draft.documents.find((d) => d.type === docType);
  }

  return (
    <div className="px-4 py-6 space-y-5" dir="rtl">
      {/* Privacy notice */}
      <div className="bg-[#EAF4FB] border border-[#2471A3]/20 rounded-2xl px-4 py-4">
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2471A3" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="text-xs font-bold text-[#2471A3] mb-1">الوثائق لأغراض التحقق الإداري فقط</p>
            <p className="text-xs text-[#2471A3]/80 leading-relaxed">
              جميع الوثائق المرفقة خاصة ومشفرة ولا تُعرض للعموم أو للمشترين. يراجعها فريق مقر فقط للتحقق من صحة الإعلان.
            </p>
          </div>
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {DOCUMENT_TYPES.map((docConfig) => {
          const existing = getDoc(docConfig.value);
          const hasFile = !!existing?.file;

          return (
            <div
              key={docConfig.value}
              className={cn(
                "bg-white rounded-2xl border p-4",
                hasFile ? "border-[#0A3C36]/40" : "border-[#E2E8F0]"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#102A43]">{docConfig.labelAr}</p>
                    {docConfig.required && (
                      <span className="text-[9px] font-bold text-[#C0392B] bg-[#FEF0EE] border border-[#C0392B]/30 px-1.5 py-0.5 rounded-full">
                        مطلوب للتحقق
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#627D98] mt-0.5">{docConfig.descAr}</p>
                </div>
                {hasFile && (
                  <div className="w-8 h-8 rounded-full bg-[#E6F0EF] flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </div>

              {hasFile ? (
                <div className="flex items-center justify-between bg-[#F0F4F8] rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="text-xs text-[#102A43] truncate">{existing?.file?.name}</span>
                  </div>
                  <button
                    onClick={() => removeDocument(docConfig.value)}
                    className="text-xs text-[#C0392B] font-semibold flex-shrink-0 ms-2"
                    aria-label="حذف الوثيقة"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => inputRefs.current[docConfig.value]?.click()}
                  className="w-full py-2.5 border border-dashed border-[#E2E8F0] rounded-xl text-sm text-[#627D98] flex items-center justify-center gap-2 active:bg-[#F0F4F8]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  رفع الوثيقة
                </button>
              )}

              <input
                ref={(el) => { inputRefs.current[docConfig.value] = el; }}
                type="file"
                accept={docConfig.accept}
                className="sr-only"
                onChange={(e) => handleFile(docConfig.value, e.target.files?.[0] ?? null)}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {/* Verification request toggle */}
      <button
        onClick={() => onChange({ requestVerification: !draft.requestVerification })}
        className="w-full flex items-center justify-between py-3 px-4 bg-white rounded-2xl border border-[#E2E8F0]"
        role="switch"
        aria-checked={draft.requestVerification}
      >
        <div className="text-right">
          <p className="text-sm font-medium text-[#102A43]">طلب شارة التحقق</p>
          <p className="text-xs text-[#627D98]">يُظهر علامة التحقق على إعلانك بعد المراجعة</p>
        </div>
        <div
          className={cn(
            "w-11 h-6 rounded-full transition-all flex-shrink-0 ms-3 relative",
            draft.requestVerification ? "bg-[#0A3C36]" : "bg-[#E2E8F0]"
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
              draft.requestVerification ? "start-5" : "start-0.5"
            )}
          />
        </div>
      </button>

      <p className="text-[10px] text-[#627D98] text-center leading-relaxed">
        رفع الوثائق اختياري للمسودة ومطلوب للنشر النهائي. جميع الوثائق مشفرة وآمنة.
      </p>
    </div>
  );
}
