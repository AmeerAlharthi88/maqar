import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocaleKey } from "@/config/locale";

interface LanguageState {
  locale: LocaleKey;
  dir: "rtl" | "ltr";
  setLocale: (locale: LocaleKey) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "ar",
      dir: "rtl",
      setLocale: (locale) =>
        set({ locale, dir: locale === "ar" ? "rtl" : "ltr" }),
    }),
    { name: "maqar-locale" }
  )
);
