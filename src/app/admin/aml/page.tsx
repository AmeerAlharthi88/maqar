"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AMLFlagCard } from "@/components/admin/AMLFlagCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { AMLFlag, AMLStatus } from "@/types/admin";
import { AML_STATUS_AR, AML_STATUS_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi } from "@/lib/admin/labels";

const STATUS_FILTERS: (AMLStatus | "all")[] = ["all", "flagged", "cleared", "escalated", "rejected_listing"];
const STATUS_FILTER_AR: Record<AMLStatus | "all", string> = { all: "الكل", ...AML_STATUS_AR };
const STATUS_FILTER_EN: Record<AMLStatus | "all", string> = { all: "All", ...AML_STATUS_EN };

function useAmlQueue() {
  const [items, setItems] = useState<AMLFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/aml");
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setItems((json.data ?? []) as AMLFlag[]);
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

  return { items, loading, error, reload, update };
}

export default function AdminAmlPage() {
  const [filter, setFilter] = useState<AMLStatus | "all">("all");
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const filterLabels = isAr ? STATUS_FILTER_AR : STATUS_FILTER_EN;
  const { items, loading, error, reload, update } = useAmlQueue();
  const filtered = filter === "all" ? items : items.filter((f) => f.status === filter);
  const flaggedCount = items.filter((f) => f.status === "flagged").length;

  return (
    <AdminDashboardShell titleAr="مراجعة AML" titleEn="AML review">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-[#FEF0EE] rounded-2xl border border-[#C0392B]/20 px-4 py-3">
          <p className="text-xs font-bold text-[#C0392B] mb-1">{bi(isAr, "سياسة مكافحة غسيل الأموال", "Anti-money-laundering policy")}</p>
          <p className="text-[10px] text-[#627D98] leading-relaxed">
            {bi(isAr,
              "يُبلَّغ تلقائياً عن أي إعلان تجاوز ١٠٠،٠٠٠ ر.ع. وسعره أقل من متوسط السوق بأكثر من ٣٠٪. وجوب المراجعة اليدوية قبل النشر وفقاً للمتطلبات العُمانية.",
              "Any listing above 100,000 OMR priced more than 30% below market average is auto-flagged. Manual review is required before publishing, per Omani requirements.")}
          </p>
        </div>

        <p className="text-xs text-[#627D98]">{bi(isAr, `${flaggedCount} علم مفتوح · ${items.length} إجمالي`, `${flaggedCount} open flags · ${items.length} total`)}</p>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {STATUS_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((fl) => fl.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
              >
                {filterLabels[f]} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">{bi(isAr, "جارٍ التحميل…", "Loading…")}</div>
        ) : error ? (
          <AdminErrorState onRetry={reload} />
        ) : filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد أعلام AML" titleEn="No AML flags" descriptionAr="الإعلانات المشتبه بها ستظهر هنا تلقائياً." descriptionEn="Suspicious listings will appear here automatically." />
        ) : (
          <div className="space-y-3">
            {filtered.map((flag) => (
              <AMLFlagCard
                key={flag.id}
                flag={flag}
                onClear={(id) => update(id, "cleared", bi(isAr, "تم التحقق والتخليص.", "Verified and cleared."))}
                onEscalate={(id) => update(id, "escalated", bi(isAr, "تم إحالته لمسؤول الامتثال.", "Escalated to the compliance officer."))}
                onRequestClarification={(id) => update(id, "flagged", bi(isAr, "في انتظار توضيح من الوسيط.", "Awaiting clarification from the agent."))}
                onRejectListing={(id) => update(id, "rejected_listing", bi(isAr, "تم رفض الإعلان.", "Listing rejected."))}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
