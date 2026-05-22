"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/language.store";

interface SectionHeaderProps {
  titleAr: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { title: "text-base font-semibold", subtitle: "text-xs" },
  md: { title: "text-lg font-bold",       subtitle: "text-sm" },
  lg: { title: "text-xl font-bold",       subtitle: "text-sm" },
};

export function SectionHeader({ titleAr, titleEn, subtitleAr, subtitleEn, action, className, size = "md" }: SectionHeaderProps) {
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  const s = sizeClasses[size];
  const title    = isAr ? titleAr    : (titleEn    ?? titleAr);
  const subtitle = isAr ? subtitleAr : (subtitleEn ?? subtitleAr);

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex flex-col gap-0.5">
        <h2 className={cn(s.title, "text-[#1E1E1E]")}>{title}</h2>
        {subtitle && <p className={cn(s.subtitle, "text-[#7A6B5E]")}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
