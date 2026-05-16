"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

const AGENT_NAV_ITEMS = [
  { href: ROUTES.agentDashboard,    labelAr: "الرئيسية",  matchExact: true },
  { href: ROUTES.agentListings,     labelAr: "إعلاناتي" },
  { href: ROUTES.agentLeads,        labelAr: "العملاء" },
  { href: ROUTES.agentAppointments, labelAr: "المواعيد" },
  { href: ROUTES.agentOffers,       labelAr: "العروض" },
  { href: ROUTES.agentAnalytics,    labelAr: "التحليلات" },
  { href: ROUTES.agentSubscription, labelAr: "الاشتراك" },
];

interface AgentDashboardShellProps {
  children: React.ReactNode;
  titleAr?: string;
}

export function AgentDashboardShell({ children, titleAr = "لوحة الوسيط" }: AgentDashboardShellProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  // Loading state
  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="w-8 h-8 rounded-full border-2 border-[#E8DDD0] border-t-[#C65D3B] animate-spin" />
        </div>
      </AppShell>
    );
  }

  // Not authenticated (client-side fallback — layout handles server redirect)
  if (!user) {
    router.replace(ROUTES.login);
    return null;
  }

  // UI-only role check — pending real RLS enforcement in Phase 11
  const hasAgentAccess =
    user.role === "agent" ||
    user.role === "agency_admin" ||
    user.role === "admin" ||
    user.role === "super_admin";

  if (!hasAgentAccess) {
    return (
      <AppShell>
        <AppHeader variant="back" titleAr="لوحة الوسيط" />
        <div className="px-4 py-12 text-center" dir="rtl">
          <div className="w-16 h-16 rounded-full bg-[#C65D3B]/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.8">
              <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-2">هذه الصفحة للوسطاء فقط</h2>
          <p className="text-sm text-[#7A6B5E] mb-6 leading-relaxed">
            سجّل كوسيط عقاري للوصول إلى لوحة التحكم وإدارة إعلاناتك وعملائك
          </p>
          <Link
            href={ROUTES.agentVerification}
            className="inline-block px-6 py-3 rounded-xl bg-[#C65D3B] text-white text-sm font-bold"
          >
            التقديم كوسيط عقاري
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader variant="back" titleAr={titleAr} />
      <DashboardNav items={AGENT_NAV_ITEMS} />
      {children}
    </AppShell>
  );
}
