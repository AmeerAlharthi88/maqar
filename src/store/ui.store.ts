import { create } from "zustand";

interface UIState {
  // Bottom sheet / modal
  isFilterSheetOpen: boolean;
  isSearchFocused: boolean;
  // Overlay
  isAnyOverlayOpen: boolean;
  // Toast queue
  toasts: { id: string; type: "success" | "error" | "warning" | "info"; title: string; description?: string }[];
  // Actions
  openFilterSheet: () => void;
  closeFilterSheet: () => void;
  setSearchFocused: (v: boolean) => void;
  addToast: (t: Omit<UIState["toasts"][number], "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isFilterSheetOpen: false,
  isSearchFocused: false,
  isAnyOverlayOpen: false,
  toasts: [],

  openFilterSheet: () => set({ isFilterSheetOpen: true, isAnyOverlayOpen: true }),
  closeFilterSheet: () => set({ isFilterSheetOpen: false, isAnyOverlayOpen: false }),
  setSearchFocused: (v) => set({ isSearchFocused: v }),

  addToast: (t) =>
    set((s) => ({
      toasts: [...s.toasts, { ...t, id: crypto.randomUUID() }].slice(-5),
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
