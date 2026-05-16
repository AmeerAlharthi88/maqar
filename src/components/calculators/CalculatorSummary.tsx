// ── CalculatorSummary — grouped results container ─────────────────────────────

import type { ReactNode } from "react";

interface CalculatorSummaryProps {
  title?: string;
  children: ReactNode;
}

export function CalculatorSummary({ title, children }: CalculatorSummaryProps) {
  return (
    <div className="mt-6">
      {title && (
        <h2 className="text-base font-bold text-[#1E1E1E] mb-3">{title}</h2>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}
