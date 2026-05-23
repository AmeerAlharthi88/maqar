// ── Listing Policy Page — Phase 16 ───────────────────────────────────────────

import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { buildMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd, faqJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  titleAr: "سياسة الإعلانات | مقر",
  descriptionAr:
    "قواعد ومعايير نشر إعلانات العقارات على منصة مقر. تشمل: شروط الإعلان، الإعلانات المحظورة، مراجعة الأسعار، والصور.",
  path: "/listing-policy",
});

const DISCLAIMER =
  "هذه الصفحة مسودة إرشادية وتحتاج إلى مراجعة قانونية قبل الإطلاق الرسمي.";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-[#102A43] mb-3">{title}</h2>
      <div className="text-sm text-[#627D98] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

const POLICY_FAQS = [
  {
    q: "هل يمكنني نشر نفس العقار أكثر من مرة؟",
    a: "لا، يُحظر نشر إعلانات مكررة لنفس العقار. النظام يكتشف الإعلانات المتشابهة تلقائياً وتخضع لمراجعة يدوية.",
  },
  {
    q: "ماذا يحدث إذا كان سعري مختلفاً عن متوسط السوق؟",
    a: "الأسعار غير المعتادة (أعلى أو أقل بشكل ملحوظ من السوق) تخضع لمراجعة إضافية قبل النشر. قد يتواصل فريقنا لطلب توضيح.",
  },
  {
    q: "ما أنواع الصور المسموح بها؟",
    a: "صور العقار الحقيقية فقط. يُحظر صور من الإنترنت أو من عقارات أخرى. يجب أن تمثل الصور الحالة الفعلية للعقار وقت النشر.",
  },
  {
    q: "هل يمكنني نشر عقار بدون صور؟",
    a: "الإعلانات بدون صور مسموح بها ولكنها تحصل على ظهور أقل في نتائج البحث. ننصح بإضافة صور واضحة لجذب مهتمين أكثر.",
  },
  {
    q: "كم يستغرق الموافقة على الإعلان؟",
    a: "معظم الإعلانات تُراجع خلال ٢٤-٤٨ ساعة في أيام العمل. الإعلانات التي تحتاج توثيقاً إضافياً قد تأخذ وقتاً أطول.",
  },
];

export default function ListingPolicyPage() {
  const faqSchema = faqJsonLd(POLICY_FAQS);

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema as Record<string, unknown>) }}
      />

      <AppHeader variant="back" titleAr="سياسة الإعلانات" />

      <main className="px-4 py-4 space-y-6 max-w-2xl mx-auto" dir="rtl">
        <Breadcrumb
          items={[
            { labelAr: "الرئيسية", href: "/" },
            { labelAr: "سياسة الإعلانات" },
          ]}
        />

        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-3">
          <p className="text-xs text-[#C8860A] font-semibold">{DISCLAIMER}</p>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#102A43] mb-1">سياسة الإعلانات</h1>
          <p className="text-sm text-[#627D98]">معايير نشر الإعلانات العقارية على منصة مقر</p>
        </div>

        <Section title="١. ما يُسمح بنشره">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2"><span className="text-[#0A3C36]">✓</span><span>عقارات سكنية وتجارية للبيع والإيجار في سلطنة عُمان</span></li>
            <li className="flex items-start gap-2"><span className="text-[#0A3C36]">✓</span><span>أراضي سكنية وتجارية وزراعية بأوراق ملكية واضحة</span></li>
            <li className="flex items-start gap-2"><span className="text-[#0A3C36]">✓</span><span>عقارات قيد الإنشاء مع توضيح واضح لحالتها</span></li>
            <li className="flex items-start gap-2"><span className="text-[#0A3C36]">✓</span><span>غرف ومساحات للإيجار مع توضيح الشروط</span></li>
          </ul>
        </Section>

        <Section title="٢. الدقة والأمانة">
          <p>
            يتحمل المعلن المسؤولية الكاملة عن دقة المعلومات المنشورة. يجب أن تعكس تفاصيل الإعلان (المساحة، الغرف، الأسعار، الموقع) الواقع الفعلي للعقار.
          </p>
          <p>
            أي معلومات مضللة أو مبالغ فيها تعرض الإعلان للإزالة والحساب للتعليق.
          </p>
        </Section>

        <Section title="٣. الإعلانات المكررة">
          <p>
            يُحظر نشر نفس العقار في إعلانات متعددة. المنصة تستخدم نظاماً تلقائياً لاكتشاف التشابه. الإعلانات المكررة تُدمج أو تُحذف مع إشعار المعلن.
          </p>
          <p>
            يُسمح بتحديث إعلان واحد بدلاً من حذفه وإعادة نشره.
          </p>
        </Section>

        <Section title="٤. مراجعة الأسعار">
          <p>
            الأسعار التي تبدو غير معقولة (أقل بكثير من السوق أو أعلى بشكل مفرط) تخضع لمراجعة يدوية من فريق مقر قبل النشر. هذا الإجراء جزء من ضوابط مكافحة غسيل الأموال.
          </p>
        </Section>

        <Section title="٥. الصور والمستندات">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>الصور يجب أن تمثل العقار الفعلي لا صور تعبيرية من الإنترنت</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>صور يجب أن تكون واضحة وغير مضللة</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>المستندات المرفوعة للتوثيق تُستخدم فقط لأغراض مراجعة الإعلان</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>يُحظر رفع صور تحتوي على معلومات شخصية للغير</span></li>
          </ul>
        </Section>

        <Section title="٦. المحتوى المحظور">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2"><span className="text-[#C0392B]">✕</span><span>إعلانات وهمية لعقارات غير موجودة</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C0392B]">✕</span><span>تأجير عقارات بدون إذن المالك</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C0392B]">✕</span><span>عقارات تنتهك قوانين التملك الأجنبي في عُمان</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C0392B]">✕</span><span>أي نشاط مرتبط بغسيل الأموال أو الاحتيال العقاري</span></li>
          </ul>
        </Section>

        <Section title="٧. عملية المراجعة الإدارية">
          <p>
            كل إعلان يمر بمراجعة آلية أولية ثم مراجعة يدوية اختيارية من فريق الإشراف. الإعلانات التي تثير تساؤلات تُوقَّف مؤقتاً ريثما يتواصل الفريق مع المعلن.
          </p>
        </Section>

        <div>
          <h2 className="text-base font-bold text-[#102A43] mb-3">أسئلة شائعة حول الإعلانات</h2>
          <FAQAccordion faqs={POLICY_FAQS} />
        </div>

        <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-4 py-3">
          <p className="text-[11px] text-[#627D98] leading-relaxed">{DISCLAIMER}</p>
        </div>
      </main>
    </AppShell>
  );
}
