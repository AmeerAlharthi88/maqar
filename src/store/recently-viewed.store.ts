import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/store/auth.store";
import { useOfflineStore } from "@/store/offline.store";
import { upsertRecentlyViewed } from "@/lib/supabase/recently-viewed";

// ── Recently Viewed Store — Phase C ───────────────────────────────────────────
// Local store with Supabase sync for authenticated users.
//
//   Guest:         local-only; no Supabase calls.
//   Auth + online: upsert to Supabase (fire-and-forget) after local update.
//   Auth + offline: enqueue for later sync.
//
// Max 20 items, deduplicated by id, sorted newest-first.
// The full listing metadata is stored locally for instant display.
// Supabase stores only user_id + listing_id + viewed_at for cross-device history.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RECENT = 20;

export interface RecentListing {
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

      add: (listing) => {
        // ── 1. Local update ───────────────────────────────────────────────────
        set((s) => {
          const filtered = s.items.filter((i) => i.id !== listing.id);
          return {
            items: [
              { ...listing, viewedAt: new Date().toISOString() },
              ...filtered,
            ].slice(0, MAX_RECENT),
          };
        });

        // ── 2. Supabase sync (after state update) ────────────────────────────
        const authState = useAuthStore.getState();
        const offlineState = useOfflineStore.getState();

        if (!authState.isAuthenticated) return; // guest — local only

        if (offlineState.isOnline) {
          upsertRecentlyViewed(authState.user!.id, listing.id).catch((err) =>
            console.error("[recently-viewed] upsert failed:", err)
          );
        } else {
          offlineState.enqueue(
            "recently_viewed",
            { listingId: listing.id },
            "مشاهدة عقار"
          );
        }
      },

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "maqar-recently-viewed" }
  )
);
