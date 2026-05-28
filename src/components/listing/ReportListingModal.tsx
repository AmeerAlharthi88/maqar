"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface ReportListingModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

const REPORT_REASONS: Array<{ ar: string; en: string }> = [
  { ar: "السعر مبالغ فيه أو غير حقيقي",    en: "Price is exaggerated or unrealistic" },
  { ar: "الصور غير مطابقة للعقار",           en: "Photos don't match the property" },
  { ar: "العقار غير موجود أو وهمي",          en: "Property doesn't exist or is fake" },
  { ar: "معلومات خاطئة أو مضللة",           en: "Incorrect or misleading information" },
  { ar: "إعلان مكرر",                        en: "Duplicate listing" },
  { ar: "احتيال أو نصب",                    en: "Fraud or scam" },
  { ar: "المعلن لا يرد",                     en: "Advertiser is unresponsive" },
  { ar: "سبب آخر",                           en: "Other reason" },
];

type Step = "form" | "success";

export function ReportListingModal({ open, onClose, listing }: ReportListingModalProps) {
  const { t, locale, dir } = useTranslation();
  const isAr = locale === "ar";

  const [step, setStep] = useState<Step>("form");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const listingTitle = isAr ? listing.titleAr : (listing.titleEn ?? listing.titleAr);

  async function handleSubmit() {
    if (!selectedReason) {
      setError(isAr ? "يرجى اختيار سبب الإبلاغ" : "Please select a reason for the report");
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
    <BottomSheet open={open} onClose={handleClose} title={t("listing.report.title")}>
      {step === "success" ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E6F0EF] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#102A43]">
            {isAr ? "تم استلام بلاغك" : "Report received"}
          </h3>
          <p className="text-sm text-[#627D98] max-w-xs">
            {isAr
              ? "شكراً لمساعدتنا في الحفاظ على جودة الإعلانات. سيراجع فريقنا البلاغ قريباً."
              : "Thank you for helping us maintain listing quality. Our team will review your report shortly."}
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-[#F0F4F8] text-[#102A43] font-semibold text-sm border border-[#E2E8F0]"
          >
            {t("common.close")}
          </button>
        </div>
      ) : (
        <div className="px-5 py-4" dir={dir}>
          <p className="text-xs text-[#627D98] mb-4">
            {isAr ? "إعلان: " : "Listing: "}
            <span className="font-semibold text-[#102A43]">{listingTitle}</span>
          </p>

          <p className="text-sm font-medium text-[#102A43] mb-3">
            {t("listing.report.reasonLabel")}
          </p>

          <div className="space-y-2 mb-4">
            {REPORT_REASONS.map((reason) => {
              const label = isAr ? reason.ar : reason.en;
              return (
                <button
                  key={reason.ar}
                  onClick={() => {
                    setSelectedReason(reason.ar);
                    setError("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-start transition-all ${
                    selectedReason === reason.ar
                      ? "bg-[#E6F0EF] border-[#0A3C36] text-[#0A3C36] font-semibold"
                      : "bg-white border-[#E2E8F0] text-[#102A43]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    selectedReason === reason.ar ? "border-[#0A3C36]" : "border-[#E2E8F0]"
                  }`}>
                    {selectedReason === reason.ar && (
                      <span className="w-2 h-2 rounded-full bg-[#0A3C36]" />
                    )}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>

          {error && <p className="text-xs text-[#C0392B] mb-3">{error}</p>}

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-[#102A43]">
              {t("listing.report.detailsLabel")}
            </label>
            <textarea
              placeholder={isAr ? "أضف أي معلومات تساعدنا في مراجعة البلاغ..." : "Add any information that would help us review the report..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-[#0A3C36] text-white font-semibold text-sm disabled:bg-[#A0AEC0] disabled:cursor-not-allowed mb-safe"
          >
            {submitting
              ? t("addListing.common.submitting")
              : t("listing.report.submit")}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
