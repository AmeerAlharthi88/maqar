"use client";

import { useState } from "react";
import type { Lead } from "@/types/lead";
import type { SmartReplyTrigger, SmartReplyResponse } from "@/lib/ai/types";
import type { AIErrorCode } from "@/lib/ai/types";
import { AIButton } from "./AIButton";
import { AILoadingState } from "./AILoadingState";
import { AIErrorState } from "./AIErrorState";
import { CopyToClipboardButton } from "./CopyToClipboardButton";
import { AIDisclaimer } from "./AIDisclaimer";

interface SmartReplyPanelProps {
  lead: Lead;
  onClose: () => void;
}

const TRIGGER_LABELS: { value: SmartReplyTrigger; labelAr: string }[] = [
  { value: "is_available",       labelAr: "هل لا يزال متاحاً؟" },
  { value: "request_visit",      labelAr: "طلب زيارة" },
  { value: "price_negotiable",   labelAr: "هل السعر قابل للتفاوض؟" },
  { value: "send_location",      labelAr: "إرسال الموقع" },
  { value: "financing_question", labelAr: "سؤال عن التمويل" },
  { value: "general",            labelAr: "رد عام" },
];

export function SmartReplyPanel({ lead, onClose }: SmartReplyPanelProps) {
  const [trigger, setTrigger] = useState<SmartReplyTrigger>("is_available");
  const [result, setResult] = useState<SmartReplyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<AIErrorCode | undefined>();

  async function generate() {
    setLoading(true);
    setErrorCode(undefined);
    setResult(null);

    try {
      const res = await fetch("/api/ai/smart-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trigger,
          listingTitleAr: lead.listingTitleAr,
          leadMessageAr:  lead.notes,
        }),
      });
      const data: SmartReplyResponse = await res.json();
      if (data.success) setResult(data);
      else setErrorCode(data.errorCode ?? "unknown");
    } catch {
      setErrorCode("provider_error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#C65D3B]/20 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#FBF0EB] border-b border-[#C65D3B]/15">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="2" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          <span className="text-xs font-bold text-[#C65D3B]">رد ذكي — {lead.customerNameAr}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#C65D3B]/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="2.5" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Trigger selector */}
        <div>
          <p className="text-[10px] font-bold text-[#A89480] mb-2">نوع رسالة العميل</p>
          <div className="flex flex-wrap gap-1.5">
            {TRIGGER_LABELS.map((t) => (
              <button
                key={t.value}
                onClick={() => { setTrigger(t.value); setResult(null); }}
                className={[
                  "px-3 py-1.5 text-[10px] font-semibold rounded-xl transition-colors",
                  trigger === t.value ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]",
                ].join(" ")}
              >
                {t.labelAr}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        {!loading && (
          <AIButton
            onClick={() => void generate()}
            label="توليد ردود مقترحة"
            loadingLabel="جاري التوليد..."
            loading={loading}
            variant="subtle"
            aria-label="توليد ردود واتساب ذكية"
          />
        )}

        {loading && <AILoadingState messageAr="يولّد الذكاء الاصطناعي ردوداً مناسبة..." compact />}
        {errorCode && !loading && <AIErrorState errorCode={errorCode} compact onRetry={() => void generate()} />}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-2">
            {result.isMockFallback && (
              <p className="text-[10px] text-[#C8860A] font-semibold">(وضع تجريبي — لا يوجد مفتاح API)</p>
            )}
            {(result.replies ?? []).map((reply, i) => (
              <div key={i} className="bg-[#FAF7F4] rounded-xl border border-[#F0EBE3] px-3 py-3">
                <p className="text-xs text-[#1E1E1E] leading-relaxed mb-2">{reply}</p>
                <CopyToClipboardButton
                  text={reply}
                  label="نسخ للواتساب"
                  copiedLabel="تم النسخ"
                  compact
                  aria-label={`نسخ الرد ${i + 1}`}
                />
              </div>
            ))}
            <AIDisclaimer textAr="هذه ردود مقترحة — راجعها قبل الإرسال وتأكد من دقة المعلومات." />
          </div>
        )}
      </div>
    </div>
  );
}
