function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-[#E2E8F0] animate-pulse ${className ?? ""}`} aria-hidden="true" />
  );
}

function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex-shrink-0 w-[280px]">
      <Shimmer className="w-full h-44 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-3 w-12" />
        </div>
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Shimmer className="h-3 w-10" />
          <Shimmer className="h-3 w-10" />
          <Shimmer className="h-3 w-12" />
        </div>
        <div className="flex justify-between pt-1 border-t border-[#F0F4F8]">
          <Shimmer className="h-5 w-24" />
          <Shimmer className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function AreaCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex-shrink-0 w-[220px]">
      <div className="flex justify-between mb-3">
        <div>
          <Shimmer className="h-4 w-20 mb-1" />
          <Shimmer className="h-3 w-12" />
        </div>
        <Shimmer className="h-4 w-8" />
      </div>
      <Shimmer className="h-3 w-full mb-2" />
      <Shimmer className="h-3 w-3/4 mb-3" />
      <Shimmer className="h-2 w-full rounded-full mb-2" />
      <Shimmer className="h-3 w-16" />
    </div>
  );
}

export function HomeFeedSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero skeleton */}
      <div className="px-4 py-5 bg-[#E6F0EF]">
        <Shimmer className="h-7 w-32 mb-3" />
        <Shimmer className="h-8 w-3/4 mb-2" />
        <Shimmer className="h-4 w-1/2 mb-4" />
        <Shimmer className="h-14 w-full mb-4" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Featured skeleton */}
      <div className="px-4 py-5">
        <div className="flex justify-between mb-4">
          <Shimmer className="h-5 w-36" />
          <Shimmer className="h-4 w-16" />
        </div>
        <div className="flex gap-4 overflow-x-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Areas skeleton */}
      <div className="px-4 py-5 bg-[#F0F4F8]">
        <div className="flex justify-between mb-4">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-4 w-20" />
        </div>
        <div className="flex gap-3 overflow-x-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <AreaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
