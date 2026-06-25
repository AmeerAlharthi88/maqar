"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { HeaderHomeButton } from "@/components/shell/HeaderHomeButton";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";

interface AppHeaderProps {
  variant?: "home" | "search" | "minimal" | "back";
  /** Locale-aware title — pass the already-translated string from the parent */
  title?: string;
  /**
   * Bilingual title. When `title` is not given, the header localizes the title
   * itself from these via its own locale-store subscription — the same selector
   * pattern as DashboardNav, so the title reliably tracks the persisted locale
   * after hydration instead of sticking on the SSR-default language (FP8 #1).
   */
  titleAr?: string;
  titleEn?: string;
  showSearch?: boolean;
  /** Explicit back handler. Takes precedence over `backHref`. */
  onBack?: () => void;
  /**
   * Deterministic back destination. When set, the back arrow navigates here
   * instead of `router.back()` — used by the admin shell so the arrow reliably
   * returns to a safe page (/account) rather than looping through admin tabs.
   */
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AppHeader({
  variant = "home",
  title,
  titleAr,
  titleEn,
  showSearch = false,
  onBack,
  backHref,
  actions,
  className,
}: AppHeaderProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const isAr = locale === "ar";

  // Prefer an explicit pre-translated `title`; otherwise localize here from the
  // bilingual props. Read locale via useTranslation (the same store access used
  // for `t` above) — mixing it with a second direct useLocaleStore subscription
  // can resolve to a different bundled store instance and leave the title stuck
  // on one language while the rest of the header localizes (FP8 #1/#4).
  const displayTitle = title ?? (isAr ? titleAr : (titleEn ?? titleAr));

  // Back behavior, in priority order:
  //   1. explicit onBack handler from the caller
  //   2. explicit backHref destination (deterministic, never stuck)
  //   3. router.back() — was previously a no-op when onBack was omitted, which
  //      left the admin back arrow unresponsive (FP8 #2).
  const handleBack = onBack ?? (backHref ? () => router.push(backHref) : () => router.back());

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
            size="md"
            variant="ghost"
            onClick={handleBack}
            className="flex-shrink-0 flip-x -ms-1"
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

        {/* Home shortcut — title/back headers hide the clickable logo, so this
            guarantees a one-tap path to the main page on every such screen
            (admin, account sub-pages, dashboards, policies…) without replacing
            the back arrow (FP9). */}
        {variant === "back" && <HeaderHomeButton />}

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
