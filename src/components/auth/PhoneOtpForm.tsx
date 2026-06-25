"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPhone, getSession } from "@/lib/supabase/auth-actions";
import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";

const OMAN_PREFIX = "+968";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return `${OMAN_PREFIX}${digits}`;
}

function isValidOmaniNumber(digits: string): boolean {
  return /^[79]\d{6,7}$/.test(digits) || /^[23]\d{6,7}$/.test(digits);
}

export function PhoneOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/account";
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  const [digits, setDigits] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techDetail, setTechDetail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Session-aware login: if a session already exists, never show a conflicting
  // login form — send the user to their destination. A full navigation guarantees
  // the (possibly just-set) session cookie reaches the middleware, which also
  // self-corrects the post-OTP redirect race where the server briefly bounces a
  // freshly-authenticated user back to /auth/login (FP7).
  useEffect(() => {
    let active = true;
    getSession()
      .then(({ session }) => {
        if (!active) return;
        if (session) window.location.replace(redirectTo);
        else setCheckingSession(false);
      })
      .catch(() => { if (active) setCheckingSession(false); });
    return () => { active = false; };
  }, [redirectTo]);

  const isValid = isValidOmaniNumber(digits);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setError(null);
    setTechDetail(null);
    setIsLoading(true);

    const phone = formatPhone(digits);

    const otpTimeout = new Promise<{ error: { message: string } }>(
      (resolve) =>
        setTimeout(
          () => resolve({ error: { message: "timeout" } }),
          15_000
        )
    );

    const { error: authError } = await Promise.race([signInWithPhone(phone), otpTimeout]);

    if (authError) {
      if (authError.message === "timeout") {
        setError(
          isAr
            ? "انتهت مهلة الاتصال. تحقق من اتصالك بالإنترنت وأعد المحاولة."
            : "Connection timed out. Check your internet connection and try again."
        );
      } else {
        const isRateLimitError =
          authError.message?.toLowerCase().includes("security purposes") ||
          authError.message?.toLowerCase().includes("rate limit") ||
          authError.message?.toLowerCase().includes("only request this after");

        const isSmsProviderError =
          authError.message?.toLowerCase().includes("sms") ||
          authError.message?.toLowerCase().includes("provider") ||
          authError.message?.toLowerCase().includes("phone") ||
          authError.message?.toLowerCase().includes("otp") ||
          authError.message?.toLowerCase().includes("send");

        const waitMatch = authError.message?.match(/after\s+(\d+)\s+second/i);
        const waitSeconds = waitMatch ? parseInt(waitMatch[1], 10) : null;

        if (isRateLimitError) {
          setError(
            waitSeconds && waitSeconds > 5
              ? isAr
                ? `يرجى الانتظار ${waitSeconds} ثانية ثم أعد المحاولة.`
                : `Please wait ${waitSeconds} seconds then try again.`
              : isAr
                ? "يرجى الانتظار لحظة ثم أعد المحاولة."
                : "Please wait a moment then try again."
          );
        } else {
          setError(
            isSmsProviderError
              ? isAr
                ? "تعذّر إرسال رمز التحقق. تأكد من إعداد مزود الرسائل أو استخدم رقم اختبار مفعّل."
                : "Failed to send verification code. Check SMS provider config or use an enabled test number."
              : isAr
                ? "تعذّر إرسال رمز التحقق. تحقق من رقم الجوال وأعد المحاولة."
                : "Failed to send verification code. Check your number and try again."
          );
        }
        if (process.env.NODE_ENV !== "production") {
          setTechDetail(authError.message);
        }
      }
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams({ phone, redirectTo });
    router.push(`/auth/verify?${params.toString()}`);
  }

  // While checking for an existing session, show a brief spinner instead of the
  // login form so an already-authenticated user never sees a conflicting form.
  if (checkingSession) {
    return (
      <div className="min-h-[calc(100svh-56px)] flex items-center justify-center bg-[#F8F9FA]" role="status" aria-live="polite">
        <span className="w-8 h-8 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100svh-56px)] flex items-center justify-center px-4 py-10 bg-[#F8F9FA]"
    >
      <div className="w-full max-w-sm lg:bg-white lg:rounded-3xl lg:shadow-[0_4px_32px_0_rgb(10_60_54/0.10)] lg:border lg:border-[#E2E8F0] lg:p-8 flex flex-col items-center">

        {/* Brand logo — mobile only. Tappable so users can leave auth for the
            main page without the browser back button (FP9). On desktop the
            AppShell header logo already provides this. */}
        <Link href={ROUTES.home} aria-label={t("nav.home")} className="lg:hidden mb-6 rounded-2xl active:scale-95 transition-transform">
          <MaqarLogo variant="stacked" size="md" color="brand" />
        </Link>

        {/* Phone icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#0A3C36] flex items-center justify-center mb-5">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16a2 2 0 0 1 .5.92z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#102A43] mb-1 text-center">{t("auth.login.title")}</h1>
        <p className="text-sm text-[#627D98] text-center mb-7 max-w-xs leading-relaxed">
          {t("auth.login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Phone input */}
          <div>
            <label className="block text-xs font-semibold text-[#627D98] mb-1.5">
              {t("auth.login.phoneLabel")}
            </label>
            <div className="flex items-center border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden focus-within:border-[#0A3C36] focus-within:shadow-[0_0_0_3px_rgba(10,60,54,0.10)] transition-all">
              <span className="flex items-center gap-1 px-3 py-3.5 border-e border-[#E2E8F0] shrink-0 bg-[#F8F9FA]">
                <span className="text-[10px] font-medium text-[#627D98] leading-none">OM</span>
                <span className="text-sm font-bold text-[#102A43]">+968</span>
              </span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t("auth.login.phonePlaceholder")}
                value={digits}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setDigits(val);
                  setError(null);
                }}
                className="flex-1 py-3.5 px-3 text-sm text-[#102A43] placeholder-[#627D98] bg-transparent outline-none"
                autoComplete="tel-national"
                autoFocus
                dir="ltr"
              />
            </div>
            {digits.length > 0 && !isValid && (
              <p className="mt-1 text-xs text-[#C0392B]">
                {t("auth.login.invalidPhone")}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#FEF0EE] border border-[#C0392B]/30 rounded-xl px-4 py-3 space-y-1">
              <p className="text-xs text-[#C0392B]">{error}</p>
              {techDetail && (
                <p className="text-[11px] text-[#627D98] font-mono break-all">{techDetail}</p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors
              bg-[#0A3C36] hover:bg-[#082E29]
              disabled:bg-[#A0AEC0] disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                {t("auth.login.sending")}
              </>
            ) : (
              t("auth.login.submit")
            )}
          </button>
        </form>

        <p className="mt-6 text-[11px] text-[#627D98] text-center max-w-xs leading-relaxed">
          {t("auth.login.termsText")}{" "}
          <a href="/terms" className="underline hover:text-[#0A3C36]">
            {t("auth.login.termsLink")}
          </a>
          {t("auth.login.termsAnd")}
          <a href="/privacy" className="underline hover:text-[#0A3C36]">
            {t("auth.login.privacyLink")}
          </a>
        </p>
      </div>
    </div>
  );
}
