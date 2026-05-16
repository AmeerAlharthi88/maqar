import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { PricePerSqmCalculator } from "@/components/calculators/PricePerSqmCalculator";

export const metadata: Metadata = {
  title: "حاسبة سعر المتر المربع | مقر",
  description:
    "قارن سعر المتر المربع لعقارك بمتوسطات المناطق والولايات في سلطنة عُمان.",
};

export default function PricePerSqmPage() {
  return (
    <AppShell>
      <CalculatorShell
        title="حاسبة سعر المتر المربع"
        subtitle="قارن سعر المتر لعقارك بمتوسطات المناطق — بيانات تقديرية"
        disclaimer="متوسطات المناطق تقديرية وليست قيماً رسمية. السعر يتأثر بعوامل كثيرة كالموقع والمواصفات والعمر."
      >
        <PricePerSqmCalculator />
      </CalculatorShell>
    </AppShell>
  );
}
