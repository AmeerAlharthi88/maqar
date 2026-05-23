// ── Terms of Use — Phase 16 ───────────────────────────────────────────────────

import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  titleAr: "الشروط والأحكام | مقر",
  descriptionAr:
    "شروط استخدام منصة مقر العقارية. تشمل: التزامات المستخدم، مسؤولية الإعلانات، إخلاء المسؤولية القانونية والمالية.",
  path: "/terms",
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

export default function TermsPage() {
  return (
    <AppShell>
      <AppHeader variant="back" titleAr="الشروط والأحكام" />

      <main className="px-4 py-4 space-y-6 max-w-2xl mx-auto" dir="rtl">
        <Breadcrumb
          items={[
            { labelAr: "الرئيسية", href: "/" },
            { labelAr: "الشروط والأحكام" },
          ]}
        />

        {/* Draft disclaimer */}
        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-3">
          <p className="text-xs text-[#C8860A] font-semibold">{DISCLAIMER}</p>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#102A43] mb-1">الشروط والأحكام</h1>
          <p className="text-xs text-[#627D98]">بالاستخدام فأنت تقبل هذه الشروط</p>
        </div>

        <Section title="١. القبول والاستخدام">
          <p>
            باستخدام منصة مقر (الموقع والتطبيق) فأنت تقبل هذه الشروط والأحكام. إذا كنت لا توافق على أي منها فيرجى عدم استخدام المنصة.
          </p>
          <p>
            مقر منصة وسيطة تجمع بين معلنين وباحثين عن العقارات. لا تملك مقر أي عقار معلن عليه ولا تتدخل في التفاوض أو إتمام الصفقات.
          </p>
        </Section>

        <Section title="٢. مسؤولية المعلن">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>أنت مسؤول عن دقة جميع المعلومات التي تنشرها</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>يُحظر نشر إعلانات وهمية أو مضللة أو مكررة بقصد التضليل</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>يجب أن تكون مخولاً قانونياً لبيع أو تأجير العقار المعلن عنه</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>الأسعار المعلنة يجب أن تعكس القيمة الفعلية المطلوبة</span></li>
          </ul>
        </Section>

        <Section title="٣. إخلاء مسؤولية التقييم">
          <p>
            أسعار السوق والتقييمات الواردة في مقر هي تقديرات إرشادية فقط. مقر لا تقدم تقييمات عقارية رسمية ولا تضمن دقة هذه الأرقام. استشر مقيماً معتمداً لأغراض التمويل أو الشراء.
          </p>
        </Section>

        <Section title="٤. إخلاء مسؤولية التمويل">
          <p>
            أي حسابات للرهن العقاري أو العائد على الاستثمار في مقر هي أدوات إرشادية تقديرية. مقر لا تقدم استشارات مالية ولا تضمن الحصول على تمويل بأي نسبة.
          </p>
        </Section>

        <Section title="٥. الذكاء الاصطناعي">
          <p>
            مخرجات أدوات الذكاء الاصطناعي في مقر (التقييم التلقائي، توليد الأوصاف، المساعد) هي اقتراحات آلية غير ملزمة. المستخدم يتحمل المسؤولية الكاملة عن استخدام هذه المخرجات.
          </p>
        </Section>

        <Section title="٦. المحتوى المحظور">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>إعلانات وهمية أو مكررة بقصد التلاعب</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>عقارات تنتهك القوانين العُمانية للتملك الأجنبي</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>أسعار مشبوهة تخالف ضوابط مكافحة غسيل الأموال</span></li>
            <li className="flex items-start gap-2"><span className="text-[#627D98]">—</span><span>صور أو محتوى غير لائق أو مضلل</span></li>
          </ul>
        </Section>

        <Section title="٧. حقوق الملكية الفكرية">
          <p>
            جميع محتويات منصة مقر (الشعار، التصميم، الكود، الأوصاف المولّدة) هي ملكية مقر أو مرخصة لها. يُحظر نسخ أو إعادة نشر المحتوى دون إذن كتابي.
          </p>
        </Section>

        <Section title="٨. تعليق الحسابات">
          <p>
            تحتفظ مقر بحق تعليق أو إلغاء أي حساب ينتهك هذه الشروط أو يضر بسلامة المنصة أو مستخدميها.
          </p>
        </Section>

        <Section title="٩. القانون المنطبق">
          <p>
            تخضع هذه الشروط لقوانين سلطنة عُمان. أي نزاع يُحال إلى الجهات القانونية المختصة في سلطنة عُمان.
          </p>
        </Section>

        <Section title="١٠. التواصل">
          <p>
            للاستفسارات القانونية: <a href="mailto:legal@maqar.om" className="text-[#0A3C36] underline underline-offset-2">legal@maqar.om</a>
          </p>
        </Section>

        <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-4 py-3">
          <p className="text-[11px] text-[#627D98] leading-relaxed">{DISCLAIMER}</p>
        </div>
      </main>
    </AppShell>
  );
}
