// ── CalculatorResultCard — single result metric display ───────────────────────

import { cn } from "@/lib/utils";

interface CalculatorResultCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: "green" | "blue" | "orange" | "default";
  large?: boolean;
}

const accentMap = {
  green:   { bg: "bg-[#E6F0EF]", border: "border-[#0A3C36]/20", text: "text-[#0A3C36]", sub: "text-[#0A3C36]/70" },
  blue:    { bg: "bg-[#EAF4FB]", border: "border-[#2471A3]/20", text: "text-[#2471A3]", sub: "text-[#2471A3]/70" },
  orange:  { bg: "bg-[#FEF0EE]", border: "border-[#C0392B]/20", text: "text-[#C0392B]", sub: "text-[#C0392B]/70" },
  default: { bg: "bg-[#F0F4F8]", border: "border-[#E2E8F0]",    text: "text-[#102A43]", sub: "text-[#627D98]" },
};

export function CalculatorResultCard({
  label,
  value,
  sub,
  accent = "default",
  large = false,
}: CalculatorResultCardProps) {
  const colors = accentMap[accent];

  return (
    <div className={cn("rounded-2xl p-4 border", colors.bg, colors.border)}>
      <p className="text-xs text-[#627D98] mb-1">{label}</p>
      <p className={cn("font-bold", large ? "text-2xl" : "text-xl", colors.text)}>
        {value}
      </p>
      {sub && <p className={cn("text-xs mt-0.5", colors.sub)}>{sub}</p>}
    </div>
  );
}
