"use client";

import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { VerificationStatusCard } from "@/components/dashboard/VerificationStatusCard";
import { LeadCard } from "@/components/dashboard/LeadCard";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { MOCK_AGENT_ANALYTICS } from "@/mock/agent-analytics";
import { MOCK_LEADS } from "@/mock/leads";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

const CHART_LINES = [
  { key: "views"          as const, labelAr: "مشاهدة", color: "#0A3C36" },
  { key: "whatsappClicks" as const, labelAr: "واتساب", color: "#25D366" },
];

export default function AgentDashboardPage() {
  const analytics = MOCK_AGENT_ANALYTICS;
  // Show only the 3 most recent leads on dashboard
  const recentLeads = MOCK_LEADS.filter((l) => l.status !== "closed" && l.status !== "lost").slice(0, 3);

  return (
    <AgentDashboardShell titleAr="لوحة الوسيط">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Verification status */}
        {/* TODO: replace with real user verification status from Supabase in Phase 11 */}
        <VerificationStatusCard status="not_started" />

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            labelAr="مشاهدة (٣٠ يوم)"
            value={analytics.totalViews.toLocaleString("ar-OM")}
            trend={{ value: "١٢٪ هذا الشهر", up: true }}
            accent
          />
          <DashboardMetricCard
            labelAr="عميل محتمل"
            value={analytics.totalLeads}
            trend={{ value: "٨٪ هذا الشهر", up: true }}
          />
          <DashboardMetricCard
            labelAr="موعد معاينة"
            value={analytics.totalAppointments}
          />
          <DashboardMetricCard
            labelAr="عرض سعر"
            value={analytics.totalOffers}
          />
        </div>

        {/* Analytics chart */}
        <DashboardChartCard
          titleAr="المشاهدات والتواصل (٣٠ يوم)"
          data={analytics.timeSeries}
          lines={CHART_LINES}
        />

        {/* Recent leads */}
        {recentLeads.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#102A43]">أحدث العملاء</h2>
              <Link href={ROUTES.agentLeads} className="text-xs text-[#0A3C36] font-semibold">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-2">
              {recentLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
