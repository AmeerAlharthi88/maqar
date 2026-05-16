import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";

interface PropertyImageProps {
  src: string;
  alt: string;
  imageCount?: number;
  aspectRatio?: "video" | "square" | "listing";
  className?: string;
  priority?: boolean;
}

export function PropertyImage({ src, alt, imageCount, aspectRatio = "listing", className }: PropertyImageProps) {
  const aspectClasses = {
    video:   "aspect-video",
    square:  "aspect-square",
    listing: "aspect-[4/3]",
  };

  return (
    <div className={cn("relative w-full overflow-hidden bg-[#F5F0EA]", aspectClasses[aspectRatio], className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-property.jpg";
        }}
      />
      {imageCount && imageCount > 1 && (
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
