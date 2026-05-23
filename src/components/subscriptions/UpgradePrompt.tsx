// ── UpgradePrompt — shown when a usage limit is reached ──────────────────────

import Link from "next/link";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  titleAr?: string;
  messageAr: string;
  ctaAr?: string;
  variant?: "banner" | "inline" | "modal-ready";
  className?: string;
}

export function UpgradePrompt({
  titleAr = "وصلت إلى الحد الأقصى",
  messageAr,
  ctaAr = "ترقية الخطة",
  variant = "banner",
  className,
}: UpgradePromptProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 bg-[#E6F0EF] border border-[#0A3C36]/20 rounded-2xl px-4 py-3",
          className
        )}
        role="alert"
        dir="rtl"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#0A3C36]">{titleAr}</p>
          <p className="text-xs text-[#627D98] mt-0.5 leading-relaxed">{messageAr}</p>
        </div>
        <Link
          href="/pricing"
          className="flex-shrink-0 px-3 py-2 bg-[#0A3C36] text-white text-xs font-bold rounded-xl whitespace-nowrap"
          aria-label={ctaAr}
        >
          {ctaAr}
        </Link>
      </div>
    );
  }

  // banner variant (full-width)
  return (
    <div
      className={cn(
        "bg-[#E6F0EF] border border-[#0A3C36]/20 rounded-2xl p-4",
        className
      )}
      role="alert"
      dir="rtl"
    >
      <p className="text-sm font-bold text-[#0A3C36] mb-1">{titleAr}</p>
      <p className="text-xs text-[#627D98] leading-relaxed mb-3">{messageAr}</p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0A3C36] text-white text-sm font-bold rounded-xl"
        aria-label={ctaAr}
      >
        {ctaAr}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="rtl:rotate-180"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  );
}
