// ── Saved Searches Supabase Service ──────────────────────────────────────────
// Browser-client functions for the `saved_searches` table.
//
// DEV_SKIP_AUTH: all functions return immediately — dev stays local-only.
// RLS ensures users only access their own rows.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import type { SearchFilters } from "@/store/search.store";

// ── DB row type ───────────────────────────────────────────────────────────────
export interface SavedSearchRow {
  id: string;
  user_id: string;
  name: string;
  query: string | null;
  filters: Partial<SearchFilters>;
  notification_whatsapp: boolean;
  notification_email: boolean;
  notification_in_app: boolean;
  last_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

/**
 * Fetches all saved searches for a user, ordered newest-first.
 */
export async function fetchSavedSearches(
  userId: string
): Promise<SavedSearchRow[]> {
  if (DEV_SKIP_AUTH) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[saved-searches] fetchSavedSearches error:", error.message);
    return [];
  }

  return (data ?? []) as SavedSearchRow[];
}

/**
 * Creates a new saved search row.
 * Returns the created row, or null on failure.
 */
export async function createSavedSearch(
  userId: string,
  name: string,
  query: string | null,
  filters: Partial<SearchFilters>
): Promise<SavedSearchRow | null> {
  if (DEV_SKIP_AUTH) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_searches")
    .insert({
      user_id: userId,
      name,
      query: query ?? null,
      filters,
    })
    .select()
    .single();

  if (error) {
    console.error("[saved-searches] createSavedSearch error:", error.message);
    return null;
  }

  return data as SavedSearchRow;
}

/**
 * Deletes a saved search by its row ID.
 * RLS ensures the caller can only delete their own rows.
 */
export async function deleteSavedSearch(id: string): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("saved_searches")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[saved-searches] deleteSavedSearch error:", error.message);
  }
}
