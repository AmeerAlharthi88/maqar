"use client";

import { AgencyDashboardShell } from "@/components/agency/AgencyDashboardShell";
import { LeadCard } from "@/components/dashboard/LeadCard";
import { MOCK_LEADS } from "@/mock/leads";
import { LEAD_STATUS_LABELS_AR } from "@/types/lead";
import type { LeadStatus } from "@/types/lead";
import { useState } from "react";

const STATUS_ORDER: LeadStatus[] = [
  "new", "contacted", "viewing_scheduled", "negotiating", "closed", "lost",
];

export default function AgencyLeadsPage() {
  const [activeFilter, setActiveFilter] = useState<LeadStatus | "all">("all");

  // TODO: fetch all agency leads in Phase 11 (currently using agent-1 mock)
  const filtered = activeFilter === "all"
    ? MOCK_LEADS
    : MOCK_LEADS.filter((l) => l.status === activeFilter);

  return (
    <AgencyDashboardShell titleAr="عملاء الوكالة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={[
              "px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
              activeFilter === "all" ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]",
            ].join(" ")}
          >
            الكل ({MOCK_LEADS.length})
          </button>
          {STATUS_ORDER.map((status) => {
            const count = MOCK_LEADS.filter((l) => l.status === status).length;
            if (count === 0) return null;
            return (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={[
                  "px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  activeFilter === status ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]",
                ].join(" ")}
              >
                {LEAD_STATUS_LABELS_AR[status]} ({count})
              </button>
            );
          })}
        </div>

        {/* Lead cards */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-[#627D98]">لا توجد عملاء في هذه الفئة</p>
          </div>
        )}
      </div>
    </AgencyDashboardShell>
  );
}
