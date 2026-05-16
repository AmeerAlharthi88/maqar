import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useOfflineStore } from "@/store/offline.store";

// ── Favorites Store — Phase 15 ────────────────────────────────────────────────
// Offline-aware: when toggling while offline, the change is applied optimistically
// to local state AND enqueued for server sync when connectivity returns.
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
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: new Set<string>(),
      _idsArray: [],

      isFavorite: (id) => get().ids.has(id),

      toggle: (id) => {
        // Optimistic local update
        set((s) => {
          const next = new Set(s.ids);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { ids: next, _idsArray: [...next] };
        });

        // Queue for server sync when offline
        const offlineState = useOfflineStore.getState();
        if (!offlineState.isOnline) {
          const isNowFavorite = get().ids.has(id);
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
    }),
    {
      name: "maqar-favorites",
      // Persist only the array; rebuild Set on rehydration
      partialize: (s) => ({ _idsArray: s._idsArray }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.ids = new Set(state._idsArray);
        }
      },
    }
  )
);
