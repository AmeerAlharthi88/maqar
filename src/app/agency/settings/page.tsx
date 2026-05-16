"use client";

import { AgencyDashboardShell } from "@/components/agency/AgencyDashboardShell";
import { SubscriptionPlanCard } from "@/components/dashboard/SubscriptionPlanCard";
import { MOCK_AGENCIES } from "@/mock/agencies";
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_ADDONS } from "@/types/subscription";

export default function AgencySettingsPage() {
  // TODO: load from real Supabase in Phase 11
  const agency = MOCK_AGENCIES[0];
  const currentPlanId = "agency";

  const agencyPlan = SUBSCRIPTION_PLANS.find((p) => p.id === "agency");

  return (
    <AgencyDashboardShell titleAr="إعدادات الوكالة">
      <div className="px-4 py-4 space-y-5" dir="rtl">
        {/* Agency info */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">بيانات الوكالة</h2>
          <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
            {[
              { label: "اسم الوكالة",  value: agency.nameAr },
              { label: "الهاتف",        value: agency.phone },
              { label: "البريد",        value: agency.email ?? "—" },
              { label: "الولاية",       value: agency.location.wilayatAr },
              { label: "السجل التجاري", value: agency.crNumber ?? "—" },
              { label: "رقم الترخيص",  value: agency.licenseNumber ?? "—" },
            ].map((row, idx, arr) => (
              <div
                key={row.label}
                className={[
                  "flex items-center justify-between px-4 py-3",
                  idx < arr.length - 1 ? "border-b border-[#F0EBE3]" : "",
                ].join(" ")}
              >
                <p className="text-xs text-[#A89480]">{row.label}</p>
                <p className="text-sm font-semibold text-[#1E1E1E]">{row.value}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 rounded-xl border border-[#E8DDD0] bg-[#F5F0EA] text-xs font-semibold text-[#1E1E1E]">
            تعديل بيانات الوكالة
          </button>
        </div>

        {/* Current subscription */}
        {agencyPlan && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">خطة الاشتراك</h2>
            <SubscriptionPlanCard
              plan={agencyPlan}
              isCurrent={agencyPlan.id === currentPlanId}
              onSelect={() => {}}
            />
          </div>
        )}

        {/* Add-ons */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">الإضافات المتاحة</h2>
          <div className="space-y-2">
            {SUBSCRIPTION_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1E1E1E]">{addon.nameAr}</p>
                  <p className="text-xs text-[#7A6B5E] mt-0.5">{addon.descAr}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="text-sm font-bold text-[#C65D3B]">{addon.price} ر.ع.</p>
                  <p className="text-[10px] text-[#A89480]">/{addon.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-[#C4B5A5] pb-2">
          تعديل الإعدادات مرتبط بقاعدة البيانات في Phase 11
        </p>
      </div>
    </AgencyDashboardShell>
  );
}
