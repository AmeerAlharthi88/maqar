import type { Agency } from "@/types/agency";

interface AgencyProfileHeaderProps {
  agency: Agency;
}

export function AgencyProfileHeader({ agency }: AgencyProfileHeaderProps) {
  const initials = agency.nameAr
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(agency.stats.rating));

  const callHref     = `tel:${agency.phone}`;
  const whatsappHref = `https://wa.me/${agency.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <div className="bg-white border-b border-[#F0EBE3]" dir="rtl">
      <div className="px-4 py-5">
        {/* Logo + Name block */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-[#C65D3B]/10 flex items-center justify-center flex-shrink-0">
            {agency.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agency.logo}
                alt={agency.nameAr}
                className="w-full h-full rounded-2xl object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-[#C65D3B]">{initials}</span>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-[#1E1E1E]">{agency.nameAr}</h1>
              {agency.isVerified && (
                <span className="flex items-center gap-1 bg-[#EDF4ED] px-2 py-0.5 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#5B8C5A">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-[#5B8C5A]">موثّقة</span>
                </span>
              )}
            </div>

            <p className="text-sm text-[#7A6B5E] mt-0.5">
              {agency.location.wilayatAr}، {agency.location.governorateAr}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-0.5 mt-2">
              {stars.map((filled, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#C65D3B" : "#E8DDD0"}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span className="text-xs text-[#7A6B5E] mr-1.5">
                {agency.stats.rating} · {agency.stats.reviewCount} تقييم
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {agency.descriptionAr && (
          <p className="text-sm text-[#7A6B5E] leading-relaxed mb-4">{agency.descriptionAr}</p>
        )}

        {/* Specializations */}
        {agency.specializationAr.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {agency.specializationAr.map((s) => (
              <span key={s} className="px-2.5 py-1 bg-[#F5F0EA] text-[#7A6B5E] text-xs rounded-lg">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
            <p className="text-base font-bold text-[#1E1E1E]">{agency.stats.activeListings}</p>
            <p className="text-[10px] text-[#A89480]">إعلان نشط</p>
          </div>
          <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
            <p className="text-base font-bold text-[#1E1E1E]">{agency.stats.soldListings}</p>
            <p className="text-[10px] text-[#A89480]">صفقة</p>
          </div>
          <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
            <p className="text-base font-bold text-[#1E1E1E]">{agency.stats.totalAgents}</p>
            <p className="text-[10px] text-[#A89480]">وسيط</p>
          </div>
          <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
            <p className="text-base font-bold text-[#1E1E1E]">{agency.foundedYear}</p>
            <p className="text-[10px] text-[#A89480]">تأسست</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.013.496 3.906 1.367 5.567L0 24l6.622-1.342A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 0 1-5.042-1.4l-.362-.215-3.737.758.795-3.634-.236-.374A9.794 9.794 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            واتساب
          </a>
          <a
            href={callHref}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F5F0EA] text-[#1E1E1E] text-sm font-bold border border-[#E8DDD0]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            اتصال
          </a>
        </div>

        {/* License */}
        {agency.licenseNumber && (
          <p className="text-[10px] text-[#A89480] text-center mt-3">
            رقم الترخيص: {agency.licenseNumber}
            {agency.crNumber && ` · السجل التجاري: ${agency.crNumber}`}
          </p>
        )}
      </div>
    </div>
  );
}
