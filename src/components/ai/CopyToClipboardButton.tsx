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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3C36]/40 rounded",
          copied ? "text-[#0A3C36]" : "text-[#627D98] hover:text-[#0A3C36]",
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3C36]/40",
        copied
          ? "bg-[#E6F0EF] text-[#0A3C36] border border-[#0A3C36]/20"
          : "bg-[#F0F4F8] text-[#627D98] border border-[#E2E8F0] hover:bg-[#E2E8F0]",
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
