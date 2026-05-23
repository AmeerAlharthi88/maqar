"use client";

// ── PlanCard — rich plan card for pricing page ────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import { CheckoutModal } from "@/components/subscriptions/CheckoutModal";
import { PLAN_ENTITLEMENTS, PLAN_NAMES_AR, PLAN_PRICES } from "@/lib/payments/plans";
import type { PlanId } from "@/lib/payments/types";

interface PlanFeatureRow {
  labelAr: string;
  included: boolean;
  valueAr?: string;
}

function getPlanFeatures(planId: PlanId): PlanFeatureRow[] {
  const e = PLAN_ENTITLEMENTS[planId];
  return [
    {
      labelAr: "إعلانات نشطة",
      included: true,
      valueAr: e.maxActiveListings === null
        ? "غير محدود"
        : `${toArabicNumerals(e.maxActiveListings)} إعلان`,
    },
    {
      labelAr: "إعلانات مميزة شهرياً",
      included: e.maxFeaturedListings > 0,
      valueAr: e.maxFeaturedListings > 0
        ? `${toArabicNumerals(e.maxFeaturedListings)} مجاناً`
        : undefined,
    },
    { labelAr: "لوحة التحليلات",         included: e.canAccessAnalytics },
    { labelAr: "إدارة العملاء المحتملين", included: e.canAccessLeads },
    { labelAr: "إدارة الفريق",            included: e.canManageTeam },
    { labelAr: "أهلية التحقق",            included: e.verificationEligible },
    {
      labelAr: "المساعد الذكي اليومي",
      included: true,
      valueAr: e.aiAssistantDailyLimit === -1
        ? "غير محدود"
        : `${toArabicNumerals(e.aiAssistantDailyLimit)} استخدام`,
    },
    { labelAr: "شراء إعلانات مميزة",  included: e.canPurchaseFeaturedListing },
    { labelAr: "تعزيز العملاء المحتملين", included: e.canPurchaseLeadBoost },
    { labelAr: "دعم أولوية",           included: e.prioritySupport },
  ];
}

interface PlanCardProps {
  planId: PlanId;
  isCurrent?: boolean;
  isHighlighted?: boolean;
  isLoggedIn?: boolean;
}

export function PlanCard({
  planId,
  isCurrent = false,
  isHighlighted = false,
  isLoggedIn = false,
}: PlanCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const price = PLAN_PRICES[planId];
  const nameAr = PLAN_NAMES_AR[planId];
  const features = getPlanFeatures(planId);
  const isFree = price === 0;
  const isAgency = planId === "agency";

  function handleCTA() {
    if (isCurrent || isFree) return;
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    if (isAgency) return; // contact sales, not checkout
    setShowModal(true);
  }

  return (
    <>
      <div
        className={cn(
          "relative rounded-2xl border-2 p-5 bg-white",
          isHighlighted
            ? "border-[#0A3C36] shadow-lg"
            : isCurrent
            ? "border-[#0A3C36]"
            : "border-[#E2E8F0]"
        )}
        dir="rtl"
      >
        {/* Popular badge */}
        {isHighlighted && !isCurrent && (
          <span className="absolute -top-3 right-5 bg-[#0A3C36] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
            الأكثر طلباً
          </span>
        )}
        {isCurrent && (
          <span className="absolute -top-3 right-5 bg-[#0A3C36] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
            خطتك الحالية
          </span>
        )}

        {/* Plan name & price */}
        <div className="mb-4">
          <p className="text-base font-bold text-[#102A43] mb-2">{nameAr}</p>
          {isFree ? (
            <p className="text-3xl font-bold text-[#102A43]">مجاني</p>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#0A3C36]">
                {toArabicNumerals(price)}
              </span>
              <span className="text-sm text-[#627D98]">ر.ع. / شهر</span>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-5">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              {f.included ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2.5" className="flex-shrink-0 mt-0.5" aria-label="متاح">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2.5" className="flex-shrink-0 mt-0.5" aria-label="غير متاح">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
              <span className={cn("text-xs leading-relaxed", f.included ? "text-[#102A43]" : "text-[#627D98]")}>
                {f.labelAr}
                {f.valueAr && (
                  <span className="font-semibold text-[#0A3C36]"> — {f.valueAr}</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isCurrent ? (
          <p className="text-center text-xs text-[#0A3C36] font-semibold py-2">
            خطتك النشطة
          </p>
        ) : isFree ? (
          <Link
            href="/auth/login"
            className="block w-full py-3 text-center rounded-xl bg-[#F0F4F8] text-[#627D98] text-sm font-bold border border-[#E2E8F0]"
            aria-label="ابدأ مجاناً"
          >
            ابدأ مجاناً
          </Link>
        ) : isAgency ? (
          <a
            href="mailto:sales@maqar.om"
            className="block w-full py-3 text-center rounded-xl bg-[#0A3C36] text-white text-sm font-bold"
            aria-label="تواصل للخطة المؤسسية"
          >
            تواصل معنا
          </a>
        ) : (
          <>
            <button
              onClick={handleCTA}
              className="w-full py-3 rounded-xl bg-[#0A3C36] text-white text-sm font-bold"
              aria-label={`ترقية إلى ${nameAr}`}
            >
              ترقية إلى {nameAr}
            </button>
            {showLoginPrompt && (
              <div className="mt-3 bg-[#E6F0EF] rounded-xl p-3 text-center">
                <p className="text-xs text-[#0A3C36] font-semibold mb-1">
                  يلزم تسجيل الدخول
                </p>
                <Link
                  href="/auth/login"
                  className="text-xs text-[#0A3C36] underline"
                >
                  تسجيل الدخول للمتابعة
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <CheckoutModal
          planId={planId}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </>
  );
}
