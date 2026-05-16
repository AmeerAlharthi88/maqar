"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_AGENCIES } from "@/mock/agencies";

// TODO: replace with dedicated AdminAgency type + Supabase query in Phase 12
type AgencyVerificationStatus = "verified" | "pending" | "rejected" | "suspended";

const STATUS_AR: Record<AgencyVerificationStatus, string> = {
  verified:  "موثّقة",
  pending:   "في الانتظار",
  rejected:  "مرفوضة",
  suspended: "موقوفة",
};

const STATUS_VARIANT: Record<AgencyVerificationStatus, "success" | "warning" | "danger" | "neutral"> = {
  verified:  "success",
  pending:   "warning",
  rejected:  "danger",
  suspended: "neutral",
};

// Augment mock data with admin-specific status — replace with real data in Phase 12
const ADMIN_AGENCY_DATA = MOCK_AGENCIES.map((a, i) => ({
  ...a,
  verificationStatus: (["verified", "verified", "pending", "verified"][i] ?? "pending") as AgencyVerificationStatus,
  crValid: [true, true, true, true][i] ?? false,
  activeSubscription: [true, true, false, true][i] ?? false,
}));

const FILTERS: (AgencyVerificationStatus | "all")[] = ["all", "verified", "pending", "rejected", "suspended"];
const FILTER_AR: Record<AgencyVerificationStatus | "all", string> = { all: "الكل", ...STATUS_AR };

export default function AdminAgenciesPage() {
  const [filter, setFilter] = useState<AgencyVerificationStatus | "all">("all");
  const [agencies, setAgencies] = useState(ADMIN_AGENCY_DATA);

  const filtered = filter === "all" ? agencies : agencies.filter((a) => a.verificationStatus === filter);

  const suspend = (id: string) =>
    setAgencies((prev) => prev.map((a) => a.id === id ? { ...a, verificationStatus: "suspended" as AgencyVerificationStatus } : a));
  const reinstate = (id: string) =>
    setAgencies((prev) => prev.map((a) => a.id === id ? { ...a, verificationStatus: "verified" as AgencyVerificationStatus } : a));

  const verifiedCount = agencies.filter((a) => a.verificationStatus === "verified").length;

  return (
    <AdminDashboardShell titleAr="إدارة الشركات">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#A89480]">{verifiedCount} شركة موثّقة · {agencies.length} إجمالي</p>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map((f) => {
            const count = f === "all" ? agencies.length : agencies.filter((a) => a.verificationStatus === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
              >
                {FILTER_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد شركات" descriptionAr="لا توجد نتائج مطابقة للفلتر المحدد." />
        ) : (
          <div className="space-y-3">
            {filtered.map((agency) => {
              const isSuspended = agency.verificationStatus === "suspended";
              const initials = agency.nameAr.slice(0, 2);
              return (
                <div key={agency.id} className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4" dir="rtl">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-[#C65D3B]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#C65D3B]">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1E1E1E]">{agency.nameAr}</p>
                      <p className="text-xs text-[#7A6B5E]">{agency.location.wilayatAr} · {agency.location.governorateAr}</p>
                    </div>
                    <StatusBadge
                      label={STATUS_AR[agency.verificationStatus]}
                      variant={STATUS_VARIANT[agency.verificationStatus]}
                      size="xs"
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                      <p className="text-xs font-bold text-[#1E1E1E]">{agency.stats.activeListings}</p>
                      <p className="text-[10px] text-[#A89480]">إعلان نشط</p>
                    </div>
                    <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                      <p className="text-xs font-bold text-[#1E1E1E]">{agency.stats.totalAgents}</p>
                      <p className="text-[10px] text-[#A89480]">وسيط</p>
                    </div>
                    <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                      <p className="text-xs font-bold text-[#1E1E1E]">{agency.foundedYear}</p>
                      <p className="text-[10px] text-[#A89480]">تأسست</p>
                    </div>
                    <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                      <p className={["text-xs font-bold", agency.activeSubscription ? "text-[#5B8C5A]" : "text-[#C65D3B]"].join(" ")}>
                        {agency.activeSubscription ? "نشط" : "لا"}
                      </p>
                      <p className="text-[10px] text-[#A89480]">اشتراك</p>
                    </div>
                  </div>

                  {/* CR & License */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {agency.crNumber && (
                      <span className={["text-[10px] font-semibold px-2 py-0.5 rounded-lg",
                        agency.crValid ? "bg-[#EDF4ED] text-[#5B8C5A]" : "bg-[#FBF0EB] text-[#C65D3B]"].join(" ")}>
                        س.ت. {agency.crNumber}
                      </span>
                    )}
                    {agency.licenseNumber && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#EAF4FB] text-[#2471A3]">
                        رخصة: {agency.licenseNumber}
                      </span>
                    )}
                    {agency.email && (
                      <span className="text-[10px] text-[#A89480]">{agency.email}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!isSuspended ? (
                      <button onClick={() => suspend(agency.id)}
                        className="flex-1 py-2 rounded-xl bg-[#FBF0EB] text-[#C65D3B] text-xs font-bold">
                        تعليق مؤقت
                      </button>
                    ) : (
                      <button onClick={() => reinstate(agency.id)}
                        className="flex-1 py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold">
                        إعادة تفعيل
                      </button>
                    )}
                    {/* Role/plan changes are server-only — TODO: Phase 12 */}
                    <div className="flex-1 py-2 rounded-xl bg-[#F5F0EA] text-center">
                      <p className="text-[10px] text-[#A89480] font-semibold">تعديل الخطة</p>
                      <p className="text-[9px] text-[#C4B5A5]">إجراء خادم فقط</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
