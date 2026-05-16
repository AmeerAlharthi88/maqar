// ── Area Detail Page — Phase 16 ───────────────────────────────────────────────
// Full area guide page with market data, lifestyle, and related listings.
// Server component with JSON-LD breadcrumbs and area structured data.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { TrustBlock } from "@/components/seo/TrustBlock";
import { buildAreaMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  areaJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";
import {
  AREA_GUIDE_MAP,
  AREA_GUIDES,
  AREA_TAG_AR,
  SUITABLE_FOR_AR,
} from "@/mock/areas";
import { MOCK_LISTINGS } from "@/mock/listings";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return AREA_GUIDES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = AREA_GUIDE_MAP[slug];
  if (!area) return { title: "المنطقة غير موجودة | مقر" };
  return buildAreaMetadata(area);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-3 py-3 text-center ${
        highlight ? "bg-[#FBF0EB]" : "bg-[#FAF7F4]"
      }`}
    >
      <p className={`text-base font-bold ${highlight ? "text-[#C65D3B]" : "text-[#1E1E1E]"}`}>
        {value}
      </p>
      <p className="text-[10px] text-[#A89480]">{label}</p>
      {sub && <p className="text-[9px] text-[#A89480] mt-0.5">{sub}</p>}
    </div>
  );
}

function DemandBar({ score }: { score: number }) {
  const color =
    score >= 85 ? "bg-[#5B8C5A]" : score >= 70 ? "bg-[#C8860A]" : "bg-[#A89480]";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-[#7A6B5E]">مؤشر الطلب</span>
        <span className="font-semibold text-[#1E1E1E]">{score}/100</span>
      </div>
      <div className="h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${score}%` }}
          role="meter"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`مؤشر الطلب ${score} من ١٠٠`}
        />
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function AreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = AREA_GUIDE_MAP[slug];

  if (!area) notFound();

  // Featured listings in this area (up to 4)
  const areaListings = MOCK_LISTINGS.filter(
    (l) =>
      l.status === "active" &&
      (l.location.areaId === area.id || l.location.wilayatId === area.wilayatId)
  ).slice(0, 4);

  // Related areas
  const relatedAreas = area.relatedAreaSlugs
    .map((s) => AREA_GUIDE_MAP[s])
    .filter(Boolean);

  const breadcrumbs = [
    { labelAr: "الرئيسية", href: "/" },
    { labelAr: "الأحياء والمناطق", href: "/areas" },
    { labelAr: area.nameAr },
  ];

  const jsonLd = [
    breadcrumbJsonLd(
      breadcrumbs.map((b) => ({ nameAr: b.labelAr, href: b.href ?? `/areas/${area.slug}` }))
    ),
    areaJsonLd({
      nameAr: area.nameAr,
      nameEn: area.nameEn,
      slug: area.slug,
      governorateAr: area.governorateAr,
    }),
  ];

  const priceChangeLabel =
    area.priceChangePct > 0
      ? `+${area.priceChangePct}٪`
      : `${area.priceChangePct}٪`;

  return (
    <AppShell>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(schema as Record<string, unknown>),
          }}
        />
      ))}

      <AppHeader variant="back" titleAr={area.nameAr} />

      <main className="px-4 py-4 space-y-5 max-w-2xl mx-auto" dir="rtl">
        <Breadcrumb items={breadcrumbs} />

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-[#1E1E1E]">{area.nameAr}</h1>
              <p className="text-sm text-[#7A6B5E] mt-0.5">
                {area.wilayatAr}، {area.governorateAr}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  area.demandScore >= 85
                    ? "bg-[#EDF4ED] text-[#5B8C5A]"
                    : "bg-[#FEF9EC] text-[#C8860A]"
                }`}
              >
                طلب {area.demandScore}٪
              </span>
              <span className="text-[10px] text-[#A89480]">{area.listingCount} إعلان</span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-2">نظرة عامة</h2>
          <p className="text-sm text-[#7A6B5E] leading-relaxed">{area.overviewAr}</p>
        </div>

        {/* Market stats grid */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">
            إحصاءات السوق
            <span className="text-[10px] font-normal text-[#A89480] mr-2">(تقديرية)</span>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="متوسط البيع"
              value={`${area.avgSalePrice.toLocaleString("ar")} ر.ع.`}
            />
            <StatCard
              label="متوسط الإيجار"
              value={`${area.avgRentPrice} ر.ع./شهر`}
            />
            <StatCard
              label="سعر المتر المربع"
              value={`${area.pricePerSqm} ر.ع./م²`}
            />
            <StatCard
              label="عائد إيجاري تقديري"
              value={`${area.rentalYield}٪`}
              highlight
              sub="سنوي"
            />
          </div>

          <div className="mt-3 bg-white rounded-2xl border border-[#F0EBE3] p-4 space-y-3">
            <DemandBar score={area.demandScore} />
            <div className="flex justify-between text-[11px]">
              <span className="text-[#7A6B5E]">تغير السعر (سنوي)</span>
              <span
                className={`font-bold ${
                  area.priceChangePct > 0 ? "text-[#5B8C5A]" : "text-[#C65D3B]"
                }`}
              >
                {priceChangeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Popular property types */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">أنواع العقارات الشائعة</h2>
          <div className="flex flex-wrap gap-2">
            {area.popularPropertyTypes.map((type) => (
              <Link
                key={type}
                href={`/search?area=${area.slug}&type=${encodeURIComponent(type)}`}
                className="px-3 py-1.5 bg-[#F5F0EA] text-xs text-[#1E1E1E] rounded-xl font-medium hover:bg-[#F0EBE3] transition-colors"
              >
                {type}
              </Link>
            ))}
          </div>
        </div>

        {/* Suitable for */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">مناسب لـ</h2>
          <div className="flex flex-wrap gap-2">
            {area.suitableForAr.map((who) => (
              <span
                key={who}
                className="px-3 py-1.5 bg-[#EDF4ED] text-xs text-[#5B8C5A] rounded-xl font-medium"
              >
                {who}
              </span>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-2">نمط الحياة</h2>
          <p className="text-sm text-[#7A6B5E] leading-relaxed">{area.lifestyleAr}</p>
        </div>

        {/* Nearby services */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">الخدمات المجاورة</h2>
          <div className="grid grid-cols-2 gap-2">
            {area.nearbyServicesAr.map((service) => (
              <div key={service} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C65D3B] flex-shrink-0" aria-hidden="true" />
                <span className="text-xs text-[#7A6B5E]">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {area.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-3 py-1 bg-[#F5F0EA] text-[#7A6B5E] rounded-full"
            >
              {AREA_TAG_AR[tag]}
            </span>
          ))}
        </div>

        {/* Browse listings CTA */}
        <Link
          href={`/search?area=${area.slug}`}
          className="block w-full py-3.5 rounded-2xl bg-[#C65D3B] text-white text-sm font-bold text-center min-h-[52px] flex items-center justify-center"
          aria-label={`تصفح العقارات في ${area.nameAr}`}
        >
          تصفح العقارات في {area.nameAr}
        </Link>

        {/* Featured listings */}
        {areaListings.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">
              عقارات متاحة في {area.nameAr}
            </h2>
            <div className="space-y-3">
              {areaListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className="flex items-center gap-3 bg-white rounded-xl border border-[#F0EBE3] px-3 py-3"
                  aria-label={listing.titleAr}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#F0EBE3] flex-shrink-0 overflow-hidden">
                    {listing.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={listing.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1E1E1E] truncate">
                      {listing.titleAr}
                    </p>
                    <p className="text-[10px] text-[#A89480]">
                      {listing.purpose === "sale" ? "للبيع" : "للإيجار"} ·{" "}
                      {listing.price.toLocaleString("ar")} ر.ع.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related areas */}
        {relatedAreas.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">مناطق مشابهة</h2>
            <div className="flex gap-2 flex-wrap">
              {relatedAreas.map((related) => (
                <Link
                  key={related.slug}
                  href={`/areas/${related.slug}`}
                  className="px-3 py-2 bg-white border border-[#F0EBE3] rounded-xl text-xs text-[#1E1E1E] font-medium hover:border-[#C65D3B]/30 transition-colors"
                >
                  {related.nameAr}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trust blocks */}
        <TrustBlock variant="market-estimates" />

        {/* Market disclaimer */}
        <div className="bg-[#FAF7F4] border border-[#F0EBE3] rounded-xl px-4 py-3">
          <p className="text-[11px] text-[#A89480] leading-relaxed">
            البيانات المعروضة هي تقديرات إرشادية من إعلانات مقر وليست تقييمات رسمية معتمدة. للحصول على تقييم دقيق يُرجى التواصل مع وسيط مرخص.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
