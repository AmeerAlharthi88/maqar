import { MOCK_AGENTS } from "@/mock/agents";
import { buildWhatsAppLink, buildListingWhatsAppMessage } from "@/lib/helpers/whatsapp";
import { toArabicNumerals } from "@/lib/formatters";
import type { Listing } from "@/types/listing";

interface AgentCardProps {
  listing: Listing;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? "#C65D3B" : "none"}
          stroke="#C65D3B"
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function AgentCard({ listing }: AgentCardProps) {
  const agent = MOCK_AGENTS.find((a) => a.id === listing.agentId) ?? MOCK_AGENTS[0];

  const whatsappMessage = buildListingWhatsAppMessage({
    listingTitle: listing.titleAr,
    listingId: listing.id,
    agentName: agent.nameAr,
  });
  const whatsappHref = buildWhatsAppLink(agent.whatsapp, whatsappMessage);
  const callHref = `tel:${agent.phone}`;

  const initials = agent.nameAr
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="px-4 py-4 border-t border-[#F0EBE3]">
      <h2 className="text-base font-bold text-[#1E1E1E] mb-3">المعلن</h2>

      <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
        {/* Agent header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-[#C65D3B]/15 flex items-center justify-center flex-shrink-0">
            {agent.avatar ? (
              <img
                src={agent.avatar}
                alt={agent.nameAr}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-[#C65D3B]">{initials}</span>
            )}
          </div>

          {/* Name + agency */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#1E1E1E] truncate">{agent.nameAr}</span>
              {agent.isVerified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#5B8C5A">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              )}
            </div>
            {agent.agency && (
              <p className="text-xs text-[#7A6B5E] truncate">{agent.agency.nameAr}</p>
            )}
            {agent.licenseNumber && (
              <p className="text-[10px] text-[#A89480]">ترخيص: {agent.licenseNumber}</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center bg-[#F5F0EA] rounded-xl py-2">
            <p className="text-sm font-bold text-[#1E1E1E]">{toArabicNumerals(agent.stats.activeListings)}</p>
            <p className="text-[10px] text-[#7A6B5E]">إعلان نشط</p>
          </div>
          <div className="text-center bg-[#F5F0EA] rounded-xl py-2">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <StarRating rating={agent.stats.rating} />
            </div>
            <p className="text-[10px] text-[#7A6B5E]">{toArabicNumerals(agent.stats.reviewCount)} تقييم</p>
          </div>
          <div className="text-center bg-[#F5F0EA] rounded-xl py-2">
            <p className="text-sm font-bold text-[#1E1E1E]">{agent.stats.avgResponseTime}</p>
            <p className="text-[10px] text-[#7A6B5E]">وقت الرد</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            واتساب
          </a>
          <a
            href={callHref}
            className="flex items-center justify-center gap-2 bg-[#F5F0EA] text-[#1E1E1E] text-sm font-semibold py-2.5 rounded-xl border border-[#E8DDD0]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            اتصال
          </a>
        </div>
      </div>
    </div>
  );
}
