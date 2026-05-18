// ── Admin Auth Helper ─────────────────────────────────────────────────────────
// Server-only utility for verifying admin identity in API routes.
// Uses the server-side Supabase client (cookie-based session).
//
// Usage in route handlers:
//   const auth = await requireAdmin(request);
//   if (!auth.ok) return auth.response;
//   // auth.userId is the verified admin UUID
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface AdminAuthOk {
  ok:       true;
  userId:   string;
  response: undefined;
}

export interface AdminAuthFail {
  ok:       false;
  userId:   undefined;
  response: NextResponse;
}

export type AdminAuthResult = AdminAuthOk | AdminAuthFail;

/**
 * Verify the caller is an authenticated admin or super_admin.
 * Returns { ok: true, userId } on success.
 * Returns { ok: false, response } with a 401/403 NextResponse on failure.
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok:       false,
        userId:   undefined,
        response: NextResponse.json(
          { success: false, error: "unauthenticated" },
          { status: 401 }
        ),
      };
    }

    // Check role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return {
        ok:       false,
        userId:   undefined,
        response: NextResponse.json(
          { success: false, error: "profile_not_found" },
          { status: 403 }
        ),
      };
    }

    if (profile.role !== "admin" && profile.role !== "super_admin") {
      return {
        ok:       false,
        userId:   undefined,
        response: NextResponse.json(
          { success: false, error: "forbidden" },
          { status: 403 }
        ),
      };
    }

    return { ok: true, userId: user.id, response: undefined };
  } catch (err) {
    console.error("[requireAdmin] exception:", err);
    return {
      ok:       false,
      userId:   undefined,
      response: NextResponse.json(
        { success: false, error: "internal_error" },
        { status: 500 }
      ),
    };
  }
}
