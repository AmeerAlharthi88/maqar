"use client";

import { useState, useEffect } from "react";
import { useFavoritesStore } from "@/store/favorites.store";
import { useAuthStore } from "@/store/auth.store";
import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
  size?: "sm" | "md";
  className?: string;
}

export function FavoriteButton({ listingId, size = "sm", className }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const [loginOpen, setLoginOpen] = useState(false);
  // Prevent hydration mismatch: localStorage state only applies after mount.
  const [mounted, setMounted] = useState(false);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { setMounted(true); }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Before mount render identical to SSR (not favorited) to avoid layout shift
  const favorited = mounted && isFavorite(listingId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    toggle(listingId);
  }

  return (
    <>
      <button
        aria-label={favorited ? "إزالة من المفضلة" : "حفظ في المفضلة"}
        aria-pressed={favorited}
        onClick={handleClick}
        className={cn(
          "rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm",
          "transition-colors hover:bg-white active:scale-95",
          size === "sm" ? "w-8 h-8" : "w-10 h-10",
          favorited ? "text-[#C65D3B]" : "text-[#7A6B5E]",
          className
        )}
      >
        <svg
          width={size === "sm" ? 17 : 20}
          height={size === "sm" ? 17 : 20}
          viewBox="0 0 24 24"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <LoginRequiredModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        reasonAr="لحفظ العقارات في المفضلة يجب تسجيل الدخول أولاً."
      />
    </>
  );
}
