"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createInitialProfile } from "@/lib/supabase/profile";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { useAuthStore } from "@/store/auth.store";
import type { AppRole } from "@/config/roles";

interface RoleOption {
  value: "user" | "agent";
  labelAr: string;
  descAr: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "user",
    labelAr: "باحث عن عقار",
    descAr: "أبحث عن شراء أو استئجار عقار",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    value: "agent",
    labelAr: "وسيط / مالك عقار",
    descAr: "أرغب في نشر إعلانات عقارية",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

export function ProfileCompletionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/account";

  const { updateProfileLocal, setProfile } = useAuthStore();

  const [nameAr, setNameAr] = useState("");
  const [role, setRole] = useState<"user" | "agent">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = nameAr.trim().length >= 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setError(null);
    setIsLoading(true);

    const { error: profileError } = await createInitialProfile(
      nameAr.trim(),
      role as AppRole
    );

    if (profileError) {
      setError("تعذّر حفظ البيانات. حاول مرة أخرى.");
      setIsLoading(false);
      return;
    }

    // Refresh profile in store
    const profile = await getCurrentProfile();
    if (profile) {
      setProfile(profile);
      updateProfileLocal({ nameAr: nameAr.trim(), role: role as AppRole, onboardingCompleted: true });
    }

    router.replace(redirectTo);
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6" dir="rtl">
      {/* Header */}
      <div className="w-16 h-16 rounded-2xl bg-[#C65D3B] flex items-center justify-center mb-6">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[#1E1E1E] mb-1">أكمل ملفك الشخصي</h1>
      <p className="text-sm text-[#7A6B5E] text-center mb-8 max-w-xs leading-relaxed">
        خطوة أخيرة لتفعيل حسابك في مقر
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#7A6B5E] mb-1.5">
            الاسم الكامل بالعربية
          </label>
          <input
            type="text"
            placeholder="مثال: أحمد بن سالم"
            value={nameAr}
            onChange={(e) => { setNameAr(e.target.value); setError(null); }}
            className="w-full px-4 py-3.5 rounded-2xl border border-[#E8DDD0] bg-white text-sm text-[#1E1E1E] placeholder-[#C4B5A5] outline-none focus:border-[#C65D3B] transition-colors"
            autoFocus
            autoComplete="name"
          />
          {nameAr.length > 0 && nameAr.trim().length < 2 && (
            <p className="mt-1 text-xs text-[#C65D3B]">الاسم قصير جداً</p>
          )}
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-xs font-semibold text-[#7A6B5E] mb-1.5">
            كيف ستستخدم مقر؟
          </label>
          <div className="space-y-2">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-right transition-all",
                  role === opt.value
                    ? "border-[#C65D3B] bg-[#FBF0EB]"
                    : "border-[#E8DDD0] bg-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex-shrink-0",
                    role === opt.value ? "text-[#C65D3B]" : "text-[#A89480]",
                  ].join(" ")}
                >
                  {opt.icon}
                </span>
                <span className="flex-1">
                  <span
                    className={[
                      "block text-sm font-bold",
                      role === opt.value ? "text-[#C65D3B]" : "text-[#1E1E1E]",
                    ].join(" ")}
                  >
                    {opt.labelAr}
                  </span>
                  <span className="block text-xs text-[#7A6B5E] mt-0.5">
                    {opt.descAr}
                  </span>
                </span>
                <span
                  className={[
                    "w-5 h-5 rounded-full border-2 flex-shrink-0",
                    role === opt.value
                      ? "border-[#C65D3B] bg-[#C65D3B]"
                      : "border-[#E8DDD0]",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
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
              جاري الحفظ...
            </>
          ) : (
            "ابدأ استخدام مقر"
          )}
        </button>
      </form>
    </div>
  );
}
