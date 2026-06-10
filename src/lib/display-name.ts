// ── Safe display-name helper ──────────────────────────────────────────────────
// Some seeded/test profiles have corrupted name fields that render as question
// marks (e.g. "?????? ??????") due to an encoding issue at import time. Never
// show that to users — fall back to a clean brand name instead.
//
// A name is considered corrupted/empty when, after trimming, it contains NO
// real letter or digit (i.e. only "?", the Unicode replacement char U+FFFD,
// whitespace, or punctuation).
//
// This is DISPLAY-ONLY. It never mutates stored data.

import type { Locale } from "@/i18n/types";

const FALLBACK: Record<Locale, string> = {
  ar: "مستخدم مقر",
  en: "Maqar User",
};

export function isCorruptedName(name: string | null | undefined): boolean {
  if (!name) return true;
  const trimmed = name.trim();
  if (!trimmed) return true;
  // No letter (any script) and no digit → corrupted (e.g. "????", "??? ??").
  return !/[\p{L}\p{N}]/u.test(trimmed);
}

/** Returns the name if valid, otherwise a clean localized fallback. */
export function safeDisplayName(
  name: string | null | undefined,
  locale: Locale = "ar"
): string {
  if (isCorruptedName(name)) return FALLBACK[locale] ?? FALLBACK.ar;
  return name!.trim();
}

/** First character for an avatar monogram, with a safe fallback ("م"/"M"). */
export function safeInitial(
  name: string | null | undefined,
  locale: Locale = "ar"
): string {
  if (isCorruptedName(name)) return locale === "en" ? "M" : "م";
  return name!.trim().slice(0, 1);
}
