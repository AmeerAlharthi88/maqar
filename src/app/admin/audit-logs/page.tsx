"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_AUDIT_LOGS } from "@/mock/admin";
import type { AuditLog, AuditCategory } from "@/types/admin";
import { AUDIT_CATEGORY_AR } from "@/types/admin";

type SeverityFilter = "info" | "warning" | "critical" | "all";

const CATEGORY_FILTERS: (AuditCategory | "all")[] = [
  "all", "admin_action", "listing_action", "verification_action",
  "user_action", "payment_action", "ai_action", "security_action", "system_action",
];
const CATEGORY_AR: Record<AuditCategory | "all", string> = { all: "الكل", ...AUDIT_CATEGORY_AR };

const SEVERITY_FILTERS: SeverityFilter[] = ["all", "info", "warning", "critical"];
const SEVERITY_AR: Record<SeverityFilter, string> = {
  all: "الكل", info: "معلومات", warning: "تحذير", critical: "حرج",
};

// Map UI severity to DB severity values for the filter query param
const SEVERITY_TO_DB: Record<SeverityFilter, string | undefined> = {
  all: undefined, info: "low", warning: "medium", critical: "critical",
};

function useAuditLogs(
  categoryFilter: AuditCategory | "all",
  severityFilter:  SeverityFilter
) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      const dbSev = SEVERITY_TO_DB[severityFilter];
      if (dbSev) params.set("severity", dbSev);

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const data: AuditLog[] = json.data ?? [];
        setLogs(data.length > 0 ? data : MOCK_AUDIT_LOGS);
      } else {
        setLogs(MOCK_AUDIT_LOGS);
      }
    } catch {
      setLogs(MOCK_AUDIT_LOGS);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, severityFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  return { logs, loading };
}

export default function AdminAuditLogsPage() {
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const { logs, loading } = useAuditLogs(categoryFilter, severityFilter);

  const filtered = logs.filter((log) => {
    const matchCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchCategory && matchSeverity;
  });

  const criticalCount = logs.filter((l) => l.severity === "critical").length;

  return (
    <AdminDashboardShell titleAr="سجل التدقيق">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#627D98]">{criticalCount} حرج · {logs.length} إجمالي</p>

        {/* Category filters */}
        <div>
          <p className="text-[10px] font-bold text-[#627D98] mb-1.5">الفئة</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {CATEGORY_FILTERS.map((f) => {
              const count = f === "all" ? logs.length : logs.filter((l) => l.category === f).length;
              return (
                <button key={f} onClick={() => setCategoryFilter(f)}
                  className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                    categoryFilter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
                >
                  {CATEGORY_AR[f]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity filters */}
        <div>
          <p className="text-[10px] font-bold text-[#627D98] mb-1.5">الخطورة</p>
          <div className="flex gap-2">
            {SEVERITY_FILTERS.map((f) => {
              const count = f === "all" ? logs.length : logs.filter((l) => l.severity === f).length;
              return (
                <button key={f} onClick={() => setSeverityFilter(f)}
                  className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                    severityFilter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
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
          <p className="text-[10px] text-[#627D98] leading-relaxed">
            جميع الإجراءات الإدارية مسجّلة وخاضعة للمراجعة. عناوين IP مُخفاة جزئياً لأغراض الخصوصية.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">جارٍ التحميل…</div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد سجلات" descriptionAr="لا توجد سجلات مطابقة للفلتر المحدد." />
        ) : (
          <AuditLogTable logs={filtered} />
        )}
      </div>
    </AdminDashboardShell>
  );
}
