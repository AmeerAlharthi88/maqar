"use client";

// ── Admin subscriptions dashboard — Phase 14 ─────────────────────────────────

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PaymentStatusBadge } from "@/components/subscriptions/PaymentStatusBadge";
import { PlanBadge } from "@/components/subscriptions/PlanBadge";
import { MOCK_ADMIN_SUBSCRIPTIONS } from "@/mock/admin";
import {
  MOCK_PLAN_DISTRIBUTION,
  MOCK_MONTHLY_REVENUE,
  MOCK_ADDON_PURCHASES,
} from "@/mock/subscriptions";
import { PLAN_NAMES_AR, ADDON_LABELS_AR } from "@/lib/payments/plans";
import type { PaymentStatus } from "@/types/admin";
import { PAYMENT_STATUS_AR } from "@/types/admin";

const STATUS_FILTERS: (PaymentStatus | "all")[] = [
  "all",
  "paid",
  "trial",
  "failed",
  "cancelled",
];

const STATUS_AR: Record<PaymentStatus | "all", string> = {
  all: "الكل",
  ...PAYMENT_STATUS_AR,
};

const STATUS_VARIANT: Record<
  PaymentStatus,
  "success" | "warning" | "danger" | "neutral" | "info" | "purple"
> = {
  paid: "success",
  trial: "info",
  failed: "danger",
  cancelled: "neutral",
};

export default function AdminSubscriptionsPage() {
  const [activeFilter, setActiveFilter] = useState<PaymentStatus | "all">("all");
  const items = MOCK_ADMIN_SUBSCRIPTIONS;

  const filtered =
    activeFilter === "all"
      ? items
      : items.filter((s) => s.paymentStatus === activeFilter);

  const paidCount = items.filter((s) => s.paymentStatus === "paid").length;
  const failedCount = items.filter((s) => s.paymentStatus === "failed").length;
  const trialCount = items.filter((s) => s.paymentStatus === "trial").length;
  const revenue = items
    .filter((s) => s.paymentStatus === "paid")
    .reduce((acc, s) => acc + s.amount, 0);

  const latestRevenue = MOCK_MONTHLY_REVENUE[MOCK_MONTHLY_REVENUE.length - 1];
  const activeAddOns = MOCK_ADDON_PURCHASES.filter((a) => a.isActive);

  return (
    <AdminDashboardShell titleAr="الاشتراكات">
      <div className="px-4 py-4 space-y-4" dir="rtl">

        {/* Mock notice */}
        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-2">
          <p className="text-[10px] text-[#C8860A]">
            بيانات تجريبية — الإيرادات لا تمثّل أرقاماً حقيقية
          </p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#E6F0EF] rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#0A3C36]">{paidCount}</p>
            <p className="text-[10px] text-[#0A3C36]">اشتراك نشط</p>
          </div>
          <div className="bg-[#EAF4FB] rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#2471A3]">{trialCount}</p>
            <p className="text-[10px] text-[#2471A3]">تجريبي</p>
          </div>
          <div className={failedCount > 0 ? "bg-[#FEF0EE]" : "bg-[#F8F9FA]" + " rounded-2xl px-3 py-3 text-center"}>
            <p className={`text-lg font-bold ${failedCount > 0 ? "text-[#C0392B]" : "text-[#627D98]"}`}>
              {failedCount}
            </p>
            <p className={`text-[10px] ${failedCount > 0 ? "text-[#C0392B]" : "text-[#627D98]"}`}>
              دفع فاشل
            </p>
          </div>
          <div className="bg-[#F8F9FA] rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{revenue} ر.ع.</p>
            <p className="text-[10px] text-[#627D98]">إيرادات (وهمية)</p>
          </div>
        </div>

        {/* Monthly revenue trend — text only */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3">
          <p className="text-xs font-bold text-[#102A43] mb-2">
            توجه الإيرادات (بيانات تقديرية)
          </p>
          <div className="flex items-end gap-1 h-12">
            {MOCK_MONTHLY_REVENUE.map((m) => {
              const pct = Math.round((m.amount / latestRevenue.amount) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[#0A3C36]/70"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-[8px] text-[#627D98]">
                    {m.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan distribution */}
        <div>
          <p className="text-xs font-bold text-[#102A43] mb-2">توزيع الخطط</p>
          <div className="flex gap-2">
            {(["free", "agent_pro", "agency"] as const).map((plan) => (
              <div
                key={plan}
                className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] px-3 py-3 text-center"
              >
                <p className="text-base font-bold text-[#102A43]">
                  {MOCK_PLAN_DISTRIBUTION[plan]}
                </p>
                <PlanBadge planId={plan} className="mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Active add-ons */}
        {activeAddOns.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#102A43] mb-2">
              الإضافات النشطة ({activeAddOns.length})
            </p>
            <div className="space-y-2">
              {activeAddOns.map((addon) => (
                <div
                  key={addon.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-2 flex items-center justify-between"
                >
                  <span className="text-xs text-[#102A43]">
                    {ADDON_LABELS_AR[addon.addOnType]}
                  </span>
                  <span className="text-xs font-semibold text-[#0A3C36]">
                    {addon.amount} ر.ع.
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed payment alert */}
        {failedCount > 0 && (
          <div className="bg-[#FEF0EE] rounded-2xl border border-[#C0392B]/20 px-4 py-3">
            <p className="text-xs font-bold text-[#C0392B] mb-0.5">
              تنبيه — دفعات فاشلة
            </p>
            <p className="text-[10px] text-[#627D98]">
              يوجد {failedCount} اشتراك بدفعة فاشلة. يلزم مراجعة يدوية أو إشعار
              تلقائي عبر مزود الدفع.
            </p>
          </div>
        )}

        {/* Filter tabs */}
        <div>
          <div className="flex gap-1 overflow-x-auto pb-1 mb-3">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={[
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                  activeFilter === f
                    ? "bg-[#0A3C36] text-white"
                    : "bg-[#F0F4F8] text-[#627D98]",
                ].join(" ")}
                aria-pressed={activeFilter === f}
              >
                {STATUS_AR[f]}
              </button>
            ))}
          </div>

          {/* Subscription list */}
          <p className="text-xs font-bold text-[#102A43] mb-2">
            الاشتراكات ({filtered.length})
          </p>
          {filtered.length === 0 ? (
            <AdminEmptyState titleAr="لا توجد اشتراكات في هذا التصنيف" />
          ) : (
            <div className="space-y-3">
              {filtered.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#102A43]">
                        {sub.userNameAr}
                      </p>
                      <PlanBadge planId={sub.planId} className="mt-1" />
                    </div>
                    <StatusBadge
                      label={PAYMENT_STATUS_AR[sub.paymentStatus]}
                      variant={STATUS_VARIANT[sub.paymentStatus]}
                      size="xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#F8F9FA] rounded-xl py-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {sub.amount === 0 ? "مجاني" : `${sub.amount} ر.ع.`}
                      </p>
                      <p className="text-[10px] text-[#627D98]">الرسوم</p>
                    </div>
                    <div className="bg-[#F8F9FA] rounded-xl py-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {new Date(sub.startDate).toLocaleDateString("ar-OM", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-[#627D98]">بدء</p>
                    </div>
                    <div className="bg-[#F8F9FA] rounded-xl py-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {sub.nextBillDate
                          ? new Date(sub.nextBillDate).toLocaleDateString(
                              "ar-OM",
                              { month: "short", year: "numeric" }
                            )
                          : "—"}
                      </p>
                      <p className="text-[10px] text-[#627D98]">تجديد</p>
                    </div>
                  </div>

                  {sub.paymentStatus === "failed" && (
                    <div className="mt-3">
                      <button
                        disabled
                        className="w-full py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold opacity-60 cursor-not-allowed"
                        aria-label="إعادة المحاولة — غير متاح في المعاينة"
                      >
                        إعادة محاولة الدفع — غير متاح في المعاينة
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminDashboardShell>
  );
}
