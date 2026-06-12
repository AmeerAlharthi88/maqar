// ── KYC Supabase Service — Phase E ────────────────────────────────────────────
// Browser-client functions for KYC applications and document uploads.
//
// Security model (mirrors RLS):
//   · createOrUpdateKYCApplication — requires authenticated user (own record only)
//   · uploadKYCDocument            — Storage upload to private 'documents' bucket
//   · insertKYCDocument            — DB record for the uploaded file
//   · fetchKYCApplicationsAdmin    — admin-only read (RLS is_admin() guard)
//   · updateKYCApplicationStatus   — admin-only update
//
// DEV_SKIP_AUTH: all functions are no-ops, return null / [] so pages fall back
// to MOCK data.
//
// Storage path convention:
//   documents/kyc/{userId}/{documentType}-{timestamp}.{ext}
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import type { KYCDocumentType } from "@/types/profile";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

// ── Public types ──────────────────────────────────────────────────────────────

export type KycEntityType = "individual" | "agency";
export type KycStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_more_info";

export interface KycApplication {
  id: string;
  userId: string;
  entityType: KycEntityType;
  agencyId: string | null;
  status: KycStatus;
  adminNotes: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KycDocument {
  id: string;
  applicationId: string;
  userId: string;
  documentType: KYCDocumentType;
  storagePath: string;
  fileName: string;
  fileSizeBytes: number | null;
  mimeType: string | null;
  createdAt: string;
}

// ── DB row shapes ─────────────────────────────────────────────────────────────

interface DbKycApplicationRow {
  id: string;
  user_id: string;
  entity_type: KycEntityType;
  agency_id: string | null;
  status: KycStatus;
  admin_notes: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Admin join
  profiles?: {
    name_ar: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
  kyc_documents?: DbKycDocumentRow[];
}

interface DbKycDocumentRow {
  id: string;
  application_id: string;
  user_id: string;
  document_type: KYCDocumentType;
  storage_path: string;
  file_name: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
}

// ── Admin view shape ──────────────────────────────────────────────────────────

export interface KycApplicationAdmin extends KycApplication {
  authorName: string;
  authorEmail: string | null;
  authorAvatarUrl: string | null;
  documents: KycDocument[];
}

// ─────────────────────────────────────────────────────────────────────────────
// createOrUpdateKYCApplication
// Upserts the user's KYC application (draft → submitted).
// Uses ON CONFLICT (user_id) DO UPDATE so re-submission works.
// Returns the application id, or null on error/skip.
// ─────────────────────────────────────────────────────────────────────────────
export async function createOrUpdateKYCApplication(
  userId: string,
  entityType: KycEntityType,
  status: "draft" | "submitted" = "submitted"
): Promise<{ id: string } | null> {
  if (DEV_SKIP_AUTH) return null;

  const supabase = createClient();

  // Try upsert — user_id has a UNIQUE constraint on the table
  const { data, error } = await supabase
    .from("kyc_applications")
    .upsert(
      {
        user_id: userId,
        entity_type: entityType,
        status,
        submitted_at: status === "submitted" ? new Date().toISOString() : null,
      },
      { onConflict: "user_id", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error) {
    console.error("[KYC] createOrUpdateKYCApplication error:", error);
    return null;
  }
  return { id: data.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// uploadKYCDocument
// Uploads a file to the private 'documents' bucket under the KYC prefix.
// Returns the storage path on success, null on failure.
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadKYCDocument(
  userId: string,
  documentType: KYCDocumentType,
  file: File
): Promise<string | null> {
  if (DEV_SKIP_AUTH) return null;

  const supabase = createClient();

  // Derive file extension from mime type or file name
  const ext = file.name.split(".").pop() ?? "bin";
  const storagePath = `kyc/${userId}/${documentType}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, {
      upsert: true,            // replace if re-uploading same document type
      contentType: file.type || undefined,
    });

  if (error) {
    console.error("[KYC] uploadKYCDocument storage error:", error);
    return null;
  }

  return storagePath;
}

// ─────────────────────────────────────────────────────────────────────────────
// insertKYCDocument
// Inserts (or replaces) a document record in kyc_documents after upload.
// The UNIQUE(application_id, document_type) constraint is handled with upsert.
// ─────────────────────────────────────────────────────────────────────────────
export interface InsertKYCDocumentPayload {
  applicationId: string;
  userId: string;
  documentType: KYCDocumentType;
  storagePath: string;
  fileName: string;
  fileSizeBytes?: number;
  mimeType?: string;
}

export async function insertKYCDocument(
  payload: InsertKYCDocumentPayload
): Promise<{ id: string } | null> {
  if (DEV_SKIP_AUTH) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("kyc_documents")
    .upsert(
      {
        application_id: payload.applicationId,
        user_id: payload.userId,
        document_type: payload.documentType,
        storage_path: payload.storagePath,
        file_name: payload.fileName,
        file_size_bytes: payload.fileSizeBytes ?? null,
        mime_type: payload.mimeType ?? null,
      },
      { onConflict: "application_id,document_type", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error) {
    console.error("[KYC] insertKYCDocument error:", error);
    return null;
  }
  return { id: data.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchKYCApplicationsAdmin
// Returns all KYC applications with author profile and documents.
// Admin-only — RLS is_admin() guards the query.
// Throws on error so the admin page can show a real error state (no mock fallback).
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchKYCApplicationsAdmin(): Promise<KycApplicationAdmin[]> {
  if (DEV_SKIP_AUTH) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("kyc_applications")
    .select(`
      id, user_id, entity_type, agency_id, status, admin_notes,
      submitted_at, reviewed_at, created_at, updated_at,
      profiles ( name_ar, email, avatar_url ),
      kyc_documents (
        id, application_id, user_id, document_type,
        storage_path, file_name, file_size_bytes, mime_type, created_at
      )
    `)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[KYC] fetchKYCApplicationsAdmin error:", error);
    // Throw so the admin page can show a real error state instead of silently
    // falling back to mock verification requests (which would hide a read failure).
    throw new Error("kyc_admin_fetch_failed");
  }

  return (data ?? []).map((r) => rowToAdminItem(r as unknown as DbKycApplicationRow));
}

// ─────────────────────────────────────────────────────────────────────────────
// updateKYCApplicationStatus
// Admin sets status on an application. RLS enforced.
// ─────────────────────────────────────────────────────────────────────────────
export async function updateKYCApplicationStatus(
  applicationId: string,
  status: KycStatus,
  adminNotes?: string
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("kyc_applications")
    .update({
      status,
      admin_notes: adminNotes ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (error) {
    console.error("[KYC] updateKYCApplicationStatus error:", error);
  }
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function rowToApplication(row: DbKycApplicationRow): KycApplication {
  return {
    id: row.id,
    userId: row.user_id,
    entityType: row.entity_type,
    agencyId: row.agency_id,
    status: row.status,
    adminNotes: row.admin_notes,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToDocument(row: DbKycDocumentRow): KycDocument {
  return {
    id: row.id,
    applicationId: row.application_id,
    userId: row.user_id,
    documentType: row.document_type,
    storagePath: row.storage_path,
    fileName: row.file_name,
    fileSizeBytes: row.file_size_bytes,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  };
}

function rowToAdminItem(row: DbKycApplicationRow): KycApplicationAdmin {
  return {
    ...rowToApplication(row),
    authorName: row.profiles?.name_ar ?? "مستخدم",
    authorEmail: row.profiles?.email ?? null,
    authorAvatarUrl: row.profiles?.avatar_url ?? null,
    documents: (row.kyc_documents ?? []).map(rowToDocument),
  };
}
