"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [pairs, setPairs] = useState<DuplicatePair[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/duplicates");
      if (res.ok) {
        const json = await res.json();
        const data: DuplicatePair[] = json.data ?? [];
        setPairs(data.length > 0 ? data : MOCK_DUPLICATE_PAIRS);
      } else {
        setPairs(MOCK_DUPLICATE_PAIRS);
      }
    } catch {
      setPairs(MOCK_DUPLICATE_PAIRS);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  const update = useCallback(async (id: string, status: DuplicateStatus) => {
    setPairs((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    try {
      await fetch(`/api/admin/duplicates/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
    } catch {
      // Optimistic update stands
    }
  }, []);

  return { pairs, loading, update };
}

export default function AdminDuplicatesPage() {
  const [filter, setFilter] = useState<DuplicateStatus | "all">("all");
  const { pairs, loading, update } = useDuplicateQueue();
  const filtered = filter === "all" ? pairs : pairs.filter((p) => p.status === filter);
  const pendingCount = pairs.filter((p) => p.status === "pending").length;

  return (
    <AdminDashboardShell titleAr="الإعلانات المكررة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#627D98]">{pendingCount} في الانتظار · {pairs.length} إجمالي</p>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map((f) => {
            const count = f === "all" ? pairs.length : pairs.filter((p) => p.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
              >
                {FILTER_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">جارٍ التحميل…</div>
        ) : filtered.length === 0 ? (
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
