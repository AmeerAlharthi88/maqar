import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { SubscriptionStatusCard } from "@/components/subscriptions/SubscriptionStatusCard";
import { BillingHistoryTable } from "@/components/subscriptions/BillingHistoryTable";
import { UsageMeter } from "@/components/subscriptions/UsageMeter";
import {
  MOCK_AGENT_PRO_SUBSCRIPTION,
  MOCK_BILLING_HISTORY,
  MOCK_AGENT_PRO_USAGE_LIMITS,
  MOCK_ADDON_PURCHASES,
} from "@/mock/subscriptions";
import { ADDON_LABELS_AR } from "@/lib/payments/plans";
import { formatOMR } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "الفواتير والاشتراك | مقر",
  description: "إدارة اشتراكك، عرض الفواتير، وإلغاء أو تغيير خطتك في مقر.",
};

export default function BillingPage() {
  // TODO Phase 15+: load real subscription from Supabase session
  const subscription = MOCK_AGENT_PRO_SUBSCRIPTION;
  const billingHistory = MOCK_BILLING_HISTORY;
  const usageLimits = MOCK_AGENT_PRO_USAGE_LIMITS;
  const addOnPurchases = MOCK_ADDON_PURCHASES;

  const activeAddOns = addOnPurchases.filter((a) => a.isActive);

  return (
    <AppShell>
      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto" dir="rtl">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#1E1E1E] mb-1">
            الاشتراك والفواتير
          </h1>
          <p className="text-sm text-[#7A6B5E]">
            إدارة خطتك وعرض سجلات الدفع
          </p>
        </div>

        {/* Mock notice */}
        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-2xl px-4 py-3">
          <p className="text-xs font-semibold text-[#C8860A] mb-0.5">
            وضع المعاينة
          </p>
          <p className="text-xs text-[#7A6B5E]">
            معالجة المدفوعات غير مفعّلة بعد. البيانات المعروضة للتجربة فقط.
          </p>
        </div>

        {/* Current subscription */}
        <SubscriptionStatusCard
          subscription={subscription}
          showBillingLink={false}
        />

        {/* Usage */}
        <div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-3">
            الاستخدام الحالي
          </h2>
          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4 space-y-4">
            {usageLimits.map((u) => (
              <UsageMeter key={u.feature} usage={u} />
            ))}
          </div>
        </div>

        {/* Active add-ons */}
        {activeAddOns.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-[#1E1E1E] mb-3">
              الإضافات النشطة
            </h2>
            <div className="space-y-2">
              {activeAddOns.map((addon) => (
                <div
                  key={addon.id}
                  className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#1E1E1E]">
                      {ADDON_LABELS_AR[addon.addOnType]}
                    </p>
                    <p className="text-xs text-[#A89480]">
                      ينتهي:{" "}
                      {new Date(addon.expiresAt).toLocaleDateString("ar-OM", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#C65D3B]">
                    {formatOMR(addon.amount, { arabic: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing history */}
        <div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-3">
            سجل الفواتير
          </h2>
          <BillingHistoryTable records={billingHistory} />
        </div>

        {/* Danger zone: cancel */}
        <div className="bg-[#FEF0F0] border border-[#C0392B]/20 rounded-2xl p-4">
          <p className="text-sm font-bold text-[#C0392B] mb-1">
            إلغاء الاشتراك
          </p>
          <p className="text-xs text-[#7A6B5E] leading-relaxed mb-3">
            يمكنك إلغاء الاشتراك في أي وقت. سيستمر الوصول حتى نهاية الفترة المدفوعة.
          </p>
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-white border border-[#C0392B]/30 text-[#C0392B] text-xs font-bold opacity-60 cursor-not-allowed"
            aria-label="إلغاء الاشتراك — غير متاح حالياً"
          >
            إلغاء الاشتراك — غير متاح في المعاينة
          </button>
        </div>

        {/* Payment method placeholder */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
          <p className="text-sm font-bold text-[#1E1E1E] mb-1">
            طريقة الدفع
          </p>
          <p className="text-xs text-[#A89480]">
            إضافة وإدارة طرق الدفع ستكون متاحة عند تفعيل مزود الدفع.
          </p>
        </div>

        {/* Upgrade link */}
        <div className="text-center">
          <Link
            href="/pricing"
            className="text-sm text-[#C65D3B] font-semibold underline underline-offset-2"
          >
            عرض جميع الخطط والأسعار
          </Link>
        </div>

        <p className="text-[11px] text-[#A89480] text-center leading-relaxed">
          لأسئلة الفواتير تواصل مع support@maqar.om · جميع الأسعار بالريال العُماني
        </p>
      </div>
    </AppShell>
  );
}
