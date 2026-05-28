"use client";

import { formatNumber } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing } from "@/types/listing";
import type { NearbyService } from "@/lib/helpers/listing-detail";

interface ListingLocationProps {
  listing: Listing;
  nearbyServices: NearbyService[];
}

const SERVICE_ICONS: Record<string, string> = {
  mosque: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 4 5 10 7 13 2-3 7-9 7-13 0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  school: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  mall: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  hospital: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>`,
  beach: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><circle cx="12" cy="7" r="3"/></svg>`,
  fuel: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14"/><path d="M3 22h12M17 8l2 2 2-2"/><path d="M19 4v8"/></svg>`,
};

const SERVICE_LABELS: Record<string, { ar: string; en: string }> = {
  mosque:   { ar: "مسجد قريب",         en: "Nearby Mosque" },
  school:   { ar: "مدرسة قريبة",       en: "Nearby School" },
  mall:     { ar: "مركز تسوق",         en: "Shopping Mall" },
  hospital: { ar: "مستشفى / صحي",      en: "Hospital / Clinic" },
  beach:    { ar: "شاطئ قريب",         en: "Nearby Beach" },
  fuel:     { ar: "محطة وقود",         en: "Fuel Station" },
};

function NearbyServiceRow({ service, locale }: { service: NearbyService; locale: string }) {
  const isAr = locale === "ar";
  const icon = SERVICE_ICONS[service.type] ?? SERVICE_ICONS.fuel;
  const labelMap = SERVICE_LABELS[service.type];
  const label = labelMap
    ? (isAr ? labelMap.ar : labelMap.en)
    : service.nameAr;
  const distLabel =
    service.distanceKm < 1
      ? isAr
        ? `${formatNumber(Math.round(service.distanceKm * 1000), "ar")} م`
        : `${formatNumber(Math.round(service.distanceKm * 1000), "en")} m`
      : isAr
        ? `${formatNumber(parseFloat(service.distanceKm.toFixed(1)), "ar")} كم`
        : `${formatNumber(parseFloat(service.distanceKm.toFixed(1)), "en")} km`;

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
      <div className="flex items-center gap-2">
        <span
          className="text-[#627D98]"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
        <span className="text-sm text-[#102A43]">{label}</span>
        <span className="text-[10px] text-[#627D98] bg-[#F0F4F8] px-1.5 py-0.5 rounded-full">
          {isAr ? "تقديري" : "est."}
        </span>
      </div>
      <span className="text-sm font-semibold text-[#102A43]">{distLabel}</span>
    </div>
  );
}

export function ListingLocation({ listing, nearbyServices }: ListingLocationProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const loc = listing.location;

  const breadcrumbParts = isAr
    ? [loc.governorateAr, loc.wilayatAr, loc.areaAr, loc.addressAr].filter(Boolean)
    : [
        loc.governorateEn ?? loc.governorateAr,
        loc.wilayatEn ?? loc.wilayatAr,
        loc.areaEn ?? loc.areaAr,
        loc.addressEn ?? loc.addressAr,
      ].filter(Boolean);

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-3">
        {t("listing.location.title")}
      </h2>

      {/* Address hierarchy */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 mb-3">
        <div className="flex flex-wrap items-center gap-1 text-sm text-[#102A43]">
          {breadcrumbParts.map((part, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              )}
              <span className={idx === 0 ? "font-semibold text-[#102A43]" : "text-[#627D98]"}>
                {part}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Nearby services */}
      {nearbyServices.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-4">
            {nearbyServices.map((service, idx) => (
              <NearbyServiceRow key={idx} service={service} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-[10px] text-[#627D98] text-center">
        {isAr
          ? "المسافات تقديرية وقد تختلف عن الواقع"
          : "Distances are approximate and may vary"}
      </p>
    </div>
  );
}
