"use client";

import { cn } from "@/lib/utils";

interface AIButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
  variant?: "primary" | "subtle";
  className?: string;
  "aria-label"?: string;
}

// Stars icon (no emoji)
function StarsIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function AIButton({
  onClick,
  loading = false,
  disabled = false,
  label = "توليد بالذكاء الاصطناعي",
  loadingLabel = "جاري التوليد...",
  variant = "subtle",
  className,
  "aria-label": ariaLabel,
}: AIButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel ?? label}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3C36]/40",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-[#0A3C36] text-white hover:bg-[#082E29]"
          : "bg-[#F0F4F8] text-[#627D98] border border-[#E2E8F0] hover:bg-[#E2E8F0]",
        className
      )}
    >
      {loading ? (
        <span
          className="w-3.5 h-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin flex-shrink-0"
          aria-hidden="true"
        />
      ) : (
        <StarsIcon />
      )}
      <span>{loading ? loadingLabel : label}</span>
    </button>
  );
}
