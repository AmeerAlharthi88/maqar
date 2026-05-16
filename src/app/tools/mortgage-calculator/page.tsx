import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";

export const metadata: Metadata = {
  title: "حاسبة التمويل العقاري | مقر",
  description:
    "احسب القسط الشهري للتمويل العقاري في سلطنة عُمان بناءً على سعر العقار والدفعة الأولى ومعدل الفائدة ومدة القرض.",
};

export default function MortgageCalculatorPage() {
  return (
    <AppShell>
      <CalculatorShell
        title="حاسبة التمويل العقاري"
        subtitle="تقدير تقريبي للقسط الشهري — ليس عرض تمويل رسمي من أي بنك"
        disclaimer="هذه الحاسبة للتوجيه فقط ولا تمثّل عرض تمويل أو موافقة بنكية. تواصل مع بنكك للحصول على أسعار وشروط دقيقة."
      >
        <MortgageCalculator />
      </CalculatorShell>
    </AppShell>
  );
}
