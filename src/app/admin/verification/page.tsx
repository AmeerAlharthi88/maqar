"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { VerificationRequestCard } from "@/components/admin/VerificationRequestCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_VERIFICATION_REQUESTS } from "@/mock/admin";
import type { AdminVerificationRequest, VerificationRequestStatus, VerificationRequestType } from "@/types/admin";

const TYPE_FILTERS: (VerificationRequestType | "all")[] = ["all", "agent", "agency"];
const TYPE_AR: Record<VerificationRequestType | "all", string> = {
  all: "الكل", agent: "وسيط", agency: "وكالة", property: "عقار",
};

// Mock action handler — TODO: replace with server action in Phase 12
function useVerificationQueue() {
  const [items, setItems] = useState<AdminVerificationRequest[]>(MOCK_VERIFICATION_REQUESTS);
  const update = (id: string, status: VerificationRequestStatus, note?: string) =>
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status, adminNote: note ?? r.adminNote } : r));
  return { items, update };
}

export default function AdminVerificationPage() {
  const [typeFilter, setTypeFilter] = useState<VerificationRequestType | "all">("all");
  const { items, update } = useVerificationQueue();

  const filtered = typeFilter === "all" ? items : items.filter((r) => r.type === typeFilter);
  const pending  = items.filter((r) => r.status === "pending" || r.status === "under_review").length;

  return (
    <AdminDashboardShell titleAr="طلبات التوثيق">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#A89480]">{pending} طلب في الانتظار · {items.length} إجمالي</p>
        </div>

        <div className="flex gap-2">
          {TYPE_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((r) => r.type === f).length;
            return (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl flex-shrink-0 transition-colors",
                  typeFilter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
              >
                {TYPE_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد طلبات توثيق" descriptionAr="طلبات التوثيق من الوسطاء والوكالات ستظهر هنا." />
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <VerificationRequestCard
                key={req.id}
                request={req}
                onApprove={(id) => update(id, "approved")}
                onReject={(id) => update(id, "rejected")}
                onRequestInfo={(id) => update(id, "needs_more_info", "يرجى إرسال المستندات المطلوبة.")}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
