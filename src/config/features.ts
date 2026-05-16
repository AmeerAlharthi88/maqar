export const FEATURES = {
  // Core browsing — always on
  publicListings:      true,
  publicSearch:        true,
  publicMap:           true,
  publicAgentProfiles: true,

  // Account features
  favorites:           true,
  recentlyViewed:      true,
  savedSearches:       true,
  appointments:        true,
  offers:              false,  // Phase 6+
  requests:            false,  // Phase 6+

  // Listing creation
  addListing:          true,
  listingDrafts:       true,
  aiListingAssist:     false,  // Phase 7+
  videoUpload:         false,  // Phase 7+

  // Agent features
  agentDashboard:      true,
  agentAnalytics:      true,
  agentVerification:   true,
  agentSubscription:   false,  // Phase 8+
  agentLeads:          false,  // Phase 6+

  // Market data
  marketInsights:      true,
  priceHistory:        false,  // Phase 6+
  areaComparisons:     false,  // Phase 6+

  // Communication
  whatsAppCta:         true,
  inAppMessaging:      false,  // Phase 6+

  // PWA
  offlineMode:         true,
  pushNotifications:   false,  // Phase 8+
  installPrompt:       true,

  // Payments
  payments:            false,  // Phase 8+
  subscriptions:       false,  // Phase 8+
} as const;

export type FeatureKey = keyof typeof FEATURES;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return FEATURES[key];
}
