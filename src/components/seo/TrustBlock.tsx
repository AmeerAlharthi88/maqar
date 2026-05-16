// ── Trust Blocks — Phase 16 ───────────────────────────────────────────────────
// Reusable explanatory blocks for platform trust signals.
// Used in listing detail, agent profiles, area pages, and content pages.
// All copy is factual and accurate — no inflated claims.
// ─────────────────────────────────────────────────────────────────────────────

interface TrustBlockProps {
  variant:
    | "verified-listings"
    | "verified-agents"
    | "whatsapp-contact"
    | "market-estimates"
    | "ai-tools"
    | "oman-data";
  className?: string;
}

const TRUST_CONTENT: Record<
  TrustBlockProps["variant"],
  { titleAr: string; bodyAr: string; icon: string }
> = {
  "verified-listings": {
    icon: "✓",
    titleAr: "إعلانات موثقة",
    bodyAr:
      "الإعلانات الموثقة في مقر قد مرت بمراجعة يدوية من فريق الإشراف للتحقق من دقة المعلومات الأساسية. التوثيق يعني مراجعة البيانات، وليس ضماناً قانونياً للعقار.",
  },
  "verified-agents": {
    icon: "✓",
    titleAr: "وسطاء موثقون",
    bodyAr:
      "الوسطاء الموثقون في مقر قدموا رقم السجل التجاري أو الترخيص المهني وتم التحقق منه يدوياً من قِبل فريق مقر. التوثيق لا يمثل رأياً قانونياً أو ضماناً لنتيجة المعاملة.",
  },
  "whatsapp-contact": {
    icon: "📱",
    titleAr: "تواصل مباشر عبر واتساب",
    bodyAr:
      "مقر تعمل بنموذج التواصل المباشر — يتم الاتصال بين المشتري/المستأجر والمعلن مباشرة عبر واتساب دون وسيط إضافي. احرص على توثيق أي اتفاق كتابياً قبل أي مدفوعات.",
  },
  "market-estimates": {
    icon: "i",
    titleAr: "تقديرات السوق",
    bodyAr:
      "أسعار السوق المعروضة في مقر هي تقديرات إرشادية مستخلصة من بيانات الإعلانات المتاحة. هذه الأرقام ليست تقييمات رسمية ولا تمثل أسعاراً حكومية معتمدة. استشر مقيماً معتمداً لأغراض التمويل أو الشراء.",
  },
  "ai-tools": {
    icon: "i",
    titleAr: "أدوات الذكاء الاصطناعي",
    bodyAr:
      "تحليلات الذكاء الاصطناعي في مقر (التقييم التلقائي، توليد الوصف، مؤشر الجودة) هي أدوات مساعدة للمعلومات فقط. لا تعتبر هذه المخرجات تقييماً رسمياً أو استشارة قانونية أو مالية.",
  },
  "oman-data": {
    icon: "🇴🇲",
    titleAr: "بيانات عُمانية أولاً",
    bodyAr:
      "مقر مصمم خصيصاً لسوق العقارات في سلطنة عُمان. البيانات والإحصاءات المعروضة مستقاة من إعلانات ومعاملات داخل عُمان فقط. بيانات المستخدمين تُحفظ وفق متطلبات خصوصية البيانات في دول مجلس التعاون الخليجي.",
  },
};

/**
 * A single compact trust block — use inside cards or content sections.
 */
export function TrustBlock({ variant, className = "" }: TrustBlockProps) {
  const content = TRUST_CONTENT[variant];

  return (
    <div
      className={`bg-[#FAF7F4] border border-[#F0EBE3] rounded-xl px-4 py-3 ${className}`}
      dir="rtl"
    >
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className="text-sm font-bold text-[#5B8C5A] flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#EDF4ED] flex items-center justify-center text-[10px]"
        >
          {content.icon}
        </span>
        <div>
          <p className="text-xs font-bold text-[#1E1E1E] mb-0.5">{content.titleAr}</p>
          <p className="text-[11px] text-[#7A6B5E] leading-relaxed">{content.bodyAr}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * A row of multiple trust blocks — use at the bottom of pages.
 */
interface TrustRowProps {
  variants: TrustBlockProps["variant"][];
  className?: string;
}

export function TrustRow({ variants, className = "" }: TrustRowProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {variants.map((v) => (
        <TrustBlock key={v} variant={v} />
      ))}
    </div>
  );
}
