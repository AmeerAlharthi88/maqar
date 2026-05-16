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
  green:   { bg: "bg-[#EDF4ED]", border: "border-[#5B8C5A]/20", text: "text-[#5B8C5A]", sub: "text-[#5B8C5A]/70" },
  blue:    { bg: "bg-[#EAF4FB]", border: "border-[#2471A3]/20", text: "text-[#2471A3]", sub: "text-[#2471A3]/70" },
  orange:  { bg: "bg-[#FBF0EB]", border: "border-[#C65D3B]/20", text: "text-[#C65D3B]", sub: "text-[#C65D3B]/70" },
  default: { bg: "bg-[#F5F0EA]", border: "border-[#E8DDD0]",    text: "text-[#1E1E1E]", sub: "text-[#7A6B5E]" },
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
      <p className="text-xs text-[#7A6B5E] mb-1">{label}</p>
      <p className={cn("font-bold", large ? "text-2xl" : "text-xl", colors.text)}>
        {value}
      </p>
      {sub && <p className={cn("text-xs mt-0.5", colors.sub)}>{sub}</p>}
    </div>
  );
}
