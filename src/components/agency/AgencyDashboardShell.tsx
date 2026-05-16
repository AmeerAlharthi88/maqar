"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

const AGENCY_NAV_ITEMS = [
  { href: ROUTES.agencyDashboard, labelAr: "الرئيسية", matchExact: true },
  { href: ROUTES.agencyListings,  labelAr: "الإعلانات" },
  { href: ROUTES.agencyTeam,      labelAr: "الفريق" },
  { href: ROUTES.agencyLeads,     labelAr: "العملاء" },
  { href: ROUTES.agencyAnalytics, labelAr: "التحليلات" },
  { href: ROUTES.agencySettings,  labelAr: "الإعدادات" },
];

interface AgencyDashboardShellProps {
  children: React.ReactNode;
  titleAr?: string;
}

export function AgencyDashboardShell({ children, titleAr = "لوحة الوكالة" }: AgencyDashboardShellProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="w-8 h-8 rounded-full border-2 border-[#E8DDD0] border-t-[#C65D3B] animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    router.replace(ROUTES.login);
    return null;
  }

  // UI-only role check — pending real RLS enforcement in Phase 11
  const hasAgencyAccess =
    user.role === "agency_admin" ||
    user.role === "admin" ||
    user.role === "super_admin";

  if (!hasAgencyAccess) {
    return (
      <AppShell>
        <AppHeader variant="back" titleAr="لوحة الوكالة" />
        <div className="px-4 py-12 text-center" dir="rtl">
          <div className="w-16 h-16 rounded-full bg-[#C65D3B]/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.8">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-2">هذه الصفحة لمديري الوكالات</h2>
          <p className="text-sm text-[#7A6B5E] mb-6 leading-relaxed">
            يتطلب الوصول إلى لوحة تحكم الوكالة صلاحيات مدير وكالة عقارية
          </p>
          <Link
            href={ROUTES.home}
            className="inline-block px-6 py-3 rounded-xl bg-[#F5F0EA] text-[#1E1E1E] text-sm font-bold"
          >
            العودة إلى الرئيسية
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader variant="back" titleAr={titleAr} />
      <DashboardNav items={AGENCY_NAV_ITEMS} />
      {children}
    </AppShell>
  );
}
