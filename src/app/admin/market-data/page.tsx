"use client";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { MarketDataTable } from "@/components/admin/MarketDataTable";
import { MOCK_ADMIN_MARKET_DATA } from "@/mock/admin";

export default function AdminMarketDataPage() {
  const lastUpdated = MOCK_ADMIN_MARKET_DATA[0]?.lastUpdated
    ? new Date(MOCK_ADMIN_MARKET_DATA[0].lastUpdated).toLocaleDateString("ar-OM", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <AdminDashboardShell titleAr="بيانات السوق">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs text-[#A89480]">
            {MOCK_ADMIN_MARKET_DATA.length} منطقة · آخر تحديث: {lastUpdated}
          </p>
          {/* Import/export placeholders — TODO: wire to real import flow in Phase 12 */}
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F5F0EA] text-[#7A6B5E] opacity-60 cursor-not-allowed" disabled>
              استيراد CSV
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F5F0EA] text-[#7A6B5E] opacity-60 cursor-not-allowed" disabled>
              تصدير
            </button>
          </div>
        </div>

        {/* Policy notice */}
        <div className="bg-[#FFF8E7] rounded-2xl border border-[#D4A017]/20 px-4 py-3">
          <p className="text-xs font-bold text-[#D4A017] mb-1">تنبيه — بيانات تجريبية</p>
          <p className="text-[10px] text-[#7A6B5E] leading-relaxed">
            الأرقام الواردة هي بيانات مقدّرة للعرض التجريبي فقط وليست بيانات سوق رسمية.
            سيتم ربط هذه الصفحة بمصادر رسمية معتمدة في Phase 12.
          </p>
        </div>

        <MarketDataTable rows={MOCK_ADMIN_MARKET_DATA} />
      </div>
    </AdminDashboardShell>
  );
}
