import { cn } from "@/lib/utils";

interface AIDisclaimerProps {
  textAr?: string;
  className?: string;
  variant?: "default" | "financial" | "legal";
}

const TEXTS: Record<NonNullable<AIDisclaimerProps["variant"]>, string> = {
  default:   "هذه النتائج توليدية إرشادية وليست معلومات رسمية أو معتمدة.",
  financial: "هذا تقدير إرشادي وليس نصيحة مالية أو استثمارية رسمية. استشر متخصصاً مالياً معتمداً قبل اتخاذ أي قرار.",
  legal:     "هذه المعلومات للتوجيه العام فقط وليست استشارة قانونية. لا تستند إليها في إجراءات قانونية.",
};

export function AIDisclaimer({ textAr, className, variant = "default" }: AIDisclaimerProps) {
  const text = textAr ?? TEXTS[variant];
  return (
    <p
      className={cn("text-[10px] text-[#627D98] leading-relaxed", className)}
      dir="rtl"
    >
      {text}
    </p>
  );
}
