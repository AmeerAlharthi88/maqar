"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { MarketDataTable } from "@/components/admin/MarketDataTable";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { AdminMarketDataRow } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi } from "@/lib/admin/labels";

function useMarketData() {
  const [rows, setRows] = useState<AdminMarketDataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/market-data");
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setRows((json.data ?? []) as AdminMarketDataRow[]);
      } else {
        setError(true);
        setRows([]);
      }
    } catch {
      setError(true);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  return { rows, loading, error, reload };
}

export default function AdminMarketDataPage() {
  const { rows, loading, error, reload } = useMarketData();
  const isAr = useLocaleStore((s) => s.locale) === "ar";

  const lastUpdated = rows[0]?.lastUpdated
    ? new Date(rows[0].lastUpdated).toLocaleDateString(isAr ? "ar-OM" : "en-OM", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <AdminDashboardShell titleAr="بيانات السوق" titleEn="Market data">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs text-[#627D98]">
            {loading ? bi(isAr, "جارٍ التحميل…", "Loading…") : bi(isAr, `${rows.length} منطقة · آخر تحديث: ${lastUpdated}`, `${rows.length} areas · Updated: ${lastUpdated}`)}
          </p>
          {/* Import/export placeholders */}
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F0F4F8] text-[#627D98] opacity-60 cursor-not-allowed" disabled>
              {bi(isAr, "استيراد CSV", "Import CSV")}
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F0F4F8] text-[#627D98] opacity-60 cursor-not-allowed" disabled>
              {bi(isAr, "تصدير", "Export")}
            </button>
          </div>
        </div>

        {/* Policy notice */}
        <div className="bg-[#FFF8E7] rounded-2xl border border-[#D4A017]/20 px-4 py-3">
          <p className="text-xs font-bold text-[#D4A017] mb-1">{bi(isAr, "تنبيه — بيانات تقديرية", "Notice — estimated data")}</p>
          <p className="text-[10px] text-[#627D98] leading-relaxed">
            {bi(isAr,
              "الأرقام الواردة هي تقديرات إدارية للأغراض التطويرية وليست بيانات سوق رسمية أو حكومية. يجب عرض هذا التنبيه على جميع الصفحات التي تستخدم هذه البيانات.",
              "These figures are administrative estimates for development purposes, not official or government market data. This notice must appear on every page that uses this data.")}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">{bi(isAr, "جارٍ التحميل…", "Loading…")}</div>
        ) : error ? (
          <AdminErrorState onRetry={reload} />
        ) : rows.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد بيانات سوق" titleEn="No market data" descriptionAr="ستظهر بيانات السوق المُدارة هنا." descriptionEn="Managed market data will appear here." />
        ) : (
          <MarketDataTable rows={rows} />
        )}
      </div>
    </AdminDashboardShell>
  );
}
