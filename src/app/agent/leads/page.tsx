"use client";

import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { LeadCard } from "@/components/dashboard/LeadCard";
import { MOCK_LEADS } from "@/mock/leads";
import { LEAD_STATUS_LABELS_AR } from "@/types/lead";
import type { LeadStatus } from "@/types/lead";
import { useState } from "react";
import { SmartReplyPanel } from "@/components/ai/SmartReplyPanel";

const STATUS_ORDER: LeadStatus[] = [
  "new", "contacted", "viewing_scheduled", "negotiating", "closed", "lost",
];

export default function AgentLeadsPage() {
  const [activeFilter, setActiveFilter] = useState<LeadStatus | "all">("all");
  const [smartReplyLeadId, setSmartReplyLeadId] = useState<string | null>(null);

  const filtered = activeFilter === "all"
    ? MOCK_LEADS
    : MOCK_LEADS.filter((l) => l.status === activeFilter);

  const smartReplyLead = MOCK_LEADS.find((l) => l.id === smartReplyLeadId);

  return (
    <AgentDashboardShell titleAr="العملاء المحتملون">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={[
              "px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
              activeFilter === "all" ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]",
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
                  activeFilter === status ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]",
                ].join(" ")}
              >
                {LEAD_STATUS_LABELS_AR[status]} ({count})
              </button>
            );
          })}
        </div>

        {/* Smart reply panel (shown when a lead is selected) */}
        {smartReplyLead && (
          <SmartReplyPanel
            lead={smartReplyLead}
            onClose={() => setSmartReplyLeadId(null)}
          />
        )}

        {/* Lead cards */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((lead) => (
              <div key={lead.id} className="space-y-1">
                <LeadCard lead={lead} />
                <button
                  onClick={() => setSmartReplyLeadId(lead.id === smartReplyLeadId ? null : lead.id)}
                  className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7A6B5E] hover:text-[#C65D3B] transition-colors mr-1"
                  aria-label="رد ذكي على هذا العميل"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  رد ذكي
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-[#A89480]">لا توجد عملاء في هذه الفئة</p>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
