"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { ReportCard } from "@/components/admin/ReportCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_ADMIN_REPORTS } from "@/mock/admin";
import type { AdminReport, ReportStatus, ReportTargetType } from "@/types/admin";
import { REPORT_STATUS_AR } from "@/types/admin";

const STATUS_FILTERS: (ReportStatus | "all")[] = ["all", "new", "reviewing", "resolved", "dismissed"];
const STATUS_AR: Record<ReportStatus | "all", string> = {
  all: "الكل", new: "جديد", reviewing: "قيد المراجعة", resolved: "محلول", dismissed: "مرفوض",
};

function useReportQueue() {
  const [items, setItems] = useState<AdminReport[]>(MOCK_ADMIN_REPORTS);
  const update = (id: string, status: ReportStatus, note?: string) =>
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status, adminNote: note ?? r.adminNote } : r));
  return { items, update };
}

export default function AdminReportsPage() {
  const [filter, setFilter] = useState<ReportStatus | "all">("all");
  const { items, update } = useReportQueue();

  const filtered = filter === "all" ? items : items.filter((r) => r.status === filter);
  const newCount = items.filter((r) => r.status === "new").length;

  return (
    <AdminDashboardShell titleAr="البلاغات">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#A89480]">{newCount} بلاغ جديد · {items.length} إجمالي</p>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {STATUS_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((r) => r.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
              >
                {STATUS_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد بلاغات" descriptionAr="البلاغات الواردة من المستخدمين ستظهر هنا." />
        ) : (
          <div className="space-y-3">
            {filtered.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onResolve={(id) => update(id, "resolved")}
                onDismiss={(id) => update(id, "dismissed")}
                onEscalate={(id) => update(id, "reviewing")}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
