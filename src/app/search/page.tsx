import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { SearchResultsSkeletonGrid } from "@/components/search/SearchSkeletons";

export const metadata = {
  title: "البحث عن عقار",
  description: "ابحث في آلاف العقارات في سلطنة عُمان — شقق وفلل وأراضي للبيع والإيجار",
};

export default function SearchPage() {
  return (
    <AppShell>
      {/* Suspense required because SearchPageClient calls useSearchParams() */}
      <Suspense fallback={<div className="px-4 py-4"><SearchResultsSkeletonGrid /></div>}>
        <SearchPageClient />
      </Suspense>
    </AppShell>
  );
}
