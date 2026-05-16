"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  href: string;
  labelAr: string;
  matchExact?: boolean;
}

interface DashboardNavProps {
  items: DashboardNavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <div
      className="bg-white border-b border-[#F0EBE3] overflow-x-auto scrollbar-none"
      dir="rtl"
    >
      <div className="flex items-stretch px-4 gap-1 min-w-max">
        {items.map((item) => {
          const isActive = item.matchExact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-[#C65D3B] text-[#C65D3B]"
                  : "border-transparent text-[#7A6B5E] hover:text-[#1E1E1E]"
              )}
            >
              {item.labelAr}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
