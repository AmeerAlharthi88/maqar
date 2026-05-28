"use client";

// ── useTranslation — client-side i18n hook ────────────────────────────────────
// Reads the current locale from the canonical locale store and returns a
// type-safe `t(key, vars?)` function together with locale metadata.

import { useLocaleStore } from "@/store/locale.store";
import { getDictionary } from "./index";
import { resolvePath } from "./types";
import type { TranslationKey, InterpolationMap, Locale } from "./types";

export interface UseTranslationResult {
  /** Translate a dot-notation key, with optional interpolation vars */
  t: (key: TranslationKey, vars?: InterpolationMap) => string;
  /** Current locale ("ar" | "en") */
  locale: Locale;
  /** Text direction for current locale */
  dir: "rtl" | "ltr";
  /** Switch to a specific locale */
  setLocale: (locale: Locale) => void;
  /** Toggle between "ar" and "en" */
  toggleLocale: () => void;
}

export function useTranslation(): UseTranslationResult {
  const { locale, dir, setLocale, toggleLocale } = useLocaleStore();

  const dict = getDictionary(locale) as Record<string, unknown>;

  const t = (key: TranslationKey, vars?: InterpolationMap): string =>
    resolvePath(dict, key, vars, locale);

  return { t, locale, dir, setLocale, toggleLocale };
}
