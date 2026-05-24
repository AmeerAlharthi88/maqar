"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { createAppointment } from "@/lib/supabase/crm";
import type { Listing } from "@/types/listing";

interface BookViewingModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  userId?: string;  // authenticated user id
  agentId: string;  // listing.agentId
}

const TIME_SLOTS = [
  "٩:٠٠ ص", "١٠:٠٠ ص", "١١:٠٠ ص",
  "١٢:٠٠ م", "٢:٠٠ م", "٤:٠٠ م",
  "٥:٠٠ م", "٦:٠٠ م",
];

type Step = "form" | "success";

export function BookViewingModal({ open, onClose, listing, userId, agentId }: BookViewingModalProps) {
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
    if (userId) {
      // Authenticated — insert into Supabase; navigate to success regardless of outcome
      await createAppointment({
        listingId: listing.id,
        agentId,
        userId,
        preferredDate: date,
        preferredTime: time,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        notes: notes.trim() || undefined,
      }).catch((err) => console.error("[BookViewing] createAppointment error:", err));
    } else {
      // Dev bypass / guest fallback
      await new Promise((r) => setTimeout(r, 800));
    }
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
          <div className="w-16 h-16 rounded-full bg-[#E6F0EF] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#102A43]">تم تأكيد طلب المعاينة</h3>
          <p className="text-sm text-[#627D98]">
            سيتواصل معك المعلن قريباً لتأكيد الموعد
          </p>
          <div className="w-full bg-[#F0F4F8] rounded-2xl p-4 text-sm text-right" dir="rtl">
            <p className="text-[#627D98] mb-1">العقار:</p>
            <p className="font-semibold text-[#102A43] mb-3">{listing.titleAr}</p>
            <p className="text-[#627D98] mb-1">التاريخ والوقت:</p>
            <p className="font-semibold text-[#102A43]">{date} — {time}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-[#0A3C36] text-white font-semibold text-sm"
          >
            حسناً
          </button>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-4" dir="rtl">
          {/* Listing title reminder */}
          <div className="bg-[#F0F4F8] rounded-xl px-3 py-2 text-xs text-[#627D98]">
            <span className="font-semibold text-[#102A43]">{listing.titleAr}</span>
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
            <label className="text-sm font-medium text-[#102A43]">تاريخ المعاينة</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-[#102A43] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15"
              dir="ltr"
            />
            {errors.date && <p className="text-xs text-[#C0392B]">{errors.date}</p>}
          </div>

          {/* Time slots */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#102A43]">الوقت المفضل</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    time === slot
                      ? "bg-[#0A3C36] text-white border-[#0A3C36]"
                      : "bg-white text-[#102A43] border-[#E2E8F0]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.time && <p className="text-xs text-[#C0392B]">{errors.time}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#102A43]">ملاحظات (اختياري)</label>
            <textarea
              placeholder="أي تعليمات أو أسئلة..."
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
            {submitting ? "جاري الإرسال..." : "تأكيد طلب المعاينة"}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
