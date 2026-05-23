import Link from "next/link";
import type { Agency } from "@/types/agency";
import { ROUTES } from "@/config/routes";

interface AgencyDirectoryCardProps {
  agency: Agency;
}

export function AgencyDirectoryCard({ agency }: AgencyDirectoryCardProps) {
  const initials = agency.nameAr
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(agency.stats.rating));

  return (
    <Link
      href={ROUTES.agency(agency.id)}
      className="block bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4 active:bg-[#F8F9FA] transition-colors"
      dir="rtl"
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl bg-[#0A3C36]/10 flex items-center justify-center flex-shrink-0">
          {agency.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agency.logo}
              alt={agency.nameAr}
              className="w-full h-full rounded-2xl object-contain"
            />
          ) : (
            <span className="text-lg font-bold text-[#0A3C36]">{initials}</span>
          )}
        </div>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-[#102A43]">{agency.nameAr}</p>
            {agency.isVerified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A3C36">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            )}
          </div>
          <p className="text-xs text-[#627D98] mt-0.5">
            {agency.location.wilayatAr}، {agency.location.governorateAr}
          </p>
          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {stars.map((filled, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#E5BA73" : "#E2E8F0"}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="text-[10px] text-[#627D98] mr-1">
              {agency.stats.rating} ({agency.stats.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Specializations */}
      {agency.specializationAr.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {agency.specializationAr.map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 bg-[#F0F4F8] text-[#627D98] text-[10px] rounded-lg"
            >
              {spec}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-sm font-bold text-[#102A43]">{agency.stats.activeListings}</p>
          <p className="text-[10px] text-[#627D98]">إعلان نشط</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-sm font-bold text-[#102A43]">{agency.stats.totalAgents}</p>
          <p className="text-[10px] text-[#627D98]">وسيط</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-sm font-bold text-[#102A43]">{agency.foundedYear}</p>
          <p className="text-[10px] text-[#627D98]">تأسست</p>
        </div>
      </div>
    </Link>
  );
}
