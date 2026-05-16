"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import type { Listing } from "@/types/listing";

interface BookViewingModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

const TIME_SLOTS = [
  "٩:٠٠ ص", "١٠:٠٠ ص", "١١:٠٠ ص",
  "١٢:٠٠ م", "٢:٠٠ م", "٤:٠٠ م",
  "٥:٠٠ م", "٦:٠٠ م",
];

type Step = "form" | "success";

export function BookViewingModal({ open, onClose, listing }: BookViewingModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^\+?9689\d{7}$/.test(phone.replace(/\s/g, ""))) {
      e.phone = "رقم عُماني غير صحيح (مثال: +96891234567)";
    }
    if (!date) e.date = "التاريخ مطلوب";
    if (!time) e.time = "يرجى اختيار وقت";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate
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

  // Min date: today
  const today = new Date().toISOString().split("T")[0];

  return (
    <BottomSheet open={open} onClose={handleClose} title="حجز موعد معاينة">
      {step === "success" ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EDF4ED] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B8C5A" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E]">تم تأكيد طلب المعاينة</h3>
          <p className="text-sm text-[#7A6B5E]">
            سيتواصل معك المعلن قريباً لتأكيد الموعد
          </p>
          <div className="w-full bg-[#F5F0EA] rounded-2xl p-4 text-sm text-right" dir="rtl">
            <p className="text-[#7A6B5E] mb-1">العقار:</p>
            <p className="font-semibold text-[#1E1E1E] mb-3">{listing.titleAr}</p>
            <p className="text-[#7A6B5E] mb-1">التاريخ والوقت:</p>
            <p className="font-semibold text-[#1E1E1E]">{date} — {time}</p>
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
          {/* Listing title reminder */}
          <div className="bg-[#F5F0EA] rounded-xl px-3 py-2 text-xs text-[#7A6B5E]">
            <span className="font-semibold text-[#1E1E1E]">{listing.titleAr}</span>
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
            <label className="text-sm font-medium text-[#1E1E1E]">تاريخ المعاينة</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 bg-white border border-[#E8DDD0] rounded-xl px-3.5 text-[#1E1E1E] outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15"
              dir="ltr"
            />
            {errors.date && <p className="text-xs text-[#C0392B]">{errors.date}</p>}
          </div>

          {/* Time slots */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">الوقت المفضل</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    time === slot
                      ? "bg-[#C65D3B] text-white border-[#C65D3B]"
                      : "bg-white text-[#3D3330] border-[#E8DDD0]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.time && <p className="text-xs text-[#C0392B]">{errors.time}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">ملاحظات (اختياري)</label>
            <textarea
              placeholder="أي تعليمات أو أسئلة..."
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
            {submitting ? "جاري الإرسال..." : "تأكيد طلب المعاينة"}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
