"use client";

import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_AGENT_ANALYTICS } from "@/mock/agent-analytics";

const CHART_LINES_TRAFFIC = [
  { key: "views"          as const, labelAr: "مشاهدة", color: "#C65D3B" },
  { key: "whatsappClicks" as const, labelAr: "واتساب", color: "#25D366" },
  { key: "callClicks"     as const, labelAr: "اتصال",  color: "#4B90D9" },
];

const CHART_LINES_LEADS = [
  { key: "leads" as const, labelAr: "عميل محتمل", color: "#C65D3B" },
];

export default function AgentAnalyticsPage() {
  const a = MOCK_AGENT_ANALYTICS;

  return (
    <AgentDashboardShell titleAr="التحليلات">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Period note */}
        <p className="text-xs text-[#A89480]">إحصائيات آخر ٣٠ يوماً</p>

        {/* Overview metrics */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            labelAr="إجمالي المشاهدات"
            value={a.totalViews.toLocaleString("ar-OM")}
            accent
          />
          <DashboardMetricCard
            labelAr="تواصل واتساب"
            value={a.totalWhatsappClicks}
          />
          <DashboardMetricCard
            labelAr="مكالمات هاتفية"
            value={a.totalCallClicks}
          />
          <DashboardMetricCard
            labelAr="معدل التحويل"
            value={`${a.conversionRate}٪`}
            subLabelAr="عملاء / مشاهدات"
          />
        </div>

        {/* Traffic chart */}
        <DashboardChartCard
          titleAr="حركة المشاهدات والتواصل"
          data={a.timeSeries}
          lines={CHART_LINES_TRAFFIC}
        />

        {/* Leads chart */}
        <DashboardChartCard
          titleAr="العملاء المحتملون"
          data={a.timeSeries}
          lines={CHART_LINES_LEADS}
        />

        {/* Top performing listings */}
        {a.topListings.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">أفضل الإعلانات أداءً</h2>
            <div className="space-y-2">
              {a.topListings.map((listing, idx) => (
                <div
                  key={listing.listingId}
                  className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#C65D3B]/10 flex items-center justify-center text-xs font-bold text-[#C65D3B] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1E1E1E] line-clamp-1">{listing.titleAr}</p>
                      <p className="text-xs font-bold text-[#C65D3B] mt-0.5">
                        {listing.price.toLocaleString("ar-OM")} ر.ع.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[
                      { value: listing.views.toLocaleString("ar-OM"), label: "مشاهدة" },
                      { value: listing.whatsappClicks.toString(),     label: "واتساب" },
                      { value: listing.saves.toString(),              label: "حفظ" },
                      { value: listing.leads.toString(),              label: "عميل" },
                    ].map((m) => (
                      <div key={m.label} className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                        <p className="text-xs font-bold text-[#1E1E1E]">{m.value}</p>
                        <p className="text-[10px] text-[#A89480]">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
