"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";

interface AppHeaderProps {
  variant?: "home" | "search" | "minimal" | "back";
  /** Locale-aware title — pass the already-translated string from the parent */
  title?: string;
  /** @deprecated Use `title` with a pre-translated value instead */
  titleAr?: string;
  showSearch?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function AppHeader({
  variant = "home",
  title,
  titleAr,
  showSearch = false,
  onBack,
  actions,
  className,
}: AppHeaderProps) {
  const { t } = useTranslation();

  const displayTitle = title ?? titleAr;

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] bg-white/92 backdrop-blur-md border-b border-[#E2E8F0]",
        "safe-area-pt",
        className
      )}
    >
      <div className="flex items-center gap-3 px-4 h-14">
        {/* Back button */}
        {(variant === "back" || onBack) && (
          <IconButton
            label={t("common.back")}
            size="sm"
            variant="ghost"
            onClick={onBack}
            className="flex-shrink-0 flip-x"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </IconButton>
        )}

        {/* Logo or title */}
        {variant === "back" && displayTitle ? (
          <h1 className="flex-1 text-base font-bold text-[#102A43] text-center truncate">{displayTitle}</h1>
        ) : (
          <Link href={ROUTES.home} className="flex-shrink-0" aria-label="مقر — الرئيسية">
            <MaqarLogo size="sm" />
          </Link>
        )}

        {/* Search */}
        {showSearch && (
          <div className="flex-1">
            <SearchInput size="sm" />
          </div>
        )}

        {/* Spacer when no search */}
        {!showSearch && variant !== "back" && <div className="flex-1" />}

        {/* Actions slot */}
        {actions && (
          <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>
        )}

        {/* Default actions: notification bell */}
        {!actions && variant === "home" && (
          <div className="flex items-center gap-1">
            <IconButton label={t("account.notifications")} size="sm" variant="ghost">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </IconButton>
          </div>
        )}
      </div>
    </header>
  );
}
