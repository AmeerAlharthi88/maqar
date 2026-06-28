"use client";

import { buildWhatsAppLink, buildListingWhatsAppMessage } from "@/lib/helpers/whatsapp";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing, ListingOwnerContact } from "@/types/listing";

interface AgentCardProps {
  listing: Listing;
  owner: ListingOwnerContact | null;
}

export function AgentCard({ listing, owner }: AgentCardProps) {
  const { locale } = useTranslation();
  const isAr = locale === "ar";

  const heading = isAr ? "المعلن" : "Advertiser";

  // No real owner could be resolved — show an honest unavailable state, never
  // fabricated agent data (FP17C-1).
  if (!owner) {
    return (
      <div className="px-4 py-4 border-t border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#102A43] mb-3">{heading}</h2>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 text-sm text-[#627D98]">
          {isAr
            ? "معلومات المعلن غير متاحة حالياً."
            : "Advertiser details are currently unavailable."}
        </div>
      </div>
    );
  }

  const name = owner.nameAr || (isAr ? "المعلن" : "Advertiser");
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("");

  const phone = owner.phone?.trim() || "";
  const whatsapp = owner.whatsapp?.trim() || "";
  const hasContact = Boolean(phone || whatsapp);

  const whatsappHref = whatsapp
    ? buildWhatsAppLink(
        whatsapp,
        buildListingWhatsAppMessage({
          listingTitle: listing.titleAr,
          listingId: listing.id,
          agentName: name,
        })
      )
    : null;
  const callHref = phone ? `tel:${phone}` : null;

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-3">{heading}</h2>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        {/* Owner header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-[#0A3C36]/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {owner.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={owner.avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-[#0A3C36]">{initials}</span>
            )}
          </div>

          {/* Name + verification + license (only when real) */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#102A43] truncate">{name}</span>
              {owner.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F0EF] text-[#0A3C36] text-[10px] font-semibold">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {isAr ? "موثّق" : "Verified"}
                </span>
              ) : (
                <span className="text-[10px] text-[#627D98] bg-[#F0F4F8] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                  {isAr ? "غير موثّق" : "Not verified"}
                </span>
              )}
            </div>
            {owner.licenseNumber && (
              <p className="text-[10px] text-[#627D98] mt-0.5">
                {isAr ? "ترخيص: " : "License: "}
                {owner.licenseNumber}
              </p>
            )}
          </div>
        </div>

        {/* CTA buttons — real number or honest unavailable state */}
        {hasContact ? (
          <div className="grid grid-cols-2 gap-2">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                {isAr ? "واتساب" : "WhatsApp"}
              </a>
            )}
            {callHref && (
              <a
                href={callHref}
                className="flex items-center justify-center gap-2 bg-[#F0F4F8] text-[#102A43] text-sm font-semibold py-2.5 rounded-xl border border-[#E2E8F0]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {isAr ? "اتصال" : "Call"}
              </a>
            )}
          </div>
        ) : (
          <p className="text-xs text-[#627D98] text-center bg-[#F0F4F8] rounded-xl py-2.5 border border-[#E2E8F0]">
            {isAr ? "معلومات التواصل غير متاحة" : "Contact information unavailable"}
          </p>
        )}
      </div>
    </div>
  );
}
