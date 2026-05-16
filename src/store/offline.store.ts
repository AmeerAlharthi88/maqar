import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Offline Queue Store — Phase 15 ────────────────────────────────────────────
// Expanded from Phase 13 baseline:
//   • New action types: save_search, contact_intent, add_listing_draft_save,
//     recently_viewed, remove_favorite
//   • Status field: pending | syncing | synced | failed
//   • syncedAt timestamp
//
// SECURITY: Never store auth tokens, passwords, or payment data in this queue.
// Payloads should contain only public listing IDs and non-sensitive metadata.
// ─────────────────────────────────────────────────────────────────────────────

export type QueuedActionType =
  | "favorite_toggle"
  | "remove_favorite"
  | "contact_request"
  | "contact_intent"
  | "appointment_request"
  | "save_search"
  | "add_listing_draft_save"
  | "recently_viewed";

export type QueuedActionStatus = "pending" | "syncing" | "synced" | "failed";

export interface QueuedAction {
  id: string;
  type: QueuedActionType;
  payload: Record<string, unknown>;
  status: QueuedActionStatus;
  createdAt: string;
  syncedAt?: string;
  retries: number;
  /** Human-readable label for the sync center UI */
  labelAr?: string;
}

interface OfflineState {
  isOnline: boolean;
  queue: QueuedAction[];

  // ── Setters ─────────────────────────────────────────────────────────────────
  setOnline: (v: boolean) => void;

  // ── Queue management ────────────────────────────────────────────────────────
  enqueue: (
    type: QueuedActionType,
    payload: Record<string, unknown>,
    labelAr?: string
  ) => void;
  dequeue: (id: string) => void;
  updateStatus: (id: string, status: QueuedActionStatus, syncedAt?: string) => void;
  incrementRetry: (id: string) => void;
  clearSynced: () => void;
  clearQueue: () => void;

  // ── Derived ─────────────────────────────────────────────────────────────────
  pendingCount: () => number;
  failedCount: () => number;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      queue: [],

      setOnline: (isOnline) => set({ isOnline }),

      enqueue: (type, payload, labelAr) =>
        set((s) => ({
          queue: [
            ...s.queue,
            {
              id: crypto.randomUUID(),
              type,
              payload,
              status: "pending" as QueuedActionStatus,
              createdAt: new Date().toISOString(),
              retries: 0,
              labelAr,
            },
          ],
        })),

      dequeue: (id) =>
        set((s) => ({ queue: s.queue.filter((a) => a.id !== id) })),

      updateStatus: (id, status, syncedAt) =>
        set((s) => ({
          queue: s.queue.map((a) =>
            a.id === id
              ? { ...a, status, ...(syncedAt ? { syncedAt } : {}) }
              : a
          ),
        })),

      incrementRetry: (id) =>
        set((s) => ({
          queue: s.queue.map((a) =>
            a.id === id ? { ...a, retries: a.retries + 1, status: "failed" } : a
          ),
        })),

      clearSynced: () =>
        set((s) => ({
          queue: s.queue.filter((a) => a.status !== "synced"),
        })),

      clearQueue: () => set({ queue: [] }),

      pendingCount: () =>
        get().queue.filter((a) => a.status === "pending" || a.status === "syncing")
          .length,

      failedCount: () =>
        get().queue.filter((a) => a.status === "failed").length,
    }),
    {
      name: "maqar-offline-queue",
      // Persist only queue — isOnline is always re-derived from navigator.onLine on mount
      partialize: (s) => ({ queue: s.queue }),
    }
  )
);
