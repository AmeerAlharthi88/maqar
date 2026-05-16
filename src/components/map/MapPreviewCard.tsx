"use client";

import Link from "next/link";
import { FavoriteButton } from "@/components/real-estate/FavoriteButton";
import { ROUTES } from "@/config/routes";
import { formatPriceBubble } from "@/lib/helpers/map-utils";
import { isBelowMarket } from "@/lib/helpers/listing-filters";
import { AGENT_MAP } from "@/mock/agents";
import {
  buildWhatsAppLink,
  buildListingWhatsAppMessage,
} from "@/lib/helpers/whatsapp";
import { toArabicNumerals } from "@/lib/formatters";
import type { Listing } from "@/types/listing";

interface MapPreviewCardProps {
  listing: Listing;
  onClose: () => void;
}

export function MapPreviewCard({ listing, onClose }: MapPreviewCardProps) {
  const agent = AGENT_MAP[listing.agentId];
  const belowMkt = isBelowMarket(listing);

  const whatsappUrl = agent
    ? buildWhatsAppLink(
        agent.whatsapp,
        buildListingWhatsAppMessage({
          agentName: agent.nameAr,
          listingTitle: listing.titleAr,
          listingId: listing.id,
        })
      )
    : null;

  return (
    <div
      className="fixed left-0 right-0 z-[60] animate-slide-up"
      style={{
        bottom: 0,
        paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-3 bg-white rounded-2xl shadow-[0_-4px_32px_0_rgb(30_30_30/0.18)] border border-[#F0EBE3] overflow-hidden">
        {/* Main content row */}
        <div className="flex gap-3 p-3">
          {/* Image */}
          <div className="relative w-24 h-[88px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F5F0EA]">
            <img
              src={listing.coverImage}
              alt={listing.titleAr}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Fallback illustration */}
            <div className="absolute inset-0 flex items-center justify-center text-[#C8B8A8] pointer-events-none">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>

            {/* Purpose chip */}
            <div className="absolute bottom-0 inset-x-0 text-center">
              <span
                className={`inline-block w-full py-0.5 text-[10px] font-semibold text-white ${
                  listing.purpose === "sale"
                    ? "bg-[#C65D3B]/90"
                    : "bg-[#2471A3]/90"
                }`}
              >
                {listing.purpose === "sale" ? "للبيع" : "للإيجار"}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {/* Price */}
                <p className="text-[15px] font-bold text-[#C65D3B] leading-tight">
                  {formatPriceBubble(listing.price, listing.purpose)}
                </p>
                {/* Title */}
                <h3 className="text-sm font-semibold text-[#1E1E1E] leading-snug line-clamp-1 mt-0.5">
                  {listing.titleAr}
                </h3>
                {/* Location */}
                <p className="text-xs text-[#7A6B5E] mt-0.5">
                  {listing.location.areaAr} · {listing.location.wilayatAr}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="إغلاق"
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#A89480] hover:text-[#1E1E1E] hover:bg-[#F5F0EA] transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {listing.specs.bedrooms > 0 && (
                <span className="flex items-center gap-1 text-xs text-[#7A6B5E]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
                    <rect x="2" y="9" width="20" height="11" rx="2" />
                    <path d="M7 9v11M17 9v11" />
                  </svg>
                  {toArabicNumerals(listing.specs.bedrooms)}
                </span>
              )}
              {listing.specs.bathrooms > 0 && (
                <span className="flex items-center gap-1 text-xs text-[#7A6B5E]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                    <line x1="10" x2="8" y1="5" y2="7" />
                    <line x1="2" x2="22" y1="12" y2="12" />
                  </svg>
                  {toArabicNumerals(listing.specs.bathrooms)}
                </span>
              )}
              <span className="text-xs text-[#7A6B5E]">
                {toArabicNumerals(listing.specs.area)} م²
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 mt-2">
              {listing.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C65D3B]/10 text-[#C65D3B] text-[10px] font-semibold">
                  موثق
                </span>
              )}
              {belowMkt && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5B8C5A]/10 text-[#5B8C5A] text-[10px] font-semibold">
                  أقل من السوق
                </span>
              )}
              {listing.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C65D3B]/10 text-[#C65D3B] text-[10px] font-semibold">
                  مميز
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-3 pb-3">
          <Link
            href={ROUTES.listing(listing.id)}
            className="flex-1 h-10 rounded-xl bg-[#C65D3B] text-white text-sm font-semibold flex items-center justify-center hover:bg-[#B34F2F] transition-colors"
            aria-label={`عرض تفاصيل ${listing.titleAr}`}
          >
            عرض التفاصيل
          </Link>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل عبر واتساب"
              className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#1DA851] transition-colors active:scale-95"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}

          <div className="flex-shrink-0">
            <FavoriteButton listingId={listing.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
