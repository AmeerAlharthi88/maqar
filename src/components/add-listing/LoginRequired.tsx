"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth.store";

// ── Dev bypass — clearly marked ───────────────────────────────────────────────
const IS_DEV = process.env.NODE_ENV === "development";

export function LoginRequired() {
  const { setUser } = useAuthStore();

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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center" dir="rtl">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#F5F0EA] flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[#1E1E1E] mb-2">تسجيل الدخول مطلوب</h1>
      <p className="text-sm text-[#7A6B5E] max-w-xs mb-8 leading-relaxed">
        لنشر إعلان عقاري في مقر، يجب تسجيل الدخول أولاً. سجّل دخولك للمتابعة أو تصفّح العقارات بحرية.
      </p>

      {/* Actions */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <Link
          href={ROUTES.login}
          className="w-full py-3.5 rounded-2xl bg-[#C65D3B] text-white font-bold text-sm text-center"
        >
          تسجيل الدخول
        </Link>
        <Link
          href={ROUTES.home}
          className="w-full py-3 rounded-2xl bg-[#F5F0EA] text-[#1E1E1E] font-semibold text-sm text-center border border-[#E8DDD0]"
        >
          تصفح العقارات
        </Link>
      </div>

      {/* Dev bypass — only in development */}
      {IS_DEV && (
        <div className="mt-10 p-4 border border-dashed border-[#C65D3B]/40 rounded-2xl bg-[#FBF0EB]/50 max-w-xs w-full">
          <p className="text-xs text-[#C65D3B] font-semibold mb-2">وضع التطوير فقط</p>
          <p className="text-xs text-[#7A6B5E] mb-3">
            هذا الزر للاختبار فقط ولن يظهر في الإنتاج.
          </p>
          <button
            onClick={handleDevBypass}
            className="w-full py-2 rounded-xl bg-[#C65D3B]/10 text-[#C65D3B] text-xs font-semibold border border-[#C65D3B]/30"
          >
            متابعة كمستخدم تجريبي
          </button>
        </div>
      )}
    </div>
  );
}
