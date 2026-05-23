"use client";

import { useState, useEffect } from "react";
import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_AGENT_ANALYTICS } from "@/mock/agent-analytics";
import type { AgentAnalyticsSummary } from "@/mock/agent-analytics";
import { fetchAgentAnalyticsSummary } from "@/lib/supabase/analytics";
import { useAuthStore } from "@/store/auth.store";

const CHART_LINES_TRAFFIC = [
  { key: "views"          as const, labelAr: "مشاهدة", color: "#0A3C36" },
  { key: "whatsappClicks" as const, labelAr: "واتساب", color: "#25D366" },
  { key: "callClicks"     as const, labelAr: "اتصال",  color: "#4B90D9" },
];

const CHART_LINES_LEADS = [
  { key: "leads" as const, labelAr: "عميل محتمل", color: "#0A3C36" },
];

export default function AgentAnalyticsPage() {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<AgentAnalyticsSummary>(MOCK_AGENT_ANALYTICS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    fetchAgentAnalyticsSummary(user.id, 30)
      .then((data) => {
        if (data) {
          setAnalytics(data);
          setIsLive(true);
        }
        // if null — no data yet or dev mode — keep mock data, isLive stays false
      })
      .catch(() => {/* keep mock data */});
  }, [user?.id]);

  const a = analytics;

  return (
    <AgentDashboardShell titleAr="التحليلات">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Period note */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#627D98]">إحصائيات آخر ٣٠ يوماً</p>
          {!isLive && (
            <span className="text-[10px] px-2 py-0.5 bg-[#F0F4F8] text-[#627D98] rounded-full">
              بيانات تجريبية
            </span>
          )}
        </div>

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
        {a.topListings.length > 0 ? (
          <div>
            <h2 className="text-sm font-bold text-[#102A43] mb-3">أفضل الإعلانات أداءً</h2>
            <div className="space-y-2">
              {a.topListings.map((listing, idx) => (
                <div
                  key={listing.listingId}
                  className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#0A3C36]/10 flex items-center justify-center text-xs font-bold text-[#0A3C36] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#102A43] line-clamp-1">{listing.titleAr}</p>
                      <p className="text-xs font-bold text-[#0A3C36] mt-0.5">
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
                      <div key={m.label} className="bg-[#F8F9FA] rounded-xl py-2 text-center">
                        <p className="text-xs font-bold text-[#102A43]">{m.value}</p>
                        <p className="text-[10px] text-[#627D98]">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state — shown when Supabase data loads but is genuinely empty */
          isLive && (
            <div className="text-center py-8">
              <p className="text-sm text-[#627D98]">لا توجد بيانات بعد. ستظهر الإحصائيات بعد أول مشاهدة لإعلاناتك.</p>
            </div>
          )
        )}
      </div>
    </AgentDashboardShell>
  );
}
