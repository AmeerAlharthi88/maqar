"use client";

// ── CheckoutModal — mock checkout bottom sheet ────────────────────────────────
// MOCK ONLY — no real payment is processed.
// In production: redirect to payment provider checkout URL (server-initiated).

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toArabicNumerals, formatOMR } from "@/lib/formatters";
import type { PlanId, AddOnType } from "@/lib/payments/types";
import { PLAN_PRICES, PLAN_NAMES_AR, ADDON_PRICES, ADDON_LABELS_AR, calculateAddOnPrice } from "@/lib/payments/plans";
import { mockCheckoutSession } from "@/lib/payments/mock-provider";

type CheckoutState = "idle" | "processing" | "success" | "error";

interface CheckoutModalProps {
  planId?: PlanId;
  addOnType?: AddOnType;
  listingId?: string;
  durationWeeks?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CheckoutModal({
  planId,
  addOnType,
  listingId,
  durationWeeks = 1,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [state, setState] = useState<CheckoutState>("idle");
  const [selectedWeeks, setSelectedWeeks] = useState(durationWeeks);

  // Trap focus and handle Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const title = planId
    ? `الترقية إلى ${PLAN_NAMES_AR[planId]}`
    : addOnType
    ? ADDON_LABELS_AR[addOnType]
    : "إتمام الشراء";

  const amount = planId
    ? PLAN_PRICES[planId]
    : addOnType
    ? calculateAddOnPrice(addOnType, selectedWeeks)
    : 0;

  async function handleCheckout() {
    setState("processing");
    try {
      await mockCheckoutSession({ planId, addOnType, listingId, durationWeeks: selectedWeeks });
      setState("success");
      onSuccess?.();
    } catch {
      setState("error");
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/40"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed bottom-0 start-0 end-0 z-[201] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#E8DDD0] rounded-full" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {/* Mock notice */}
          <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-3 py-2 mb-4">
            <p className="text-[10px] text-[#C8860A] font-semibold">
              وضع المعاينة — لا تتم أي عملية دفع حقيقية
            </p>
          </div>

          {state === "success" ? (
            /* Success state */
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#EDF4ED] flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B8C5A" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-base font-bold text-[#1E1E1E] mb-2">
                تم بنجاح (وهمي)
              </p>
              <p className="text-sm text-[#7A6B5E] mb-6">
                في الإنتاج، يتم التفعيل بعد تأكيد مزود الدفع عبر Webhook.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#5B8C5A] text-white text-sm font-bold"
              >
                إغلاق
              </button>
            </div>
          ) : state === "error" ? (
            /* Error state */
            <div className="text-center py-6">
              <p className="text-base font-bold text-[#C0392B] mb-2">
                فشل الإجراء
              </p>
              <p className="text-sm text-[#7A6B5E] mb-6">
                حدث خطأ غير متوقع. يُرجى المحاولة مجدداً.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setState("idle")}
                  className="flex-1 py-3 rounded-2xl bg-[#C65D3B] text-white text-sm font-bold"
                >
                  إعادة المحاولة
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-[#F5F0EA] text-[#7A6B5E] text-sm font-semibold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          ) : (
            /* Idle / processing state */
            <>
              <h2 className="text-base font-bold text-[#1E1E1E] mb-1">{title}</h2>

              {/* Duration selector for add-ons */}
              {addOnType === "featured_listing" && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#1E1E1E] mb-2">
                    مدة الإعلان المميز
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 4].map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeeks(w)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors",
                          selectedWeeks === w
                            ? "bg-[#C65D3B] text-white border-[#C65D3B]"
                            : "bg-white text-[#1E1E1E] border-[#E8DDD0]"
                        )}
                        aria-pressed={selectedWeeks === w}
                      >
                        {toArabicNumerals(w)} {w === 1 ? "أسبوع" : "أسابيع"}
                        <span className="block text-[10px] font-normal mt-0.5">
                          {formatOMR(ADDON_PRICES["featured_listing"] * w, { arabic: true })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price summary */}
              <div className="bg-[#FAF7F4] rounded-2xl p-4 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#7A6B5E]">المبلغ المستحق</span>
                  <span className="text-lg font-bold text-[#1E1E1E]">
                    {amount === 0 ? "مجاني" : formatOMR(amount, { arabic: true })}
                    {planId && amount > 0 && (
                      <span className="text-xs font-normal text-[#A89480]"> / شهر</span>
                    )}
                  </span>
                </div>
                {addOnType && (
                  <p className="text-[10px] text-[#A89480] mt-1">
                    {selectedWeeks} {selectedWeeks === 1 ? "أسبوع" : "أسابيع"} ×{" "}
                    {formatOMR(ADDON_PRICES[addOnType], { arabic: true })}
                  </p>
                )}
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-[#A89480] mb-4 leading-relaxed">
                التحقق الفعلي يتم عبر مزود الدفع من جهة الخادم فقط. لا يُعتمد على حالة الدفع من جهة العميل.
              </p>

              {/* CTA */}
              <button
                onClick={() => void handleCheckout()}
                disabled={state === "processing"}
                className={cn(
                  "w-full py-3.5 rounded-2xl text-sm font-bold transition-colors",
                  state === "processing"
                    ? "bg-[#C65D3B]/60 text-white cursor-not-allowed"
                    : "bg-[#C65D3B] text-white"
                )}
                aria-busy={state === "processing"}
              >
                {state === "processing" ? "جاري المعالجة..." : `تأكيد الدفع (تجريبي)`}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 mt-2 text-sm text-[#7A6B5E] font-semibold"
                aria-label="إلغاء"
              >
                إلغاء
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
