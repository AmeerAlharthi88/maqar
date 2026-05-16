import type { Listing } from "@/types/listing";
import type { NearbyService } from "@/lib/helpers/listing-detail";
import { toArabicNumerals } from "@/lib/formatters";

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

const SERVICE_LABELS: Record<string, string> = {
  mosque: "مسجد قريب",
  school: "مدرسة قريبة",
  mall: "مركز تسوق",
  hospital: "مستشفى / صحي",
  beach: "شاطئ قريب",
  fuel: "محطة وقود",
};

function NearbyServiceRow({ service }: { service: NearbyService }) {
  const icon = SERVICE_ICONS[service.type] ?? SERVICE_ICONS.fuel;
  const label = SERVICE_LABELS[service.type] ?? service.nameAr;
  const distLabel =
    service.distanceKm < 1
      ? `${toArabicNumerals(Math.round(service.distanceKm * 1000))} م`
      : `${toArabicNumerals(service.distanceKm.toFixed(1))} كم`;

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F5F0EA] last:border-0">
      <div className="flex items-center gap-2">
        <span
          className="text-[#7A6B5E]"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
        <span className="text-sm text-[#3D3330]">{label}</span>
        <span className="text-[10px] text-[#A89480] bg-[#F5F0EA] px-1.5 py-0.5 rounded-full">تقديري</span>
      </div>
      <span className="text-sm font-semibold text-[#1E1E1E]">{distLabel}</span>
    </div>
  );
}

export function ListingLocation({ listing, nearbyServices }: ListingLocationProps) {
  const loc = listing.location;

  const breadcrumbParts = [
    loc.governorateAr,
    loc.wilayatAr,
    loc.areaAr,
    loc.addressAr,
  ].filter(Boolean);

  return (
    <div className="px-4 py-4 border-t border-[#F0EBE3]">
      <h2 className="text-base font-bold text-[#1E1E1E] mb-3">الموقع والخدمات القريبة</h2>

      {/* Address hierarchy */}
      <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-3 mb-3">
        <div className="flex flex-wrap items-center gap-1 text-sm text-[#3D3330]" dir="rtl">
          {breadcrumbParts.map((part, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A89480" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              )}
              <span className={idx === 0 ? "font-semibold text-[#1E1E1E]" : "text-[#7A6B5E]"}>
                {part}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Nearby services */}
      {nearbyServices.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
          <div className="px-4">
            {nearbyServices.map((service, idx) => (
              <NearbyServiceRow key={idx} service={service} />
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-[10px] text-[#A89480] text-center">
        المسافات تقديرية وقد تختلف عن الواقع
      </p>
    </div>
  );
}
