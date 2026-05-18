import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchFilters } from "@/store/search.store";
import type { SavedSearchRow } from "@/lib/supabase/saved-searches";

// ── Saved Searches Store — Phase C ────────────────────────────────────────────
// Stores full saved-search objects hydrated from Supabase on login.
// Persisted locally so items are available immediately on mount before
// the next Supabase fetch completes.
//
// Guest users keep the store empty — no Supabase calls are made.
// ─────────────────────────────────────────────────────────────────────────────

export interface SavedSearch {
  id: string;
  name: string;
  query: string | null;
  filters: Partial<SearchFilters>;
  notificationInApp: boolean;
  notificationEmail: boolean;
  notificationWhatsapp: boolean;
  createdAt: string;
}

// Maps a DB row to the local store shape
export function rowToSavedSearch(row: SavedSearchRow): SavedSearch {
  return {
    id: row.id,
    name: row.name,
    query: row.query,
    filters: row.filters,
    notificationInApp: row.notification_in_app,
    notificationEmail: row.notification_email,
    notificationWhatsapp: row.notification_whatsapp,
    createdAt: row.created_at,
  };
}

interface SavedSearchesState {
  items: SavedSearch[];
  isLoading: boolean;

  // Bulk replace — called after Supabase hydration on login
  setItems: (items: SavedSearch[]) => void;
  // Add one to the front — called after a successful INSERT
  addItem: (item: SavedSearch) => void;
  // Remove by DB row id — called after a successful DELETE
  removeItem: (id: string) => void;
  setLoading: (v: boolean) => void;
  // Clear on sign-out
  reset: () => void;
}

export const useSavedSearchesStore = create<SavedSearchesState>()(
  persist(
    (set) => ({
      items: [],
      isLoading: false,

      setItems: (items) => set({ items }),

      addItem: (item) =>
        set((s) => ({ items: [item, ...s.items] })),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      setLoading: (isLoading) => set({ isLoading }),

      reset: () => set({ items: [], isLoading: false }),
    }),
    {
      name: "maqar-saved-searches",
      // Only persist the items array; isLoading is ephemeral
      partialize: (s) => ({ items: s.items }),
    }
  )
);
