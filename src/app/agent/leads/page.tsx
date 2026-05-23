"use client";

import { useEffect, useState } from "react";
import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { LeadCard } from "@/components/dashboard/LeadCard";
import { MOCK_LEADS } from "@/mock/leads";
import { LEAD_STATUS_LABELS_AR } from "@/types/lead";
import type { Lead, LeadStatus } from "@/types/lead";
import { SmartReplyPanel } from "@/components/ai/SmartReplyPanel";
import { useAuthStore } from "@/store/auth.store";
import { fetchAgentLeads, updateLeadStatus } from "@/lib/supabase/crm";
import type { CrmLead } from "@/lib/supabase/crm";

const STATUS_ORDER: LeadStatus[] = [
  "new", "contacted", "viewing_scheduled", "negotiating", "closed", "lost",
];

function crmLeadToLead(crm: CrmLead): Lead {
  return {
    id: crm.id,
    customerNameAr: crm.customerName || "—",
    customerPhone: crm.customerPhone || "",
    listingId: crm.listingId,
    listingTitleAr: crm.listingTitleAr,
    source: crm.source,
    status: crm.status,
    notes: crm.notes ?? crm.message ?? undefined,
    agentId: crm.agentId,
    createdAt: crm.createdAt,
    updatedAt: crm.updatedAt,
  };
}

export default function AgentLeadsPage() {
  const { user } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<LeadStatus | "all">("all");
  const [smartReplyLeadId, setSmartReplyLeadId] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user?.id) {
      setLeads(MOCK_LEADS);
      setLoading(false);
      return;
    }
    fetchAgentLeads(user.id)
      .then((rows) => {
        setLeads(rows.length > 0 ? rows.map(crmLeadToLead) : MOCK_LEADS);
      })
      .catch(() => setLeads(MOCK_LEADS))
      .finally(() => setLoading(false));
  }, [user?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleStatusChange(leadId: string, status: LeadStatus) {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString() } : l
      )
    );
    await updateLeadStatus(leadId, status).catch((err) =>
      console.error("[Leads] updateLeadStatus error:", err)
    );
  }

  const filtered =
    activeFilter === "all" ? leads : leads.filter((l) => l.status === activeFilter);

  const smartReplyLead = leads.find((l) => l.id === smartReplyLeadId);

  if (loading) {
    return (
      <AgentDashboardShell titleAr="العملاء المحتملون">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#0A3C36] border-t-transparent animate-spin" />
        </div>
      </AgentDashboardShell>
    );
  }

  return (
    <AgentDashboardShell titleAr="العملاء المحتملون">
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
            الكل ({leads.length})
          </button>
          {STATUS_ORDER.map((status) => {
            const count = leads.filter((l) => l.status === status).length;
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
                <div className="flex items-center justify-between mr-1">
                  {/* Smart reply toggle */}
                  <button
                    onClick={() =>
                      setSmartReplyLeadId(lead.id === smartReplyLeadId ? null : lead.id)
                    }
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-[#627D98] hover:text-[#0A3C36] transition-colors"
                    aria-label="رد ذكي على هذا العميل"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    رد ذكي
                  </button>

                  {/* Inline status update */}
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      void handleStatusChange(lead.id, e.target.value as LeadStatus)
                    }
                    className="text-[10px] font-semibold text-[#627D98] bg-[#F0F4F8] border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
                    aria-label="تحديث حالة العميل"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {LEAD_STATUS_LABELS_AR[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-[#627D98]">لا توجد عملاء في هذه الفئة</p>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
