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
          "flex items-center justify-between gap-3 bg-[#FBF0EB] border border-[#C65D3B]/20 rounded-2xl px-4 py-3",
          className
        )}
        role="alert"
        dir="rtl"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#C65D3B]">{titleAr}</p>
          <p className="text-xs text-[#7A6B5E] mt-0.5 leading-relaxed">{messageAr}</p>
        </div>
        <Link
          href="/pricing"
          className="flex-shrink-0 px-3 py-2 bg-[#C65D3B] text-white text-xs font-bold rounded-xl whitespace-nowrap"
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
        "bg-[#FBF0EB] border border-[#C65D3B]/20 rounded-2xl p-4",
        className
      )}
      role="alert"
      dir="rtl"
    >
      <p className="text-sm font-bold text-[#C65D3B] mb-1">{titleAr}</p>
      <p className="text-xs text-[#7A6B5E] leading-relaxed mb-3">{messageAr}</p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C65D3B] text-white text-sm font-bold rounded-xl"
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
