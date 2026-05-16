export interface Review {
  id: string;
  authorNameAr: string;
  rating: number; // 1-5
  bodyAr: string;
  createdAt: string;
  targetId: string; // agentId or agencyId
  targetType: "agent" | "agency";
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    authorNameAr: "سيف بن ناصر العلوي",
    rating: 5,
    bodyAr: "خالد وسيط محترف جداً، تعامل ممتاز ورد سريع. ساعدني في إيجاد الفيلا المثالية بوقت قياسي.",
    createdAt: "2025-03-20T10:00:00Z",
    targetId: "agent-1",
    targetType: "agent",
  },
  {
    id: "rev-2",
    authorNameAr: "مريم بنت حمد الجهورية",
    rating: 5,
    bodyAr: "تجربة رائعة مع مقر العقارية. الفريق محترف والإجراءات سلسة.",
    createdAt: "2025-03-15T14:00:00Z",
    targetId: "agent-1",
    targetType: "agent",
  },
  {
    id: "rev-3",
    authorNameAr: "طارق بن سعيد الحراصي",
    rating: 4,
    bodyAr: "خدمة جيدة عموماً، الرد كان يتأخر أحياناً لكن النتيجة كانت ممتازة.",
    createdAt: "2025-02-28T09:00:00Z",
    targetId: "agent-1",
    targetType: "agent",
  },
  {
    id: "rev-4",
    authorNameAr: "ليلى بنت عوض الشكيلية",
    rating: 5,
    bodyAr: "فاطمة من أفضل الوسيطات في مسقط. صادقة وتعمل بجد لإيجاد ما يناسب العميل.",
    createdAt: "2025-04-01T11:00:00Z",
    targetId: "agent-2",
    targetType: "agent",
  },
  {
    id: "rev-5",
    authorNameAr: "بلال بن محمد الرحبي",
    rating: 5,
    bodyAr: "لاكشري لايف شركة احترافية بامتياز. استلمنا الشقة بالمواصفات المتفق عليها تماماً.",
    createdAt: "2025-03-10T16:00:00Z",
    targetId: "agency-4",
    targetType: "agency",
  },
  {
    id: "rev-6",
    authorNameAr: "منال بنت علي السناني",
    rating: 5,
    bodyAr: "مقر العقارية تستحق الثقة. خدمة ما بعد البيع ممتازة.",
    createdAt: "2025-04-05T12:00:00Z",
    targetId: "agency-1",
    targetType: "agency",
  },
];

export function getReviews(targetId: string, limit = 3): Review[] {
  return MOCK_REVIEWS.filter((r) => r.targetId === targetId).slice(0, limit);
}
