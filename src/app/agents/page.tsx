import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { AgentDirectoryCard } from "@/components/agent/AgentDirectoryCard";
import { MOCK_AGENTS } from "@/mock/agents";

export default function AgentsPage() {
  return (
    <AppShell>
      <AppHeader variant="back" titleAr="الوسطاء العقاريون" />
      <div className="px-4 py-4 space-y-3" dir="rtl">
        {/* Summary bar */}
        <p className="text-xs text-[#A89480]">
          {MOCK_AGENTS.length} وسيط معتمد في سلطنة عُمان
        </p>

        {/* Agent cards */}
        {MOCK_AGENTS.map((agent) => (
          <AgentDirectoryCard key={agent.id} agent={agent} />
        ))}

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#C4B5A5] pb-2">
          جميع البيانات تجريبية — سيتم ربطها بقاعدة البيانات في المرحلة القادمة
        </p>
      </div>
    </AppShell>
  );
}
