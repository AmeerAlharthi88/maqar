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
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getAgentProfile } from "@/lib/supabase/agents";
import type { Agent } from "@/types/agent";

// Re-render at most once every 5 minutes (ISR) so Supabase reviews stay fresh.
export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

// Static params from mock agents — guarantees build succeeds.
// UUID-based DB agent pages are served on-demand via ISR (revalidate = 300).
export async function generateStaticParams() {
  return MOCK_AGENTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Prefer DB agent; fall back to mock
  const dbAgent = await getAgentProfile(id);
  const agent: Agent | undefined = dbAgent ?? AGENT_MAP[id];

  if (!agent) return { title: "الوسيط غير موجود | مقر" };
  return buildAgentMetadata({ nameAr: agent.nameAr, id: agent.id, areasAr: agent.areasAr });
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;

  // ── Resolve agent: DB first, then mock ─────────────────────────────────────
  const dbAgent = await getAgentProfile(id);
  const agent: Agent | undefined = dbAgent ?? AGENT_MAP[id];

  if (!agent) notFound();

  // ── Reviews: try Supabase first, fall back to mock ─────────────────────────
  let reviews: Array<{
    id: string;
    authorNameAr: string;
    rating: number;
    bodyAr: string;
    createdAt: string;
  }>;

  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, body, created_at, profiles ( name_ar )")
      .eq("target_id", id)
      .eq("target_type", "agent")
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false })
      .limit(5);

    if (data && data.length > 0) {
      reviews = data.map((r) => ({
        id: r.id as string,
        authorNameAr:
          (r.profiles as unknown as { name_ar: string | null } | null)?.name_ar ?? "مستخدم",
        rating: r.rating as number,
        bodyAr: (r.body as string | null) ?? "",
        createdAt: r.created_at as string,
      }));
    } else {
      reviews = getReviews(id, 5);
    }
  } catch {
    reviews = getReviews(id, 5);
  }

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
            <h2 className="text-sm font-bold text-[#102A43] mb-2">المناطق التي يغطيها</h2>
            <div className="flex flex-wrap gap-2">
              {agent.areasAr.map((area) => (
                <span key={area} className="px-3 py-1.5 bg-[#F0F4F8] text-[#627D98] text-xs rounded-xl">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews section */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#102A43] mb-3">
              تقييمات العملاء ({agent.stats.reviewCount > 0 ? agent.stats.reviewCount : reviews.length})
            </h2>
            <div className="space-y-3">
              {reviews.map((review) => {
                const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
                return (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-[#102A43]">{review.authorNameAr}</p>
                      <div className="flex gap-0.5">
                        {stars.map((filled, i) => (
                          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#E5BA73" : "#E2E8F0"}>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#627D98] leading-relaxed">{review.bodyAr}</p>
                    <p className="text-[10px] text-[#627D98] mt-2">
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
            <p className="text-sm text-[#627D98]">لا توجد تقييمات بعد</p>
          </div>
        )}

        <TrustBlock variant="verified-agents" />
        <TrustBlock variant="whatsapp-contact" />
      </div>
    </AppShell>
  );
}
