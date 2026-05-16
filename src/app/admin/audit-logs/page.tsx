"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_AUDIT_LOGS } from "@/mock/admin";
import type { AuditCategory } from "@/types/admin";
import { AUDIT_CATEGORY_AR } from "@/types/admin";

type SeverityFilter = "info" | "warning" | "critical" | "all";

const CATEGORY_FILTERS: (AuditCategory | "all")[] = [
  "all", "admin_action", "listing_action", "verification_action", "user_action", "payment_action",
];
const CATEGORY_AR: Record<AuditCategory | "all", string> = { all: "الكل", ...AUDIT_CATEGORY_AR };

const SEVERITY_FILTERS: SeverityFilter[] = ["all", "info", "warning", "critical"];
const SEVERITY_AR: Record<SeverityFilter, string> = {
  all: "الكل", info: "معلومات", warning: "تحذير", critical: "حرج",
};

export default function AdminAuditLogsPage() {
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const logs = MOCK_AUDIT_LOGS;

  const filtered = logs.filter((log) => {
    const matchCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchCategory && matchSeverity;
  });

  const criticalCount = logs.filter((l) => l.severity === "critical").length;

  return (
    <AdminDashboardShell titleAr="سجل التدقيق">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#A89480]">{criticalCount} حرج · {logs.length} إجمالي</p>

        {/* Category filters */}
        <div>
          <p className="text-[10px] font-bold text-[#A89480] mb-1.5">الفئة</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {CATEGORY_FILTERS.map((f) => {
              const count = f === "all" ? logs.length : logs.filter((l) => l.category === f).length;
              return (
                <button key={f} onClick={() => setCategoryFilter(f)}
                  className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                    categoryFilter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
                >
                  {CATEGORY_AR[f]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity filters */}
        <div>
          <p className="text-[10px] font-bold text-[#A89480] mb-1.5">الخطورة</p>
          <div className="flex gap-2">
            {SEVERITY_FILTERS.map((f) => {
              const count = f === "all" ? logs.length : logs.filter((l) => l.severity === f).length;
              return (
                <button key={f} onClick={() => setSeverityFilter(f)}
                  className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                    severityFilter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
                >
                  {SEVERITY_AR[f]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy notice */}
        <div className="bg-[#EAF4FB] rounded-2xl border border-[#2471A3]/15 px-4 py-3">
          <p className="text-xs font-bold text-[#2471A3] mb-0.5">سجل التدقيق — للاستخدام الداخلي فقط</p>
          <p className="text-[10px] text-[#7A6B5E] leading-relaxed">
            جميع الإجراءات الإدارية مسجّلة وخاضعة للمراجعة. عناوين IP مُخفاة جزئياً لأغراض الخصوصية.
            سيتم ربط هذا السجل بـ Supabase Audit Logs في Phase 12.
          </p>
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد سجلات" descriptionAr="لا توجد سجلات مطابقة للفلتر المحدد." />
        ) : (
          <AuditLogTable logs={filtered} />
        )}
      </div>
    </AdminDashboardShell>
  );
}
