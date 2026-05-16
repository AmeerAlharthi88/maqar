import type { AppRole } from "@/config/roles";

// ── Verification status ───────────────────────────────────────────────────────
export type VerificationStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_more_info";

export const VERIFICATION_STATUS_LABELS_AR: Record<VerificationStatus, string> = {
  not_started:    "لم يبدأ",
  draft:          "مسودة",
  submitted:      "تم الإرسال",
  under_review:   "قيد المراجعة",
  approved:       "موافق عليه",
  rejected:       "مرفوض",
  needs_more_info:"يحتاج معلومات إضافية",
};

// ── Notification preferences ──────────────────────────────────────────────────
export interface NotificationPreferences {
  newListingsInSavedSearch: boolean;
  priceDropAlerts: boolean;
  appointmentReminders: boolean;
  offerUpdates: boolean;
  marketDigest: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  newListingsInSavedSearch: true,
  priceDropAlerts: true,
  appointmentReminders: true,
  offerUpdates: true,
  marketDigest: false,
  smsEnabled: true,
  pushEnabled: true,
};

// ── User profile ──────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  nameAr: string;
  phone?: string;
  email?: string;
  role: AppRole;
  avatarUrl?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  onboardingCompleted: boolean;
  preferredLocale: "ar" | "en";
  notificationPreferences: NotificationPreferences;
  createdAt?: string;
}

// ── KYC / agent verification ──────────────────────────────────────────────────
export type KYCDocumentType =
  | "civil_id_front"
  | "civil_id_back"
  | "cr_number"
  | "agency_license"
  | "agent_card"
  | "selfie";

export const KYC_DOC_LABELS_AR: Record<KYCDocumentType, string> = {
  civil_id_front:  "الهوية المدنية (الوجه الأمامي)",
  civil_id_back:   "الهوية المدنية (الوجه الخلفي)",
  cr_number:       "السجل التجاري",
  agency_license:  "ترخيص الوكالة العقارية",
  agent_card:      "بطاقة الوسيط العقاري",
  selfie:          "صورة شخصية للتحقق",
};

export interface KYCDocument {
  id: string;
  type: KYCDocumentType;
  fileName: string;
  uploadStatus: "pending" | "uploading" | "done" | "error";
  url?: string;
}

export interface KYCApplication {
  id?: string;
  userId: string;
  status: VerificationStatus;
  agentType: "individual" | "agency";
  agencyNameAr?: string;
  crNumber?: string;
  licenseNumber?: string;
  documents: KYCDocument[];
  submittedAt?: string;
  reviewNotes?: string;
}
