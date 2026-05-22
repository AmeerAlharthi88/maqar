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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F0F4F8]">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
            className="text-[#A0AEC0]"
          >
            <rect
              x="4" y="8" width="32" height="24" rx="3"
              stroke="currentColor" strokeWidth="1.5"
            />
            <circle cx="14" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M4 26l9-8 6 6 4-4 9 8"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
            />
            {/* Maqar emerald accent dot */}
            <circle cx="14" cy="17" r="1.5" fill="#0A3C36" opacity="0.35" />
          </svg>
          <span className="text-[10px] font-medium text-[#A0AEC0] leading-none text-center px-2">
            صورة العقار غير متوفرة
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
