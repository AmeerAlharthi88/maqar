"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuthStore } from "@/store/auth.store";
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

  // Show spinner while: initial auth loading OR user is authenticated but the profile
  // hasn't been fetched from the DB yet (getCurrentProfile() is still in-flight).
  // This prevents the restricted screen from flashing during the async gap between
  // setUser(role:"user" from metadata) and setUser(role:"admin" from profile).
  if (isLoading || (user !== null && profile === null)) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="w-8 h-8 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
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
