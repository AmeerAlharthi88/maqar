"use client";

import type { AIErrorCode } from "@/lib/ai/types";

interface AIErrorStateProps {
  errorCode?: AIErrorCode;
  onRetry?: () => void;
  compact?: boolean;
}

const ERROR_MESSAGES: Partial<Record<AIErrorCode, string>> = {
  missing_api_key:     "ميزة الذكاء الاصطناعي غير مُفعّلة في هذه البيئة.",
  rate_limit:          "تم الوصول إلى حد المعالجة. حاول مجدداً بعد قليل.",
  usage_limit_reached: "لقد استنفدت حصتك اليومية من الذكاء الاصطناعي.",
  invalid_input:       "البيانات المُدخلة غير صالحة. تحقق من الحقول وأعد المحاولة.",
  timeout:             "انتهى وقت الاستجابة. تحقق من اتصالك وأعد المحاولة.",
  auth_required:       "تسجيل الدخول مطلوب لاستخدام هذه الميزة.",
  provider_error:      "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً.",
  unknown:             "حدث خطأ غير متوقع. حاول مجدداً.",
};

export function AIErrorState({ errorCode, onRetry, compact = false }: AIErrorStateProps) {
  const message = (errorCode ? ERROR_MESSAGES[errorCode] : null) ?? ERROR_MESSAGES.unknown!;

  if (compact) {
    return (
      <div className="flex items-center gap-2" dir="rtl">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-xs text-[#C0392B]">{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="text-xs font-semibold text-[#C0392B] underline underline-offset-2 ml-1">
            إعادة المحاولة
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-[#FEF0EE] border border-[#C0392B]/25 rounded-2xl px-4 py-4 flex items-start gap-3"
      dir="rtl"
      role="alert"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" className="flex-shrink-0 mt-0.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#C0392B] mb-0.5">تعذّر استخدام الذكاء الاصطناعي</p>
        <p className="text-xs text-[#627D98]">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-[#C0392B] underline underline-offset-2"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
}
