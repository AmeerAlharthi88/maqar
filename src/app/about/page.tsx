// ── About Page — Phase 16 ─────────────────────────────────────────────────────

import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { TrustRow } from "@/components/seo/TrustBlock";
import { buildMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd, organizationJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  titleAr: "عن مقر — منصة العقارات العُمانية",
  descriptionAr:
    "مقر منصة عقارية عُمانية تجمع بين البحث الذكي عن العقارات وتوثيق الوسطاء وتحليل السوق والتواصل المباشر عبر واتساب.",
  path: "/about",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
      <h2 className="text-base font-bold text-[#102A43] mb-3">{title}</h2>
      <div className="text-sm text-[#627D98] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  const orgJsonLd = organizationJsonLd();

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgJsonLd as Record<string, unknown>) }}
      />

      <AppHeader variant="back" titleAr="عن مقر" />

      <main className="px-4 py-4 space-y-4 max-w-2xl mx-auto" dir="rtl">
        <Breadcrumb
          items={[
            { labelAr: "الرئيسية", href: "/" },
            { labelAr: "عن مقر" },
          ]}
        />

        {/* Hero */}
        <div className="bg-[#0A3C36] rounded-2xl px-5 py-6 text-white">
          <p className="text-xs font-semibold opacity-80 mb-1">منصة عقارية عُمانية</p>
          <h1 className="text-2xl font-bold mb-2">مقر</h1>
          <p className="text-sm opacity-90 leading-relaxed">
            مقرك يبدأ هنا — منصة عقارية مصممة خصيصاً لسوق سلطنة عُمان
          </p>
        </div>

        <Section title="قصتنا">
          <p>
            مقر وُلدت من حاجة حقيقية في السوق العقاري العُماني: صعوبة العثور على معلومات موثوقة وواضحة عن العقارات، وغياب منصة تجمع المشترين والمستأجرين والوسطاء في مكان واحد.
          </p>
          <p>
            هدفنا بناء منصة عُمانية أولاً — تفهم طبيعة السوق المحلي، واللغة العربية، وأسلوب التواصل المفضل عبر واتساب، وتقدم بيانات واقعية من السوق العُماني.
          </p>
        </Section>

        <Section title="ما نقدمه">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold flex-shrink-0">—</span>
              <span>بحث عقاري شامل مع فلاتر دقيقة حسب المنطقة والنوع والسعر والمساحة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold flex-shrink-0">—</span>
              <span>توثيق الوسطاء والوكالات العقارية بالتحقق من السجل التجاري والترخيص</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold flex-shrink-0">—</span>
              <span>تحليلات السوق العقاري بمتوسطات الأسعار وعوائد الإيجار والاتجاهات</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold flex-shrink-0">—</span>
              <span>أدوات التحليل المالي: حاسبة الرهن، عائد الإيجار، العائد على الاستثمار</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold flex-shrink-0">—</span>
              <span>تواصل مباشر مع المعلنين عبر واتساب دون وسيط إضافي</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold flex-shrink-0">—</span>
              <span>مساعد ذكاء اصطناعي للاستفسار عن العقارات وتوليد الأوصاف وتقدير القيمة</span>
            </li>
          </ul>
        </Section>

        <Section title="الثقة والتوثيق">
          <p>
            نؤمن بأن الثقة هي أساس أي معاملة عقارية ناجحة. لهذا نوثق الوسطاء يدوياً ونراجع إعلاناتهم قبل النشر.
          </p>
          <p>
            التوثيق لا يعني الضمان القانوني — يعني أننا تحققنا من وجود الترخيص وصحة بيانات الوسيط. المسؤولية النهائية للتحقق من تفاصيل الصفقة تقع على عاتق المشتري والمعلن.
          </p>
        </Section>

        <Section title="الذكاء الاصطناعي في مقر">
          <p>
            نستخدم تقنيات الذكاء الاصطناعي لمساعدة المعلنين في كتابة أوصاف واضحة، ومساعدة الباحثين في فهم السوق. هذه الأدوات مساعدة وليست بديلاً عن الرأي القانوني أو التقييم الرسمي.
          </p>
        </Section>

        <Section title="البيانات والخصوصية">
          <p>
            بيانات مستخدمينا تُخزّن في بيئة سحابية تتوافق مع متطلبات البيانات في دول مجلس التعاون الخليجي. لا نشارك بيانات المستخدمين مع أطراف ثالثة لأغراض تجارية.
          </p>
        </Section>

        <Section title="تواصل معنا">
          <p>
            للاستفسارات والدعم الفني:
          </p>
          <p>
            البريد الإلكتروني:{" "}
            <a href="mailto:support@maqar.om" className="text-[#0A3C36] underline underline-offset-2">
              support@maqar.om
            </a>
          </p>
        </Section>

        {/* Trust blocks */}
        <TrustRow
          variants={["verified-agents", "market-estimates", "ai-tools", "oman-data"]}
        />
      </main>
    </AppShell>
  );
}
