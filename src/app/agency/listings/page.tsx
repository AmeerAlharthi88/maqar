"use client";

import { AgencyDashboardShell } from "@/components/agency/AgencyDashboardShell";
import { ListingPerformanceCard } from "@/components/dashboard/ListingPerformanceCard";
import { MOCK_AGENT_LISTINGS } from "@/mock/agent-analytics";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

export default function AgencyListingsPage() {
  // TODO: fetch all agency listings from Supabase in Phase 11 (currently using agent-1 mock)
  const listings = MOCK_AGENT_LISTINGS;
  const activeCount = listings.filter((l) => l.status === "active").length;

  return (
    <AgencyDashboardShell titleAr="إعلانات الوكالة">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Summary + action */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#627D98]">{listings.length} إعلان · {activeCount} نشط</p>
          <Link
            href={ROUTES.addListing}
            className="px-3 py-1.5 bg-[#0A3C36] text-white text-xs font-bold rounded-xl"
          >
            + إعلان جديد
          </Link>
        </div>

        <div className="space-y-3">
          {listings.map((listing) => (
            <ListingPerformanceCard
              key={listing.listingId}
              listing={listing}
              onEdit={() => {}}
            />
          ))}
        </div>
      </div>
    </AgencyDashboardShell>
  );
}
