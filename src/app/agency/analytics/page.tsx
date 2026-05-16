"use client";

import { AgencyDashboardShell } from "@/components/agency/AgencyDashboardShell";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { MOCK_AGENCY_ANALYTICS } from "@/mock/agent-analytics";

const CHART_LINES = [
  { key: "views" as const, labelAr: "مشاهدة", color: "#C65D3B" },
  { key: "leads" as const, labelAr: "عميل",   color: "#4B90D9" },
];

export default function AgencyAnalyticsPage() {
  const a = MOCK_AGENCY_ANALYTICS;

  return (
    <AgencyDashboardShell titleAr="تحليلات الوكالة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#A89480]">إحصائيات آخر ٣٠ يوماً</p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            labelAr="إجمالي المشاهدات"
            value={a.totalViews.toLocaleString("ar-OM")}
            accent
          />
          <DashboardMetricCard
            labelAr="عميل محتمل"
            value={a.totalLeads}
          />
          <DashboardMetricCard
            labelAr="عروض الأسعار"
            value={a.totalOffers}
          />
          <DashboardMetricCard
            labelAr="صفقات مغلقة"
            value={a.totalSales}
          />
        </div>

        {/* Chart */}
        <DashboardChartCard
          titleAr="أداء الوكالة"
          data={a.timeSeries}
          lines={CHART_LINES}
        />

        {/* Top areas */}
        {a.topAreas.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">أكثر المناطق مشاهدةً</h2>
            <div className="space-y-2">
              {a.topAreas.map((area, idx) => {
                const maxViews = a.topAreas[0].views;
                const pct = Math.round((area.views / maxViews) * 100);
                return (
                  <div key={area.areaAr} className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-bold text-[#1E1E1E]">{area.areaAr}</p>
                      <p className="text-xs text-[#7A6B5E]">{area.views.toLocaleString("ar-OM")} مشاهدة</p>
                    </div>
                    <div className="h-1.5 bg-[#F0EBE3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C65D3B] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Agent leaderboard */}
        {a.topAgents.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">أداء الوسطاء</h2>
            <div className="space-y-2">
              {a.topAgents.map((agent, idx) => (
                <div
                  key={agent.agentId}
                  className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-3 flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-[#C65D3B]/10 flex items-center justify-center text-xs font-bold text-[#C65D3B] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="flex-1 text-sm font-bold text-[#1E1E1E]">{agent.nameAr}</p>
                  <div className="flex gap-3 text-xs flex-shrink-0">
                    <span className="text-[#4B90D9] font-semibold">{agent.leads} عميل</span>
                    <span className="text-[#5B8C5A] font-semibold">{agent.sales} صفقة</span>
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
