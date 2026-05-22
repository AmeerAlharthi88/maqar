"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The path to redirect to after login (default: current page) */
  redirectTo?: string;
  /** Reason copy shown inside the modal */
  reasonAr?: string;
}

export function LoginRequiredModal({
  isOpen,
  onClose,
  redirectTo,
  reasonAr = "لمتابعة هذه العملية يجب تسجيل الدخول أولاً.",
}: LoginRequiredModalProps) {
  if (!isOpen) return null;

  const loginHref = redirectTo
    ? `${ROUTES.login}?redirectTo=${encodeURIComponent(redirectTo)}`
    : ROUTES.login;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl px-5 py-6 safe-area-bottom"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-[#E2E8F0] mx-auto mb-5" />

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[#0A3C36] flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-[#102A43] text-center mb-2">
          تسجيل الدخول مطلوب
        </h2>
        <p className="text-sm text-[#627D98] text-center mb-6 leading-relaxed">
          {reasonAr}
        </p>

        <div className="space-y-3">
          <Link
            href={loginHref}
            className="block w-full py-3.5 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm text-center hover:bg-[#082E29]"
          >
            تسجيل الدخول
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#F0F4F8] text-[#102A43] font-semibold text-sm border border-[#E2E8F0]"
          >
            ليس الآن
          </button>
        </div>
      </div>
    </div>
  );
}
