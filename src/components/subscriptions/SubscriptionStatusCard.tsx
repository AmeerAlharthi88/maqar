// ── SubscriptionStatusCard — current plan overview card ──────────────────────

import Link from "next/link";
import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import { PlanBadge } from "@/components/subscriptions/PlanBadge";
import { PaymentStatusBadge } from "@/components/subscriptions/PaymentStatusBadge";
import type { UserSubscription } from "@/lib/payments/types";
import { PLAN_PRICES, PLAN_NAMES_AR } from "@/lib/payments/plans";

interface SubscriptionStatusCardProps {
  subscription: UserSubscription;
  className?: string;
  showBillingLink?: boolean;
}

export function SubscriptionStatusCard({
  subscription,
  className,
  showBillingLink = true,
}: SubscriptionStatusCardProps) {
  const price = PLAN_PRICES[subscription.planId];
  const isPaid = price > 0;

  const periodEnd = new Date(subscription.currentPeriodEnd).toLocaleDateString(
    "ar-OM",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#F0EBE3] p-4",
        className
      )}
      dir="rtl"
    >
      {/* Plan name + status */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-[#A89480] mb-1">خطتك الحالية</p>
          <p className="text-base font-bold text-[#1E1E1E]">
            {PLAN_NAMES_AR[subscription.planId]}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <PlanBadge planId={subscription.planId} />
          <PaymentStatusBadge status={subscription.status} />
        </div>
      </div>

      {/* Price */}
      {isPaid ? (
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-bold text-[#C65D3B]">
            {toArabicNumerals(price)}
          </span>
          <span className="text-sm text-[#7A6B5E]">ر.ع. / شهر</span>
        </div>
      ) : (
        <p className="text-xl font-bold text-[#1E1E1E] mb-3">مجاني</p>
      )}

      {/* Period */}
      {isPaid && (
        <div className="bg-[#FAF7F4] rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-[#7A6B5E]">
            {subscription.cancelAtPeriodEnd
              ? `ينتهي في ${periodEnd} ولن يتجدد`
              : `يتجدد في ${periodEnd}`}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {subscription.planId === "free" ? (
          <Link
            href="/pricing"
            className="flex-1 py-2.5 text-center rounded-xl bg-[#C65D3B] text-white text-xs font-bold"
            aria-label="ترقية الخطة"
          >
            ترقية الخطة
          </Link>
        ) : (
          <>
            <Link
              href="/pricing"
              className="flex-1 py-2.5 text-center rounded-xl bg-[#F5F0EA] text-[#1E1E1E] text-xs font-semibold border border-[#E8DDD0]"
              aria-label="تغيير الخطة"
            >
              تغيير الخطة
            </Link>
            {showBillingLink && (
              <Link
                href="/account/billing"
                className="flex-1 py-2.5 text-center rounded-xl bg-[#F5F0EA] text-[#1E1E1E] text-xs font-semibold border border-[#E8DDD0]"
                aria-label="الفواتير"
              >
                الفواتير
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
