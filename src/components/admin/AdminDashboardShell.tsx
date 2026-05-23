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

const ADMIN_NAV_ITEMS = [
  { href: ROUTES.admin,               labelAr: "لوحة التحكم", matchExact: true },
  { href: ROUTES.adminListings,       labelAr: "الإعلانات" },
  { href: ROUTES.adminVerification,   labelAr: "التوثيق" },
  { href: ROUTES.adminReports,        labelAr: "البلاغات" },
  { href: ROUTES.adminAml,            labelAr: "AML" },
  { href: ROUTES.adminDuplicates,     labelAr: "المكررات" },
  { href: ROUTES.adminUsers,          labelAr: "المستخدمون" },
  { href: ROUTES.adminAgencies,       labelAr: "الشركات" },
  { href: ROUTES.adminMarketData,     labelAr: "بيانات السوق" },
  { href: ROUTES.adminSubscriptions,  labelAr: "الاشتراكات" },
  { href: ROUTES.adminAuditLogs,      labelAr: "سجل التدقيق" },
];

interface AdminDashboardShellProps {
  children: React.ReactNode;
  titleAr?: string;
}

export function AdminDashboardShell({ children, titleAr = "لوحة الإدارة" }: AdminDashboardShellProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  // Loading state
  if (isLoading) {
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

  // UI-only role check — pending real RLS enforcement in Phase 12
  const hasAdminAccess = user.role === "admin" || user.role === "super_admin";

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
