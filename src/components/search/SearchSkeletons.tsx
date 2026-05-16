import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl bg-[#F0EBE3] animate-pulse", className)} aria-hidden="true" />
  );
}

export function SearchResultSkeleton() {
  return (
    <article className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
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
        <div className="flex justify-between items-end pt-1 border-t border-[#F5F0EA]">
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

export function SearchEmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F0EA] flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A89480" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <path d="M8 11h6M11 8v6" stroke="#C65D3B" strokeWidth="2.5"/>
        </svg>
      </div>
      <h2 className="text-lg font-bold text-[#1E1E1E] mb-2">لا توجد نتائج</h2>
      <p className="text-sm text-[#7A6B5E] max-w-xs">
        {query
          ? `لم نجد عقارات تطابق "${query}". جرّب تغيير كلمة البحث أو تعديل الفلاتر.`
          : "لم نجد عقارات تطابق الفلاتر المحددة. جرّب تعديل البحث أو إعادة التعيين."}
      </p>
    </div>
  );
}
