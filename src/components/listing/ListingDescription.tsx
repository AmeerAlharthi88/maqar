"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ListingDescriptionProps {
  description: string;
  aiGenerated?: boolean;
}

const TRUNCATE_AT = 220;

export function ListingDescription({
  description,
  aiGenerated = false,
}: ListingDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = description.length > TRUNCATE_AT;
  const displayText =
    needsTruncate && !expanded
      ? description.slice(0, TRUNCATE_AT).trim() + "..."
      : description;

  return (
    <div className="px-4 py-4 border-t border-[#F0EBE3]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-[#1E1E1E]">وصف العقار</h2>
        {aiGenerated && (
          <span className="text-[10px] text-[#7A6B5E] bg-[#F5F0EA] px-2 py-0.5 rounded-full border border-[#E8DDD0]">
            وصف مُنشأ بالذكاء الاصطناعي
          </span>
        )}
      </div>

      {/* Sanitized text — only plain text, no HTML injection */}
      <p
        className={cn(
          "text-sm text-[#3D3330] leading-relaxed whitespace-pre-line",
          !expanded && needsTruncate && "line-clamp-5"
        )}
        dir="rtl"
      >
        {displayText}
      </p>

      {needsTruncate && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm font-semibold text-[#C65D3B] hover:underline focus-visible:outline-none focus-visible:underline"
          aria-expanded={expanded}
        >
          {expanded ? "عرض أقل" : "قراءة المزيد"}
        </button>
      )}
    </div>
  );
}
