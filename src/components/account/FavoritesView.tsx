"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFavoritesStore } from "@/store/favorites.store";
import { fetchListingsByIds } from "@/lib/supabase/listings";
import { getListingById } from "@/lib/helpers/listing-detail";
import { ROUTES } from "@/config/routes";
import type { Listing } from "@/types/listing";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

export function FavoritesView() {
  const router = useRouter();
  const { _idsArray: ids, toggle } = useFavoritesStore();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (ids.length === 0) {
      setListings([]);
      return;
    }

    if (DEV_SKIP_AUTH) {
      // Dev mode — pull from mock data
      const mockListings = ids
        .map((id) => getListingById(id))
        .filter(Boolean) as Listing[];
      setListings(mockListings);
      return;
    }

    // Production — fetch from Supabase
    setIsLoading(true);
    fetchListingsByIds(ids)
      .then((rows) => {
        if (rows.length > 0) {
          setListings(rows);
        } else {
          // Fallback to mock if Supabase returned nothing (e.g. listings not yet active)
          const mockListings = ids
            .map((id) => getListingById(id))
            .filter(Boolean) as Listing[];
          setListings(mockListings);
        }
      })
      .catch((err) => {
        console.error("[FavoritesView] fetchListingsByIds error:", err);
        // Fallback to mock on error
        const mockListings = ids
          .map((id) => getListingById(id))
          .filter(Boolean) as Listing[];
        setListings(mockListings);
      })
      .finally(() => setIsLoading(false));
  }, [ids]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm font-bold text-[#1E1E1E]">المفضلة</h1>
          <p className="text-xs text-[#A89480]">{ids.length} عقار</p>
        </div>
      </div>

      {ids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F0EA] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-2">لا توجد عقارات مفضلة</h2>
          <p className="text-sm text-[#7A6B5E] mb-6 leading-relaxed">
            اضغط على أيقونة القلب في أي إعلان لحفظه هنا
          </p>
          <Link
            href={ROUTES.home}
            className="py-3 px-6 rounded-2xl bg-[#C65D3B] text-white font-bold text-sm"
          >
            تصفح العقارات
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-6 h-6 rounded-full border-2 border-[#C65D3B]/30 border-t-[#C65D3B] animate-spin" />
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden flex gap-3"
            >
              {/* Image */}
              <Link href={ROUTES.listing(listing.id)} className="w-24 h-24 flex-shrink-0">
                <img
                  src={listing.coverImage}
                  alt={listing.titleAr}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 py-3 pr-0 pl-3">
                <Link href={ROUTES.listing(listing.id)}>
                  <p className="text-sm font-bold text-[#1E1E1E] line-clamp-1">{listing.titleAr}</p>
                  <p className="text-xs text-[#7A6B5E] mt-0.5 line-clamp-1">
                    {listing.location.areaAr}
                  </p>
                  <p className="text-sm font-bold text-[#C65D3B] mt-1">
                    {listing.price.toLocaleString("ar-OM")} ر.ع.
                    {listing.purpose === "rent" && (
                      <span className="text-xs font-normal text-[#A89480]"> / شهر</span>
                    )}
                  </p>
                </Link>
              </div>

              {/* Remove */}
              <button
                onClick={() => toggle(listing.id)}
                className="px-3 flex items-center justify-center text-[#C65D3B]"
                aria-label="إزالة من المفضلة"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
