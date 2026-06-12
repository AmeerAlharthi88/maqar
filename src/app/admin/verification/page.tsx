"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { VerificationRequestCard } from "@/components/admin/VerificationRequestCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { AdminVerificationRequest, VerificationRequestStatus, VerificationRequestType } from "@/types/admin";

const TYPE_FILTERS: (VerificationRequestType | "all")[] = ["all", "agent", "agency"];
const TYPE_AR: Record<VerificationRequestType | "all", string> = {
  all: "الكل", agent: "وسيط", agency: "وكالة", property: "عقار",
};

function useVerificationQueue() {
  const [items, setItems] = useState<AdminVerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/verification");
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        // Real data only — the service-role API returns AdminVerificationRequest[]
        // directly; an empty array is a real empty state, never mock.
        setItems((json.data ?? []) as AdminVerificationRequest[]);
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

  async function update(id: string, status: VerificationRequestStatus, note?: string) {
    // Optimistic update
    setItems((prev) =>
      prev.map((r) => r.id === id ? { ...r, status, adminNote: note ?? r.adminNote } : r)
    );
    await fetch(`/api/admin/verification/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status, note }),
    }).catch((err) => console.error("[Admin/Verification] update error:", err));
  }

  return { items, loading, error, reload, update };
}

export default function AdminVerificationPage() {
  const [typeFilter, setTypeFilter] = useState<VerificationRequestType | "all">("all");
  const { items, loading, error, reload, update } = useVerificationQueue();

  const filtered = typeFilter === "all" ? items : items.filter((r) => r.type === typeFilter);
  const pending  = items.filter((r) => r.status === "pending" || r.status === "under_review").length;

  return (
    <AdminDashboardShell titleAr="طلبات التوثيق">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#627D98]">{pending} طلب في الانتظار · {items.length} إجمالي</p>
        </div>

        <div className="flex gap-2">
          {TYPE_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((r) => r.type === f).length;
            return (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl flex-shrink-0 transition-colors",
                  typeFilter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
              >
                {TYPE_AR[f]} ({count})
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
            titleAr={typeFilter === "all" ? "لا توجد طلبات توثيق" : "لا توجد طلبات في هذه الفئة"}
            titleEn={typeFilter === "all" ? "No verification requests" : "No requests in this category"}
            descriptionAr={typeFilter === "all" ? "طلبات التوثيق من الوسطاء والوكالات ستظهر هنا." : undefined}
            descriptionEn={typeFilter === "all" ? "Verification requests from agents and agencies will appear here." : undefined}
            onReset={typeFilter !== "all" ? () => setTypeFilter("all") : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <VerificationRequestCard
                key={req.id}
                request={req}
                onApprove={(id) => void update(id, "approved")}
                onReject={(id) => void update(id, "rejected")}
                onRequestInfo={(id) => void update(id, "needs_more_info", "يرجى إرسال المستندات المطلوبة.")}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
