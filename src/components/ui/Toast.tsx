"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

const typeConfig: Record<ToastType, { bg: string; border: string; icon: string; iconColor: string }> = {
  success: { bg: "#EDF4ED", border: "#5B8C5A", icon: "✓", iconColor: "#5B8C5A" },
  error:   { bg: "#FEF0EE", border: "#C0392B", icon: "✕", iconColor: "#C0392B" },
  warning: { bg: "#FFF8E6", border: "#C8860A", icon: "!", iconColor: "#C8860A" },
  info:    { bg: "#EAF4FB", border: "#2471A3", icon: "i", iconColor: "#2471A3" },
};

export function Toast({ open, onClose, type = "info", title, description, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const cfg = typeConfig[type];

  return (
    <div className="fixed top-4 start-4 end-4 z-[500] flex justify-center pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl w-full max-w-sm",
          "shadow-[0_8px_24px_0_rgb(30_30_30/0.12)] border animate-slide-down"
        )}
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border + "40" }}
        role="alert"
      >
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: cfg.iconColor }}
        >
          {cfg.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1E1E1E]">{title}</p>
          {description && <p className="text-xs text-[#7A6B5E] mt-0.5">{description}</p>}
        </div>
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="flex-shrink-0 text-[#7A6B5E] hover:text-[#1E1E1E] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
