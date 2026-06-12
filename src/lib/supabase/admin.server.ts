// ── Admin Server Service — Phase I ─────────────────────────────────────────────
// All functions use the service-role client (bypasses RLS).
// SECURITY: Only import this file from:
//   · /src/app/api/admin/**/route.ts  (after admin auth check)
//   · /src/app/**/actions.ts          (server actions with admin guard)
// NEVER import from client components or public API routes.
//
// DB ↔ TS type mapping notes:
//   · aml_status (DB):  open|cleared|clarification_requested|escalated|rejected
//     → AMLStatus (TS): flagged|cleared|escalated|rejected_listing
//   · duplicate_status: open|duplicate|not_duplicate|merged|rejected
//     → DuplicateStatus: pending|confirmed_duplicate|not_duplicate|merged
//   · report_reason:    incorrect_information|unrealistic_price|fake_images|...
//     → ReportReason:   wrong_info|unrealistic_price|fake_photos|...
// ─────────────────────────────────────────────────────────────────────────────

import { createServiceClient } from "@/lib/supabase/service";
import type {
  AdminListingItem,
  ListingReviewStatus,
  AdminReport,
  ReportStatus,
  ReportReason,
  ReportTargetType,
  AMLFlag,
  AMLStatus,
  RiskLevel,
  DuplicatePair,
  DuplicateStatus,
  AuditLog,
  AuditCategory,
  AdminMarketDataRow,
  AdminReviewItem,
  ReviewModerationStatus,
  AdminVerificationRequest,
  VerificationRequestStatus,
  VerificationDocument,
} from "@/types/admin";

// ── Environment guard ──────────────────────────────────────────────────────────

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
}

// ── Type mappers ───────────────────────────────────────────────────────────────

function mapAmlStatus(dbStatus: string): AMLStatus {
  const map: Record<string, AMLStatus> = {
    open:                    "flagged",
    clarification_requested: "flagged",
    cleared:                 "cleared",
    escalated:               "escalated",
    rejected:                "rejected_listing",
  };
  return map[dbStatus] ?? "flagged";
}

function mapAmlStatusToDb(status: AMLStatus): string {
  const map: Record<AMLStatus, string> = {
    flagged:          "open",
    cleared:          "cleared",
    escalated:        "escalated",
    rejected_listing: "rejected",
  };
  return map[status];
}

function mapDuplicateStatus(dbStatus: string): DuplicateStatus {
  const map: Record<string, DuplicateStatus> = {
    open:         "pending",
    duplicate:    "confirmed_duplicate",
    not_duplicate:"not_duplicate",
    merged:       "merged",
    rejected:     "not_duplicate",
  };
  return map[dbStatus] ?? "pending";
}

function mapDuplicateStatusToDb(status: DuplicateStatus): string {
  const map: Record<DuplicateStatus, string> = {
    pending:              "open",
    confirmed_duplicate:  "duplicate",
    not_duplicate:        "not_duplicate",
    merged:               "merged",
  };
  return map[status];
}

function mapReportReason(dbReason: string): ReportReason {
  const map: Record<string, ReportReason> = {
    incorrect_information: "wrong_info",
    unrealistic_price:     "unrealistic_price",
    fake_images:           "fake_photos",
    duplicate_listing:     "duplicate",
    sold_or_rented:        "already_sold",
    suspicious_listing:    "suspicious",
    other:                 "other",
  };
  return map[dbReason] ?? "other";
}

function mapReportTargetType(dbType: string): ReportTargetType {
  const valid: ReportTargetType[] = ["listing", "agent", "agency", "review"];
  return valid.includes(dbType as ReportTargetType)
    ? (dbType as ReportTargetType)
    : "listing";
}

function mapRiskLevel(dbLevel: string): RiskLevel {
  const valid: RiskLevel[] = ["low", "medium", "high", "critical"];
  return valid.includes(dbLevel as RiskLevel) ? (dbLevel as RiskLevel) : "low";
}

function mapAuditCategory(dbCat: string): AuditCategory {
  const valid: AuditCategory[] = [
    "admin_action","listing_action","verification_action","user_action",
    "payment_action","ai_action","security_action","system_action",
  ];
  return valid.includes(dbCat as AuditCategory)
    ? (dbCat as AuditCategory)
    : "admin_action";
}

// ── Listings queue ─────────────────────────────────────────────────────────────

export async function fetchPendingListings(): Promise<AdminListingItem[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("listings")
      .select(`
        id,
        title_ar,
        price_omr,
        purpose,
        area_ar,
        wilayat_ar,
        owner_id,
        created_at,
        review_status,
        is_price_hidden,
        quality_score,
        admin_note,
        profiles!owner_id (
          name_ar
        )
      `)
      .in("review_status", ["pending", "suspicious"])
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[Admin] fetchPendingListings:", error.message);
      throw new Error("admin_query_failed");
    }

    return (data ?? []).map((row: Record<string, unknown>) => ({
      id:               row.id as string,
      titleAr:          (row.title_ar as string) ?? "",
      price:            Number(row.price_omr ?? 0),
      purpose:          (row.purpose as "sale" | "rent") ?? "sale",
      areaAr:           (row.area_ar as string) ?? "",
      wilayatAr:        (row.wilayat_ar as string) ?? "",
      agentNameAr:      (row.profiles as { name_ar?: string } | null)?.name_ar ?? "—",
      agentId:          (row.owner_id as string) ?? "",
      submittedAt:      (row.created_at as string) ?? "",
      qualityScore:     Number(row.quality_score ?? 0),
      reviewStatus:     (row.review_status as ListingReviewStatus) ?? "pending",
      isSuspiciousPrice:false,
      duplicateRisk:    "none",
      adminNote:        (row.admin_note as string | undefined),
    }));
  } catch (err) {
    console.error("[Admin] fetchPendingListings exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}

export async function approveListingAdmin(
  listingId: string,
  actorId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    const { error } = await sb
      .from("listings")
      .update({ review_status: "approved", status: "active", updated_at: new Date().toISOString() })
      .eq("id", listingId);

    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "listing_action",
      action:     "approve_listing",
      targetType: "listing",
      targetId:   listingId,
      severity:   "low",
      details:    {},
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function rejectListingAdmin(
  listingId: string,
  actorId: string,
  note?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    const update: Record<string, unknown> = {
      review_status: "rejected",
      status:        "rejected",
      updated_at:    new Date().toISOString(),
    };
    if (note) update.admin_note = note;

    const { error } = await sb.from("listings").update(update).eq("id", listingId);
    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "listing_action",
      action:     "reject_listing",
      targetType: "listing",
      targetId:   listingId,
      severity:   "low",
      details:    note ? { note } : {},
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function requestChangesListingAdmin(
  listingId: string,
  actorId: string,
  note?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    const update: Record<string, unknown> = {
      review_status: "needs_changes",
      status:        "needs_changes",
      updated_at:    new Date().toISOString(),
    };
    if (note) update.admin_note = note;

    const { error } = await sb.from("listings").update(update).eq("id", listingId);
    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "listing_action",
      action:     "request_changes_listing",
      targetType: "listing",
      targetId:   listingId,
      severity:   "low",
      details:    note ? { note } : {},
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Reports queue ──────────────────────────────────────────────────────────────

export async function fetchAdminReports(
  status?: ReportStatus
): Promise<AdminReport[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    let query = sb
      .from("admin_reports")
      .select(`
        id,
        target_type,
        target_id,
        reason,
        notes,
        status,
        severity,
        admin_notes,
        created_at,
        reporter_id,
        reporter:profiles!reporter_id ( name_ar )
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      console.error("[Admin] fetchAdminReports:", error.message);
      throw new Error("admin_query_failed");
    }

    return (data ?? []).map((row: Record<string, unknown>) => ({
      id:            row.id as string,
      targetType:    mapReportTargetType(row.target_type as string),
      targetId:      (row.target_id as string) ?? "",
      targetNameAr:  "—", // would need a join per target type
      reporterNameAr:(row.reporter as { name_ar?: string } | null)?.name_ar ?? "—",
      reason:        mapReportReason(row.reason as string),
      detailsAr:     (row.notes as string | undefined),
      status:        (row.status as ReportStatus) ?? "new",
      severity:      mapRiskLevel(row.severity as string),
      createdAt:     (row.created_at as string) ?? "",
      adminNote:     (row.admin_notes as string | undefined),
    }));
  } catch (err) {
    console.error("[Admin] fetchAdminReports exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  actorId: string,
  adminNote?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    const update: Record<string, unknown> = {
      status,
      reviewed_by: actorId,
      reviewed_at: new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    };
    if (adminNote) update.admin_notes = adminNote;

    const { error } = await sb.from("admin_reports").update(update).eq("id", reportId);
    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "admin_action",
      action:     `update_report_status_${status}`,
      targetType: "admin_report",
      targetId:   reportId,
      severity:   "low",
      details:    { status, adminNote },
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Reviews moderation (service-role) ────────────────────────────────────────────
// Replaces the browser-client/RLS admin read, which failed in Production.

const REVIEW_TARGET_TYPE_AR: Record<"agent" | "agency", string> = {
  agent:  "وسيط",
  agency: "وكالة",
};

// Resolve display names for a set of user ids. reviews.author_id and
// kyc_applications.user_id have no PostgREST relationship to `profiles` in the
// schema cache, so we look the names up with a separate query instead of a join.
async function fetchProfileNames(
  sb: ReturnType<typeof createServiceClient>,
  ids: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return map;
  const { data } = await sb.from("profiles").select("id, name_ar").in("id", unique);
  for (const p of (data ?? []) as Array<{ id: string; name_ar: string | null }>) {
    if (p.name_ar) map.set(p.id, p.name_ar);
  }
  return map;
}

export async function fetchAdminReviews(): Promise<AdminReviewItem[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("reviews")
      .select("id, author_id, target_id, target_type, rating, body, moderation_status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[Admin] fetchAdminReviews:", error.message);
      throw new Error("admin_query_failed");
    }
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    const nameById = await fetchProfileNames(sb, rows.map((r) => r.author_id as string));

    return rows.map((row) => {
      const targetType = ((row.target_type as string) === "agency" ? "agency" : "agent") as "agent" | "agency";
      return {
        id:           row.id as string,
        authorNameAr: nameById.get(row.author_id as string) ?? "مستخدم",
        rating:       Number(row.rating ?? 0),
        bodyAr:       (row.body as string | null) ?? "",
        targetType,
        targetNameAr: REVIEW_TARGET_TYPE_AR[targetType],
        targetId:     (row.target_id as string) ?? "",
        status:       (row.moderation_status as ReviewModerationStatus) ?? "pending",
        isReported:   false,
        createdAt:    (row.created_at as string) ?? "",
      };
    });
  } catch (err) {
    console.error("[Admin] fetchAdminReviews exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}

export async function moderateReviewAdmin(
  reviewId: string,
  status: ReviewModerationStatus,
  actorId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    const { error } = await sb
      .from("reviews")
      .update({ moderation_status: status })
      .eq("id", reviewId);

    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "admin_action",
      action:     `moderate_review_${status}`,
      targetType: "review",
      targetId:   reviewId,
      severity:   "low",
      details:    { status },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Verification / KYC (service-role) ─────────────────────────────────────────────

const KYC_STATUS_TO_VERIF: Record<string, VerificationRequestStatus> = {
  not_started:     "pending",
  draft:           "pending",
  submitted:       "pending",
  under_review:    "under_review",
  approved:        "approved",
  rejected:        "rejected",
  needs_more_info: "needs_more_info",
};

const KYC_DOC_TYPE_MAP: Record<string, VerificationDocument["type"]> = {
  civil_id_front: "civil_id",
  civil_id_back:  "civil_id",
  cr_number:      "cr",
  agency_license: "other",
  agent_card:     "agent_license",
  selfie:         "other",
};

export async function fetchAdminVerifications(): Promise<AdminVerificationRequest[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("kyc_applications")
      .select("id, user_id, entity_type, status, admin_notes, submitted_at, created_at")
      .order("submitted_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[Admin] fetchAdminVerifications:", error.message);
      throw new Error("admin_query_failed");
    }
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    const nameById = await fetchProfileNames(sb, rows.map((r) => r.user_id as string));

    // Documents via a separate query (no reliance on a PostgREST join).
    const appIds = rows.map((r) => r.id as string);
    const docsByApp = new Map<string, Array<{ document_type: string; file_name: string }>>();
    if (appIds.length) {
      const { data: docs } = await sb
        .from("kyc_documents")
        .select("application_id, document_type, file_name")
        .in("application_id", appIds);
      for (const d of (docs ?? []) as Array<{ application_id: string; document_type: string; file_name: string }>) {
        const arr = docsByApp.get(d.application_id) ?? [];
        arr.push({ document_type: d.document_type, file_name: d.file_name });
        docsByApp.set(d.application_id, arr);
      }
    }

    return rows.map((row) => {
      const docs = docsByApp.get(row.id as string) ?? [];
      return {
        id:              row.id as string,
        applicantNameAr: nameById.get(row.user_id as string) ?? "—",
        applicantId:     (row.user_id as string) ?? "",
        type:            (row.entity_type as string) === "individual" ? "agent" : "agency",
        status:          KYC_STATUS_TO_VERIF[row.status as string] ?? "pending",
        phone:           "—",
        isPhoneVerified: false,
        documents:       docs.map((d) => ({
          type:      KYC_DOC_TYPE_MAP[d.document_type] ?? "other",
          labelAr:   d.file_name,
          submitted: true,
          verified:  false,
        })),
        submittedAt:     (row.submitted_at as string) ?? (row.created_at as string) ?? "",
        riskLevel:       "low",
        adminNote:       (row.admin_notes as string | undefined) ?? undefined,
      };
    });
  } catch (err) {
    console.error("[Admin] fetchAdminVerifications exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}

export async function updateVerificationAdmin(
  applicationId: string,
  status: VerificationRequestStatus,
  actorId: string,
  note?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    // The admin actions only send approved | rejected | needs_more_info, which are
    // valid kyc_applications.status values.
    const { error } = await sb
      .from("kyc_applications")
      .update({
        status,
        admin_notes: note ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "verification_action",
      action:     `update_verification_${status}`,
      targetType: "kyc_application",
      targetId:   applicationId,
      severity:   "low",
      details:    { status, note },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── AML flags ──────────────────────────────────────────────────────────────────

export async function fetchAMLFlags(
  status?: AMLStatus
): Promise<AMLFlag[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    // Map TS status to DB value(s)
    let dbStatus: string | undefined;
    if (status === "flagged")          dbStatus = "open";
    else if (status === "cleared")     dbStatus = "cleared";
    else if (status === "escalated")   dbStatus = "escalated";
    else if (status === "rejected_listing") dbStatus = "rejected";

    let query = sb
      .from("aml_flags")
      .select(`
        id,
        listing_id,
        risk_level,
        status,
        price_omr,
        market_average_omr,
        difference_percent,
        reason,
        admin_notes,
        created_at,
        owner_id,
        listing:listings!listing_id ( title_ar, area_ar ),
        owner:profiles!owner_id ( name_ar )
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (dbStatus) query = query.eq("status", dbStatus);

    const { data, error } = await query;
    if (error) {
      console.error("[Admin] fetchAMLFlags:", error.message);
      throw new Error("admin_query_failed");
    }

    return (data ?? []).map((row: Record<string, unknown>) => {
      const listing = row.listing as { title_ar?: string; area_ar?: string } | null;
      const owner   = row.owner   as { name_ar?: string } | null;
      return {
        id:              row.id as string,
        listingId:       (row.listing_id as string) ?? "",
        listingTitleAr:  listing?.title_ar ?? "—",
        listingPrice:    Number(row.price_omr ?? 0),
        areaAr:          listing?.area_ar ?? "—",
        marketAvgPrice:  Number(row.market_average_omr ?? 0),
        diffPct:         Number(row.difference_percent ?? 0),
        agentNameAr:     owner?.name_ar ?? "—",
        agentId:         (row.owner_id as string) ?? "",
        submittedAt:     (row.created_at as string) ?? "",
        riskLevel:       mapRiskLevel(row.risk_level as string),
        status:          mapAmlStatus(row.status as string),
        adminNote:       (row.admin_notes as string | undefined),
      };
    });
  } catch (err) {
    console.error("[Admin] fetchAMLFlags exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}

export async function updateAMLFlag(
  flagId: string,
  status: AMLStatus,
  actorId: string,
  adminNote?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    const dbStatus = mapAmlStatusToDb(status);
    const update: Record<string, unknown> = {
      status:      dbStatus,
      resolved_by: actorId,
      resolved_at: new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    };
    if (adminNote) update.admin_notes = adminNote;

    const { error } = await sb.from("aml_flags").update(update).eq("id", flagId);
    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "admin_action",
      action:     `update_aml_status_${dbStatus}`,
      targetType: "aml_flag",
      targetId:   flagId,
      severity:   status === "escalated" ? "high" : "medium",
      details:    { status: dbStatus, adminNote },
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Duplicate alerts ───────────────────────────────────────────────────────────

export async function fetchDuplicateAlerts(
  status?: DuplicateStatus
): Promise<DuplicatePair[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    let dbStatus: string | undefined;
    if (status === "pending")             dbStatus = "open";
    else if (status === "confirmed_duplicate") dbStatus = "duplicate";
    else if (status === "not_duplicate")  dbStatus = "not_duplicate";
    else if (status === "merged")         dbStatus = "merged";

    let query = sb
      .from("duplicate_alerts")
      .select(`
        id,
        listing_a_id,
        listing_b_id,
        risk_score,
        matched_fields,
        status,
        notes,
        created_at,
        listing_a:listings!listing_a_id ( title_ar, price_omr, area_ar, bedrooms, area_sqm, created_at, owner_id ),
        listing_b:listings!listing_b_id ( title_ar, price_omr, area_ar, bedrooms, area_sqm, created_at, owner_id )
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (dbStatus) query = query.eq("status", dbStatus);

    const { data, error } = await query;
    if (error) {
      console.error("[Admin] fetchDuplicateAlerts:", error.message);
      throw new Error("admin_query_failed");
    }

    return (data ?? []).map((row: Record<string, unknown>) => {
      const a = row.listing_a as Record<string, unknown> | null;
      const b = row.listing_b as Record<string, unknown> | null;
      const matchedFields = (row.matched_fields as Record<string, boolean>) ?? {};
      const matchReasons  = Object.entries(matchedFields)
        .filter(([, v]) => v)
        .map(([k]) => k);
      const score = Number(row.risk_score ?? 0);

      return {
        id:              row.id as string,
        listingA: {
          id:          (row.listing_a_id as string) ?? "",
          titleAr:     (a?.title_ar as string) ?? "—",
          price:       Number(a?.price_omr ?? 0),
          areaAr:      (a?.area_ar as string) ?? "—",
          agentNameAr: "—",
          specs: {
            bedrooms: Number(a?.bedrooms ?? 0),
            area:     Number(a?.area_sqm ?? 0),
          },
          createdAt: (a?.created_at as string) ?? "",
        },
        listingB: {
          id:          (row.listing_b_id as string) ?? "",
          titleAr:     (b?.title_ar as string) ?? "—",
          price:       Number(b?.price_omr ?? 0),
          areaAr:      (b?.area_ar as string) ?? "—",
          agentNameAr: "—",
          specs: {
            bedrooms: Number(b?.bedrooms ?? 0),
            area:     Number(b?.area_sqm ?? 0),
          },
          createdAt: (b?.created_at as string) ?? "",
        },
        similarityScore: score,
        matchReasons,
        riskLevel: score >= 80 ? "high" : score >= 60 ? "medium" : "low",
        status:    mapDuplicateStatus(row.status as string),
        detectedAt:(row.created_at as string) ?? "",
      };
    });
  } catch (err) {
    console.error("[Admin] fetchDuplicateAlerts exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}

export async function updateDuplicateAlert(
  alertId: string,
  status: DuplicateStatus,
  actorId: string,
  note?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };
  try {
    const sb = createServiceClient();
    const dbStatus = mapDuplicateStatusToDb(status);
    const update: Record<string, unknown> = {
      status:      dbStatus,
      reviewed_by: actorId,
      reviewed_at: new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    };
    if (note) update.notes = note;

    const { error } = await sb.from("duplicate_alerts").update(update).eq("id", alertId);
    if (error) return { ok: false, error: error.message };

    await insertAuditLog({
      actorId,
      category:   "admin_action",
      action:     `update_duplicate_status_${dbStatus}`,
      targetType: "duplicate_alert",
      targetId:   alertId,
      severity:   "low",
      details:    { status: dbStatus, note },
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Audit logs ─────────────────────────────────────────────────────────────────

interface InsertAuditLogParams {
  actorId:    string;
  category:   AuditCategory;
  action:     string;
  targetType?: string;
  targetId?:  string;
  severity:   "low" | "medium" | "high" | "critical";
  details:    Record<string, unknown>;
  ipAddress?: string;
}

export async function insertAuditLog(params: InsertAuditLogParams): Promise<void> {
  if (!isConfigured()) return;
  try {
    const sb = createServiceClient();
    await sb.from("audit_logs").insert({
      actor_id:    params.actorId,
      category:    params.category,
      action:      params.action,
      target_type: params.targetType ?? null,
      target_id:   params.targetId ?? null,
      severity:    params.severity,
      details:     params.details,
      ip_address:  params.ipAddress ?? null,
    });
    // Fire-and-forget — failures are acceptable for audit infra
  } catch {
    // Intentionally swallowed — audit log failures must never block user actions
  }
}

export async function fetchAuditLogs(opts?: {
  category?: AuditCategory;
  severity?:  string;
  limit?:     number;
}): Promise<AuditLog[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    let query = sb
      .from("audit_logs")
      .select(`
        id,
        actor_id,
        category,
        action,
        target_type,
        target_id,
        severity,
        details,
        ip_address,
        created_at,
        actor:profiles!actor_id ( name_ar )
      `)
      .order("created_at", { ascending: false })
      .limit(opts?.limit ?? 200);

    if (opts?.category) query = query.eq("category", opts.category);
    if (opts?.severity) query = query.eq("severity", opts.severity);

    const { data, error } = await query;
    if (error) {
      console.error("[Admin] fetchAuditLogs:", error.message);
      throw new Error("admin_query_failed");
    }

    return (data ?? []).map((row: Record<string, unknown>) => {
      const actor   = row.actor as { name_ar?: string } | null;
      const details = (row.details as Record<string, unknown>) ?? {};
      const sev     = row.severity as string;

      return {
        id:            row.id as string,
        actorNameAr:   actor?.name_ar ?? "النظام",
        actorId:       (row.actor_id as string) ?? "",
        category:      mapAuditCategory(row.category as string),
        actionAr:      (row.action as string) ?? "",
        targetAr:      (row.target_type as string) ?? "",
        targetId:      (row.target_id as string | undefined),
        severity:      (["info","warning","critical"].includes(sev)
                          ? sev
                          : sev === "low" ? "info"
                          : sev === "medium" ? "warning"
                          : sev === "high" ? "warning"
                          : "critical") as "info" | "warning" | "critical",
        ipPlaceholder: row.ip_address ? maskIp(row.ip_address as string) : "—",
        createdAt:     (row.created_at as string) ?? "",
        detailsAr:     details.note as string | undefined,
      };
    });
  } catch (err) {
    console.error("[Admin] fetchAuditLogs exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}

function maskIp(ip: string): string {
  // Partially mask for privacy: 192.168.1.xxx or 2001:db8:xxx:xxx
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return `${parts[0]}:${parts[1]}:xxx:xxx`;
  }
  return "xxx.xxx";
}

// ── Market data ────────────────────────────────────────────────────────────────

export async function fetchAdminMarketData(): Promise<AdminMarketDataRow[]> {
  if (!isConfigured()) return [];
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("market_data")
      .select("*")
      .order("last_updated", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[Admin] fetchAdminMarketData:", error.message);
      throw new Error("admin_query_failed");
    }

    return (data ?? []).map((row: Record<string, unknown>) => ({
      id:            row.id as string,
      governorateAr: (row.governorate as string) ?? "",
      wilayatAr:     (row.wilayat as string) ?? "",
      areaAr:        (row.area as string) ?? "",
      avgSalePrice:  Number(row.average_sale_price_omr ?? 0),
      avgRentPrice:  Number(row.average_rent_omr ?? 0),
      pricePerSqm:   Number(row.price_per_sqm_omr ?? 0),
      rentalYield:   Number(row.rental_yield_percent ?? 0),
      demandScore:   Number(row.demand_score ?? 0),
      lastUpdated:   (row.last_updated as string) ?? (row.updated_at as string) ?? "",
      dataSource:    (row.data_source as string) ?? "admin_managed",
    }));
  } catch (err) {
    console.error("[Admin] fetchAdminMarketData exception:", err);
    throw err instanceof Error ? err : new Error("admin_query_failed");
  }
}
