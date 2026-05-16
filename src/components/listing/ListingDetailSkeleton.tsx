export function ListingDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Gallery skeleton */}
      <div className="w-full bg-[#E8DDD0]" style={{ paddingBottom: "62%" }} />

      {/* Header skeleton */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-[#E8DDD0]" />
          <div className="h-5 w-20 rounded-full bg-[#E8DDD0]" />
        </div>
        <div className="h-6 w-3/4 rounded-lg bg-[#E8DDD0]" />
        <div className="h-8 w-1/2 rounded-lg bg-[#E8DDD0]" />
        <div className="h-4 w-2/3 rounded-lg bg-[#E8DDD0]" />
      </div>

      {/* Specs skeleton */}
      <div className="px-4 py-4 border-t border-[#F0EBE3]">
        <div className="h-5 w-32 rounded-lg bg-[#E8DDD0] mb-3" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[#E8DDD0]" />
          ))}
        </div>
      </div>

      {/* Description skeleton */}
      <div className="px-4 py-4 border-t border-[#F0EBE3] space-y-2">
        <div className="h-5 w-32 rounded-lg bg-[#E8DDD0]" />
        <div className="h-4 w-full rounded-lg bg-[#E8DDD0]" />
        <div className="h-4 w-5/6 rounded-lg bg-[#E8DDD0]" />
        <div className="h-4 w-4/6 rounded-lg bg-[#E8DDD0]" />
      </div>

      {/* Market insight skeleton */}
      <div className="px-4 py-4 border-t border-[#F0EBE3]">
        <div className="h-5 w-44 rounded-lg bg-[#E8DDD0] mb-3" />
        <div className="rounded-2xl bg-[#E8DDD0] h-48" />
      </div>

      {/* Agent card skeleton */}
      <div className="px-4 py-4 border-t border-[#F0EBE3]">
        <div className="h-5 w-20 rounded-lg bg-[#E8DDD0] mb-3" />
        <div className="rounded-2xl bg-[#E8DDD0] h-36" />
      </div>
    </div>
  );
}
