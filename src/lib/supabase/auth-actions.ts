"use client";

import { createClient } from "./client";

// ── Phone OTP ─────────────────────────────────────────────────────────────────

/** Send OTP SMS to phone number. Phone must include country code, e.g. +96891234567 */
export async function signInWithPhone(phone: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { channel: "sms" },
  });
  return { error };
}

/** Verify the 6-digit OTP received via SMS */
export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  return { session: data.session, user: data.user, error };
}

// ── Session ───────────────────────────────────────────────────────────────────

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

export async function getUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// ── Sign out ──────────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ── Profile metadata update ───────────────────────────────────────────────────

export async function updateUserMetadata(data: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ data });
  return { error };
}
