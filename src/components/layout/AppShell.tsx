"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BOTTOM_NAV_ITEMS } from "@/config/navigation";
import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/types";

// Map each nav item key to its translation key
const NAV_KEY_MAP: Record<string, TranslationKey> = {
  home:      "nav.home",
  map:       "nav.map",
  add:       "nav.add",
  favorites: "nav.favorites",
  account:   "nav.account",
};

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { locale, dir, toggleLocale, t } = useTranslation();
  const isAr = locale === "ar";

  // Admin routes are an admin console, not the public buyer/agent app. They must
  // NOT show the public bottom tab bar (incl. the centre Add button) or the
  // public desktop nav / "Add property" CTA. Admin nav comes from DashboardNav.
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  // Keep <html lang> and <html dir> in sync with locale preference.
  // suppressHydrationWarning on <html> in layout.tsx prevents SSR mismatch flash.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  function navLabel(item: { key: string; labelAr: string }): string {
    const key = NAV_KEY_MAP[item.key];
    return key ? t(key) : item.labelAr;
  }

  return (
    <div className="flex flex-col min-h-svh">
      {/* ── Desktop-only top header (lg+) ── */}
      <header className="hidden lg:flex sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] h-14 px-6">
        {/* Inner content capped at max-w-7xl for wide screens */}
        <div className="max-w-7xl mx-auto w-full flex items-center gap-6">
          <Link href={ROUTES.home} aria-label={isAr ? "مقر — الرئيسية" : "Maqar — Home"} className="flex-shrink-0">
            <MaqarLogo size="sm" />
          </Link>
          <nav className="flex items-center gap-1 flex-1" aria-label={t("nav.home")}>
            {!isAdminRoute && BOTTOM_NAV_ITEMS.filter((i) => !i.isAdd).map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "px-3 h-9 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#E6F0EF] text-[#0A3C36]"
                      : "text-[#627D98] hover:bg-[#F0F4F8] hover:text-[#102A43]"
                  )}
                >
                  {navLabel(item)}
                </Link>
              );
            })}
          </nav>

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 h-8 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#627D98] hover:border-[#0A3C36] hover:text-[#0A3C36] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {isAr ? "EN" : "عر"}
          </button>

          {/* Add listing CTA — hidden on admin console */}
          {!isAdminRoute && (
          <Link
            href={ROUTES.addListing}
            className="flex-shrink-0 flex items-center gap-2 px-4 h-9 rounded-xl bg-[#0A3C36] text-white text-sm font-semibold hover:bg-[#082E29] transition-colors"
            aria-label={t("nav.add")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t("home.addProperty")}
          </Link>
          )}
        </div>
      </header>

      {/* Page content — overflow-x-clip stops horizontal scroll from -mx carousel sections.
          pb-20 reserves space for the mobile bottom nav; not needed on admin (no bottom nav). */}
      <main className={cn("flex-1 lg:pb-0 overflow-x-clip", !isAdminRoute && "pb-20")}>{children}</main>

      {/* ── Mobile language toggle (shown only on small screens, fixed top-right) ── */}
      <div className="fixed top-3 end-3 z-[95] lg:hidden">
        <button
          onClick={toggleLocale}
          aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
          className="flex items-center gap-1 px-2.5 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E2E8F0] text-xs font-semibold text-[#627D98] shadow-sm hover:border-[#0A3C36] hover:text-[#0A3C36] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {isAr ? "EN" : "عر"}
        </button>
      </div>

      {/* ── Mobile/tablet bottom tab bar (hidden on lg+ and on admin console) ── */}
      {!isAdminRoute && (
      <nav
        className="fixed bottom-0 start-0 end-0 z-[100] bg-white border-t border-[#E2E8F0] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
      >
        {/* overflow-visible so the raised Add button can extend above the bar */}
        <div className="flex items-stretch h-16 overflow-visible">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            if (item.isAdd) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex-1 flex flex-col items-center justify-center relative"
                  aria-label={navLabel(item)}
                  style={{ overflow: "visible" }}
                >
                  {/* Raised circle */}
                  <span
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0A3C36] shadow-[0_4px_20px_rgba(10,60,54,0.35)]"
                    style={{ marginTop: "-28px" }}
                    aria-hidden="true"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-semibold leading-none mt-1 text-[#0A3C36]">
                    {navLabel(item)}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 min-w-0 transition-colors",
                  isActive ? "text-[#0A3C36]" : "text-[#627D98]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="flex-shrink-0">
                  <NavIcon itemKey={item.key} filled={isActive} />
                </span>
                <span className="text-[10px] font-medium leading-none">
                  {navLabel(item)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      )}
    </div>
  );
}

function NavIcon({ itemKey, filled }: { itemKey: string; filled: boolean }) {
  const w = filled ? "2.5" : "2";

  if (itemKey === "home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={w}>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" stroke={filled ? "white" : "currentColor"} strokeWidth="2" />
      </svg>
    );
  }
  if (itemKey === "map") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w}>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    );
  }
  if (itemKey === "favorites") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={w}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (itemKey === "account") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={w}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  return null;
}
