"use client";

import { AgencyDashboardShell } from "@/components/agency/AgencyDashboardShell";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { MOCK_AGENCY_ANALYTICS } from "@/mock/agent-analytics";
import { MOCK_AGENCIES } from "@/mock/agencies";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

const CHART_LINES = [
  { key: "views" as const, labelAr: "مشاهدة", color: "#0A3C36" },
  { key: "leads" as const, labelAr: "عميل",   color: "#4B90D9" },
];

export default function AgencyDashboardPage() {
  const analytics = MOCK_AGENCY_ANALYTICS;
  // TODO: load agency from real Supabase profile in Phase 11
  const agency = MOCK_AGENCIES[0];

  return (
    <AgencyDashboardShell titleAr="لوحة الوكالة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Agency banner */}
        <div className="bg-[#0A3C36] rounded-2xl px-4 py-4">
          <p className="text-white/80 text-xs mb-1">الوكالة</p>
          <p className="text-white text-base font-bold">{agency.nameAr}</p>
          <p className="text-white/70 text-xs mt-1">
            {agency.location.wilayatAr}، {agency.location.governorateAr}
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            labelAr="مشاهدة (٣٠ يوم)"
            value={analytics.totalViews.toLocaleString("ar-OM")}
            accent
          />
          <DashboardMetricCard
            labelAr="عميل محتمل"
            value={analytics.totalLeads}
          />
          <DashboardMetricCard
            labelAr="عرض سعر"
            value={analytics.totalOffers}
          />
          <DashboardMetricCard
            labelAr="صفقة مغلقة"
            value={analytics.totalSales}
          />
        </div>

        {/* Agency chart */}
        <DashboardChartCard
          titleAr="أداء الوكالة (٣٠ يوم)"
          data={analytics.timeSeries}
          lines={CHART_LINES}
        />

        {/* Top agents */}
        {analytics.topAgents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#102A43]">أفضل الوسطاء</h2>
              <Link href={ROUTES.agencyTeam} className="text-xs text-[#0A3C36] font-semibold">
                الفريق كاملاً
              </Link>
            </div>
            <div className="space-y-2">
              {analytics.topAgents.map((agent, idx) => (
                <div
                  key={agent.agentId}
                  className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0A3C36]/10 flex items-center justify-center text-xs font-bold text-[#0A3C36] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="flex-1 text-sm font-bold text-[#102A43]">{agent.nameAr}</p>
                  <div className="text-left flex-shrink-0">
                    <p className="text-xs font-bold text-[#102A43]">{agent.leads} عميل</p>
                    <p className="text-[10px] text-[#0A3C36]">{agent.sales} صفقة</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AgencyDashboardShell>
  );
}
