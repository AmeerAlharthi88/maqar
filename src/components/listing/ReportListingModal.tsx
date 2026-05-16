"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { Listing } from "@/types/listing";

interface ReportListingModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

const REPORT_REASONS = [
  "السعر مبالغ فيه أو غير حقيقي",
  "الصور غير مطابقة للعقار",
  "العقار غير موجود أو وهمي",
  "معلومات خاطئة أو مضللة",
  "إعلان مكرر",
  "احتيال أو نصب",
  "المعلن لا يرد",
  "سبب آخر",
];

type Step = "form" | "success";

export function ReportListingModal({ open, onClose, listing }: ReportListingModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!selectedReason) {
      setError("يرجى اختيار سبب الإبلاغ");
      return;
    }
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setStep("success");
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep("form");
      setSelectedReason(null);
      setNotes("");
      setError("");
    }, 300);
  }

  return (
    <BottomSheet open={open} onClose={handleClose} title="الإبلاغ عن الإعلان">
      {step === "success" ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F0EA] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7A6B5E" strokeWidth="2">
              <path d="M4 4l16 16M4 20L20 4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E]">تم استلام بلاغك</h3>
          <p className="text-sm text-[#7A6B5E] max-w-xs">
            شكراً لمساعدتنا في الحفاظ على جودة الإعلانات. سيراجع فريقنا البلاغ قريباً.
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-[#F5F0EA] text-[#1E1E1E] font-semibold text-sm border border-[#E8DDD0]"
          >
            إغلاق
          </button>
        </div>
      ) : (
        <div className="px-5 py-4" dir="rtl">
          <p className="text-xs text-[#7A6B5E] mb-4">
            إعلان: <span className="font-semibold text-[#1E1E1E]">{listing.titleAr}</span>
          </p>

          <p className="text-sm font-medium text-[#1E1E1E] mb-3">سبب الإبلاغ</p>

          <div className="space-y-2 mb-4">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => {
                  setSelectedReason(reason);
                  setError("");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-right transition-all ${
                  selectedReason === reason
                    ? "bg-[#FBF0EB] border-[#C65D3B] text-[#C65D3B] font-semibold"
                    : "bg-white border-[#E8DDD0] text-[#3D3330]"
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedReason === reason ? "border-[#C65D3B]" : "border-[#E8DDD0]"
                }`}>
                  {selectedReason === reason && (
                    <span className="w-2 h-2 rounded-full bg-[#C65D3B]" />
                  )}
                </span>
                {reason}
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-[#C0392B] mb-3">{error}</p>}

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-[#1E1E1E]">تفاصيل إضافية (اختياري)</label>
            <textarea
              placeholder="أضف أي معلومات تساعدنا في مراجعة البلاغ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#E8DDD0] rounded-xl px-3.5 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#A89480] outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-[#C65D3B] text-white font-semibold text-sm disabled:opacity-60 mb-safe"
          >
            {submitting ? "جاري الإرسال..." : "إرسال البلاغ"}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
