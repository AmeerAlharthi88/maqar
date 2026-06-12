"use client";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminDemoBanner } from "@/components/admin/AdminDemoBanner";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { MOCK_ADMIN_STATS } from "@/mock/admin";
import { MOCK_AUDIT_LOGS } from "@/mock/admin";
import { MOCK_MARKET_OVERVIEW } from "@/mock/market-stats";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

// Build chart series from market monthly stats
const chartData = MOCK_MARKET_OVERVIEW.monthlyStats.map((m) => ({
  date: m.month,
  views: m.sales,
  leads: m.rents,
  whatsappClicks: 0,
  callClicks: 0,
}));

const CHART_LINES = [
  { key: "views" as const, labelAr: "صفقات بيع",  color: "#0A3C36" },
  { key: "leads" as const, labelAr: "صفقات إيجار", color: "#4B90D9" },
];

export default function AdminOverviewPage() {
  const stats = MOCK_ADMIN_STATS;
  const recentLogs = MOCK_AUDIT_LOGS.slice(0, 4);

  return (
    <AdminDashboardShell titleAr="لوحة الإدارة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* This overview shows demonstration data only. The mock-derived "priority
            alerts" were removed so no fake operational counts appear here — real
            moderation happens on the Listings-review and Reports pages, which load
            live data with real loading/error/empty states. */}
        <AdminDemoBanner
          noteAr="جميع الأرقام والنشاط في هذه اللوحة بيانات تجريبية للعرض فقط، وليست بيانات تشغيلية حقيقية. للمراجعة الفعلية استخدم صفحتَي «مراجعة الإعلانات» و«البلاغات»."
          noteEn="All figures and activity on this dashboard are demonstration data only — not live operational data. Use the Listings-review and Reports pages for real moderation."
        />

        {/* Key metrics — row 1 */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            labelAr="إجمالي الإعلانات"
            value={stats.totalListings.toLocaleString("ar-OM")}
            accent
          />
          <DashboardMetricCard
            labelAr="إعلانات نشطة"
            value={stats.activeListings.toLocaleString("ar-OM")}
          />
        </div>

        {/* Key metrics — row 2 */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            labelAr="تحتاج مراجعة"
            value={stats.pendingReview}
            subLabelAr="إعلان معلّق"
          />
          <DashboardMetricCard
            labelAr="بلاغات"
            value={stats.reportedListings}
            subLabelAr="إعلان مُبلَّغ"
          />
          <DashboardMetricCard
            labelAr="طلبات توثيق"
            value={stats.verificationRequests}
          />
          <DashboardMetricCard
            labelAr="أعلام AML"
            value={stats.amlFlags}
            subLabelAr="يستوجب مراجعة"
          />
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{stats.totalUsers.toLocaleString("ar-OM")}</p>
            <p className="text-[10px] text-[#627D98]">مستخدم</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{stats.activeAgents}</p>
            <p className="text-[10px] text-[#627D98]">وسيط نشط</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{stats.totalAgencies}</p>
            <p className="text-[10px] text-[#627D98]">وكالة</p>
          </div>
        </div>

        {/* Market activity chart */}
        <DashboardChartCard
          titleAr="نشاط السوق — آخر ٦ أشهر"
          data={chartData}
          lines={CHART_LINES}
        />

        {/* Recent admin activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#102A43]">آخر الإجراءات الإدارية</h2>
            <Link href={ROUTES.adminAuditLogs} className="text-xs text-[#0A3C36] font-semibold">
              سجل كامل
            </Link>
          </div>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#102A43]">{log.actionAr}</p>
                  <p className="text-[10px] text-[#627D98]">{log.targetAr}</p>
                  <p className="text-[10px] text-[#627D98] mt-0.5">
                    {new Date(log.createdAt).toLocaleString("ar-OM", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={[
                  "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0",
                  log.severity === "critical" ? "bg-[#FEF0EE] text-[#C0392B]" :
                  log.severity === "warning"  ? "bg-[#FFF8E7] text-[#D4A017]" :
                  "bg-[#EAF4FB] text-[#2471A3]",
                ].join(" ")}>
                  {log.severity === "critical" ? "حرج" : log.severity === "warning" ? "تحذير" : "معلومات"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue placeholder */}
        <div className="bg-[#F8F9FA] rounded-2xl border border-[#E2E8F0] px-4 py-4">
          <p className="text-xs font-bold text-[#102A43] mb-1">الإيرادات الشهرية</p>
          <p className="text-2xl font-bold text-[#0A3C36]">{stats.revenuePlaceholder.toLocaleString("ar-OM")} ر.ع.</p>
          <p className="text-[10px] text-[#627D98] mt-1">بيانات تجريبية — الدفع يُربط في Phase 12</p>
        </div>
      </div>
    </AdminDashboardShell>
  );
}
