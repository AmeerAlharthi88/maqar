"use client";

// ── Canonical locale store ────────────────────────────────────────────────────
// Single source of truth for the active locale. Persisted to localStorage.
// All components should consume this via useLocaleStore or useTranslation().

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/i18n/types";

interface LocaleState {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Sync <html lang> and <html dir> with the current locale. Call once on mount. */
  syncHtmlAttributes: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "ar",
      dir: "rtl",

      setLocale: (locale: Locale) => {
        const dir = locale === "ar" ? "rtl" : "ltr";
        set({ locale, dir });
        // Keep <html> attributes in sync when called client-side
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
          document.documentElement.dir = dir;
        }
      },

      toggleLocale: () => {
        const next: Locale = get().locale === "ar" ? "en" : "ar";
        get().setLocale(next);
      },

      syncHtmlAttributes: () => {
        if (typeof document === "undefined") return;
        const { locale, dir } = get();
        document.documentElement.lang = locale;
        document.documentElement.dir = dir;
      },
    }),
    {
      name: "maqar-locale",
      // Rehydrate dir from persisted locale so it's always consistent
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.dir = state.locale === "ar" ? "rtl" : "ltr";
        }
      },
    }
  )
);
