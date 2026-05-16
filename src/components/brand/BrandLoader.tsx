"use client";

import { MaqarLogoMark } from "./MaqarLogoMark";

interface BrandLoaderProps {
  message?: string;
}

export function BrandLoader({ message = "جاري التحميل..." }: BrandLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] gap-5">
      <div className="animate-pulse-brand">
        <MaqarLogoMark size={64} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xl font-bold text-[#C65D3B]">مقر</span>
        <span className="text-sm text-[#7A6B5E]">{message}</span>
      </div>
      {/* Dot spinner */}
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[#C65D3B] animate-pulse-brand"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
