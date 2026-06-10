"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLocaleStore } from "@/store/locale.store";

export interface DashboardNavItem {
  href: string;
  labelAr: string;
  /** English label. Falls back to labelAr when omitted. */
  labelEn?: string;
  matchExact?: boolean;
  /** Marks a module that is demo/not-yet-live — shows a small badge. */
  demo?: boolean;
}

interface DashboardNavProps {
  items: DashboardNavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();
  const isAr = useLocaleStore((s) => s.locale) === "ar";

  return (
    <div
      className="bg-white border-b border-[#E2E8F0] overflow-x-auto scrollbar-none"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex items-stretch px-4 gap-1 min-w-max">
        {items.map((item) => {
          const isActive = item.matchExact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const label = isAr ? item.labelAr : (item.labelEn ?? item.labelAr);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-[#0A3C36] text-[#0A3C36]"
                  : "border-transparent text-[#627D98] hover:text-[#102A43]"
              )}
            >
              {label}
              {item.demo && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#9A7400] leading-none">
                  {isAr ? "تجريبي" : "Demo"}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
