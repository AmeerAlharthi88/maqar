// ── i18n public API ─────────────────────────────────────────────────────────────
// Server-safe: no React, no Zustand — pure data access.

import type { Locale, Dictionary, TranslationKey, InterpolationMap } from "./types";
import { resolvePath } from "./types";
import { ar } from "./dictionaries/ar";
import { en } from "./dictionaries/en";

// ── Dictionary map ────────────────────────────────────────────────────────────
// `as unknown as Dictionary` is intentional: both dictionaries share the same
// key shape; only the string values differ (AR vs EN literals). The Dictionary
// type (= typeof ar) retains full literal-type intellisense for the AR dict
// while still being usable as a runtime record for EN.

const dictionaries = { ar, en } as const;

/**
 * Return the full dictionary for a locale.
 * Safe to call in Server Components, API routes, and metadata helpers.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as unknown as Dictionary;
}

/**
 * Server-side translate helper.
 * Returns a `t(key, vars?)` function bound to the given locale.
 *
 * Usage in Server Components:
 *   const t = getT("ar");
 *   return <h1>{t("nav.home")}</h1>;
 */
export function getT(locale: Locale) {
  const dict = getDictionary(locale) as Record<string, unknown>;
  return function t(key: TranslationKey, vars?: InterpolationMap): string {
    return resolvePath(dict, key, vars, locale);
  };
}

// ── Re-exports for convenience ────────────────────────────────────────────────

export { ar } from "./dictionaries/ar";
export { en } from "./dictionaries/en";
export type { Locale, Dictionary, TranslationKey, InterpolationMap } from "./types";
export { resolvePath } from "./types";
