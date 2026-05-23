"use client";

import { useState, useEffect } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { VerificationRequestCard } from "@/components/admin/VerificationRequestCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_VERIFICATION_REQUESTS } from "@/mock/admin";
import type { AdminVerificationRequest, VerificationRequestStatus, VerificationRequestType } from "@/types/admin";
import { fetchKYCApplicationsAdmin, updateKYCApplicationStatus } from "@/lib/supabase/kyc";
import type { KycApplicationAdmin, KycStatus } from "@/lib/supabase/kyc";
import type { KYCDocumentType } from "@/types/profile";

const TYPE_FILTERS: (VerificationRequestType | "all")[] = ["all", "agent", "agency"];
const TYPE_AR: Record<VerificationRequestType | "all", string> = {
  all: "الكل", agent: "وسيط", agency: "وكالة", property: "عقار",
};

// ── Mapper: KycApplicationAdmin → AdminVerificationRequest ─────────────────────
const KYC_STATUS_MAP: Record<KycStatus, VerificationRequestStatus> = {
  not_started:    "pending",
  draft:          "pending",
  submitted:      "pending",
  under_review:   "under_review",
  approved:       "approved",
  rejected:       "rejected",
  needs_more_info:"needs_more_info",
};

const KYC_DOC_TYPE_MAP: Record<KYCDocumentType, "civil_id" | "agent_license" | "cr" | "property_deed" | "other"> = {
  civil_id_front: "civil_id",
  civil_id_back:  "civil_id",
  cr_number:      "cr",
  agency_license: "other",
  agent_card:     "agent_license",
  selfie:         "other",
};

function kycToVerificationRequest(app: KycApplicationAdmin): AdminVerificationRequest {
  return {
    id: app.id,
    applicantNameAr: app.authorName,
    applicantId: app.userId,
    type: app.entityType === "individual" ? "agent" : "agency",
    status: KYC_STATUS_MAP[app.status] ?? "pending",
    phone: "—",
    isPhoneVerified: false,
    documents: app.documents.map((d) => ({
      type: KYC_DOC_TYPE_MAP[d.documentType] ?? "other",
      labelAr: d.fileName,
      submitted: true,
      verified: false,
    })),
    submittedAt: app.submittedAt ?? app.createdAt,
    riskLevel: "low",
    adminNote: app.adminNotes ?? undefined,
  };
}

function useVerificationQueue() {
  const [items, setItems] = useState<AdminVerificationRequest[]>(MOCK_VERIFICATION_REQUESTS);

  useEffect(() => {
    fetchKYCApplicationsAdmin()
      .then((rows) => {
        if (rows.length > 0) {
          setItems(rows.map(kycToVerificationRequest));
        }
        // if empty, keep mock data
      })
      .catch(() => {/* keep mock data */});
  }, []);

  async function update(id: string, status: VerificationRequestStatus, note?: string) {
    // Optimistic update
    setItems((prev) =>
      prev.map((r) => r.id === id ? { ...r, status, adminNote: note ?? r.adminNote } : r)
    );
    // Map VerificationRequestStatus back to KycStatus for DB update
    const kycStatus = status as KycStatus;
    await updateKYCApplicationStatus(id, kycStatus, note).catch((err) =>
      console.error("[Admin/Verification] updateKYCApplicationStatus error:", err)
    );
  }

  return { items, update };
}

export default function AdminVerificationPage() {
  const [typeFilter, setTypeFilter] = useState<VerificationRequestType | "all">("all");
  const { items, update } = useVerificationQueue();

  const filtered = typeFilter === "all" ? items : items.filter((r) => r.type === typeFilter);
  const pending  = items.filter((r) => r.status === "pending" || r.status === "under_review").length;

  return (
    <AdminDashboardShell titleAr="طلبات التوثيق">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#627D98]">{pending} طلب في الانتظار · {items.length} إجمالي</p>
        </div>

        <div className="flex gap-2">
          {TYPE_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((r) => r.type === f).length;
            return (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl flex-shrink-0 transition-colors",
                  typeFilter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
              >
                {TYPE_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد طلبات توثيق" descriptionAr="طلبات التوثيق من الوسطاء والوكالات ستظهر هنا." />
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <VerificationRequestCard
                key={req.id}
                request={req}
                onApprove={(id) => void update(id, "approved")}
                onReject={(id) => void update(id, "rejected")}
                onRequestInfo={(id) => void update(id, "needs_more_info", "يرجى إرسال المستندات المطلوبة.")}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
