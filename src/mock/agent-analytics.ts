// Mock analytics data — clearly marked, replace with Supabase queries in Phase 11

export interface ListingPerformance {
  listingId: string;
  titleAr: string;
  views: number;
  whatsappClicks: number;
  callClicks: number;
  saves: number;
  leads: number;
  status: "active" | "pending" | "draft" | "sold" | "rejected";
  daysOnMarket: number;
  price: number;
}

export interface AnalyticsTimePoint {
  date: string; // YYYY-MM-DD
  views: number;
  whatsappClicks: number;
  callClicks: number;
  leads: number;
}

export interface AgentAnalyticsSummary {
  agentId: string;
  period: "7d" | "30d" | "90d";
  totalViews: number;
  totalWhatsappClicks: number;
  totalCallClicks: number;
  totalSaves: number;
  totalLeads: number;
  totalAppointments: number;
  totalOffers: number;
  conversionRate: number; // leads/views %
  avgResponseTime: string;
  topListings: ListingPerformance[];
  timeSeries: AnalyticsTimePoint[];
}

// 30-day time series mock
function makeSeries(days: number): AnalyticsTimePoint[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000);
    const base = 50 + Math.round(Math.sin(i / 3) * 20 + Math.random() * 30);
    return {
      date: d.toISOString().slice(0, 10),
      views: base,
      whatsappClicks: Math.round(base * 0.12),
      callClicks: Math.round(base * 0.08),
      leads: Math.round(base * 0.04),
    };
  });
}

export const MOCK_AGENT_ANALYTICS: AgentAnalyticsSummary = {
  agentId: "agent-1",
  period: "30d",
  totalViews: 2340,
  totalWhatsappClicks: 187,
  totalCallClicks: 124,
  totalSaves: 315,
  totalLeads: 28,
  totalAppointments: 11,
  totalOffers: 6,
  conversionRate: 1.2,
  avgResponseTime: "٢٥ دقيقة",
  topListings: [
    {
      listingId: "lst-001",
      titleAr: "فيلا فاخرة بإطلالة بحرية في القرم",
      views: 1847,
      whatsappClicks: 94,
      callClicks: 61,
      saves: 203,
      leads: 12,
      status: "active",
      daysOnMarket: 47,
      price: 285000,
    },
    {
      listingId: "lst-002",
      titleAr: "شقة مودرن في الخوير",
      views: 493,
      whatsappClicks: 43,
      callClicks: 29,
      saves: 67,
      leads: 8,
      status: "active",
      daysOnMarket: 23,
      price: 85000,
    },
    {
      listingId: "lst-005",
      titleAr: "تاون هاوس في الموالح",
      views: 312,
      whatsappClicks: 28,
      callClicks: 18,
      saves: 45,
      leads: 5,
      status: "active",
      daysOnMarket: 15,
      price: 145000,
    },
  ],
  timeSeries: makeSeries(30),
};

export interface AgencyAnalyticsSummary {
  agencyId: string;
  period: "30d";
  totalViews: number;
  totalLeads: number;
  totalOffers: number;
  totalSales: number;
  conversionRate: number;
  topAgents: Array<{ agentId: string; nameAr: string; leads: number; sales: number }>;
  topAreas: Array<{ areaAr: string; views: number }>;
  timeSeries: AnalyticsTimePoint[];
}

export const MOCK_AGENCY_ANALYTICS: AgencyAnalyticsSummary = {
  agencyId: "agency-1",
  period: "30d",
  totalViews: 14200,
  totalLeads: 184,
  totalOffers: 47,
  totalSales: 12,
  conversionRate: 1.3,
  topAgents: [
    { agentId: "agent-5", nameAr: "منى المعمري", leads: 42, sales: 5 },
    { agentId: "agent-2", nameAr: "فاطمة البلوشي", leads: 38, sales: 4 },
    { agentId: "agent-1", nameAr: "خالد الحارثي", leads: 28, sales: 3 },
  ],
  topAreas: [
    { areaAr: "القرم", views: 4200 },
    { areaAr: "الخوير", views: 3100 },
    { areaAr: "المعبيلة", views: 2400 },
    { areaAr: "بوشر", views: 1800 },
    { areaAr: "السيب", views: 1200 },
  ],
  timeSeries: makeSeries(30),
};

// Agent listing inventory mock (for /agent/listings page)
export interface AgentListingMeta {
  listingId: string;
  titleAr: string;
  price: number;
  status: "active" | "pending_review" | "draft" | "rejected" | "expired";
  views: number;
  leads: number;
  createdAt: string;
  expiresAt?: string;
}

export const MOCK_AGENT_LISTINGS: AgentListingMeta[] = [
  {
    listingId: "lst-001",
    titleAr: "فيلا فاخرة بإطلالة بحرية في القرم",
    price: 285000,
    status: "active",
    views: 1847,
    leads: 12,
    createdAt: "2025-03-10T08:00:00Z",
    expiresAt: "2025-07-10T08:00:00Z",
  },
  {
    listingId: "lst-002",
    titleAr: "شقة مودرن في الخوير",
    price: 85000,
    status: "active",
    views: 493,
    leads: 8,
    createdAt: "2025-03-28T10:00:00Z",
    expiresAt: "2025-07-28T10:00:00Z",
  },
  {
    listingId: "lst-new-1",
    titleAr: "شقة عائلية في الموالح الشمالية",
    price: 72000,
    status: "pending_review",
    views: 0,
    leads: 0,
    createdAt: "2025-04-14T12:00:00Z",
  },
  {
    listingId: "lst-new-2",
    titleAr: "أرض تجارية في صحار",
    price: 45000,
    status: "draft",
    views: 0,
    leads: 0,
    createdAt: "2025-04-15T09:00:00Z",
  },
  {
    listingId: "lst-old-1",
    titleAr: "شقة في روي",
    price: 55000,
    status: "expired",
    views: 234,
    leads: 3,
    createdAt: "2024-10-01T08:00:00Z",
    expiresAt: "2025-01-01T08:00:00Z",
  },
];
