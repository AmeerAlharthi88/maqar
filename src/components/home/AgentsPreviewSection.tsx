import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Avatar } from "@/components/ui/Avatar";
import { ROUTES } from "@/config/routes";
import { toArabicNumerals } from "@/lib/formatters";
import type { Agent } from "@/types/agent";

interface AgentPreviewCardProps {
  agent: Agent;
}

function AgentPreviewCard({ agent }: AgentPreviewCardProps) {
  return (
    <Link
      href={ROUTES.agent(agent.id)}
      className="flex-shrink-0 w-36 bg-white rounded-2xl border border-[#F0EBE3] p-3 flex flex-col items-center gap-2 text-center shadow-[0_2px_8px_0_rgb(30_30_30/0.06)] hover:shadow-[0_6px_20px_0_rgb(30_30_30/0.10)] transition-shadow"
    >
      <Avatar name={agent.nameAr} size="lg" />
      <div className="w-full min-w-0">
        <p className="text-xs font-bold text-[#1E1E1E] truncate">{agent.nameAr}</p>
        {agent.agency && (
          <p className="text-[10px] text-[#A89480] truncate">{agent.agency.nameAr}</p>
        )}
      </div>
      {agent.isVerified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF4FB] text-[#2471A3] text-[10px] font-semibold">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          موثوق
        </span>
      )}
      <div className="flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#D4A373" stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span className="text-xs font-semibold text-[#1E1E1E]">{agent.stats.rating.toFixed(1)}</span>
        <span className="text-[10px] text-[#A89480]">({toArabicNumerals(agent.stats.reviewCount)})</span>
      </div>
    </Link>
  );
}

interface AgentsPreviewSectionProps {
  agents: Agent[];
}

export function AgentsPreviewSection({ agents }: AgentsPreviewSectionProps) {
  const verified = agents.filter((a) => a.isVerified);

  return (
    <section className="px-4 py-5 bg-[#FAF7F2]">
      <SectionHeader
        titleAr="وسطاء موثوقون"
        subtitleAr="احترافيون معتمدون في السوق العُماني"
        size="md"
        action={
          <Link href={ROUTES.agents} className="text-xs font-semibold text-[#C65D3B] hover:underline">
            جميع الوسطاء
          </Link>
        }
        className="mb-4"
      />

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {verified.map((agent) => (
          <AgentPreviewCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  );
}
