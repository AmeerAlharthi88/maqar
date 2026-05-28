// ── Backward-compatibility re-export ─────────────────────────────────────────
// Existing code that imports useLanguageStore continues to work unchanged.
// New code should import useLocaleStore from "@/store/locale.store" instead.

export { useLocaleStore as useLanguageStore } from "./locale.store";

// Re-export LocaleKey so existing `import type { LocaleKey }` calls still resolve
export type { LocaleKey } from "@/config/locale";
