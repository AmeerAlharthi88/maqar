"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";

export default function NotFound() {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center bg-[#F8F9FA]">
      <p className="text-7xl font-bold text-[#0A3C36] mb-4">{isAr ? "٤٠٤" : "404"}</p>
      <h1 className="text-xl font-bold text-[#102A43] mb-2">{t("errors.notFound")}</h1>
      <p className="text-sm text-[#627D98] mb-8">
        {t("errors.notFoundHint")}
      </p>
      <Link
        href={ROUTES.home}
        className="px-6 py-3 rounded-xl bg-[#0A3C36] text-white text-sm font-semibold"
      >
        {t("errors.goHome")}
      </Link>
    </div>
  );
}
