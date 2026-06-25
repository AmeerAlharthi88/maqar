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

export const LISTING_REVIEW_STATUS_EN: Record<ListingReviewStatus, string> = {
  pending:       "Pending",
  approved:      "Approved",
  rejected:      "Rejected",
  needs_changes: "Needs changes",
  suspicious:    "Suspicious",
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

export const VERIFICATION_STATUS_EN: Record<VerificationRequestStatus, string> = {
  pending:        "Pending",
  under_review:   "Under review",
  approved:       "Approved",
  rejected:       "Rejected",
  needs_more_info:"Needs info",
};

export type RiskLevel = "low" | "medium" | "high" | "critical";

export const RISK_LEVEL_AR: Record<RiskLevel, string> = {
  low:      "منخفض",
  medium:   "متوسط",
  high:     "مرتفع",
  critical: "حرج",
};

export const RISK_LEVEL_EN: Record<RiskLevel, string> = {
  low:      "Low",
  medium:   "Medium",
  high:     "High",
  critical: "Critical",
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

export const REPORT_REASON_EN: Record<ReportReason, string> = {
  wrong_info:        "Incorrect information",
  unrealistic_price: "Unrealistic price",
  fake_photos:       "Fake photos",
  duplicate:         "Duplicate property",
  already_sold:      "Already sold or rented",
  suspicious:        "Suspicious listing",
  other:             "Other reason",
};

export type ReportStatus = "new" | "reviewing" | "resolved" | "dismissed" | "escalated";

export const REPORT_STATUS_AR: Record<ReportStatus, string> = {
  new:       "جديد",
  reviewing: "قيد المراجعة",
  resolved:  "تم الحل",
  dismissed: "تم الرفض",
  escalated: "مُصعَّد",
};

export const REPORT_STATUS_EN: Record<ReportStatus, string> = {
  new:       "New",
  reviewing: "Reviewing",
  resolved:  "Resolved",
  dismissed: "Dismissed",
  escalated: "Escalated",
};

export type ReportTargetType = "listing" | "agent" | "agency" | "review";

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

export const AML_STATUS_EN: Record<AMLStatus, string> = {
  flagged:          "Flagged",
  cleared:          "Cleared",
  escalated:        "Escalated",
  rejected_listing: "Listing rejected",
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

export const USER_STATUS_EN: Record<UserStatus, string> = {
  active:                "Active",
  suspended:             "Suspended",
  banned:                "Banned",
  pending_verification:  "Pending verification",
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

export const PAYMENT_STATUS_EN: Record<PaymentStatus, string> = {
  paid:      "Paid",
  failed:    "Failed",
  trial:     "Trial",
  cancelled: "Cancelled",
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
  | "payment_action"
  | "ai_action"
  | "security_action"
  | "system_action";

export const AUDIT_CATEGORY_AR: Record<AuditCategory, string> = {
  admin_action:        "إجراء إداري",
  listing_action:      "إجراء إعلان",
  verification_action: "إجراء توثيق",
  user_action:         "إجراء مستخدم",
  payment_action:      "إجراء دفع",
  ai_action:           "إجراء ذكاء اصطناعي",
  security_action:     "إجراء أمني",
  system_action:       "إجراء نظام",
};

export const AUDIT_CATEGORY_EN: Record<AuditCategory, string> = {
  admin_action:        "Admin action",
  listing_action:      "Listing action",
  verification_action: "Verification action",
  user_action:         "User action",
  payment_action:      "Payment action",
  ai_action:           "AI action",
  security_action:     "Security action",
  system_action:       "System action",
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

export const REVIEW_MOD_STATUS_EN: Record<ReviewModerationStatus, string> = {
  pending:  "Pending",
  approved: "Approved",
  rejected: "Rejected",
  hidden:   "Hidden",
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
