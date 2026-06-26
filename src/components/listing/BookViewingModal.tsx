"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { createAppointment } from "@/lib/supabase/crm";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";

interface BookViewingModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  userId?: string;  // authenticated user id
  agentId: string;  // listing.agentId
}

const TIME_SLOTS_AR = [
  "٩:٠٠ ص", "١٠:٠٠ ص", "١١:٠٠ ص",
  "١٢:٠٠ م", "٢:٠٠ م", "٤:٠٠ م",
  "٥:٠٠ م", "٦:٠٠ م",
];

const TIME_SLOTS_EN = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "2:00 PM",  "4:00 PM",
  "5:00 PM",  "6:00 PM",
];

type Step = "form" | "success";

export function BookViewingModal({ open, onClose, listing, userId, agentId }: BookViewingModalProps) {
  const { t, locale, dir } = useTranslation();
  const isAr = locale === "ar";
  const timeSlots = isAr ? TIME_SLOTS_AR : TIME_SLOTS_EN;

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())
      e.name = isAr ? "الاسم مطلوب" : "Name is required";
    if (!phone.trim())
      e.phone = isAr ? "رقم الهاتف مطلوب" : "Phone number is required";
    else if (!/^\+?9689\d{7}$/.test(phone.replace(/\s/g, ""))) {
      e.phone = isAr ? "رقم عُماني غير صحيح (مثال: +96891234567)" : "Invalid Omani number (e.g. +96891234567)";
    }
    if (!date)
      e.date = isAr ? "التاريخ مطلوب" : "Date is required";
    if (!time)
      e.time = isAr ? "يرجى اختيار وقت" : "Please select a time";
    return e;
  }

  async function handleSubmit() {
    if (submitting) return; // guard against duplicate submissions while in flight
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    // Honest success: createAppointment returns the new row id on success, or
    // null on ANY failure. Only show success when a real row was created (FP12 #2).
    const apptId = userId
      ? await createAppointment({
          listingId: listing.id,
          agentId,
          userId,
          preferredDate: date,
          preferredTime: time,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          notes: notes.trim() || undefined,
        }).catch((err) => {
          console.error("[BookViewing] createAppointment error:", err);
          return null;
        })
      : null;
    setSubmitting(false);
    if (!apptId) {
      setSubmitError(
        isAr
          ? "تعذّر حجز الموعد. تأكد من تسجيل الدخول وحاول مرة أخرى."
          : "Couldn't book the viewing. Please make sure you're signed in and try again."
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

  // Min date: today
  const today = new Date().toISOString().split("T")[0];
  const listingTitle = isAr ? listing.titleAr : (listing.titleEn ?? listing.titleAr);

  return (
    <BottomSheet open={open} onClose={handleClose} title={t("listing.actions.bookViewing")}>
      {step === "success" ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E6F0EF] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#102A43]">
            {isAr ? "تم تأكيد طلب المعاينة" : "Viewing request confirmed!"}
          </h3>
          <p className="text-sm text-[#627D98]">
            {isAr
              ? "سيتواصل معك المعلن قريباً لتأكيد الموعد"
              : "The advertiser will contact you soon to confirm the appointment."}
          </p>
          <div className="w-full bg-[#F0F4F8] rounded-2xl p-4 text-sm text-start" dir={dir}>
            <p className="text-[#627D98] mb-1">
              {isAr ? "العقار:" : "Property:"}
            </p>
            <p className="font-semibold text-[#102A43] mb-3">{listingTitle}</p>
            <p className="text-[#627D98] mb-1">
              {isAr ? "التاريخ والوقت:" : "Date & time:"}
            </p>
            <p className="font-semibold text-[#102A43]">{date} — {time}</p>
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
          {/* Listing title reminder */}
          <div className="bg-[#F0F4F8] rounded-xl px-3 py-2 text-xs text-[#627D98]">
            <span className="font-semibold text-[#102A43]">{listingTitle}</span>
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
              {isAr ? "تاريخ المعاينة" : "Viewing date"}
            </label>
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
            <label className="text-sm font-medium text-[#102A43]">
              {isAr ? "الوقت المفضل" : "Preferred time"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
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
            <label className="text-sm font-medium text-[#102A43]">
              {isAr ? "ملاحظات (اختياري)" : "Notes (optional)"}
            </label>
            <textarea
              placeholder={isAr ? "أي تعليمات أو أسئلة..." : "Any instructions or questions..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15 resize-none"
            />
          </div>

          {submitError && (
            <div className="bg-[#FEF0EE] border border-[#C0392B]/30 rounded-xl px-4 py-3 mb-3" role="alert">
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
              : isAr ? "تأكيد طلب المعاينة" : "Confirm Viewing Request"}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
