import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useOfflineStore } from "@/store/offline.store";
import { useAuthStore } from "@/store/auth.store";
import {
  fetchFavoriteIds,
  upsertFavorite,
  deleteFavorite,
} from "@/lib/supabase/favorites";

// ── Favorites Store — Phase C ──────────────────────────────────────────────────
// Offline-aware + Supabase-backed:
//
//   Guest (unauthenticated):
//     → local Set only; no Supabase calls.
//
//   Authenticated + online:
//     → optimistic local update → fire-and-forget Supabase upsert/delete.
//
//   Authenticated + offline:
//     → optimistic local update → queued for sync when connectivity returns.
//
// SECURITY: Only listing IDs (non-sensitive) stored here.
// ─────────────────────────────────────────────────────────────────────────────

interface FavoritesState {
  ids: Set<string>;
  // Serialized for persistence — Set is not JSON-serializable
  _idsArray: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  addMany: (ids: string[]) => void;
  /** Called by AuthSessionProvider after login to hydrate from Supabase. */
  fetchAndHydrate: (userId: string) => Promise<void>;
  /** Clear all favorites on sign-out. */
  reset: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: new Set<string>(),
      _idsArray: [],

      isFavorite: (id) => get().ids.has(id),

      toggle: (id) => {
        // ── 1. Optimistic local update ──────────────────────────────────────
        set((s) => {
          const next = new Set(s.ids);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { ids: next, _idsArray: [...next] };
        });

        // Snapshot state AFTER the toggle to know the new favorite status
        const isNowFavorite = get().ids.has(id);
        const offlineState = useOfflineStore.getState();
        const authState = useAuthStore.getState();

        if (!authState.isAuthenticated) {
          // Guest — local only, nothing more to do
          return;
        }

        if (offlineState.isOnline) {
          // ── 2a. Online: sync to Supabase (fire-and-forget) ─────────────
          const userId = authState.user!.id;
          if (isNowFavorite) {
            upsertFavorite(userId, id).catch((err) =>
              console.error("[favorites] upsertFavorite failed:", err)
            );
          } else {
            deleteFavorite(userId, id).catch((err) =>
              console.error("[favorites] deleteFavorite failed:", err)
            );
          }
        } else {
          // ── 2b. Offline: enqueue for later sync ──────────────────────────
          offlineState.enqueue(
            isNowFavorite ? "favorite_toggle" : "remove_favorite",
            { listingId: id },
            isNowFavorite ? "إضافة إلى المفضلة" : "إزالة من المفضلة"
          );
        }
      },

      addMany: (ids) =>
        set((s) => {
          const next = new Set([...s.ids, ...ids]);
          return { ids: next, _idsArray: [...next] };
        }),

      fetchAndHydrate: async (userId) => {
        try {
          const ids = await fetchFavoriteIds(userId);
          if (ids.length > 0) {
            get().addMany(ids);
          }
        } catch (err) {
          console.error("[favorites] fetchAndHydrate error:", err);
        }
      },

      reset: () => set({ ids: new Set<string>(), _idsArray: [] }),
    }),
    {
      name: "maqar-favorites",
      // Persist only the serializable array; rebuild Set on rehydration
      partialize: (s) => ({ _idsArray: s._idsArray }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.ids = new Set(state._idsArray);
        }
      },
    }
  )
);
