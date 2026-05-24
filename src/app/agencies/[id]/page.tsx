import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { AgencyProfileHeader } from "@/components/agency/AgencyProfileHeader";
import { TeamMemberCard } from "@/components/agency/TeamMemberCard";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { TrustBlock } from "@/components/seo/TrustBlock";
import { AGENCY_MAP, MOCK_AGENCIES } from "@/mock/agencies";
import { getReviews } from "@/mock/reviews";
import { buildAgencyMetadata } from "@/lib/seo/metadata";
import { agencyJsonLd, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Re-render at most once every 5 minutes (ISR) so Supabase reviews stay fresh.
export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_AGENCIES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agency = AGENCY_MAP[id];
  if (!agency) return { title: "الوكالة غير موجودة | مقر" };
  return buildAgencyMetadata({
    nameAr: agency.nameAr,
    id: agency.id,
    descriptionAr: agency.descriptionAr ?? "",
  });
}

export default async function AgencyProfilePage({ params }: Props) {
  const { id } = await params;
  const agency = AGENCY_MAP[id];

  if (!agency) notFound();

  // ── Reviews: try Supabase first, fall back to mock ────────────────────────
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
      .select("id, rating, body, created_at, profiles ( full_name )")
      .eq("target_id", id)
      .eq("target_type", "agency")
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false })
      .limit(5);

    if (data && data.length > 0) {
      reviews = data.map((r) => ({
        id: r.id as string,
        authorNameAr:
          (r.profiles as unknown as { full_name: string | null } | null)?.full_name ?? "مستخدم",
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

  const agSchema = agencyJsonLd({
    nameAr: agency.nameAr,
    nameEn: agency.nameEn ?? undefined,
    id: agency.id,
    phone: agency.phone ?? undefined,
    email: agency.email ?? undefined,
    website: agency.website ?? undefined,
    descriptionAr: agency.descriptionAr ?? "",
    wilayatAr: agency.location?.wilayatAr ?? undefined,
    governorateAr: agency.location?.governorateAr ?? undefined,
    isVerified: agency.isVerified,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { nameAr: "الرئيسية", href: "/" },
    { nameAr: "الوكالات", href: "/agencies" },
    { nameAr: agency.nameAr, href: `/agencies/${agency.id}` },
  ]);

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(agSchema as Record<string, unknown>) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema as Record<string, unknown>) }}
      />
      <AppHeader variant="back" titleAr={agency.nameAr} />

      <AgencyProfileHeader agency={agency} />

      <div className="px-4 py-4 space-y-4" dir="rtl">
        <Breadcrumb
          items={[
            { labelAr: "الرئيسية", href: "/" },
            { labelAr: "الوكالات", href: "/agencies" },
            { labelAr: agency.nameAr },
          ]}
        />

        {/* Areas covered */}
        {agency.areasAr.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#102A43] mb-2">المناطق التي تغطيها</h2>
            <div className="flex flex-wrap gap-2">
              {agency.areasAr.map((area) => (
                <span key={area} className="px-3 py-1.5 bg-[#F0F4F8] text-[#627D98] text-xs rounded-xl">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Team members */}
        {agency.members && agency.members.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#102A43] mb-3">
              فريق العمل ({agency.stats.totalAgents} وسيط)
            </h2>
            <div className="space-y-2">
              {agency.members.map((member) => (
                <TeamMemberCard key={member.id} member={member} isOwner={false} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews section */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#102A43] mb-3">
              تقييمات العملاء ({agency.stats.reviewCount})
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

        <TrustBlock variant="verified-listings" />
        <TrustBlock variant="whatsapp-contact" />
      </div>
    </AppShell>
  );
}
