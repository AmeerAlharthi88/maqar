"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPhoneOtp, signInWithPhone } from "@/lib/supabase/auth-actions";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "@/i18n/useTranslation";
import type { AppRole } from "@/config/roles";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_S = 60;

export function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const redirectTo = searchParams.get("redirectTo") ?? "/account";
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  const { setUser, setProfile } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
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
    setRedirecting(false);
    setError(null);

    const timeoutMsg = isAr
      ? "انتهت مهلة التحقق (١٥ ثانية). تحقق من اتصالك بالإنترنت وأعد المحاولة."
      : "Verification timed out (15s). Check your internet connection and try again.";

    const verifyTimeout = new Promise<{ user: null; session: null; error: { message: string } }>(
      (resolve) =>
        setTimeout(
          () => resolve({ user: null, session: null, error: { message: timeoutMsg } }),
          15_000
        )
    );

    const { user, error: authError } = await Promise.race([
      verifyPhoneOtp(phone, token),
      verifyTimeout,
    ]);

    if (authError || !user) {
      setError(
        authError?.message.startsWith("انتهت مهلة") ||
        authError?.message.startsWith("Verification timed out")
          ? authError.message
          : isAr
            ? "رمز التحقق غير صحيح أو منتهي الصلاحية. حاول مرة أخرى."
            : "Invalid or expired verification code. Please try again."
      );
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
      setIsVerifying(false);
      return;
    }

    const meta = user.user_metadata ?? {};
    const userFromMeta = {
      id: user.id,
      email: user.email,
      phone: user.phone ?? undefined,
      nameAr: meta.name_ar as string | undefined,
      role: ((meta.role as AppRole) ?? "user") as AppRole,
      isVerified: Boolean(meta.is_verified ?? false),
      avatarUrl: meta.avatar_url as string | undefined,
    };
    setUser(userFromMeta);
    // Verification succeeded — switch the indicator to "signing in" so the user
    // knows it worked while the profile loads + the redirect runs (FP6 #5).
    setRedirecting(true);

    const profileTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8_000));
    const profile = await Promise.race([getCurrentProfile(), profileTimeout]);
    setProfile(profile);
    // Sync role from DB: profiles table is source of truth.
    // user_metadata.role may be stale for manually-promoted admin/agent users.
    if (profile?.role) {
      setUser({ ...userFromMeta, role: profile.role });
    }

    // Deterministic redirect: only divert to onboarding when we actually have a
    // profile that is not yet onboarded. If the profile fetch failed or timed
    // out (profile === null), proceed to the requested destination instead of
    // misrouting an already-onboarded returning user into onboarding.
    if (profile && !profile.onboardingCompleted) {
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
    <div
      className="min-h-[calc(100svh-56px)] flex items-center justify-center px-4 py-10 bg-[#F8F9FA]"
    >
      <div className="w-full max-w-sm lg:bg-white lg:rounded-3xl lg:shadow-[0_4px_32px_0_rgb(10_60_54/0.10)] lg:border lg:border-[#E2E8F0] lg:p-8 flex flex-col items-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#0A3C36] flex items-center justify-center mb-5">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#102A43] mb-1">{t("auth.otp.title")}</h1>
        <p className="text-sm text-[#627D98] text-center mb-2 max-w-xs leading-relaxed">
          {t("auth.otp.subtitle", { phone: maskedPhone || phone })}
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
              disabled={isVerifying}
              className={[
                "w-11 h-14 text-center text-xl font-bold rounded-2xl border-2 bg-white outline-none transition-colors",
                d
                  ? "border-[#0A3C36] text-[#0A3C36]"
                  : "border-[#E2E8F0] text-[#102A43]",
                "focus:border-[#0A3C36] disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
              aria-label={`${t("auth.otp.digitLabel")} ${i + 1}`}
              autoComplete="one-time-code"
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-xs bg-[#FEF0EE] border border-[#C0392B]/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-[#C0392B] text-center">{error}</p>
          </div>
        )}

        {/* Verify button */}
        {digits.every((d) => d !== "") && !isVerifying && (
          <button
            onClick={() => submit(digits.join(""))}
            className="w-full max-w-xs py-3.5 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm mb-4 hover:bg-[#082E29]"
          >
            {t("auth.otp.verify")}
          </button>
        )}

        {isVerifying && (
          <div className="flex items-center gap-2 text-sm text-[#627D98] mb-4" role="status" aria-live="polite">
            <span className="w-4 h-4 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
            {redirecting
              ? (isAr ? "تم التحقق، جاري تسجيل الدخول..." : "Verified — signing you in...")
              : t("auth.otp.verifying")}
          </div>
        )}

        {/* Resend */}
        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-xs text-[#627D98]">
              {t("auth.otp.resendIn", { seconds: String(cooldown) })}
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-xs font-semibold text-[#0A3C36] underline"
            >
              {t("auth.otp.resend")}
            </button>
          )}
        </div>

        {/* Change phone */}
        <button
          onClick={() => router.back()}
          className="mt-6 text-xs text-[#627D98] underline"
        >
          {t("auth.otp.changePhone")}
        </button>
      </div>
    </div>
  );
}
