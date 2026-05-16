"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import type { Listing } from "@/types/listing";

interface MakeOfferModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

type FinancingType = "cash" | "mortgage" | "installment";
type Step = "form" | "success";

const FINANCING_OPTIONS: Array<{ value: FinancingType; labelAr: string }> = [
  { value: "cash", labelAr: "نقداً" },
  { value: "mortgage", labelAr: "تمويل بنكي" },
  { value: "installment", labelAr: "أقساط" },
];

export function MakeOfferModal({ open, onClose, listing }: MakeOfferModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [offerAmount, setOfferAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [financing, setFinancing] = useState<FinancingType>("cash");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const numAmount = parseFloat(offerAmount.replace(/,/g, "")) || 0;
  const diffPct =
    listing.price > 0
      ? (((numAmount - listing.price) / listing.price) * 100).toFixed(1)
      : "0";
  const isBelow = numAmount > 0 && numAmount < listing.price;
  const isAbove = numAmount > listing.price;

  function validate() {
    const e: Record<string, string> = {};
    if (!offerAmount.trim() || numAmount <= 0) e.offerAmount = "يرجى إدخال مبلغ العرض";
    else if (numAmount < listing.price * 0.5) e.offerAmount = "العرض أقل من ٥٠٪ من السعر المطلوب";
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^\+?9689\d{7}$/.test(phone.replace(/\s/g, ""))) {
      e.phone = "رقم عُماني غير صحيح";
    }
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setStep("success");
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep("form");
      setErrors({});
    }, 300);
  }

  return (
    <BottomSheet open={open} onClose={handleClose} title="تقديم عرض سعر">
      {step === "success" ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EDF4ED] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B8C5A" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E]">تم إرسال عرضك بنجاح</h3>
          <p className="text-sm text-[#7A6B5E]">
            سيراجع المعلن عرضك ويتواصل معك قريباً
          </p>
          <div className="w-full bg-[#F5F0EA] rounded-2xl p-4 text-sm text-right" dir="rtl">
            <p className="text-[#7A6B5E] mb-1">مبلغ العرض:</p>
            <p className="text-xl font-bold text-[#C65D3B]">
              {formatOMR(numAmount, { arabic: true })}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-[#C65D3B] text-white font-semibold text-sm"
          >
            حسناً
          </button>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-4" dir="rtl">
          {/* Price reference */}
          <div className="bg-[#F5F0EA] rounded-xl px-4 py-3">
            <p className="text-xs text-[#7A6B5E] mb-1">السعر المطلوب</p>
            <p className="text-base font-bold text-[#1E1E1E]">
              {formatOMR(listing.price, { arabic: true })}
            </p>
          </div>

          {/* Offer amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">مبلغ العرض (ر.ع)</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full h-12 bg-white border border-[#E8DDD0] rounded-xl px-4 text-lg font-bold text-[#1E1E1E] outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15"
              dir="ltr"
            />
            {errors.offerAmount && (
              <p className="text-xs text-[#C0392B]">{errors.offerAmount}</p>
            )}
            {numAmount > 0 && (
              <p className={`text-xs font-medium ${isBelow ? "text-[#C65D3B]" : isAbove ? "text-[#5B8C5A]" : "text-[#7A6B5E]"}`}>
                {isBelow
                  ? `أقل من السعر المطلوب بـ ${toArabicNumerals(Math.abs(parseFloat(diffPct)).toFixed(1))}%`
                  : isAbove
                  ? `أعلى من السعر المطلوب بـ ${toArabicNumerals(parseFloat(diffPct).toFixed(1))}%`
                  : "يساوي السعر المطلوب"}
              </p>
            )}
          </div>

          {/* Financing type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">طريقة الدفع</label>
            <div className="grid grid-cols-3 gap-2">
              {FINANCING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFinancing(opt.value)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    financing === opt.value
                      ? "bg-[#C65D3B] text-white border-[#C65D3B]"
                      : "bg-white text-[#3D3330] border-[#E8DDD0]"
                  }`}
                >
                  {opt.labelAr}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="الاسم الكامل"
            placeholder="محمد بن سالم..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="رقم الهاتف"
            placeholder="+96891234567"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            dir="ltr"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">ملاحظات (اختياري)</label>
            <textarea
              placeholder="أي شروط أو تفاصيل إضافية..."
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
            {submitting ? "جاري الإرسال..." : "إرسال العرض"}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
