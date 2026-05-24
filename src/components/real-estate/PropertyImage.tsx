"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";

interface PropertyImageProps {
  src?: string | null;
  alt: string;
  imageCount?: number;
  aspectRatio?: "video" | "square" | "listing";
  className?: string;
  priority?: boolean;
}

export function PropertyImage({
  src,
  alt,
  imageCount,
  aspectRatio = "listing",
  className,
}: PropertyImageProps) {
  const [failed, setFailed] = useState(false);

  const aspectClasses = {
    video:   "aspect-video",
    square:  "aspect-square",
    listing: "aspect-[4/3]",
  };

  const hasSrc = src && src.trim() !== "";
  const showImage = hasSrc && !failed;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#F0F4F8]",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {showImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        /* Maqar brand placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#E6F0EF] to-[#F0F4F8]">
          <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-sm">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              {/* House outline */}
              <path
                d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
                stroke="#0A3C36"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="#0A3C36"
                fillOpacity="0.08"
              />
              {/* Door */}
              <path
                d="M9 21V14h6v7"
                stroke="#0A3C36"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Gold accent window */}
              <rect x="10.5" y="8" width="3" height="3" rx="0.5" fill="#E5BA73" opacity="0.8" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-[#627D98] leading-none text-center px-4">
            لا توجد صورة
          </span>
        </div>
      )}

      {/* Image count badge — only when image loaded successfully */}
      {showImage && imageCount != null && imageCount > 1 && (
        <div className="absolute bottom-2 start-2 flex items-center gap-1 bg-black/55 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          {toArabicNumerals(imageCount)}
        </div>
      )}
    </div>
  );
}
