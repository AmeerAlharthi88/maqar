// ── Admin types — Phase 11 ─────────────────────────────────────────────────────
// All admin actions are mock/UI-only until Supabase RLS + server actions are connected.

// ── Listing review ─────────────────────────────────────────────────────────────

export type ListingReviewStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_changes"
  | "suspicious";

export const LISTING_REVIEW_STATUS_AR: Record<ListingReviewStatus, string> = {
  pending:       "في الانتظار",
  approved:      "مقبول",
  rejected:      "مرفوض",
  needs_changes: "يحتاج تعديلات",
  suspicious:    "مشبوه",
};

export interface AdminListingItem {
  id: string;
  titleAr: string;
  price: number;
  purpose: "sale" | "rent";
  areaAr: string;
  wilayatAr: string;
  agentNameAr: string;
  agentId: string;
  submittedAt: string;
  qualityScore: number;        // 0-100
  reviewStatus: ListingReviewStatus;
  isSuspiciousPrice: boolean;
  duplicateRisk: "none" | "low" | "medium" | "high";
  adminNote?: string;
}

// ── Verification requests ──────────────────────────────────────────────────────

export type VerificationRequestType = "agent" | "agency" | "property";
export type VerificationRequestStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_more_info";

export const VERIFICATION_STATUS_AR: Record<VerificationRequestStatus, string> = {
  pending:        "في الانتظار",
  under_review:   "قيد المراجعة",
  approved:       "مقبول",
  rejected:       "مرفوض",
  needs_more_info:"يحتاج معلومات",
};

export type RiskLevel = "low" | "medium" | "high" | "critical";

export const RISK_LEVEL_AR: Record<RiskLevel, string> = {
  low:      "منخفض",
  medium:   "متوسط",
  high:     "مرتفع",
  critical: "حرج",
};

export interface VerificationDocument {
  type: "civil_id" | "agent_license" | "cr" | "property_deed" | "other";
  labelAr: string;
  submitted: boolean;
  verified: boolean;
}

export interface AdminVerificationRequest {
  id: string;
  applicantNameAr: string;
  applicantId: string;
  type: VerificationRequestType;
  status: VerificationRequestStatus;
  phone: string;
  isPhoneVerified: boolean;
  crNumber?: string;
  licenseNumber?: string;
  documents: VerificationDocument[];
  submittedAt: string;
  riskLevel: RiskLevel;
  adminNote?: string;
}

// ── Reports ────────────────────────────────────────────────────────────────────

export type ReportReason =
  | "wrong_info"
  | "unrealistic_price"
  | "fake_photos"
  | "duplicate"
  | "already_sold"
  | "suspicious"
  | "other";

export const REPORT_REASON_AR: Record<ReportReason, string> = {
  wrong_info:        "معلومات غير صحيحة",
  unrealistic_price: "سعر غير منطقي",
  fake_photos:       "صور غير حقيقية",
  duplicate:         "عقار مكرر",
  already_sold:      "تم بيعه أو تأجيره",
  suspicious:        "إعلان مشبوه",
  other:             "سبب آخر",
};

export type ReportStatus = "new" | "reviewing" | "resolved" | "dismissed";

export const REPORT_STATUS_AR: Record<ReportStatus, string> = {
  new:       "جديد",
  reviewing: "قيد المراجعة",
  resolved:  "تم الحل",
  dismissed: "تم الرفض",
};

export type ReportTargetType = "listing" | "agent" | "agency";

export interface AdminReport {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetNameAr: string;
  reporterNameAr: string;
  reason: ReportReason;
  detailsAr?: string;
  status: ReportStatus;
  severity: RiskLevel;
  createdAt: string;
  adminNote?: string;
}

// ── AML flags ──────────────────────────────────────────────────────────────────

export type AMLStatus = "flagged" | "cleared" | "escalated" | "rejected_listing";

export const AML_STATUS_AR: Record<AMLStatus, string> = {
  flagged:          "مُبلَّغ",
  cleared:          "تم التخليص",
  escalated:        "مُصعَّد",
  rejected_listing: "تم رفض الإعلان",
};

export interface AMLFlag {
  id: string;
  listingId: string;
  listingTitleAr: string;
  listingPrice: number;
  areaAr: string;
  marketAvgPrice: number;
  diffPct: number;              // How far below market average (positive = below)
  agentNameAr: string;
  agentId: string;
  submittedAt: string;
  riskLevel: RiskLevel;
  status: AMLStatus;
  adminNote?: string;
}

// ── Duplicate listings ─────────────────────────────────────────────────────────

export type DuplicateStatus = "pending" | "confirmed_duplicate" | "not_duplicate" | "merged";

export interface DuplicatePair {
  id: string;
  listingA: {
    id: string;
    titleAr: string;
    price: number;
    areaAr: string;
    agentNameAr: string;
    specs: { bedrooms: number; area: number };
    createdAt: string;
  };
  listingB: {
    id: string;
    titleAr: string;
    price: number;
    areaAr: string;
    agentNameAr: string;
    specs: { bedrooms: number; area: number };
    createdAt: string;
  };
  similarityScore: number;      // 0-100
  matchReasons: string[];
  riskLevel: RiskLevel;
  status: DuplicateStatus;
  detectedAt: string;
}

// ── Users ──────────────────────────────────────────────────────────────────────

export type UserStatus = "active" | "suspended" | "banned" | "pending_verification";

export const USER_STATUS_AR: Record<UserStatus, string> = {
  active:                "نشط",
  suspended:             "موقوف",
  banned:                "محظور",
  pending_verification:  "في انتظار التحقق",
};

export interface AdminUser {
  id: string;
  nameAr: string;
  phone: string;
  email?: string;
  role: "guest" | "user" | "agent" | "agency_admin" | "admin" | "super_admin";
  isPhoneVerified: boolean;
  isVerified: boolean;
  listingsCount: number;
  status: UserStatus;
  joinedAt: string;
}

// ── Market data ────────────────────────────────────────────────────────────────

export interface AdminMarketDataRow {
  id: string;
  governorateAr: string;
  wilayatAr: string;
  areaAr: string;
  avgSalePrice: number;
  avgRentPrice: number;
  pricePerSqm: number;
  rentalYield: number;          // %
  demandScore: number;          // 0-100
  lastUpdated: string;
  dataSource: string;
}

// ── Subscriptions ──────────────────────────────────────────────────────────────

export type PaymentStatus = "paid" | "failed" | "trial" | "cancelled";

export const PAYMENT_STATUS_AR: Record<PaymentStatus, string> = {
  paid:      "مدفوع",
  failed:    "فشل",
  trial:     "تجريبي",
  cancelled: "ملغي",
};

export interface AdminSubscriptionRecord {
  id: string;
  userNameAr: string;
  userId: string;
  planId: "free" | "agent_pro" | "agency";
  planNameAr: string;
  paymentStatus: PaymentStatus;
  amount: number;
  startDate: string;
  nextBillDate?: string;
}

// ── Audit logs ─────────────────────────────────────────────────────────────────

export type AuditCategory =
  | "admin_action"
  | "listing_action"
  | "verification_action"
  | "user_action"
  | "payment_action";

export const AUDIT_CATEGORY_AR: Record<AuditCategory, string> = {
  admin_action:        "إجراء إداري",
  listing_action:      "إجراء إعلان",
  verification_action: "إجراء توثيق",
  user_action:         "إجراء مستخدم",
  payment_action:      "إجراء دفع",
};

export interface AuditLog {
  id: string;
  actorNameAr: string;
  actorId: string;
  category: AuditCategory;
  actionAr: string;
  targetAr: string;
  targetId?: string;
  severity: "info" | "warning" | "critical";
  ipPlaceholder: string;
  createdAt: string;
  detailsAr?: string;
}

// ── Review moderation ─────────────────────────────────────────────────────────

export type ReviewModerationStatus = "pending" | "approved" | "rejected" | "hidden";

export const REVIEW_MOD_STATUS_AR: Record<ReviewModerationStatus, string> = {
  pending:  "في الانتظار",
  approved: "مقبول",
  rejected: "مرفوض",
  hidden:   "مخفي",
};

export interface AdminReviewItem {
  id: string;
  authorNameAr: string;
  rating: number;
  bodyAr: string;
  targetType: "agent" | "agency";
  targetNameAr: string;
  targetId: string;
  status: ReviewModerationStatus;
  isReported: boolean;
  createdAt: string;
  adminNote?: string;
}

// ── Admin overview stats ───────────────────────────────────────────────────────

export interface AdminOverviewStats {
  totalListings: number;
  pendingReview: number;
  activeListings: number;
  reportedListings: number;
  verificationRequests: number;
  amlFlags: number;
  duplicateAlerts: number;
  activeAgents: number;
  totalAgencies: number;
  totalUsers: number;
  revenuePlaceholder: number;
}
