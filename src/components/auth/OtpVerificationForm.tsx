"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPhoneOtp, signInWithPhone } from "@/lib/supabase/auth-actions";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { useAuthStore } from "@/store/auth.store";
import type { AppRole } from "@/config/roles";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_S = 60;

export function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const redirectTo = searchParams.get("redirectTo") ?? "/account";

  const { setUser, setProfile } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);

    if (char && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }

    // Auto-submit when all filled
    if (char && next.every((d) => d !== "")) {
      submit(next.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === "ArrowLeft" && index < OTP_LENGTH - 1) focusInput(index + 1);
    if (e.key === "ArrowRight" && index > 0) focusInput(index - 1);
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { if (i < OTP_LENGTH) next[i] = ch; });
    setDigits(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
    if (pasted.length === OTP_LENGTH) submit(pasted);
  }

  async function submit(token: string) {
    if (isVerifying || !phone) return;
    setIsVerifying(true);
    setError(null);

    const { user, error: authError } = await verifyPhoneOtp(phone, token);

    if (authError || !user) {
      setError("رمز التحقق غير صحيح أو منتهي الصلاحية. حاول مرة أخرى.");
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
      setIsVerifying(false);
      return;
    }

    // Sync user to store
    const meta = user.user_metadata ?? {};
    setUser({
      id: user.id,
      email: user.email,
      phone: user.phone ?? undefined,
      nameAr: meta.name_ar as string | undefined,
      role: ((meta.role as AppRole) ?? "user") as AppRole,
      isVerified: Boolean(meta.is_verified ?? false),
      avatarUrl: meta.avatar_url as string | undefined,
    });

    const profile = await getCurrentProfile();
    setProfile(profile);

    // Redirect: to onboarding if not completed, else to redirectTo
    if (!profile?.onboardingCompleted) {
      const params = new URLSearchParams({ redirectTo });
      router.replace(`/auth/onboarding?${params.toString()}`);
    } else {
      router.replace(redirectTo);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || !phone) return;
    await signInWithPhone(phone);
    setCooldown(RESEND_COOLDOWN_S);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(null);
    focusInput(0);
  }

  const maskedPhone = phone.replace(/(\+968)(\d{2})(\d+)(\d{2})/, "$1 $2*****$4");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6" dir="rtl">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#F5F0EA] flex items-center justify-center mb-6">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.8">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[#1E1E1E] mb-1">أدخل رمز التحقق</h1>
      <p className="text-sm text-[#7A6B5E] text-center mb-2 max-w-xs leading-relaxed">
        أرسلنا رمزاً مكوناً من 6 أرقام إلى
      </p>
      <p className="text-sm font-bold text-[#1E1E1E] mb-8" dir="ltr">
        {maskedPhone || phone}
      </p>

      {/* OTP inputs */}
      <div className="flex gap-2 mb-6" dir="ltr" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={[
              "w-11 h-14 text-center text-xl font-bold rounded-2xl border-2 bg-white outline-none transition-colors",
              d
                ? "border-[#C65D3B] text-[#C65D3B]"
                : "border-[#E8DDD0] text-[#1E1E1E]",
              "focus:border-[#C65D3B]",
            ].join(" ")}
            autoComplete="one-time-code"
            autoFocus={i === 0}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-xs bg-[#FBF0EB] border border-[#C65D3B]/30 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-[#C65D3B] text-center">{error}</p>
        </div>
      )}

      {/* Verify button (for manual submit if auto-submit didn't fire) */}
      {digits.every((d) => d !== "") && !isVerifying && (
        <button
          onClick={() => submit(digits.join(""))}
          className="w-full max-w-xs py-3.5 rounded-2xl bg-[#C65D3B] text-white font-bold text-sm mb-4"
        >
          تحقق
        </button>
      )}

      {isVerifying && (
        <div className="flex items-center gap-2 text-sm text-[#7A6B5E] mb-4">
          <span className="w-4 h-4 rounded-full border-2 border-[#E8DDD0] border-t-[#C65D3B] animate-spin" />
          جاري التحقق...
        </div>
      )}

      {/* Resend */}
      <div className="text-center">
        {cooldown > 0 ? (
          <p className="text-xs text-[#A89480]">
            إعادة الإرسال بعد{" "}
            <span className="font-bold text-[#7A6B5E]">{cooldown}</span> ثانية
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-xs font-semibold text-[#C65D3B] underline"
          >
            إعادة إرسال الرمز
          </button>
        )}
      </div>

      {/* Change phone */}
      <button
        onClick={() => router.back()}
        className="mt-6 text-xs text-[#A89480] underline"
      >
        تغيير رقم الجوال
      </button>
    </div>
  );
}
