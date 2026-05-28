"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

function CTACard({
  href,
  title,
  description,
  cta,
  accentColor,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
  accentColor: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex-1 flex flex-col gap-3 p-4 rounded-2xl border border-[#E2E8F0] bg-white",
        "shadow-[0_2px_8px_0_rgb(10_60_54/0.06)] hover:shadow-[0_6px_20px_0_rgb(10_60_54/0.10)]",
        "transition-shadow duration-200"
      )}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: accentColor + "1A", color: accentColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-[#102A43]">{title}</p>
        <p className="text-xs text-[#627D98] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <span className="text-xs font-semibold" style={{ color: accentColor }}>
        {cta}
      </span>
    </Link>
  );
}

export function HomeCTABanner() {
  const { t } = useTranslation();

  return (
    <section className="px-4 py-5">
      <div className="flex gap-3">
        <CTACard
          href={ROUTES.addListing}
          title={t("home.cta.addProperty")}
          description={t("home.cta.addPropertyDesc")}
          cta={t("home.cta.addPropertyCTA")}
          accentColor="#0A3C36"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          }
        />
        <CTACard
          href={ROUTES.map}
          title={t("home.cta.browseMap")}
          description={t("home.cta.browseMapDesc")}
          cta={t("home.cta.browseMapCTA")}
          accentColor="#1A5C54"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          }
        />
      </div>
    </section>
  );
}
