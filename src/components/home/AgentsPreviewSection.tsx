"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Avatar } from "@/components/ui/Avatar";
import { ROUTES } from "@/config/routes";
import { formatNumber } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import type { Agent } from "@/types/agent";

interface AgentPreviewCardProps {
  agent: Agent;
  locale: string;
  verifiedLabel: string;
}

function AgentPreviewCard({ agent, locale, verifiedLabel }: AgentPreviewCardProps) {
  return (
    <Link
      href={ROUTES.agent(agent.id)}
      className="flex-shrink-0 w-40 bg-white rounded-2xl border border-[#E2E8F0] px-3 py-4 flex flex-col items-center gap-2.5 text-center shadow-[0_2px_8px_0_rgb(10_60_54/0.06)] hover:shadow-[0_6px_20px_0_rgb(10_60_54/0.10)] transition-shadow"
    >
      <Avatar name={locale === "ar" ? agent.nameAr : (agent.nameEn ?? agent.nameAr)} size="lg" />
      <div className="w-full min-w-0 space-y-0.5">
        <p className="text-xs font-bold text-[#102A43] leading-snug line-clamp-1">
          {locale === "ar" ? agent.nameAr : (agent.nameEn ?? agent.nameAr)}
        </p>
        {agent.agency && (
          <p className="text-[10px] text-[#627D98] leading-snug line-clamp-1">
            {locale === "ar" ? agent.agency.nameAr : (agent.agency.nameEn ?? agent.agency.nameAr)}
          </p>
        )}
      </div>
      {agent.isVerified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F0EF] text-[#0A3C36] text-[10px] font-semibold">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          {verifiedLabel}
        </span>
      )}
      <div className="flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#E5BA73" stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span className="text-xs font-semibold text-[#102A43]">{agent.stats.rating.toFixed(1)}</span>
        <span className="text-[10px] text-[#627D98]">({formatNumber(agent.stats.reviewCount, locale as "ar" | "en")})</span>
      </div>
    </Link>
  );
}

interface AgentsPreviewSectionProps {
  agents: Agent[];
}

export function AgentsPreviewSection({ agents }: AgentsPreviewSectionProps) {
  const { t, locale } = useTranslation();
  const verified = agents.filter((a) => a.isVerified);

  return (
    <section className="px-4 py-5 bg-[#F0F4F8] overflow-x-hidden">
      <SectionHeader
        titleAr="وسطاء موثوقون"
        titleEn="Verified Agents"
        subtitleAr="احترافيون معتمدون في السوق العُماني"
        subtitleEn="Licensed professionals in the Omani market"
        size="md"
        action={
          <Link href={ROUTES.agents} className="text-xs font-semibold text-[#0A3C36] hover:underline">
            {t("common.viewAll")}
          </Link>
        }
        className="mb-4"
      />

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {verified.map((agent) => (
          <AgentPreviewCard
            key={agent.id}
            agent={agent}
            locale={locale}
            verifiedLabel={t("common.verified")}
          />
        ))}
      </div>
    </section>
  );
}
