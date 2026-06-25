"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";

interface HeaderHomeButtonProps {
  className?: string;
  /** Visual style: "ghost" for light headers, "overlay" for image overlays. */
  variant?: "ghost" | "overlay";
}

/**
 * Always-available "go to the main page" affordance for headers that show a
 * title/back arrow instead of the clickable Maqar logo (admin, account
 * sub-pages, add-listing, listing detail, auth…). Navigates to "/" via Next
 * Link, with a localized accessible label (الرئيسية / Home) and a comfortable
 * 40px mobile tap target. It complements — never replaces — the back arrow
 * (FP9): back = previous safe page, Home = always the main page.
 */
export function HeaderHomeButton({ className, variant = "ghost" }: HeaderHomeButtonProps) {
  const { t } = useTranslation();
  return (
    <Link
      href={ROUTES.home}
      aria-label={t("nav.home")}
      title={t("nav.home")}
      className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-all active:scale-95",
        variant === "overlay"
          ? "bg-black/45 backdrop-blur-sm text-white hover:bg-black/60"
          : "text-[#627D98] hover:bg-[#F0F4F8] hover:text-[#0A3C36]",
        className
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    </Link>
  );
}
