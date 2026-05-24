"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: "primary" | "danger";
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "إلغاء",
  onConfirm,
  confirmVariant = "primary",
  className,
}: DialogProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "relative bg-white rounded-2xl w-full max-w-sm animate-slide-up",
          "shadow-[0_8px_24px_0_rgb(30_30_30/0.10)]",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 id="dialog-title" className="text-base font-semibold text-[#102A43]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-[#627D98]">{description}</p>
            )}
          </div>
          <IconButton label="إغلاق" size="sm" variant="ghost" onClick={onClose} className="flex-shrink-0 -mt-1 -me-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </IconButton>
        </div>

        {/* Body */}
        {children && <div className="px-5 pb-3">{children}</div>}

        {/* Actions */}
        {(onConfirm ?? confirmLabel) && (
          <div className="flex gap-2.5 p-5 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button variant={confirmVariant} size="md" className="flex-1" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
