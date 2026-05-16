export type LeadStatus =
  | "new"
  | "contacted"
  | "viewing_scheduled"
  | "negotiating"
  | "closed"
  | "lost";

export type LeadSource = "whatsapp" | "call" | "appointment" | "offer" | "website";

export const LEAD_STATUS_LABELS_AR: Record<LeadStatus, string> = {
  new:               "جديد",
  contacted:         "تم التواصل",
  viewing_scheduled: "معاينة مجدولة",
  negotiating:       "في التفاوض",
  closed:            "مغلق",
  lost:              "خُسر",
};

export const LEAD_SOURCE_LABELS_AR: Record<LeadSource, string> = {
  whatsapp:    "واتساب",
  call:        "اتصال",
  appointment: "موعد معاينة",
  offer:       "عرض سعر",
  website:     "الموقع",
};

export interface Lead {
  id: string;
  customerNameAr: string;
  customerPhone: string;
  listingId: string;
  listingTitleAr: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  budget?: number;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rescheduled"
  | "cancelled"
  | "completed";

export const APPOINTMENT_STATUS_LABELS_AR: Record<AppointmentStatus, string> = {
  pending:     "في الانتظار",
  confirmed:   "مؤكد",
  rescheduled: "معاد جدولته",
  cancelled:   "ملغي",
  completed:   "مكتمل",
};

export interface DashboardAppointment {
  id: string;
  customerNameAr: string;
  customerPhone: string;
  listingId: string;
  listingTitleAr: string;
  scheduledAt: string; // ISO
  status: AppointmentStatus;
  notes?: string;
  agentId: string;
}

export type OfferStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "countered"
  | "withdrawn";

export const OFFER_STATUS_LABELS_AR: Record<OfferStatus, string> = {
  submitted:    "مُقدَّم",
  under_review: "قيد المراجعة",
  accepted:     "مقبول",
  rejected:     "مرفوض",
  countered:    "عرض مضاد",
  withdrawn:    "مسحوب",
};

export type FinancingType = "cash" | "mortgage" | "installment";

export const FINANCING_LABELS_AR: Record<FinancingType, string> = {
  cash:        "نقداً",
  mortgage:    "تمويل بنكي",
  installment: "أقساط",
};

export interface DashboardOffer {
  id: string;
  buyerNameAr: string;
  buyerPhone: string;
  listingId: string;
  listingTitleAr: string;
  askingPrice: number;
  offerAmount: number;
  financing: FinancingType;
  status: OfferStatus;
  agentId: string;
  createdAt: string;
}
