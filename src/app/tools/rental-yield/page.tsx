import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { RentalYieldCalculator } from "@/components/calculators/RentalYieldCalculator";

export const metadata: Metadata = {
  title: "حاسبة العائد الإيجاري | مقر",
  description:
    "احسب العائد الإجمالي والصافي لعقارك وقارنه بمتوسطات المناطق في سلطنة عُمان.",
};

export default function RentalYieldPage() {
  return (
    <AppShell>
      <CalculatorShell
        title="حاسبة العائد الإيجاري"
        subtitle="احسب العائد الإجمالي والصافي وقارنه بمتوسط المنطقة"
        disclaimer="هذه الحاسبة للتوجيه فقط. العوائد الفعلية تتأثر بعوامل عديدة. استشر متخصصاً عقارياً لتقييم دقيق."
      >
        <RentalYieldCalculator />
      </CalculatorShell>
    </AppShell>
  );
}
