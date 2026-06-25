"use client";

// ── Admin subscriptions dashboard — Phase 14 ─────────────────────────────────

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminDemoBanner } from "@/components/admin/AdminDemoBanner";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PlanBadge } from "@/components/subscriptions/PlanBadge";
import { MOCK_ADMIN_SUBSCRIPTIONS } from "@/mock/admin";
import {
  MOCK_PLAN_DISTRIBUTION,
  MOCK_MONTHLY_REVENUE,
  MOCK_ADDON_PURCHASES,
} from "@/mock/subscriptions";
import { ADDON_LABELS_AR, ADDON_LABELS_EN } from "@/lib/payments/plans";
import type { PaymentStatus } from "@/types/admin";
import { PAYMENT_STATUS_AR, PAYMENT_STATUS_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

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
const STATUS_EN: Record<PaymentStatus | "all", string> = {
  all: "All",
  ...PAYMENT_STATUS_EN,
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
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const numLocale = isAr ? "ar-OM" : "en-OM";
  const statusLabels = isAr ? STATUS_AR : STATUS_EN;
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
    <AdminDashboardShell titleAr="الاشتراكات" titleEn="Subscriptions">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>

        {/* Demo notice — subscriptions/revenue are not wired to live payments yet */}
        <AdminDemoBanner
          noteAr="الاشتراكات والإيرادات بيانات تجريبية ولا تمثّل أرقاماً حقيقية. الدفع يُربط في مرحلة لاحقة."
          noteEn="Subscriptions and revenue are demo data — not real figures. Payments are wired in a later phase."
        />

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#E6F0EF] rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#0A3C36]">{paidCount}</p>
            <p className="text-[10px] text-[#0A3C36]">{bi(isAr, "اشتراك نشط", "Active")}</p>
          </div>
          <div className="bg-[#EAF4FB] rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#2471A3]">{trialCount}</p>
            <p className="text-[10px] text-[#2471A3]">{bi(isAr, "تجريبي", "Trial")}</p>
          </div>
          <div className={failedCount > 0 ? "bg-[#FEF0EE]" : "bg-[#F8F9FA]" + " rounded-2xl px-3 py-3 text-center"}>
            <p className={`text-lg font-bold ${failedCount > 0 ? "text-[#C0392B]" : "text-[#627D98]"}`}>
              {failedCount}
            </p>
            <p className={`text-[10px] ${failedCount > 0 ? "text-[#C0392B]" : "text-[#627D98]"}`}>
              {bi(isAr, "دفع فاشل", "Failed")}
            </p>
          </div>
          <div className="bg-[#F8F9FA] rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-bold text-[#102A43]">{revenue.toLocaleString(numLocale)} {bi(isAr, "ر.ع.", "OMR")}</p>
            <p className="text-[10px] text-[#627D98]">{bi(isAr, "إيرادات (وهمية)", "Revenue (demo)")}</p>
          </div>
        </div>

        {/* Monthly revenue trend — text only */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3">
          <p className="text-xs font-bold text-[#102A43] mb-2">
            {bi(isAr, "توجه الإيرادات (بيانات تقديرية)", "Revenue trend (estimated)")}
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
          <p className="text-xs font-bold text-[#102A43] mb-2">{bi(isAr, "توزيع الخطط", "Plan distribution")}</p>
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
              {bi(isAr, "الإضافات النشطة", "Active add-ons")} ({activeAddOns.length})
            </p>
            <div className="space-y-2">
              {activeAddOns.map((addon) => (
                <div
                  key={addon.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-2 flex items-center justify-between"
                >
                  <span className="text-xs text-[#102A43]">
                    {isAr ? ADDON_LABELS_AR[addon.addOnType] : ADDON_LABELS_EN[addon.addOnType]}
                  </span>
                  <span className="text-xs font-semibold text-[#0A3C36]">
                    {addon.amount.toLocaleString(numLocale)} {bi(isAr, "ر.ع.", "OMR")}
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
              {bi(isAr, "تنبيه — دفعات فاشلة", "Alert — failed payments")}
            </p>
            <p className="text-[10px] text-[#627D98]">
              {bi(isAr,
                `يوجد ${failedCount} اشتراك بدفعة فاشلة. يلزم مراجعة يدوية أو إشعار تلقائي عبر مزود الدفع.`,
                `${failedCount} subscription(s) have a failed payment. Manual review or an automatic notice via the payment provider is required.`)}
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
                {statusLabels[f]}
              </button>
            ))}
          </div>

          {/* Subscription list */}
          <p className="text-xs font-bold text-[#102A43] mb-2">
            {bi(isAr, "الاشتراكات", "Subscriptions")} ({filtered.length})
          </p>
          {filtered.length === 0 ? (
            <AdminEmptyState titleAr="لا توجد اشتراكات في هذا التصنيف" titleEn="No subscriptions in this category" />
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
                        {displayMeta(sub.userNameAr, isAr)}
                      </p>
                      <PlanBadge planId={sub.planId} className="mt-1" />
                    </div>
                    <StatusBadge
                      label={isAr ? PAYMENT_STATUS_AR[sub.paymentStatus] : PAYMENT_STATUS_EN[sub.paymentStatus]}
                      variant={STATUS_VARIANT[sub.paymentStatus]}
                      size="xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#F8F9FA] rounded-xl py-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {sub.amount === 0 ? bi(isAr, "مجاني", "Free") : `${sub.amount.toLocaleString(numLocale)} ${bi(isAr, "ر.ع.", "OMR")}`}
                      </p>
                      <p className="text-[10px] text-[#627D98]">{bi(isAr, "الرسوم", "Fee")}</p>
                    </div>
                    <div className="bg-[#F8F9FA] rounded-xl py-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {new Date(sub.startDate).toLocaleDateString(numLocale, {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-[#627D98]">{bi(isAr, "بدء", "Start")}</p>
                    </div>
                    <div className="bg-[#F8F9FA] rounded-xl py-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {sub.nextBillDate
                          ? new Date(sub.nextBillDate).toLocaleDateString(
                              numLocale,
                              { month: "short", year: "numeric" }
                            )
                          : "—"}
                      </p>
                      <p className="text-[10px] text-[#627D98]">{bi(isAr, "تجديد", "Renewal")}</p>
                    </div>
                  </div>

                  {sub.paymentStatus === "failed" && (
                    <div className="mt-3">
                      <button
                        disabled
                        className="w-full py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold opacity-60 cursor-not-allowed"
                        aria-label={bi(isAr, "إعادة المحاولة — غير متاح في المعاينة", "Retry — not available in preview")}
                      >
                        {bi(isAr, "إعادة محاولة الدفع — غير متاح في المعاينة", "Retry payment — not available in preview")}
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
