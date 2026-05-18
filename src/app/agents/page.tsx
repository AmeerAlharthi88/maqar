import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { AgentDirectoryCard } from "@/components/agent/AgentDirectoryCard";
import { MOCK_AGENTS } from "@/mock/agents";
import { getAgentProfiles } from "@/lib/supabase/agents";

// Re-render at most once every 5 minutes so newly onboarded agents appear.
export const revalidate = 300;

export default async function AgentsPage() {
  // ── Try real DB profiles; fall back to mock if empty or unavailable ─────────
  const dbAgents = await getAgentProfiles();
  const agents = dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;

  return (
    <AppShell>
      <AppHeader variant="back" titleAr="الوسطاء العقاريون" />
      <div className="px-4 py-4 space-y-3" dir="rtl">
        {/* Summary bar */}
        <p className="text-xs text-[#A89480]">
          {agents.length} وسيط معتمد في سلطنة عُمان
        </p>

        {/* Agent cards */}
        {agents.map((agent) => (
          <AgentDirectoryCard key={agent.id} agent={agent} />
        ))}

        {agents.length === 0 && (
          <p className="text-center text-sm text-[#A89480] py-8">
            لا يوجد وسطاء متاحون حالياً
          </p>
        )}
      </div>
    </AppShell>
  );
}
