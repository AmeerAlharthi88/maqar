import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { PlanCard } from "@/components/subscriptions/PlanCard";
import { FeatureComparisonTable } from "@/components/subscriptions/FeatureComparisonTable";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { ADDON_PRICES, ADDON_LABELS_AR } from "@/lib/payments/plans";
import { faqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "الأسعار والخطط | مقر",
  description:
    "اختر الخطة المناسبة لك في مقر: مجاني، وسيط احترافي ١٥ ر.ع./شهر، أو خطة وكالة عقارية ٥٠ ر.ع./شهر. بدون إلزام.",
};

const FAQ = [
  {
    q: "هل يمكنني إلغاء الاشتراك في أي وقت؟",
    a: "نعم، يمكنك إلغاء اشتراكك في أي وقت. سيستمر الوصول حتى نهاية الفترة المدفوعة.",
  },
  {
    q: "هل الدفع آمن؟",
    a: "في الإنتاج، تتم معالجة المدفوعات عبر مزود دفع مرخّص. لا يتم تخزين بيانات بطاقتك على خوادمنا.",
  },
  {
    q: "ما الفرق بين الإعلان المميز وخطة الوسيط الاحترافي؟",
    a: "الوسيط الاحترافي خطة شاملة تمنح ميزات متعددة. الإعلان المميز إضافة منفصلة ترفع إعلاناً واحداً محدداً لفترة مؤقتة.",
  },
  {
    q: "كيف يمكنني الترقية؟",
    a: "انقر على زر الترقية في أي خطة. ستتم معالجة التغيير فورياً في بيئة الإنتاج.",
  },
  {
    q: "هل تتوفر فترة تجريبية؟",
    a: "سيتوفر الطرح التجريبي في مرحلة لاحقة. حالياً يبدأ الاشتراك مباشرة بدون فترة تجريبية.",
  },
];

export default function PricingPage() {
  // TODO Phase 15+: read isLoggedIn from server session cookie
  const isLoggedIn = false;
  const faqSchema = faqJsonLd(FAQ);

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema as Record<string, unknown>) }}
      />
      <div className="px-4 py-6 max-w-lg mx-auto" dir="rtl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            الخطط والأسعار
          </h1>
          <p className="text-sm text-[#7A6B5E]">
            ابدأ مجاناً وارقِّ عندما تحتاج. لا إلزام. ادفع شهرياً.
          </p>
        </div>

        {/* Plan cards */}
        <div className="space-y-4 mb-8">
          <PlanCard planId="free"      isLoggedIn={isLoggedIn} />
          <PlanCard planId="agent_pro" isLoggedIn={isLoggedIn} isHighlighted />
          <PlanCard planId="agency"    isLoggedIn={isLoggedIn} />
        </div>

        {/* Feature comparison */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-[#1E1E1E] mb-3">
            مقارنة تفصيلية بين الخطط
          </h2>
          <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
            <FeatureComparisonTable />
          </div>
        </div>

        {/* Add-ons */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-[#1E1E1E] mb-1">
            الإضافات المدفوعة
          </h2>
          <p className="text-xs text-[#7A6B5E] mb-3">
            متاحة لمشتركي خطة الوسيط الاحترافي أو الوكالة.
          </p>
          <div className="space-y-3">
            {(["featured_listing", "lead_boost"] as const).map((type) => (
              <div
                key={type}
                className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-[#1E1E1E]">
                    {ADDON_LABELS_AR[type]}
                  </p>
                  <p className="text-xs text-[#7A6B5E] mt-0.5">
                    {type === "featured_listing"
                      ? "رفع إعلانك لأعلى نتائج البحث"
                      : "الحصول على عملاء محتملين إضافيين في منطقتك"}
                  </p>
                </div>
                <div className="text-end flex-shrink-0">
                  <p className="text-sm font-bold text-[#C65D3B]">
                    {ADDON_PRICES[type]} ر.ع.
                  </p>
                  <p className="text-[10px] text-[#A89480]">
                    / {type === "featured_listing" ? "أسبوع" : "مرة"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-[#1E1E1E] mb-3">
            أسئلة شائعة
          </h2>
          <FAQAccordion faqs={FAQ} />
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-[#A89480] text-center leading-relaxed">
          الأسعار بالريال العُماني · التفعيل مشروط بنجاح عملية الدفع عبر مزود
          معتمد · لا تتم أي معالجة فعلية في بيئة المعاينة الحالية
        </p>
      </div>
    </AppShell>
  );
}
