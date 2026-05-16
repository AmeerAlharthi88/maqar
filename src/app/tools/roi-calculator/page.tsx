import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { ROICalculator } from "@/components/calculators/ROICalculator";

export const metadata: Metadata = {
  title: "حاسبة العائد على الاستثمار | مقر",
  description:
    "احسب العائد الإجمالي والصافي على استثمارك العقاري في سلطنة عُمان وقدّر فترة الاسترداد.",
};

export default function ROICalculatorPage() {
  return (
    <AppShell>
      <CalculatorShell
        title="حاسبة العائد على الاستثمار"
        subtitle="تقدير العائد الإجمالي والصافي — ليست نصيحة استثمارية"
        disclaimer="هذه الحاسبة للتوجيه فقط ولا تمثّل تقييماً رسمياً أو نصيحة استثمارية. استشر متخصصاً مالياً مرخّصاً قبل اتخاذ قراراتك."
      >
        <ROICalculator />
      </CalculatorShell>
    </AppShell>
  );
}
