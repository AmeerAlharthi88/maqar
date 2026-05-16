"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BOTTOM_NAV_ITEMS } from "@/config/navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-svh">
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 start-0 end-0 z-[100] bg-white border-t border-[#F0EBE3]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="التنقل الرئيسي"
      >
        <div className="flex items-stretch h-16">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            if (item.isAdd) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex-1 flex flex-col items-center justify-center"
                  aria-label={item.labelAr}
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#C65D3B] shadow-lg -mt-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-medium leading-none mt-1 text-[#C65D3B]">
                    {item.labelAr}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 min-w-0 transition-colors",
                  isActive ? "text-[#C65D3B]" : "text-[#A89480]"
                )}
              >
                <span className="flex-shrink-0">
                  <NavIcon itemKey={item.key} filled={isActive} />
                </span>
                <span className="text-[10px] font-medium leading-none">
                  {item.labelAr}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function NavIcon({ itemKey, filled }: { itemKey: string; filled: boolean }) {
  const w = filled ? "2.5" : "2";

  if (itemKey === "home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={w}>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" stroke={filled ? "white" : "currentColor"} strokeWidth="2" />
      </svg>
    );
  }
  if (itemKey === "map") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w}>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    );
  }
  if (itemKey === "favorites") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={w}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (itemKey === "account") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={w}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  return null;
}
