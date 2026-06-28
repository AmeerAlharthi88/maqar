"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

interface ListingDescriptionProps {
  description: string;
}

const TRUNCATE_AT = 220;

export function ListingDescription({ description }: ListingDescriptionProps) {
  const { locale } = useTranslation();
  const isAr = locale === "ar";
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = description.length > TRUNCATE_AT;
  const displayText =
    needsTruncate && !expanded
      ? description.slice(0, TRUNCATE_AT).trim() + "..."
      : description;

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-2">
        {isAr ? "وصف العقار" : "Description"}
      </h2>

      {/* Description text is authored in Arabic — keep it RTL regardless of UI locale */}
      <p
        className={cn(
          "text-sm text-[#102A43] leading-relaxed whitespace-pre-line",
          !expanded && needsTruncate && "line-clamp-5"
        )}
        dir="rtl"
      >
        {displayText}
      </p>

      {needsTruncate && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm font-semibold text-[#0A3C36] hover:underline focus-visible:outline-none focus-visible:underline"
          aria-expanded={expanded}
        >
          {expanded ? (isAr ? "عرض أقل" : "Show less") : (isAr ? "قراءة المزيد" : "Read more")}
        </button>
      )}
    </div>
  );
}
