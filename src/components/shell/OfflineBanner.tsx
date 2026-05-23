"use client";

import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { cn } from "@/lib/utils";

export function OfflineBanner() {
  const isOnline = useOfflineStatus();

  if (isOnline) return null;

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-[600]",
        "bg-[#102A43] text-white text-center text-xs font-medium py-2 px-4",
        "animate-slide-down"
      )}
      role="alert"
      aria-live="assertive"
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5BA73] animate-pulse-brand" />
        لا يوجد اتصال بالإنترنت — يتم العمل في وضع عدم الاتصال
      </span>
    </div>
  );
}
