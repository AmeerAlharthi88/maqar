"use client";

import { useRouter } from "next/navigation";

interface DashboardPageHeaderProps {
  titleAr: string;
  subtitleAr?: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export function DashboardPageHeader({
  titleAr,
  subtitleAr,
  showBack = false,
  action,
}: DashboardPageHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3"
      dir="rtl"
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          aria-label="رجوع"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-[#1E1E1E] truncate">{titleAr}</h1>
        {subtitleAr && (
          <p className="text-xs text-[#A89480] truncate">{subtitleAr}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
