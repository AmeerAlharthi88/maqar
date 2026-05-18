"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPhone } from "@/lib/supabase/auth-actions";

const OMAN_PREFIX = "+968";

function formatPhone(raw: string): string {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, "");
  return `${OMAN_PREFIX}${digits}`;
}

function isValidOmaniNumber(digits: string): boolean {
  // Omani mobile numbers: 7 or 9 digits starting with 7, 9, or occasionally 2
  return /^[79]\d{6,7}$/.test(digits) || /^[23]\d{6,7}$/.test(digits);
}

export function PhoneOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/account";

  const [digits, setDigits] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = isValidOmaniNumber(digits);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setError(null);
    setIsLoading(true);

    const phone = formatPhone(digits);

    // Race signInWithPhone against a 15-second timeout
    const otpTimeout = new Promise<{ error: { message: string } }>(
      (resolve) =>
        setTimeout(
          () => resolve({ error: { message: "timeout" } }),
          15_000
        )
    );

    const { error: authError } = await Promise.race([signInWithPhone(phone), otpTimeout]);

    if (authError) {
      setError(
        authError.message === "timeout"
          ? "انتهت مهلة الاتصال. تحقق من اتصالك بالإنترنت وأعد المحاولة."
          : "تعذّر إرسال رمز التحقق. تأكد من رقم الجوال وحاول مرة أخرى."
      );
      setIsLoading(false);
      return;
    }

    // Navigate to verify page, carry phone + redirectTo
    const params = new URLSearchParams({
      phone,
      redirectTo,
    });
    router.push(`/auth/verify?${params.toString()}`);
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6" dir="rtl">
      {/* Logo mark */}
      <div className="w-16 h-16 rounded-2xl bg-[#C65D3B] flex items-center justify-center mb-6">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16a2 2 0 0 1 .5.92z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[#1E1E1E] mb-1">أهلاً بك في مقر</h1>
      <p className="text-sm text-[#7A6B5E] text-center mb-8 max-w-xs leading-relaxed">
        أدخل رقم جوالك العُماني وسنرسل لك رمز التحقق فوراً
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        {/* Phone input */}
        <div>
          <label className="block text-xs font-semibold text-[#7A6B5E] mb-1.5">
            رقم الجوال
          </label>
          <div className="flex items-center gap-2 border border-[#E8DDD0] rounded-2xl bg-white overflow-hidden focus-within:border-[#C65D3B] transition-colors">
            {/* Country prefix */}
            <span className="flex items-center gap-1.5 px-3 py-3.5 border-l border-[#E8DDD0] text-sm font-bold text-[#1E1E1E] shrink-0 bg-[#FAF7F4]">
              🇴🇲 +968
            </span>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="91234567"
              value={digits}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                setDigits(val);
                setError(null);
              }}
              className="flex-1 py-3.5 px-3 text-sm text-[#1E1E1E] placeholder-[#C4B5A5] bg-transparent outline-none"
              autoComplete="tel-national"
              autoFocus
            />
          </div>
          {digits.length > 0 && !isValid && (
            <p className="mt-1 text-xs text-[#C65D3B]">رقم الجوال غير صحيح</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#FBF0EB] border border-[#C65D3B]/30 rounded-xl px-4 py-3">
            <p className="text-xs text-[#C65D3B]">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full py-3.5 rounded-2xl bg-[#C65D3B] text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            "إرسال رمز التحقق"
          )}
        </button>
      </form>

      <p className="mt-6 text-[11px] text-[#A89480] text-center max-w-xs leading-relaxed">
        بتسجيل دخولك توافق على{" "}
        <a href="/terms" className="underline">شروط الاستخدام</a>
        {" "}و
        <a href="/privacy" className="underline">سياسة الخصوصية</a>
      </p>
    </div>
  );
}
