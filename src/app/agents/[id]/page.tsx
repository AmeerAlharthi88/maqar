import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { AgentProfileHeader } from "@/components/agent/AgentProfileHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { TrustBlock } from "@/components/seo/TrustBlock";
import { AGENT_MAP, MOCK_AGENTS } from "@/mock/agents";
import { getReviews } from "@/mock/reviews";
import { buildAgentMetadata } from "@/lib/seo/metadata";
import { agentJsonLd, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_AGENTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agent = AGENT_MAP[id];
  if (!agent) return { title: "الوسيط غير موجود | مقر" };
  return buildAgentMetadata({ nameAr: agent.nameAr, id: agent.id, areasAr: agent.areasAr });
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;
  const agent = AGENT_MAP[id];

  if (!agent) notFound();

  const reviews = getReviews(id, 5);

  const agentSchema = agentJsonLd({
    nameAr: agent.nameAr,
    nameEn: agent.nameEn,
    id: agent.id,
    phone: agent.phone,
    areasAr: agent.areasAr,
    isVerified: agent.isVerified,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { nameAr: "الرئيسية", href: "/" },
    { nameAr: "الوسطاء", href: "/agents" },
    { nameAr: agent.nameAr, href: `/agents/${agent.id}` },
  ]);

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(agentSchema as Record<string, unknown>) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema as Record<string, unknown>) }}
      />
      <AppHeader variant="back" titleAr={agent.nameAr} />

      <AgentProfileHeader agent={agent} />

      <div className="px-4 py-4 space-y-4" dir="rtl">
        <Breadcrumb
          items={[
            { labelAr: "الرئيسية", href: "/" },
            { labelAr: "الوسطاء", href: "/agents" },
            { labelAr: agent.nameAr },
          ]}
        />

        {/* Areas covered */}
        {agent.areasAr.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-2">المناطق التي يغطيها</h2>
            <div className="flex flex-wrap gap-2">
              {agent.areasAr.map((area) => (
                <span key={area} className="px-3 py-1.5 bg-[#F5F0EA] text-[#7A6B5E] text-xs rounded-xl">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews section */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">
              تقييمات العملاء ({agent.stats.reviewCount})
            </h2>
            <div className="space-y-3">
              {reviews.map((review) => {
                const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
                return (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-[#1E1E1E]">{review.authorNameAr}</p>
                      <div className="flex gap-0.5">
                        {stars.map((filled, i) => (
                          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#C65D3B" : "#E8DDD0"}>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#7A6B5E] leading-relaxed">{review.bodyAr}</p>
                    <p className="text-[10px] text-[#A89480] mt-2">
                      {new Date(review.createdAt).toLocaleDateString("ar-OM", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[#A89480]">لا توجد تقييمات بعد</p>
          </div>
        )}

        <TrustBlock variant="verified-agents" />
        <TrustBlock variant="whatsapp-contact" />
      </div>
    </AppShell>
  );
}
