"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MaqarLogo } from "@/components/brand/MaqarLogo";
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
 * sub-pages, add-listing, listing detail, auth…). It renders the approved Maqar
 * mark (not a generic home icon) so the brand doubles as the Home control
 * (FP10 #2), navigates to "/" via Next Link, carries a localized accessible
 * label (الرئيسية / Home), and keeps a comfortable 40px mobile tap target. It
 * complements — never replaces — the back arrow: back = previous safe page,
 * Home = always the main page.
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
          ? "bg-black/45 backdrop-blur-sm hover:bg-black/60"
          : "hover:bg-[#F0F4F8]",
        className
      )}
    >
      {/* mark-only keeps the logo compact and undistorted inside the tap target;
          white on image overlays, brand emerald on light headers. */}
      <MaqarLogo variant="mark-only" size="xs" color={variant === "overlay" ? "white" : "brand"} />
    </Link>
  );
}
