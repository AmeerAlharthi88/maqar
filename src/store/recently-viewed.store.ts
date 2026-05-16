import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 20;

interface RecentListing {
  id: string;
  titleAr: string;
  coverImage: string;
  price: number;
  purpose: "sale" | "rent";
  areaAr: string;
  viewedAt: string; // ISO
}

interface RecentlyViewedState {
  items: RecentListing[];
  add: (listing: RecentListing) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],

      add: (listing) =>
        set((s) => {
          const filtered = s.items.filter((i) => i.id !== listing.id);
          return {
            items: [{ ...listing, viewedAt: new Date().toISOString() }, ...filtered].slice(
              0,
              MAX_RECENT
            ),
          };
        }),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "maqar-recently-viewed" }
  )
);
