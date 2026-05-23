"use client";

import { AgencyDashboardShell } from "@/components/agency/AgencyDashboardShell";
import { TeamMemberCard } from "@/components/agency/TeamMemberCard";
import { MOCK_AGENCIES } from "@/mock/agencies";

export default function AgencyTeamPage() {
  // TODO: load from real agency Supabase profile in Phase 11
  const agency  = MOCK_AGENCIES[0];
  const members = agency.members ?? [];

  return (
    <AgencyDashboardShell titleAr="فريق الوكالة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#627D98]">
            {members.length} من {agency.stats.totalAgents} وسيط
          </p>
          <button
            className="px-3 py-1.5 bg-[#0A3C36] text-white text-xs font-bold rounded-xl"
            onClick={() => alert("دعوة وسيط — قيد التطوير")}
          >
            + دعوة وسيط
          </button>
        </div>

        {/* Member cards */}
        {members.length > 0 ? (
          <div className="space-y-2">
            {members.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isOwner
                onChangeRole={() => {}}
                onRemove={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-[#627D98]">لا يوجد أعضاء بعد</p>
          </div>
        )}

        <p className="text-center text-[10px] text-[#627D98] pb-2">
          إدارة الصلاحيات والدعوات مرتبطة بقاعدة البيانات في Phase 11
        </p>
      </div>
    </AgencyDashboardShell>
  );
}
