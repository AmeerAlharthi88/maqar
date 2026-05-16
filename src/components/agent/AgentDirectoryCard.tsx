import Link from "next/link";
import type { Agent } from "@/types/agent";
import { ROUTES } from "@/config/routes";

interface AgentDirectoryCardProps {
  agent: Agent;
}

export function AgentDirectoryCard({ agent }: AgentDirectoryCardProps) {
  const initials = agent.nameAr
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(agent.stats.rating));

  return (
    <Link
      href={ROUTES.agent(agent.id)}
      className="block bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4 active:bg-[#FAF7F4] transition-colors"
      dir="rtl"
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-[#C65D3B]/10 flex items-center justify-center flex-shrink-0">
          {agent.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agent.avatar}
              alt={agent.nameAr}
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-[#C65D3B]">{initials}</span>
          )}
        </div>

        {/* Name + agency */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-[#1E1E1E]">{agent.nameAr}</p>
            {agent.isVerified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#5B8C5A">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            )}
          </div>
          {agent.agency && (
            <p className="text-xs text-[#7A6B5E] mt-0.5">{agent.agency.nameAr}</p>
          )}
          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {stars.map((filled, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#C65D3B" : "#E8DDD0"}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="text-[10px] text-[#A89480] mr-1">
              {agent.stats.rating} ({agent.stats.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Specializations */}
      {agent.specializationAr.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {agent.specializationAr.map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 bg-[#F5F0EA] text-[#7A6B5E] text-[10px] rounded-lg"
            >
              {spec}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
          <p className="text-sm font-bold text-[#1E1E1E]">{agent.stats.activeListings}</p>
          <p className="text-[10px] text-[#A89480]">إعلان نشط</p>
        </div>
        <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
          <p className="text-sm font-bold text-[#1E1E1E]">{agent.stats.soldListings}</p>
          <p className="text-[10px] text-[#A89480]">صفقة منجزة</p>
        </div>
        <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
          <p className="text-sm font-bold text-[#1E1E1E]">{agent.stats.avgResponseTime}</p>
          <p className="text-[10px] text-[#A89480]">وقت الرد</p>
        </div>
      </div>
    </Link>
  );
}
