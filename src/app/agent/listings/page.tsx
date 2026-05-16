"use client";

import Link from "next/link";
import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { ListingPerformanceCard } from "@/components/dashboard/ListingPerformanceCard";
import { MOCK_AGENT_LISTINGS } from "@/mock/agent-analytics";
import { ROUTES } from "@/config/routes";

export default function AgentListingsPage() {
  const activeCount  = MOCK_AGENT_LISTINGS.filter((l) => l.status === "active").length;
  const draftCount   = MOCK_AGENT_LISTINGS.filter((l) => l.status === "draft").length;
  const pendingCount = MOCK_AGENT_LISTINGS.filter((l) => l.status === "pending_review").length;

  return (
    <AgentDashboardShell titleAr="إعلاناتي">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Summary chips */}
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1.5 bg-[#EDF4ED] text-[#5B8C5A] text-xs font-semibold rounded-xl">
            {activeCount} نشط
          </span>
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 bg-[#FFF8E7] text-[#D4A017] text-xs font-semibold rounded-xl">
              {pendingCount} قيد المراجعة
            </span>
          )}
          {draftCount > 0 && (
            <span className="px-3 py-1.5 bg-[#F5F0EA] text-[#7A6B5E] text-xs font-semibold rounded-xl">
              {draftCount} مسودة
            </span>
          )}
          <Link
            href={ROUTES.addListing}
            className="mr-auto px-3 py-1.5 bg-[#C65D3B] text-white text-xs font-bold rounded-xl"
          >
            + إضافة إعلان
          </Link>
        </div>

        {/* Listing cards */}
        <div className="space-y-3">
          {MOCK_AGENT_LISTINGS.map((listing) => (
            <ListingPerformanceCard
              key={listing.listingId}
              listing={listing}
              onEdit={() => {}}
            />
          ))}
        </div>
      </div>
    </AgentDashboardShell>
  );
}
