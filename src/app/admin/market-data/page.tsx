"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { MarketDataTable } from "@/components/admin/MarketDataTable";
import { MOCK_ADMIN_MARKET_DATA } from "@/mock/admin";
import type { AdminMarketDataRow } from "@/types/admin";

function useMarketData() {
  const [rows, setRows] = useState<AdminMarketDataRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/market-data");
      if (res.ok) {
        const json = await res.json();
        const data: AdminMarketDataRow[] = json.data ?? [];
        setRows(data.length > 0 ? data : MOCK_ADMIN_MARKET_DATA);
      } else {
        setRows(MOCK_ADMIN_MARKET_DATA);
      }
    } catch {
      setRows(MOCK_ADMIN_MARKET_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  return { rows, loading };
}

export default function AdminMarketDataPage() {
  const { rows, loading } = useMarketData();

  const lastUpdated = rows[0]?.lastUpdated
    ? new Date(rows[0].lastUpdated).toLocaleDateString("ar-OM", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <AdminDashboardShell titleAr="بيانات السوق">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs text-[#A89480]">
            {loading ? "جارٍ التحميل…" : `${rows.length} منطقة · آخر تحديث: ${lastUpdated}`}
          </p>
          {/* Import/export placeholders */}
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
          <p className="text-xs font-bold text-[#D4A017] mb-1">تنبيه — بيانات تقديرية</p>
          <p className="text-[10px] text-[#7A6B5E] leading-relaxed">
            الأرقام الواردة هي تقديرات إدارية للأغراض التطويرية وليست بيانات سوق رسمية أو حكومية.
            يجب عرض هذا التنبيه على جميع الصفحات التي تستخدم هذه البيانات.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-[#A89480] py-8">جارٍ التحميل…</div>
        ) : (
          <MarketDataTable rows={rows} />
        )}
      </div>
    </AdminDashboardShell>
  );
}
