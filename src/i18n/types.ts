// ── i18n type primitives ───────────────────────────────────────────────────────

export type Locale = "ar" | "en";
export type TextDir = "rtl" | "ltr";

/** Map used for string interpolation in `t("key", { count: 3 })` calls */
export type InterpolationMap = Record<string, string | number>;

// ── Type-safe dot-notation key extraction ─────────────────────────────────────
// Derives all leaf paths from a nested object type, e.g. "auth.login.title"

type Leaves<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? P extends "" ? K : `${P}.${K}`
    : T[K] extends Record<string, unknown>
    ? Leaves<T[K], P extends "" ? K : `${P}.${K}`>
    : never;
}[keyof T & string];

// Import the shape of the Arabic dictionary as the canonical type
import type { ar } from "./dictionaries/ar";

/** The full bilingual dictionary shape — English must match this exactly */
export type Dictionary = typeof ar;

/** Every valid translation key (dot-notation path through the dictionary) */
export type TranslationKey = Leaves<Dictionary>;

/** Helper: access a nested dict path at runtime */
export function resolvePath(
  dict: Record<string, unknown>,
  path: string,
  vars?: InterpolationMap,
  locale: Locale = "ar"
): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);

  if (typeof value !== "string") return path; // fallback: return the key itself

  if (!vars) return value;

  // Replace {{var}} placeholders; format numbers locale-aware
  return value.replace(/\{\{(\w+)\}\}/g, (_, k: string) => {
    const v = vars[k];
    if (v === undefined) return `{{${k}}}`;
    if (typeof v === "number") {
      return locale === "ar"
        ? String(v).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)])
        : String(v);
    }
    return String(v);
  });
}
