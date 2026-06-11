"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { ReportCard } from "@/components/admin/ReportCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { AdminReport, ReportStatus } from "@/types/admin";
import { REPORT_STATUS_AR } from "@/types/admin";

const STATUS_FILTERS: (ReportStatus | "all")[] = ["all", "new", "reviewing", "resolved", "dismissed", "escalated"];
const STATUS_AR: Record<ReportStatus | "all", string> = {
  all: "الكل", ...REPORT_STATUS_AR,
};

function useReportQueue() {
  const [items, setItems] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/reports");
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        // Real data only — empty array is a real empty state, never mock.
        setItems((json.data ?? []) as AdminReport[]);
      } else {
        setError(true);
        setItems([]);
      }
    } catch {
      setError(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  const update = useCallback(async (id: string, status: ReportStatus, note?: string) => {
    // Optimistic update
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status, adminNote: note ?? r.adminNote } : r));
    try {
      await fetch(`/api/admin/reports/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status, adminNote: note }),
      });
    } catch {
      // Optimistic update stands
    }
  }, []);

  return { items, loading, error, reload, update };
}

export default function AdminReportsPage() {
  const [filter, setFilter] = useState<ReportStatus | "all">("all");
  const { items, loading, error, reload, update } = useReportQueue();

  const filtered = filter === "all" ? items : items.filter((r) => r.status === filter);
  const newCount = items.filter((r) => r.status === "new").length;

  return (
    <AdminDashboardShell titleAr="البلاغات">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#627D98]">{newCount} بلاغ جديد · {items.length} إجمالي</p>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {STATUS_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((r) => r.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
              >
                {STATUS_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">جارٍ التحميل…</div>
        ) : error ? (
          <AdminErrorState onRetry={reload} />
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            titleAr={filter === "all" ? "لا توجد بلاغات مفتوحة" : "لا توجد بلاغات في هذه الحالة"}
            titleEn={filter === "all" ? "No open reports" : "No reports in this status"}
            descriptionAr={filter === "all"
              ? "البلاغات الواردة من المستخدمين ستظهر هنا."
              : `لا توجد بلاغات بحالة "${STATUS_AR[filter]}". جرّب فلتراً آخر.`}
            descriptionEn={filter === "all"
              ? "Reports submitted by users will appear here."
              : "No reports match this filter. Try another one."}
            onReset={filter !== "all" ? () => setFilter("all") : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onResolve={(id) => update(id, "resolved")}
                onDismiss={(id) => update(id, "dismissed")}
                onEscalate={(id) => update(id, "escalated")}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
