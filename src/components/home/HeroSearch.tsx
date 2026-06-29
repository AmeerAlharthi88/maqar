"use client";

import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { SmartSearch } from "@/components/search/SmartSearch";
import { HomeSearchBuilder } from "@/components/home/HomeSearchBuilder";
import { useTranslation } from "@/i18n/useTranslation";

export function HeroSearch() {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  return (
    <section className="bg-gradient-to-b from-[#E6F0EF] to-white px-4 pt-4 pb-5 lg:pt-6 lg:pb-6 lg:max-w-3xl lg:mx-auto">
      {/* Logo + tagline — hidden on desktop since header provides branding */}
      <div className="mb-4 lg:hidden">
        <MaqarLogo size="sm" />
        <p className="mt-1.5 text-xs text-[#627D98] font-medium">
          {t("home.hero.tagline")}
        </p>
      </div>

      {/* Greeting */}
      <div className="mb-3 lg:mb-4 lg:text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#102A43] leading-tight">
          {t("home.hero.title")}
          <span className="text-[#0A3C36]"> {t("home.hero.titleHighlight")}</span>
        </h1>
        <p className="text-sm text-[#627D98] mt-1">
          {t("home.hero.subtitle")}
        </p>
      </div>

      {/* Primary path: guided search (purpose → type → location → Show results) */}
      <HomeSearchBuilder />

      {/* Secondary path: optional keyword search */}
      <div className="mt-3">
        <p className="text-[11px] text-[#627D98] mb-1.5 text-center">
          {isAr ? "أو ابحث بكلمة" : "Or search by keyword"}
        </p>
        <SmartSearch size="md" placeholder={t("home.hero.searchPlaceholder")} />
      </div>
    </section>
  );
}
