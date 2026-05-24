"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { ListingPerformanceCard } from "@/components/dashboard/ListingPerformanceCard";
import { MOCK_AGENT_LISTINGS, type AgentListingMeta } from "@/mock/agent-analytics";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth.store";
import { getAgentListingsClient } from "@/lib/supabase/listings";

// Map DB listing_status to the AgentListingMeta status union
function mapStatus(dbStatus: string): AgentListingMeta["status"] {
  switch (dbStatus) {
    case "active":   return "active";
    case "draft":    return "draft";
    case "rejected": return "rejected";
    case "expired":  return "expired";
    case "sold":
    case "rented":
    case "needs_changes":
    case "pending_review":
    default:
      return "pending_review";
  }
}

export default function AgentListingsPage() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState<AgentListingMeta[]>(MOCK_AGENT_LISTINGS);
  const [isLoading, setIsLoading] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user?.id) return; // not logged in → keep mock

    setIsLoading(true);
    getAgentListingsClient(user.id).then(({ listings: rows, error }) => {
      setIsLoading(false);
      if (error || rows.length === 0) return; // keep mock on error or empty DB

      // Map DB rows to AgentListingMeta (what ListingPerformanceCard expects)
      const mapped: AgentListingMeta[] = rows.map((row) => ({
        listingId: row.id,
        titleAr:   row.title_ar,
        price:     row.price_omr ? Number(row.price_omr) : 0,
        status:    mapStatus(row.status),
        views:     row.view_count ?? 0,
        leads:     row.lead_count ?? 0,
        createdAt: row.created_at ?? new Date().toISOString(),
        expiresAt: row.expires_at ?? undefined,
      }));

      setListings(mapped);
    });
  }, [user?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const activeCount  = listings.filter((l) => l.status === "active").length;
  const draftCount   = listings.filter((l) => l.status === "draft").length;
  const pendingCount = listings.filter((l) => l.status === "pending_review").length;

  return (
    <AgentDashboardShell titleAr="إعلاناتي">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Summary chips */}
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1.5 bg-[#E6F0EF] text-[#0A3C36] text-xs font-semibold rounded-xl">
            {activeCount} نشط
          </span>
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 bg-[#FFF8E7] text-[#D4A017] text-xs font-semibold rounded-xl">
              {pendingCount} قيد المراجعة
            </span>
          )}
          {draftCount > 0 && (
            <span className="px-3 py-1.5 bg-[#F0F4F8] text-[#627D98] text-xs font-semibold rounded-xl">
              {draftCount} مسودة
            </span>
          )}
          <Link
            href={ROUTES.addListing}
            className="mr-auto px-3 py-1.5 bg-[#0A3C36] text-white text-xs font-bold rounded-xl"
          >
            + إضافة إعلان
          </Link>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#F0F4F8] animate-pulse" />
            ))}
          </div>
        )}

        {/* Listing cards */}
        {!isLoading && (
          <div className="space-y-3">
            {listings.map((listing) => (
              <ListingPerformanceCard
                key={listing.listingId}
                listing={listing}
                onEdit={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
