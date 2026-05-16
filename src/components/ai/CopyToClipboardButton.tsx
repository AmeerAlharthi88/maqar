"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CopyToClipboardButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  compact?: boolean;
  "aria-label"?: string;
}

export function CopyToClipboardButton({
  text,
  label = "نسخ",
  copiedLabel = "تم النسخ",
  className,
  compact = false,
  "aria-label": ariaLabel,
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel ?? label}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D3B]/50 rounded",
          copied ? "text-[#5B8C5A]" : "text-[#7A6B5E] hover:text-[#C65D3B]",
          className
        )}
      >
        {copied ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        {copied ? copiedLabel : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? label}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D3B]/50",
        copied
          ? "bg-[#EDF4ED] text-[#5B8C5A] border border-[#5B8C5A]/20"
          : "bg-[#F5F0EA] text-[#7A6B5E] border border-[#E8DDD0] hover:bg-[#EDE8E0]",
        className
      )}
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
