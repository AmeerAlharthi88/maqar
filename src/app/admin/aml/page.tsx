"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AMLFlagCard } from "@/components/admin/AMLFlagCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_AML_FLAGS } from "@/mock/admin";
import type { AMLFlag, AMLStatus } from "@/types/admin";
import { AML_STATUS_AR } from "@/types/admin";

const STATUS_FILTERS: (AMLStatus | "all")[] = ["all", "flagged", "cleared", "escalated", "rejected_listing"];
const STATUS_FILTER_AR: Record<AMLStatus | "all", string> = { all: "الكل", ...AML_STATUS_AR };

function useAmlQueue() {
  const [items, setItems] = useState<AMLFlag[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/aml");
      if (res.ok) {
        const json = await res.json();
        const data: AMLFlag[] = json.data ?? [];
        setItems(data.length > 0 ? data : MOCK_AML_FLAGS);
      } else {
        setItems(MOCK_AML_FLAGS);
      }
    } catch {
      setItems(MOCK_AML_FLAGS);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  const update = useCallback(async (id: string, status: AMLStatus, note?: string) => {
    setItems((prev) => prev.map((f) => f.id === id ? { ...f, status, adminNote: note ?? f.adminNote } : f));
    try {
      await fetch(`/api/admin/aml/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status, adminNote: note }),
      });
    } catch {
      // Optimistic update stands
    }
  }, []);

  return { items, loading, update };
}

export default function AdminAmlPage() {
  const [filter, setFilter] = useState<AMLStatus | "all">("all");
  const { items, loading, update } = useAmlQueue();
  const filtered = filter === "all" ? items : items.filter((f) => f.status === filter);
  const flaggedCount = items.filter((f) => f.status === "flagged").length;

  return (
    <AdminDashboardShell titleAr="مراجعة AML">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <div className="bg-[#FBF0EB] rounded-2xl border border-[#C65D3B]/20 px-4 py-3">
          <p className="text-xs font-bold text-[#C65D3B] mb-1">سياسة مكافحة غسيل الأموال</p>
          <p className="text-[10px] text-[#7A6B5E] leading-relaxed">
            يُبلَّغ تلقائياً عن أي إعلان تجاوز ١٠٠،٠٠٠ ر.ع. وسعره أقل من متوسط السوق بأكثر من ٣٠٪.
            وجوب المراجعة اليدوية قبل النشر وفقاً للمتطلبات العُمانية.
          </p>
        </div>

        <p className="text-xs text-[#A89480]">{flaggedCount} علم مفتوح · {items.length} إجمالي</p>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {STATUS_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((fl) => fl.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
              >
                {STATUS_FILTER_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-xs text-[#A89480] py-8">جارٍ التحميل…</div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد أعلام AML" descriptionAr="الإعلانات المشتبه بها ستظهر هنا تلقائياً." />
        ) : (
          <div className="space-y-3">
            {filtered.map((flag) => (
              <AMLFlagCard
                key={flag.id}
                flag={flag}
                onClear={(id) => update(id, "cleared", "تم التحقق والتخليص.")}
                onEscalate={(id) => update(id, "escalated", "تم إحالته لمسؤول الامتثال.")}
                onRequestClarification={(id) => update(id, "flagged", "في انتظار توضيح من الوسيط.")}
                onRejectListing={(id) => update(id, "rejected_listing", "تم رفض الإعلان.")}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
