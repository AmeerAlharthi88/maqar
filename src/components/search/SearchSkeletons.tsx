import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl bg-[#E2E8F0] animate-pulse", className)} aria-hidden="true" />
  );
}

export function SearchResultSkeleton() {
  return (
    <article className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      <Shimmer className="w-full h-48 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <Shimmer className="h-3.5 w-16" />
          <Shimmer className="h-3.5 w-12" />
        </div>
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3.5 w-1/2" />
        <div className="flex gap-3">
          <Shimmer className="h-3.5 w-12" />
          <Shimmer className="h-3.5 w-12" />
          <Shimmer className="h-3.5 w-14" />
        </div>
        <div className="flex justify-between items-end pt-1 border-t border-[#F0F4F8]">
          <Shimmer className="h-5 w-28" />
          <Shimmer className="h-7 w-16 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function SearchResultsSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between gap-3">
        <Shimmer className="h-5 w-24" />
        <div className="flex gap-2">
          <Shimmer className="h-9 w-24 rounded-xl" />
          <Shimmer className="h-9 w-24 rounded-xl" />
        </div>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function SearchEmptyState({ query, locale = "ar" }: { query?: string; locale?: "ar" | "en" }) {
  const isAr = locale === "ar";
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#E6F0EF] flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <path d="M8 11h6M11 8v6" stroke="#0A3C36" strokeWidth="2.5"/>
        </svg>
      </div>
      <h2 className="text-lg font-bold text-[#102A43] mb-2">
        {isAr ? "لم يتم العثور على عقارات مطابقة" : "No matching properties found"}
      </h2>
      <p className="text-sm text-[#627D98] max-w-xs">
        {query
          ? isAr
            ? `لم نجد عقارات تطابق "${query}". جرّب تغيير كلمة البحث أو تعديل الفلاتر.`
            : `No properties match "${query}". Try a different search term or adjust the filters.`
          : isAr
          ? "جرّب تعديل الفلاتر أو إعادة التعيين."
          : "Try adjusting or resetting the filters."}
      </p>
    </div>
  );
}
