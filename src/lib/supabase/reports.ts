// ── Reports Supabase Service ───────────────────────────────────────────────────
// Browser-client function for filing listing reports.
//
// Security model (mirrors RLS on the DB side):
//   · submitReport — requires authenticated user (auth.uid() IS NOT NULL)
//   · Reads are NOT exposed here — admin reads go through service-role API routes
//
// UUID guard: if listingId is not a real UUID we skip the insert to avoid FK
// violations (e.g. mock listings during local dev).
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";

/** DB enum values for report_reason (from migration 034_phase_i_enums.sql). */
type DbReportReason =
  | "incorrect_information"
  | "unrealistic_price"
  | "fake_images"
  | "duplicate_listing"
  | "sold_or_rented"
  | "suspicious_listing"
  | "other";

/**
 * Maps the Arabic reason label stored in ReportListingModal's selectedReason
 * state to the DB report_reason enum value.
 *
 * Arabic labels come from REPORT_REASONS[].ar in ReportListingModal.tsx.
 */
const REASON_MAP: Record<string, DbReportReason> = {
  "السعر مبالغ فيه أو غير حقيقي": "unrealistic_price",
  "الصور غير مطابقة للعقار":       "fake_images",
  "العقار غير موجود أو وهمي":      "suspicious_listing",
  "معلومات خاطئة أو مضللة":        "incorrect_information",
  "إعلان مكرر":                    "duplicate_listing",
  "احتيال أو نصب":                 "suspicious_listing",
  "المعلن لا يرد":                  "other",
  "سبب آخر":                       "other",
};

function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export interface SubmitReportInput {
  /** UUID of the listing being reported. */
  listingId: string;
  /** UUID of the authenticated user filing the report (reporter_id). */
  reporterId: string;
  /**
   * Arabic reason label as stored in ReportListingModal's selectedReason state.
   * Mapped internally to the DB report_reason enum value.
   */
  reasonAr: string;
  /** Optional free-text description from the reporter. */
  notes?: string;
}

/**
 * Inserts a row into admin_reports on behalf of an authenticated user.
 *
 * Returns { ok: true } on success.
 * Returns { ok: false, error: string } on failure (caller shows error state).
 */
export async function submitReport(
  input: SubmitReportInput
): Promise<{ ok: boolean; error?: string }> {
  if (!isUUID(input.listingId) || !isUUID(input.reporterId)) {
    // Skip insert for mock/invalid IDs — silently succeed so UX isn't broken
    // in dev environments with mock listing data.
    console.warn("[reports] submitReport: skipped — invalid UUID(s)", input);
    return { ok: true };
  }

  const dbReason: DbReportReason = REASON_MAP[input.reasonAr] ?? "other";

  const supabase = createClient();
  const { error } = await supabase.from("admin_reports").insert({
    reporter_id:  input.reporterId,
    target_type:  "listing",
    target_id:    input.listingId,
    reason:       dbReason,
    status:       "new",
    severity:     "low",
    notes:        input.notes?.trim() || null,
  });

  if (error) {
    console.error("[reports] submitReport error:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
