"use client";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminDemoBanner } from "@/components/admin/AdminDemoBanner";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { MOCK_ADMIN_STATS } from "@/mock/admin";
import { MOCK_AUDIT_LOGS } from "@/mock/admin";
import { MOCK_MARKET_OVERVIEW } from "@/mock/market-stats";
import { ROUTES } from "@/config/routes";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";
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
  { key: "views" as const, labelAr: "صفقات بيع",  labelEn: "Sale deals",  color: "#0A3C36" },
  { key: "leads" as const, labelAr: "صفقات إيجار", labelEn: "Rent deals", color: "#4B90D9" },
];

export default function AdminOverviewPage() {
  const stats = MOCK_ADMIN_STATS;
  const recentLogs = MOCK_AUDIT_LOGS.slice(0, 4);
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const numLocale = isAr ? "ar-OM" : "en-OM";

  return (
    <AdminDashboardShell titleAr="لوحة الإدارة" titleEn="Admin">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>
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
            labelEn="Total listings"
            value={stats.totalListings.toLocaleString(numLocale)}
            accent
          />
          <DashboardMetricCard
            labelAr="إعلانات نشطة"
            labelEn="Active listings"
            value={stats.activeListings.toLocaleString(numLocale)}
          />
        </div>

        {/* Key metrics — row 2 */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            labelAr="تحتاج مراجعة"
            labelEn="Pending review"
            value={stats.pendingReview}
            subLabelAr="إعلان معلّق"
            subLabelEn="listings pending"
          />
          <DashboardMetricCard
            labelAr="بلاغات"
            labelEn="Reports"
            value={stats.reportedListings}
            subLabelAr="إعلان مُبلَّغ"
            subLabelEn="reported listings"
          />
          <DashboardMetricCard
            labelAr="طلبات توثيق"
            labelEn="Verification requests"
            value={stats.verificationRequests}
          />
          <DashboardMetricCard
            labelAr="أعلام AML"
            labelEn="AML flags"
            value={stats.amlFlags}
            subLabelAr="يستوجب مراجعة"
            subLabelEn="need review"
          />
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{stats.totalUsers.toLocaleString(numLocale)}</p>
            <p className="text-[10px] text-[#627D98]">{bi(isAr, "مستخدم", "Users")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{stats.activeAgents}</p>
            <p className="text-[10px] text-[#627D98]">{bi(isAr, "وسيط نشط", "Active agents")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{stats.totalAgencies}</p>
            <p className="text-[10px] text-[#627D98]">{bi(isAr, "وكالة", "Agencies")}</p>
          </div>
        </div>

        {/* Market activity chart */}
        <DashboardChartCard
          titleAr="نشاط السوق — آخر ٦ أشهر"
          titleEn="Market activity — last 6 months"
          data={chartData}
          lines={CHART_LINES}
        />

        {/* Recent admin activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#102A43]">{bi(isAr, "آخر الإجراءات الإدارية", "Recent admin actions")}</h2>
            <Link href={ROUTES.adminAuditLogs} className="text-xs text-[#0A3C36] font-semibold">
              {bi(isAr, "سجل كامل", "Full log")}
            </Link>
          </div>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#102A43]">{displayMeta(log.actionAr, isAr)}</p>
                  <p className="text-[10px] text-[#627D98]">{displayMeta(log.targetAr, isAr)}</p>
                  <p className="text-[10px] text-[#627D98] mt-0.5">
                    {new Date(log.createdAt).toLocaleString(numLocale, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={[
                  "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0",
                  log.severity === "critical" ? "bg-[#FEF0EE] text-[#C0392B]" :
                  log.severity === "warning"  ? "bg-[#FFF8E7] text-[#D4A017]" :
                  "bg-[#EAF4FB] text-[#2471A3]",
                ].join(" ")}>
                  {log.severity === "critical" ? bi(isAr, "حرج", "Critical") : log.severity === "warning" ? bi(isAr, "تحذير", "Warning") : bi(isAr, "معلومات", "Info")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue placeholder */}
        <div className="bg-[#F8F9FA] rounded-2xl border border-[#E2E8F0] px-4 py-4">
          <p className="text-xs font-bold text-[#102A43] mb-1">{bi(isAr, "الإيرادات الشهرية", "Monthly revenue")}</p>
          <p className="text-2xl font-bold text-[#0A3C36]">{stats.revenuePlaceholder.toLocaleString(numLocale)} {bi(isAr, "ر.ع.", "OMR")}</p>
          <p className="text-[10px] text-[#627D98] mt-1">{bi(isAr, "بيانات تجريبية — الدفع يُربط في Phase 12", "Demo data — payments integrate in Phase 12")}</p>
        </div>
      </div>
    </AdminDashboardShell>
  );
}
