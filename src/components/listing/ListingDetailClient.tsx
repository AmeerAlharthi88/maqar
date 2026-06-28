"use client";

import { useEffect, useState, useCallback } from "react";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { useAuthStore } from "@/store/auth.store";
import { buildWhatsAppLink } from "@/lib/helpers/whatsapp";
import { buildDetailWhatsAppMessage } from "@/lib/helpers/listing-detail";
import { cn } from "@/lib/utils";
import { BookViewingModal } from "./BookViewingModal";
import { MakeOfferModal } from "./MakeOfferModal";
import { ReportListingModal } from "./ReportListingModal";
import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";
import { createLead } from "@/lib/supabase/crm";
import { trackEvent } from "@/lib/supabase/analytics";
import { useTranslation } from "@/i18n/useTranslation";
import type { Listing, ListingOwnerContact } from "@/types/listing";

interface ListingDetailClientProps {
  listing: Listing;
  owner: ListingOwnerContact | null;
}

type ProtectedModal = "bookViewing" | "makeOffer" | "report" | null;

export function ListingDetailClient({ listing, owner }: ListingDetailClientProps) {
  const { add: addRecentlyViewed } = useRecentlyViewedStore();
  const { toggle, isFavorite } = useFavoritesStore();
  const { isAuthenticated, user } = useAuthStore();
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  const [bookViewingOpen, setBookViewingOpen] = useState(false);
  const [makeOfferOpen, setMakeOfferOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Which modal was blocked by the login gate
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [blockedModal, setBlockedModal] = useState<ProtectedModal>(null);

  const favorite = isFavorite(listing.id);
  const listingUrl = `/listing/${listing.id}`;

  // Track recently viewed + analytics view event on mount
  useEffect(() => {
    addRecentlyViewed({
      id: listing.id,
      titleAr: listing.titleAr,
      coverImage: listing.coverImage,
      price: listing.price,
      purpose: listing.purpose,
      areaAr: listing.location.areaAr,
      viewedAt: new Date().toISOString(),
    });

    // Session-dedup guard: fire view event at most once per browser session per listing.
    const sessionKey = `maqar_view_${listing.id}`;
    if (typeof sessionStorage !== "undefined" && !sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      trackEvent({
        listingId: listing.id,
        agentId:   listing.agentId ?? null,
        userId:    user?.id ?? null,
        eventType: "view",
        source:    "listing_detail",
      }).catch((err) => console.error("[ListingDetail] trackEvent view error:", err));
    }
  }, [listing.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real owner contact only (FP17C-1). null hrefs → safe unavailable state, never
  // a fabricated mock number.
  const ownerPhone = owner?.phone?.trim() || "";
  const ownerWhatsapp = owner?.whatsapp?.trim() || "";

  const whatsappMessage = buildDetailWhatsAppMessage({
    listingTitle: listing.titleAr,
    price: listing.price,
    purpose: listing.purpose,
    locationAr: [listing.location.areaAr, listing.location.wilayatAr]
      .filter(Boolean)
      .join("، "),
    listingId: listing.id,
  });
  const whatsappHref = ownerWhatsapp ? buildWhatsAppLink(ownerWhatsapp, whatsappMessage) : null;
  const callHref = ownerPhone ? `tel:${ownerPhone}` : null;

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = `${listing.titleAr} — ${listing.price.toLocaleString("en-US")} ${t("common.omr")}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: listing.titleAr, text, url });
      } catch {
        // user cancelled
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  }, [listing, t]);

  // ── Auth-gated action helper ───────────────────────────────────────────────
  function requireAuth(modal: ProtectedModal, action: () => void) {
    if (!isAuthenticated) {
      setBlockedModal(modal);
      setLoginModalOpen(true);
      return;
    }
    action();
  }

  // ── Favorite toggle (auth-gated) ──────────────────────────────────────────
  function handleFavoriteToggle() {
    requireAuth(null, () => toggle(listing.id));
  }

  // ── WhatsApp click — create lead + track analytics, then navigate ─────────
  function handleWhatsAppClick() {
    if (isAuthenticated && user?.id) {
      createLead({
        listingId: listing.id,
        agentId: listing.agentId,
        userId: user.id,
        source: "whatsapp",
      }).catch((err) => console.error("[ListingDetail] createLead error:", err));
    }
    trackEvent({
      listingId: listing.id,
      agentId:   listing.agentId ?? null,
      userId:    user?.id ?? null,
      eventType: "whatsapp_click",
      source:    "listing_detail",
    }).catch((err) => console.error("[ListingDetail] trackEvent whatsapp error:", err));
  }

  // ── Call click — track analytics, then navigate via tel link ──────────────
  function handleCallClick() {
    trackEvent({
      listingId: listing.id,
      agentId:   listing.agentId ?? null,
      userId:    user?.id ?? null,
      eventType: "call_click",
      source:    "listing_detail",
    }).catch((err) => console.error("[ListingDetail] trackEvent call error:", err));
  }

  // Login modal reason text per action
  const loginReason: Record<NonNullable<ProtectedModal>, string> = {
    bookViewing: isAr
      ? "لحجز موعد معاينة يجب تسجيل الدخول أولاً."
      : "Sign in to book a viewing appointment.",
    makeOffer: isAr
      ? "لتقديم عرض سعر يجب تسجيل الدخول أولاً."
      : "Sign in to submit a price offer.",
    report: isAr
      ? "للإبلاغ عن إعلان يجب تسجيل الدخول أولاً."
      : "Sign in to report this listing.",
  };

  return (
    <>
      {/* Sticky action bar — sits above the bottom nav */}
      <div
        className="fixed start-0 end-0 z-[110] bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]"
        style={{
          bottom: 0,
          paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          {/* WhatsApp + Call — real owner contact only. If neither exists, a safe
              unavailable state replaces them (never a fabricated number) (FP17C-1). */}
          {whatsappHref || callHref ? (
            <>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-bold py-3 rounded-2xl"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  {t("listing.contact.whatsapp")}
                </a>
              )}
              {callHref && (
                <a
                  href={callHref}
                  onClick={handleCallClick}
                  className={cn(
                    "flex items-center justify-center gap-1.5 text-sm font-semibold py-3 px-4 rounded-2xl",
                    whatsappHref
                      ? "bg-[#F0F4F8] text-[#102A43] border border-[#E2E8F0]"
                      : "flex-1 bg-[#0A3C36] text-white"
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {t("listing.contact.call")}
                </a>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 bg-[#F0F4F8] text-[#627D98] text-sm font-semibold py-3 rounded-2xl border border-[#E2E8F0]">
              {isAr ? "التواصل غير متاح" : "Contact unavailable"}
            </div>
          )}

          {/* Book viewing — auth-gated, only for sale */}
          {listing.purpose === "sale" && (
            <button
              onClick={() => requireAuth("bookViewing", () => setBookViewingOpen(true))}
              className="flex items-center justify-center gap-1.5 bg-[#102A43] text-white text-sm font-semibold py-3 px-4 rounded-2xl"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {isAr ? "معاينة" : "View"}
            </button>
          )}

          {/* Favorite — auth-gated */}
          <button
            onClick={handleFavoriteToggle}
            aria-label={favorite ? t("listing.actions.unfavorite") : t("listing.actions.favorite")}
            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#F0F4F8] border border-[#E2E8F0] flex-shrink-0"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={favorite ? "#0A3C36" : "none"}
              stroke="#0A3C36"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Secondary row: make offer + report + share */}
        <div className="flex items-center justify-between px-4 pb-2">
          {listing.purpose === "sale" ? (
            <button
              onClick={() => requireAuth("makeOffer", () => setMakeOfferOpen(true))}
              className="text-xs font-semibold text-[#0A3C36] underline underline-offset-2"
            >
              {t("listing.actions.makeOffer")}
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            {/* Share */}
            <button
              onClick={handleShare}
              className="text-xs text-[#627D98] flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {shareSuccess ? t("listing.actions.linkCopied") : t("listing.actions.share")}
            </button>

            {/* Report — auth-gated */}
            <button
              onClick={() => requireAuth("report", () => setReportOpen(true))}
              className="text-xs text-[#627D98] flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {t("listing.actions.report")}
            </button>
          </div>
        </div>
      </div>

      {/* Share toast */}
      {shareSuccess && (
        <div className="fixed top-16 start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 z-[200] bg-[#102A43] text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg">
          {t("listing.actions.linkCopied")}
        </div>
      )}

      {/* Auth-gate modal */}
      <LoginRequiredModal
        isOpen={loginModalOpen}
        onClose={() => { setLoginModalOpen(false); setBlockedModal(null); }}
        redirectTo={listingUrl}
        reason={blockedModal ? loginReason[blockedModal] : (isAr ? "يجب تسجيل الدخول للمتابعة." : "Sign in to continue.")}
      />

      {/* Protected modals — pass userId + agentId for Supabase inserts */}
      <BookViewingModal
        open={bookViewingOpen}
        onClose={() => setBookViewingOpen(false)}
        listing={listing}
        userId={user?.id}
        agentId={listing.agentId}
      />
      <MakeOfferModal
        open={makeOfferOpen}
        onClose={() => setMakeOfferOpen(false)}
        listing={listing}
        userId={user?.id}
        agentId={listing.agentId}
      />
      <ReportListingModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        listing={listing}
      />
    </>
  );
}
