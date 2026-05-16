// ── Areas Landing Page — Phase 16 ────────────────────────────────────────────
// Area guide index: filter by governorate, tag, or suitability.
// Server component — filtering logic is client-side (AreasFilter component).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  AREA_GUIDES,
  AREA_TAG_AR,
  SUITABLE_FOR_AR,
  type AreaGuide,
} from "@/mock/areas";
import { serializeJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  titleAr: "دليل الأحياء والمناطق العقارية في عُمان",
  descriptionAr:
    "استكشف العقارات في أكثر من ١١ حياً ومنطقة في سلطنة عُمان. متوسطات الأسعار وعوائد الاستثمار ومعلومات شاملة عن كل منطقة.",
  path: "/areas",
  keywords: ["أحياء مسقط", "مناطق عقارات عمان", "دليل العقارات", "استثمار عقاري عمان"],
});

// ── Static filter data ────────────────────────────────────────────────────────
const ALL_GOVERNORATES = [...new Set(AREA_GUIDES.map((a) => a.governorateAr))];
const ALL_TAGS = [...new Set(AREA_GUIDES.flatMap((a) => a.tags))] as AreaGuide["tags"];

// ── Sub-components ────────────────────────────────────────────────────────────
function AreaCard({ area }: { area: AreaGuide }) {
  const yieldColor =
    area.rentalYield >= 5.5
      ? "text-[#5B8C5A]"
      : area.rentalYield >= 4.5
      ? "text-[#C8860A]"
      : "text-[#7A6B5E]";

  return (
    <Link
      href={`/areas/${area.slug}`}
      className="block bg-white rounded-2xl border border-[#F0EBE3] p-4 hover:border-[#C65D3B]/40 transition-colors"
      aria-label={`دليل عقارات ${area.nameAr}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] leading-tight">{area.nameAr}</h2>
          <p className="text-[11px] text-[#A89480] mt-0.5">{area.governorateAr}</p>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            area.demandScore >= 85
              ? "bg-[#EDF4ED] text-[#5B8C5A]"
              : area.demandScore >= 70
              ? "bg-[#FEF9EC] text-[#C8860A]"
              : "bg-[#F5F0EA] text-[#7A6B5E]"
          }`}
        >
          طلب {area.demandScore}٪
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <p className="text-xs font-bold text-[#1E1E1E]">
            {(area.avgSalePrice / 1000).toFixed(0)}k
          </p>
          <p className="text-[9px] text-[#A89480]">بيع (ر.ع.)</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-[#1E1E1E]">{area.avgRentPrice}</p>
          <p className="text-[9px] text-[#A89480]">إيجار/شهر</p>
        </div>
        <div className="text-center">
          <p className={`text-xs font-bold ${yieldColor}`}>{area.rentalYield}٪</p>
          <p className="text-[9px] text-[#A89480]">عائد</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {area.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] px-2 py-0.5 bg-[#F5F0EA] text-[#7A6B5E] rounded-full"
          >
            {AREA_TAG_AR[tag]}
          </span>
        ))}
      </div>
    </Link>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#F5F0EA] last:border-0">
      <span className="text-xs text-[#7A6B5E]">{label}</span>
      <span className="text-xs font-semibold text-[#1E1E1E]">{value}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AreasPage() {
  const popularAreas = [...AREA_GUIDES]
    .sort((a, b) => b.demandScore - a.demandScore)
    .slice(0, 4);

  const investmentAreas = AREA_GUIDES.filter((a) => a.tags.includes("investment")).slice(0, 4);
  const familyAreas = AREA_GUIDES.filter((a) => a.tags.includes("family")).slice(0, 4);

  const breadcrumbs = [
    { labelAr: "الرئيسية", href: "/" },
    { labelAr: "الأحياء والمناطق" },
  ];

  const jsonLd = breadcrumbJsonLd(
    breadcrumbs.map((b) => ({ nameAr: b.labelAr, href: b.href ?? "/areas" }))
  );

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd as Record<string, unknown>) }}
      />

      <AppHeader variant="back" titleAr="الأحياء والمناطق" />

      <main className="px-4 py-4 space-y-6 max-w-2xl mx-auto" dir="rtl">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero intro */}
        <div>
          <h1 className="text-xl font-bold text-[#1E1E1E] mb-1">
            دليل الأحياء العقارية في عُمان
          </h1>
          <p className="text-sm text-[#7A6B5E]">
            {AREA_GUIDES.length} منطقة مع بيانات السوق وإحصاءات الإيجار والبيع
          </p>
        </div>

        {/* Market data note */}
        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-2">
          <p className="text-[10px] text-[#C8860A]">
            جميع أسعار السوق تقديرية وإرشادية — ليست تقييمات رسمية معتمدة
          </p>
        </div>

        {/* Market overview summary */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">نظرة عامة</h2>
          <StatRow label="عدد المناطق" value={`${AREA_GUIDES.length} منطقة`} />
          <StatRow
            label="متوسط سعر البيع"
            value={`${Math.round(AREA_GUIDES.reduce((s, a) => s + a.avgSalePrice, 0) / AREA_GUIDES.length).toLocaleString("ar")} ر.ع.`}
          />
          <StatRow
            label="متوسط الإيجار"
            value={`${Math.round(AREA_GUIDES.reduce((s, a) => s + a.avgRentPrice, 0) / AREA_GUIDES.length).toLocaleString("ar")} ر.ع./شهر`}
          />
          <StatRow
            label="متوسط العائد الإيجاري"
            value={`${(AREA_GUIDES.reduce((s, a) => s + a.rentalYield, 0) / AREA_GUIDES.length).toFixed(1)}٪`}
          />
        </div>

        {/* Governorate quick links */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-2">حسب المحافظة</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_GOVERNORATES.map((gov) => (
              <span
                key={gov}
                className="px-3 py-1.5 bg-[#F5F0EA] text-xs text-[#7A6B5E] rounded-full font-medium"
              >
                {gov} ({AREA_GUIDES.filter((a) => a.governorateAr === gov).length})
              </span>
            ))}
          </div>
        </div>

        {/* Most in-demand */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">الأكثر طلباً</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {popularAreas.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>

        {/* Investment-friendly */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-1">
            مناطق استثمارية واعدة
          </h2>
          <p className="text-xs text-[#A89480] mb-3">
            مناطق تتميز بعوائد إيجارية أعلى من المتوسط أو نمو في الطلب
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {investmentAreas.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>

        {/* Family-friendly */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-1">
            مناطق عائلية مناسبة
          </h2>
          <p className="text-xs text-[#A89480] mb-3">
            أحياء تتوفر فيها مدارس ومرافق وبيئة عائلية هادئة
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {familyAreas.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>

        {/* All areas */}
        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">
            جميع المناطق ({AREA_GUIDES.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AREA_GUIDES.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>

        {/* Market disclaimer */}
        <div className="bg-[#FAF7F4] border border-[#F0EBE3] rounded-xl px-4 py-3">
          <p className="text-[11px] text-[#7A6B5E] leading-relaxed">
            <strong className="text-[#1E1E1E]">إخلاء مسؤولية:</strong> جميع أسعار السوق في هذه الصفحة هي تقديرات إرشادية مستخلصة من إعلانات منصة مقر. لا تعبر عن أسعار رسمية أو حكومية معتمدة. ننصح بالتحقق مع وسيط مرخص قبل اتخاذ أي قرار استثماري.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
