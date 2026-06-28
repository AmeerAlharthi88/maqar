"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { createOffer } from "@/lib/supabase/crm";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface MakeOfferModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  userId?: string;  // authenticated user id
  agentId: string;  // listing.agentId
}

type FinancingType = "cash" | "mortgage" | "installment";
type Step = "form" | "success";

const FINANCING_OPTIONS: Array<{ value: FinancingType; labelAr: string; labelEn: string }> = [
  { value: "cash",        labelAr: "نقداً",      labelEn: "Cash" },
  { value: "mortgage",    labelAr: "تمويل بنكي", labelEn: "Mortgage" },
  { value: "installment", labelAr: "أقساط",      labelEn: "Installments" },
];

export function MakeOfferModal({ open, onClose, listing, userId, agentId }: MakeOfferModalProps) {
  const { t, locale, dir } = useTranslation();
  const isAr = locale === "ar";

  const [step, setStep] = useState<Step>("form");
  const [offerAmount, setOfferAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [financing, setFinancing] = useState<FinancingType>("cash");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const numAmount = parseFloat(offerAmount.replace(/,/g, "")) || 0;
  const diffPct =
    listing.price > 0
      ? (((numAmount - listing.price) / listing.price) * 100).toFixed(1)
      : "0";
  const isBelow = numAmount > 0 && numAmount < listing.price;
  const isAbove = numAmount > listing.price;

  function validate() {
    const e: Record<string, string> = {};
    if (!offerAmount.trim() || numAmount <= 0)
      e.offerAmount = isAr ? "يرجى إدخال مبلغ العرض" : "Please enter an offer amount";
    else if (numAmount < listing.price * 0.5)
      e.offerAmount = isAr ? "العرض أقل من ٥٠٪ من السعر المطلوب" : "Offer is below 50% of the asking price";
    if (!name.trim())
      e.name = isAr ? "الاسم مطلوب" : "Name is required";
    if (!phone.trim())
      e.phone = isAr ? "رقم الهاتف مطلوب" : "Phone number is required";
    else if (!/^\+?9689\d{7}$/.test(phone.replace(/\s/g, ""))) {
      e.phone = isAr ? "رقم عُماني غير صحيح" : "Invalid Omani phone number";
    }
    return e;
  }

  async function handleSubmit() {
    if (submitting) return; // guard against duplicate submissions while in flight
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitError(null);
    setSubmitting(true);
    // Honest success: createOffer returns the new row id on success, or null on
    // ANY failure (not signed in, non-real listing id, RLS, DB error). Only show
    // success when a row was actually created — never fake it (FP12 #2).
    const offerId = userId
      ? await createOffer({
          listingId: listing.id,
          agentId,
          userId,
          offerAmountOmr: numAmount,
          askingPriceOmr: listing.price,
          financingType: financing,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          notes: notes.trim() || undefined,
        }).catch((err) => {
          console.error("[MakeOffer] createOffer error:", err);
          return null;
        })
      : null;
    setSubmitting(false);
    if (!offerId) {
      setSubmitError(
        isAr
          ? "تعذّر إرسال العرض. تأكد من تسجيل الدخول وحاول مرة أخرى."
          : "Couldn't submit your offer. Please make sure you're signed in and try again."
      );
      return;
    }
    setStep("success");
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep("form");
      setErrors({});
      setSubmitError(null);
    }, 300);
  }

  const priceDiffText = isBelow
    ? isAr
      ? `أقل من السعر المطلوب بـ ${formatNumber(Math.abs(parseFloat(diffPct)), locale)}%`
      : `${formatNumber(Math.abs(parseFloat(diffPct)), locale)}% below asking price`
    : isAbove
    ? isAr
      ? `أعلى من السعر المطلوب بـ ${formatNumber(parseFloat(diffPct), locale)}%`
      : `${formatNumber(parseFloat(diffPct), locale)}% above asking price`
    : isAr
    ? "يساوي السعر المطلوب"
    : "Matches asking price";

  return (
    <BottomSheet open={open} onClose={handleClose} title={t("listing.actions.makeOffer")}>
      {step === "success" ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E6F0EF] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#102A43]">
            {isAr ? "تم إرسال عرضك بنجاح" : "Your offer was submitted!"}
          </h3>
          <p className="text-sm text-[#627D98]">
            {isAr ? "سيراجع المعلن عرضك ويتواصل معك قريباً" : "The advertiser will review your offer and contact you soon."}
          </p>
          <div className="w-full bg-[#E6F0EF] rounded-2xl p-4 text-sm text-start" dir={dir}>
            <p className="text-[#627D98] mb-1">
              {isAr ? "مبلغ العرض:" : "Offer amount:"}
            </p>
            <p className="text-xl font-bold text-[#0A3C36]">
              {formatCurrency(numAmount, locale)}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-[#0A3C36] text-white font-semibold text-sm"
          >
            {isAr ? "حسناً" : "OK"}
          </button>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-4" dir={dir}>
          {/* Price reference — hidden when the owner chose "Contact for price" (FP17C-1) */}
          <div className="bg-[#F0F4F8] rounded-xl px-4 py-3">
            <p className="text-xs text-[#627D98] mb-1">
              {isAr ? "السعر المطلوب" : "Asking price"}
            </p>
            <p className="text-base font-bold text-[#102A43]">
              {listing.isPriceHidden
                ? (isAr ? "تواصل للسعر" : "Contact for price")
                : formatCurrency(listing.price, locale)}
            </p>
          </div>

          {/* Offer amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#102A43]">
              {isAr ? "مبلغ العرض (ر.ع)" : "Offer amount (OMR)"}
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full h-12 bg-white border border-[#E2E8F0] rounded-xl px-4 text-lg font-bold text-[#102A43] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15"
              dir="ltr"
            />
            {errors.offerAmount && (
              <p className="text-xs text-[#C0392B]">{errors.offerAmount}</p>
            )}
            {numAmount > 0 && (
              <p className={`text-xs font-medium ${isBelow ? "text-[#C0392B]" : isAbove ? "text-[#0A3C36]" : "text-[#627D98]"}`}>
                {priceDiffText}
              </p>
            )}
          </div>

          {/* Financing type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#102A43]">
              {isAr ? "طريقة الدفع" : "Payment method"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FINANCING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFinancing(opt.value)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    financing === opt.value
                      ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                      : "bg-white text-[#102A43] border-[#E2E8F0]"
                  }`}
                >
                  {isAr ? opt.labelAr : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          <Input
            label={isAr ? "الاسم الكامل" : "Full name"}
            placeholder={isAr ? "محمد بن سالم..." : "John Smith..."}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label={isAr ? "رقم الهاتف" : "Phone number"}
            placeholder="+96891234567"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            dir="ltr"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#102A43]">
              {isAr ? "ملاحظات (اختياري)" : "Notes (optional)"}
            </label>
            <textarea
              placeholder={isAr ? "أي شروط أو تفاصيل إضافية..." : "Any additional terms or details..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15 resize-none"
            />
          </div>

          {submitError && (
            <div className="bg-[#FEF0EE] border border-[#C0392B]/30 rounded-xl px-4 py-3" role="alert">
              <p className="text-xs text-[#C0392B]">{submitError}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-[#0A3C36] text-white font-semibold text-sm disabled:bg-[#A0AEC0] disabled:cursor-not-allowed mb-safe"
          >
            {submitting
              ? t("addListing.common.submitting")
              : isAr ? "إرسال العرض" : "Submit Offer"}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
