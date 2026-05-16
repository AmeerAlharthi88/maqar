"use client";

// ── Agent subscription page — Phase 14 overhaul ───────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { SubscriptionStatusCard } from "@/components/subscriptions/SubscriptionStatusCard";
import { UsageMeter } from "@/components/subscriptions/UsageMeter";
import { AddOnCard } from "@/components/subscriptions/AddOnCard";
import { UpgradePrompt } from "@/components/subscriptions/UpgradePrompt";
import { PlanCard } from "@/components/subscriptions/PlanCard";
import {
  MOCK_AGENT_PRO_SUBSCRIPTION,
  MOCK_AGENT_PRO_USAGE_LIMITS,
} from "@/mock/subscriptions";
import { canCreateListing, canFeatureListing } from "@/lib/payments/usage-limits";
import { ADDON_PRICES } from "@/lib/payments/plans";

export default function AgentSubscriptionPage() {
  // TODO Phase 15+: load from Supabase session
  const subscription = MOCK_AGENT_PRO_SUBSCRIPTION;
  const usageLimits = MOCK_AGENT_PRO_USAGE_LIMITS;
  const [showUpgrade, setShowUpgrade] = useState(false);

  const listingUsage = usageLimits.find((u) => u.feature === "listing");
  const listingCount = listingUsage?.current ?? 0;
  const isListingAtLimit = !canCreateListing(subscription.planId, listingCount);
  const canFeature = canFeatureListing(subscription.planId);

  return (
    <AgentDashboardShell titleAr="الاشتراك">
      <div className="px-4 py-4 space-y-5" dir="rtl">

        {/* Mock notice */}
        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-2xl px-4 py-3">
          <p className="text-xs font-semibold text-[#C8860A]">وضع المعاينة</p>
          <p className="text-[10px] text-[#7A6B5E] mt-0.5">
            معالجة المدفوعات غير مفعّلة. البيانات تجريبية.
          </p>
        </div>

        {/* Current subscription card */}
        <SubscriptionStatusCard subscription={subscription} />

        {/* Usage limits */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">
            الاستخدام الحالي
          </h2>
          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4 space-y-4">
            {usageLimits.map((u) => (
              <UsageMeter key={u.feature} usage={u} />
            ))}
          </div>
        </div>

        {/* Listing limit gate */}
        {isListingAtLimit && (
          <UpgradePrompt
            titleAr="وصلت إلى حد الإعلانات النشطة"
            messageAr="يمكنك نشر المزيد من الإعلانات بالترقية إلى خطة أعلى أو حذف إعلانات قديمة."
            ctaAr="ترقية الخطة"
            variant="banner"
          />
        )}

        {/* Add-ons */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-1">الإضافات</h2>
          <p className="text-xs text-[#A89480] mb-3">
            أدوات إضافية لتعزيز ظهورك وجذب عملاء محتملين.
          </p>
          <div className="space-y-3">
            <AddOnCard
              addOnType="featured_listing"
              price={ADDON_PRICES.featured_listing}
              unit="أسبوع"
              descAr="رفع إعلانك لأعلى نتائج البحث لمدة أسبوع"
              disabled={!canFeature}
              disabledReason="يتطلب خطة الوسيط الاحترافي أو الوكالة"
            />
            <AddOnCard
              addOnType="lead_boost"
              price={ADDON_PRICES.lead_boost}
              unit="مرة"
              descAr="الحصول على عملاء محتملين إضافيين في منطقة إعلاناتك"
              disabled={!canFeature}
              disabledReason="يتطلب خطة الوسيط الاحترافي أو الوكالة"
            />
          </div>
        </div>

        {/* Upgrade options */}
        {subscription.planId !== "agency" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1E1E1E]">
                ترقية خطتك
              </h2>
              <button
                onClick={() => setShowUpgrade(!showUpgrade)}
                className="text-xs text-[#C65D3B] font-semibold"
                aria-expanded={showUpgrade}
                aria-label="عرض خيارات الترقية"
              >
                {showUpgrade ? "إخفاء" : "عرض الخيارات"}
              </button>
            </div>
            {showUpgrade && (
              <div className="space-y-4">
                {subscription.planId === "free" && (
                  <PlanCard planId="agent_pro" isHighlighted isLoggedIn />
                )}
                <PlanCard planId="agency" isLoggedIn />
              </div>
            )}
          </div>
        )}

        {/* Billing link */}
        <div className="text-center pb-2">
          <Link
            href="/account/billing"
            className="text-sm text-[#C65D3B] font-semibold underline underline-offset-2"
          >
            عرض الفواتير وسجل الدفع
          </Link>
        </div>
      </div>
    </AgentDashboardShell>
  );
}
