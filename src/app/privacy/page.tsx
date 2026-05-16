// ── Privacy Policy Page — Phase 16 ───────────────────────────────────────────

import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  titleAr: "سياسة الخصوصية | مقر",
  descriptionAr:
    "كيف تجمع منصة مقر بيانات المستخدمين وتحميها وتستخدمها. تشمل: البيانات الشخصية، الكوكيز، بيانات الدفع، وحقوق المستخدم.",
  path: "/privacy",
});

const DISCLAIMER =
  "هذه الصفحة مسودة إرشادية وتحتاج إلى مراجعة قانونية قبل الإطلاق الرسمي.";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-[#1E1E1E] mb-3">{title}</h2>
      <div className="text-sm text-[#7A6B5E] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <AppShell>
      <AppHeader variant="back" titleAr="سياسة الخصوصية" />

      <main className="px-4 py-4 space-y-6 max-w-2xl mx-auto" dir="rtl">
        <Breadcrumb
          items={[
            { labelAr: "الرئيسية", href: "/" },
            { labelAr: "سياسة الخصوصية" },
          ]}
        />

        {/* Draft disclaimer */}
        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-3">
          <p className="text-xs text-[#C8860A] font-semibold">{DISCLAIMER}</p>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#1E1E1E] mb-1">سياسة الخصوصية</h1>
          <p className="text-xs text-[#A89480]">آخر تحديث: {new Date().toLocaleDateString("ar-OM", { year: "numeric", month: "long" })}</p>
        </div>

        <Section title="١. البيانات التي نجمعها">
          <p>عند استخدام منصة مقر قد نجمع البيانات التالية:</p>
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2">
              <span className="text-[#C65D3B]">—</span>
              <span><strong>بيانات الحساب:</strong> رقم الهاتف المستخدم للتحقق عبر OTP، واسمك إذا أضفته</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C65D3B]">—</span>
              <span><strong>بيانات الإعلانات:</strong> معلومات العقار التي تنشرها، الصور، والمستندات المرفوعة لأغراض التوثيق</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C65D3B]">—</span>
              <span><strong>بيانات الاستخدام:</strong> صفحات تمت مشاهدتها، عمليات البحث، العقارات المحفوظة — لتحسين تجربتك</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C65D3B]">—</span>
              <span><strong>البيانات التقنية:</strong> نوع المتصفح، نظام التشغيل، عنوان IP — لأغراض الأمان والأداء</span>
            </li>
          </ul>
        </Section>

        <Section title="٢. كيف نستخدم بياناتك">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>تشغيل المنصة وتقديم خدمات البحث والنشر</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>التحقق من هوية الوسطاء ومراجعة الإعلانات</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>تحسين خوارزميات البحث والتوصية</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>إرسال إشعارات متعلقة بحسابك وإعلاناتك</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>الامتثال للمتطلبات القانونية في سلطنة عُمان</span></li>
          </ul>
        </Section>

        <Section title="٣. التخزين المحلي والكوكيز">
          <p>
            نستخدم التخزين المحلي (localStorage) لحفظ تفضيلاتك، البحوث المحفوظة، العقارات المفضلة، والإعلانات التي شاهدتها — هذه البيانات تُخزَّن على جهازك فقط ولا ترسل للخادم إلا عند تسجيل الدخول.
          </p>
          <p>
            نستخدم كوكيز تقنية ضرورية لتشغيل المنصة. لا نستخدم كوكيز تتبع إعلاني من أطراف ثالثة في الوقت الحالي.
          </p>
        </Section>

        <Section title="٤. الذكاء الاصطناعي">
          <p>
            عند استخدام مميزات الذكاء الاصطناعي (توليد الوصف، التقييم، المساعد)، قد تُرسل معلومات الإعلان إلى مزود الذكاء الاصطناعي لمعالجتها. لا يتم إرسال بياناتك الشخصية المعرِّفة مع هذه الطلبات.
          </p>
        </Section>

        <Section title="٥. بيانات الدفع">
          <p>
            معالجة الدفع تتم عبر مزود دفع خارجي مرخص. مقر لا تخزّن بيانات البطاقة الائتمانية على خوادمها. التفاصيل الكاملة ستتوفر عند تفعيل بوابة الدفع.
          </p>
        </Section>

        <Section title="٦. مستندات KYC والتوثيق">
          <p>
            مستندات الهوية والسجل التجاري المرفوعة لأغراض توثيق الوسطاء تُخزَّن بشكل آمن وتُستخدم فقط لأغراض التحقق. لا تُشارك مع أطراف ثالثة إلا بأمر قانوني.
          </p>
        </Section>

        <Section title="٧. إقامة البيانات">
          <p>
            نسعى لتخزين بيانات المستخدمين العُمانيين في بيئة سحابية متوافقة مع متطلبات دول مجلس التعاون الخليجي. التفاصيل الكاملة ستُوضَّح قبل الإطلاق الرسمي.
          </p>
        </Section>

        <Section title="٨. حقوق المستخدم">
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>الاطلاع على بياناتك المخزنة لدينا</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>تعديل بيانات حسابك</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>طلب حذف حسابك وبياناتك</span></li>
            <li className="flex items-start gap-2"><span className="text-[#C65D3B]">—</span><span>الاعتراض على استخدام بياناتك في حالات معينة</span></li>
          </ul>
          <p className="mt-2">لممارسة هذه الحقوق تواصل معنا على: <a href="mailto:privacy@maqar.om" className="text-[#C65D3B] underline underline-offset-2">privacy@maqar.om</a></p>
        </Section>

        <Section title="٩. تحديثات السياسة">
          <p>
            قد نحدّث هذه السياسة دورياً. سنُخطرك بأي تغييرات جوهرية عبر إشعار في المنصة.
          </p>
        </Section>

        <div className="bg-[#FAF7F4] border border-[#F0EBE3] rounded-xl px-4 py-3">
          <p className="text-[11px] text-[#A89480] leading-relaxed">{DISCLAIMER}</p>
        </div>
      </main>
    </AppShell>
  );
}
