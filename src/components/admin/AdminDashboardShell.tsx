"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/config/routes";

// TODO: In Phase 12, replace this UI role check with a verified server-side
// session read from the Supabase `profiles` table and RLS policies.
// Do NOT rely on client-side role checks for real security enforcement.

// `demo: true` marks modules that are still mock-only (not wired to live data
// or real mutations) — DashboardNav shows a small "Demo / تجريبي" badge so an
// admin never mistakes them for production tools (UAT-056/063).
const ADMIN_NAV_ITEMS = [
  { href: ROUTES.admin,               labelAr: "لوحة التحكم",  labelEn: "Dashboard",     matchExact: true },
  { href: ROUTES.adminListings,       labelAr: "الإعلانات",    labelEn: "Listings" },
  { href: ROUTES.adminReports,        labelAr: "البلاغات",     labelEn: "Reports" },
  { href: ROUTES.adminVerification,   labelAr: "التوثيق",      labelEn: "Verification" },
  { href: ROUTES.adminAml,            labelAr: "AML",          labelEn: "AML" },
  { href: ROUTES.adminDuplicates,     labelAr: "المكررات",     labelEn: "Duplicates" },
  { href: ROUTES.adminAuditLogs,      labelAr: "سجل التدقيق",  labelEn: "Audit logs" },
  { href: ROUTES.adminMarketData,     labelAr: "بيانات السوق", labelEn: "Market data" },
  { href: ROUTES.adminUsers,          labelAr: "المستخدمون",   labelEn: "Users",         demo: true },
  { href: ROUTES.adminAgencies,       labelAr: "الشركات",      labelEn: "Agencies",      demo: true },
  { href: ROUTES.adminSubscriptions,  labelAr: "الاشتراكات",   labelEn: "Subscriptions", demo: true },
];

interface AdminDashboardShellProps {
  children: React.ReactNode;
  titleAr?: string;
}

export function AdminDashboardShell({ children, titleAr = "لوحة الإدارة" }: AdminDashboardShellProps) {
  const { user, profile, isLoading } = useAuthStore();
  const router = useRouter();
  const { locale } = useTranslation();
  const isAr = locale === "ar";
  const [timedOut, setTimedOut] = useState(false);

  // Loading while: initial auth loading OR user is authenticated but the profile
  // (which carries the authoritative role) hasn't been fetched yet. Showing the
  // shell until the role is known prevents the restricted screen flashing during
  // the gap between setUser(metadata role) and setUser(profile role).
  const loadingProfile = isLoading || (user !== null && profile === null);

  // Never hang on a blank spinner: if the profile fetch stalls/fails on mobile,
  // surface a clear error + retry + back instead of spinning forever (FP6 #1/#6).
  useEffect(() => {
    if (!loadingProfile) return;
    const id = setTimeout(() => setTimedOut(true), 8000);
    return () => clearTimeout(id);
  }, [loadingProfile]);

  if (loadingProfile) {
    return (
      <AppShell>
        <AppHeader variant="back" titleAr={titleAr} />
        <div
          className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center gap-3"
          dir={isAr ? "rtl" : "ltr"}
          role="status"
          aria-live="polite"
        >
          {!timedOut ? (
            <>
              <span className="w-9 h-9 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
              <p className="text-sm font-semibold text-[#102A43]">
                {isAr ? "جاري تحميل لوحة الإدارة..." : "Loading admin dashboard..."}
              </p>
              <p className="text-xs text-[#627D98] max-w-xs leading-relaxed">
                {isAr ? "إذا استغرق التحميل وقتاً طويلاً، حاول مرة أخرى." : "If this takes too long, please try again."}
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[#FEF0EE] flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#102A43]">
                {isAr ? "تعذّر تحميل لوحة الإدارة" : "Couldn't load the admin dashboard"}
              </p>
              <p className="text-xs text-[#627D98] max-w-xs leading-relaxed">
                {isAr ? "تحقق من اتصالك بالإنترنت وحاول مرة أخرى." : "Check your connection and try again."}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => { setTimedOut(false); window.location.reload(); }}
                  className="px-4 py-2.5 rounded-xl bg-[#0A3C36] text-white text-xs font-bold hover:bg-[#082E29] transition-colors"
                >
                  {isAr ? "إعادة المحاولة" : "Retry"}
                </button>
                <Link
                  href={ROUTES.account}
                  className="px-4 py-2.5 rounded-xl bg-[#F0F4F8] text-[#102A43] text-xs font-bold border border-[#E2E8F0]"
                >
                  {isAr ? "العودة للحساب" : "Back to account"}
                </Link>
              </div>
            </>
          )}
        </div>
      </AppShell>
    );
  }

  // Not authenticated (client-side fallback — layout handles server redirect)
  if (!user) {
    router.replace(ROUTES.login);
    return null;
  }

  // Use profile.role as the authoritative source: it is fetched fresh from the DB
  // (public.profiles) by getCurrentProfile() on every auth event, whereas
  // user.role comes from user_metadata which may be stale for manually-promoted admins.
  // user.role is kept as a fallback only — it is always overwritten by profile.role
  // once getCurrentProfile() resolves (see AuthSessionProvider).
  const effectiveRole = profile?.role ?? user.role;
  const hasAdminAccess = effectiveRole === "admin" || effectiveRole === "super_admin";

  if (!hasAdminAccess) {
    return (
      <AppShell>
        <AppHeader variant="back" titleAr="لوحة الإدارة" />
        <div className="px-4 py-12 text-center" dir="rtl">
          <div className="w-16 h-16 rounded-full bg-[#0A3C36]/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#102A43] mb-2">وصول مقيّد</h2>
          <p className="text-sm text-[#627D98] mb-2 leading-relaxed">
            هذه المنطقة خاصة بمشرفي منصة مقر فقط.
          </p>
          <p className="text-xs text-[#627D98]">
            إذا كنت مشرفاً وتواجه هذه الرسالة، تواصل مع فريق التقنية.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader variant="back" titleAr={titleAr} />
      <DashboardNav items={ADMIN_NAV_ITEMS} />
      {children}
    </AppShell>
  );
}
