"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/real-estate/FavoriteButton";
import { toArabicNumerals } from "@/lib/formatters";

interface ListingGalleryProps {
  images: string[];
  title: string;
  listingId: string;
  coverImage: string;
}

export function ListingGallery({
  images,
  title,
  listingId,
  coverImage,
}: ListingGalleryProps) {
  const router = useRouter();
  const allImages = images.length > 0 ? images : [coverImage];
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + allImages.length) % allImages.length),
    [allImages.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % allImages.length),
    [allImages.length]
  );

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  }

  return (
    <>
      {/* ── Gallery strip ─────────────────────────────────────────────── */}
      <div className="relative w-full bg-[#1E1E1E] overflow-hidden">
        {/* Main image */}
        <div
          className="relative w-full"
          style={{ paddingBottom: "62%" }}
          onClick={() => setModalOpen(true)}
          role="button"
          aria-label="فتح معرض الصور"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
        >
          <img
            src={allImages[current]}
            alt={`${title} — صورة ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23E8DDD0' width='400' height='250'/%3E%3Ctext fill='%23A89480' font-family='system-ui' font-size='18' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3Eلا توجد صورة%3C/text%3E%3C/svg%3E";
            }}
            loading={current === 0 ? "eager" : "lazy"}
          />

          {/* Dark gradient at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* ── Floating controls ──────────────────────────────────────────── */}

        {/* Back button — top start */}
        <button
          onClick={() => router.back()}
          aria-label="رجوع"
          className={cn(
            "absolute top-3 start-3 z-10",
            "w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white",
            "flex items-center justify-center transition-colors hover:bg-black/60",
            "focus-visible:ring-2 focus-visible:ring-white"
          )}
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="flip-x"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        {/* Action buttons — top end */}
        <div
          className="absolute top-3 end-3 z-10 flex items-center gap-2"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
        >
          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="مشاركة"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            {shareSuccess ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            )}
          </button>

          {/* Favorite */}
          <FavoriteButton listingId={listingId} size="md" />
        </div>

        {/* Image counter — bottom start */}
        {allImages.length > 1 && (
          <button
            onClick={() => setModalOpen(true)}
            className="absolute bottom-3 start-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full"
            aria-label={`عرض جميع الصور — ${allImages.length} صور`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {toArabicNumerals(allImages.length)} صور
          </button>
        )}

        {/* Prev / Next arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="الصورة السابقة"
              className="absolute start-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flip-x">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="الصورة التالية"
              className="absolute end-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flip-x">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {allImages.length > 1 && allImages.length <= 8 && (
          <div className="absolute bottom-3 end-3 z-10 flex gap-1">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`الصورة ${i + 1}`}
                className={cn(
                  "rounded-full transition-all",
                  i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip (3+ images) */}
      {allImages.length > 2 && (
        <div className="flex gap-2 px-4 pt-3 overflow-x-auto scrollbar-none">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`الصورة ${i + 1}`}
              className={cn(
                "flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors",
                i === current ? "border-[#C65D3B]" : "border-transparent"
              )}
            >
              <img
                src={src}
                alt={`مصغرة ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Full-screen gallery modal ──────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[500] bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="معرض الصور"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
            <button
              onClick={() => setModalOpen(false)}
              aria-label="إغلاق المعرض"
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <span className="text-white text-sm font-medium">
              {toArabicNumerals(current + 1)} / {toArabicNumerals(allImages.length)}
            </span>
            <div className="w-10" aria-hidden="true" />
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center px-2 relative">
            <img
              src={allImages[current]}
              alt={`${title} — صورة ${current + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
            />

            {allImages.length > 1 && (
              <>
                <button onClick={prev} aria-label="السابقة"
                  className="absolute start-2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flip-x">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button onClick={next} aria-label="التالية"
                  className="absolute end-2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flip-x">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-none flex-shrink-0"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>
            {allImages.map((src, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`الصورة ${i + 1}`}
                className={cn(
                  "flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all",
                  i === current ? "border-[#C65D3B] opacity-100" : "border-white/20 opacity-50"
                )}>
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
