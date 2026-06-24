"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "@/i18n/useTranslation";

// ── Dev bypass — clearly marked ───────────────────────────────────────────────
const IS_DEV = process.env.NODE_ENV === "development";

export function LoginRequired() {
  const { setUser } = useAuthStore();
  const { locale, dir } = useTranslation();
  const isAr = locale === "ar";

  function handleDevBypass() {
    setUser({
      id: "demo-user-1",
      nameAr: "مستخدم تجريبي",
      email: "demo@maqar.om",
      role: "user",
      isVerified: false,
    });
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center" dir={dir}>
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#E6F0EF] flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[#102A43] mb-2">
        {isAr ? "تسجيل الدخول مطلوب" : "Sign in required"}
      </h1>
      <p className="text-sm text-[#627D98] max-w-xs mb-8 leading-relaxed">
        {isAr
          ? "لنشر إعلان عقاري في مقر، يجب تسجيل الدخول أولاً. سجّل دخولك للمتابعة أو تصفّح العقارات بحرية."
          : "To post a property listing on Maqar, please sign in first. Sign in to continue, or browse listings freely."}
      </p>

      {/* Actions */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <Link
          href={ROUTES.login}
          className="w-full py-3.5 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm text-center hover:bg-[#082E29] transition-colors"
        >
          {isAr ? "تسجيل الدخول" : "Sign in"}
        </Link>
        <Link
          href={ROUTES.home}
          className="w-full py-3 rounded-2xl bg-[#F0F4F8] text-[#102A43] font-semibold text-sm text-center border border-[#E2E8F0]"
        >
          {isAr ? "تصفح العقارات" : "Browse listings"}
        </Link>
      </div>

      {/* Dev bypass — only in development */}
      {IS_DEV && (
        <div className="mt-10 p-4 border border-dashed border-[#0A3C36]/40 rounded-2xl bg-[#E6F0EF]/50 max-w-xs w-full">
          <p className="text-xs text-[#0A3C36] font-semibold mb-2">
            {isAr ? "وضع التطوير فقط" : "Development only"}
          </p>
          <p className="text-xs text-[#627D98] mb-3">
            {isAr ? "هذا الزر للاختبار فقط ولن يظهر في الإنتاج." : "This button is for testing only and never ships to production."}
          </p>
          <button
            onClick={handleDevBypass}
            className="w-full py-2 rounded-xl bg-[#0A3C36]/10 text-[#0A3C36] text-xs font-semibold border border-[#0A3C36]/30"
          >
            {isAr ? "متابعة كمستخدم تجريبي" : "Continue as demo user"}
          </button>
        </div>
      )}
    </div>
  );
}
