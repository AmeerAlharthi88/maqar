"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { DuplicateComparisonCard } from "@/components/admin/DuplicateComparisonCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_DUPLICATE_PAIRS } from "@/mock/admin";
import type { DuplicatePair, DuplicateStatus } from "@/types/admin";

const FILTERS: (DuplicateStatus | "all")[] = ["all", "pending", "confirmed_duplicate", "not_duplicate"];
const FILTER_AR: Record<DuplicateStatus | "all", string> = {
  all: "الكل", pending: "في الانتظار", confirmed_duplicate: "مكرر مؤكد", not_duplicate: "ليس مكرراً", merged: "مدموج",
};

function useDuplicateQueue() {
  const [pairs, setPairs] = useState<DuplicatePair[]>(MOCK_DUPLICATE_PAIRS);
  const update = (id: string, status: DuplicateStatus) =>
    setPairs((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  return { pairs, update };
}

export default function AdminDuplicatesPage() {
  const [filter, setFilter] = useState<DuplicateStatus | "all">("all");
  const { pairs, update } = useDuplicateQueue();
  const filtered = filter === "all" ? pairs : pairs.filter((p) => p.status === filter);
  const pendingCount = pairs.filter((p) => p.status === "pending").length;

  return (
    <AdminDashboardShell titleAr="الإعلانات المكررة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#A89480]">{pendingCount} في الانتظار · {pairs.length} إجمالي</p>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map((f) => {
            const count = f === "all" ? pairs.length : pairs.filter((p) => p.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
              >
                {FILTER_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد تكرارات" descriptionAr="الإعلانات المكررة المكتشفة تلقائياً ستظهر هنا." />
        ) : (
          <div className="space-y-3">
            {filtered.map((pair) => (
              <DuplicateComparisonCard
                key={pair.id}
                pair={pair}
                onConfirmDuplicate={(id) => update(id, "confirmed_duplicate")}
                onNotDuplicate={(id) => update(id, "not_duplicate")}
                onRequestClarification={(id) => update(id, "pending")}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
