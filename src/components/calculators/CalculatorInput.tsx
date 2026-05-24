"use client";

// ── CalculatorInput — labeled number input field ──────────────────────────────

import { cn } from "@/lib/utils";

interface CalculatorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  className?: string;
}

export function CalculatorInput({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = 1,
  hint,
  className,
}: CalculatorInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-semibold text-[#102A43]">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#102A43] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15 ltr"
          dir="ltr"
        />
        {suffix && (
          <span className="absolute left-3 text-sm text-[#627D98] pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-[#627D98]">{hint}</p>}
    </div>
  );
}
