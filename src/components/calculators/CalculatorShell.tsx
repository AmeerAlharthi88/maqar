// ── CalculatorShell — page-level wrapper for all calculators ─────────────────

import type { ReactNode } from "react";

interface CalculatorShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  disclaimer?: string;
}

export function CalculatorShell({
  title,
  subtitle,
  children,
  disclaimer,
}: CalculatorShellProps) {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1E1E1E] mb-1">{title}</h1>
        <p className="text-sm text-[#7A6B5E]">{subtitle}</p>
      </div>

      {children}

      {/* Bottom disclaimer */}
      {disclaimer && (
        <p className="mt-6 text-[11px] text-[#A89480] text-center leading-relaxed border-t border-[#F0EBE3] pt-4">
          {disclaimer}
        </p>
      )}
    </div>
  );
}
