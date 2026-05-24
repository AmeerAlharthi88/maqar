// ── Agent Verification Policy — Phase 16 ─────────────────────────────────────

import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { TrustBlock } from "@/components/seo/TrustBlock";
import { buildMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd, faqJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  titleAr: "سياسة توثيق الوسطاء | مقر",
  descriptionAr:
    "كيف توثّق منصة مقر الوسطاء العقاريين. تشمل متطلبات KYC والسجل التجاري وتصريح الوسيط وإجراءات المراجعة.",
  path: "/agent-verification-policy",
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

const VERIFICATION_FAQS = [
  {
    q: "كم يستغرق مراجعة طلب التوثيق؟",
    a: "تتم المراجعة خلال ٣–٥ أيام عمل من استلام جميع المستندات المطلوبة. في حالات التدقيق الإضافي قد يمتد الوقت.",
  },
  {
    q: "هل يمكن لوسيط أجنبي التوثيق؟",
    a: "نعم، يمكن للوسطاء غير العُمانيين التوثيق بشرط وجود تصريح عمل سار وترخيص مزاولة نشاط عقاري معتمد في عُمان.",
  },
  {
    q: "ماذا يحدث إذا انتهت صلاحية الترخيص؟",
    a: "عند انتهاء الترخيص يُوقَّف الحساب الموثق مؤقتاً. يتم إخطار الوسيط مسبقاً برسالة تذكيرية قبل تاريخ الانتهاء.",
  },
  {
    q: "هل التوثيق إلزامي لنشر الإعلانات؟",
    a: "لا، يمكن للمعلنين غير الموثقين نشر إعلانات. لكن الحسابات الموثقة تظهر بشعار التوثيق وتحصل على ظهور أفضل في البحث.",
  },
  {
    q: "ما الفرق بين الوسيط الموثق والوكالة الموثقة؟",
    a: "الوسيط الموثق فرد يملك ترخيصاً شخصياً. الوكالة الموثقة شركة مسجلة تجارياً. كلاهما يخضع لإجراءات توثيق منفصلة.",
  },
];

export default function AgentVerificationPolicyPage() {
  const faqSchema = faqJsonLd(VERIFICATION_FAQS);

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema as Record<string, unknown>) }}
      />

      <AppHeader variant="back" titleAr="سياسة التوثيق" />

      <main className="px-4 py-4 space-y-6 max-w-2xl mx-auto" dir="rtl">
        <Breadcrumb
          items={[
            { labelAr: "الرئيسية", href: "/" },
            { labelAr: "سياسة توثيق الوسطاء" },
          ]}
        />

        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-3">
          <p className="text-xs text-[#C8860A] font-semibold">{DISCLAIMER}</p>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#102A43] mb-1">سياسة توثيق الوسطاء</h1>
          <p className="text-sm text-[#627D98]">
            معايير وإجراءات التحقق من هوية وتراخيص الوسطاء العقاريين في مقر
          </p>
        </div>

        <TrustBlock variant="verified-agents" />

        <Section title="١. لماذا التوثيق">
          <p>
            في سوق عقاري يعتمد على الثقة، يهدف برنامج التوثيق في مقر إلى منح المشترين والمستأجرين ثقة إضافية بأن الوسيط لديه ترخيص مهني معتمد وسجل تجاري سار في سلطنة عُمان.
          </p>
        </Section>

        <Section title="٢. متطلبات التوثيق للوسيط الفرد">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">١</span>
              <span>بطاقة الهوية الوطنية أو جواز السفر ساري المفعول</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">٢</span>
              <span>ترخيص مزاولة النشاط العقاري من الجهة المختصة في عُمان</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">٣</span>
              <span>رقم التسجيل في السجل التجاري (إن وُجد)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">٤</span>
              <span>رقم هاتف عُماني فعّال للتواصل</span>
            </li>
          </ul>
        </Section>

        <Section title="٣. متطلبات توثيق الوكالة">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">١</span>
              <span>سجل تجاري ساري المفعول</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">٢</span>
              <span>ترخيص مزاولة النشاط العقاري للشركة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">٣</span>
              <span>هوية المفوض بالتوقيع أو المدير التنفيذي</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A3C36] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">٤</span>
              <span>عنوان الوكالة وبيانات التواصل الرسمية</span>
            </li>
          </ul>
        </Section>

        <Section title="٤. إجراءات المراجعة">
          <p>
            بعد تقديم الطلب ورفع المستندات، يقوم فريق مقر بالخطوات التالية:
          </p>
          <ol className="space-y-2 list-none">
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold">١.</span>
              <span>مراجعة أولية آلية للتحقق من اكتمال المستندات</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold">٢.</span>
              <span>تحقق يدوي من صحة الترخيص والسجل التجاري</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A3C36] font-bold">٣.</span>
              <span>إخطار الوسيط بنتيجة المراجعة خلال ٣–٥ أيام عمل</span>
            </li>
          </ol>
        </Section>

        <Section title="٥. الرفض والاستئناف">
          <p>
            في حالة رفض طلب التوثيق، يتلقى الوسيط إشعاراً يوضح السبب. يمكن تقديم طعن مع مستندات إضافية داعمة. الطعون تُراجع خلال ٧ أيام عمل.
          </p>
        </Section>

        <Section title="٦. خصوصية مستندات التوثيق">
          <p>
            جميع مستندات الهوية والتراخيص المرفوعة تُخزَّن بشكل آمن وتُستخدم فقط لأغراض التحقق. لا تُشارك مع أطراف ثالثة إلا بموجب أمر قانوني. راجع <a href="/privacy" className="text-[#0A3C36] underline underline-offset-2">سياسة الخصوصية</a> للتفاصيل.
          </p>
        </Section>

        <div>
          <h2 className="text-base font-bold text-[#102A43] mb-3">أسئلة شائعة حول التوثيق</h2>
          <FAQAccordion faqs={VERIFICATION_FAQS} />
        </div>

        {/* Apply CTA */}
        <div className="bg-[#E6F0EF] rounded-2xl px-5 py-4 text-center">
          <p className="text-sm font-bold text-[#102A43] mb-1">هل أنت وسيط مرخص؟</p>
          <p className="text-xs text-[#627D98] mb-3">سجّل حسابك وقدّم طلب التوثيق من لوحة التحكم</p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#0A3C36] text-white text-sm font-bold min-h-[44px] flex items-center"
          >
            البدء في التوثيق
          </a>
        </div>

        <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-4 py-3">
          <p className="text-[11px] text-[#627D98] leading-relaxed">{DISCLAIMER}</p>
        </div>
      </main>
    </AppShell>
  );
}
