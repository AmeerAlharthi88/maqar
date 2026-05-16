export const ROUTES = {
  // Public
  home:           "/",
  search:         "/search",
  map:            "/map",
  listing:        (id: string) => `/listing/${id}`,
  areas:          "/areas",
  area:           (slug: string) => `/areas/${slug}`,
  agents:         "/agents",
  agent:          (id: string) => `/agents/${id}`,
  agencies:       "/agencies",
  agency:         (id: string) => `/agencies/${id}`,
  about:          "/about",
  privacy:        "/privacy",
  terms:          "/terms",
  listingPolicy:  "/listing-policy",
  agentVerPolicy: "/agent-verification-policy",

  // Auth
  login:      "/auth/login",
  verify:     "/auth/verify",
  onboarding: "/auth/onboarding",

  // Account (protected)
  account:          "/account",
  favorites:        "/account/favorites",
  recentlyViewed:   "/account/recently-viewed",
  savedSearches:    "/account/saved-searches",
  appointments:     "/account/appointments",
  offers:           "/account/offers",
  requests:         "/account/requests",
  accountSettings:  "/account/settings",

  // Listing (protected)
  addListing:   "/add-listing",
  listingDraft: (id: string) => `/add-listing/draft/${id}`,
  myListings:   "/my-listings",

  // Agent dashboard (protected)
  agentDashboard:    "/agent/dashboard",
  agentListings:     "/agent/listings",
  agentLeads:        "/agent/leads",
  agentAppointments: "/agent/appointments",
  agentOffers:       "/agent/offers",
  agentAnalytics:    "/agent/analytics",
  agentVerification: "/agent/verification",
  agentSubscription: "/agent/subscription",

  // Agency dashboard (protected)
  agencyDashboard: "/agency/dashboard",
  agencyListings:  "/agency/listings",
  agencyTeam:      "/agency/team",
  agencyLeads:     "/agency/leads",
  agencyAnalytics: "/agency/analytics",
  agencySettings:  "/agency/settings",

  // Admin (protected)
  admin:              "/admin",
  adminListings:      "/admin/listings",
  adminReviews:       "/admin/reviews",
  adminVerification:  "/admin/verification",
  adminReports:       "/admin/reports",
  adminAml:           "/admin/aml",
  adminDuplicates:    "/admin/duplicates",
  adminUsers:         "/admin/users",
  adminAgencies:      "/admin/agencies",
  adminMarketData:    "/admin/market-data",
  adminSubscriptions: "/admin/subscriptions",
  adminAuditLogs:     "/admin/audit-logs",

  // Misc
  offline: "/offline",
} as const;

export const PROTECTED_ROUTE_PREFIXES = [
  "/account",
  "/add-listing",
  "/my-listings",
  "/agent",
  "/agency",
  "/admin",
] as const;

export const ADMIN_ONLY_PREFIXES = ["/admin"] as const;
export const AGENT_PREFIXES = ["/agent"] as const;
export const AGENCY_PREFIXES = ["/agency"] as const;
