import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { formatPhoneDisplay } from "@/lib/formatters";
import type { Agent } from "@/types/agent";

interface AgentMiniCardProps {
  agent: Agent;
  listingTitle?: string;
  listingId?: string;
  showWhatsApp?: boolean;
  className?: string;
}

export function AgentMiniCard({
  agent,
  listingTitle = "عقار",
  listingId = "",
  showWhatsApp = true,
  className,
}: AgentMiniCardProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar name={agent.nameAr} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-[#102A43] truncate">{agent.nameAr}</p>
          {agent.isVerified && (
            <span className="w-4 h-4 rounded-full bg-[#EAF4FB] flex items-center justify-center flex-shrink-0">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2471A3" strokeWidth="3">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          )}
        </div>
        {agent.agency && (
          <p className="text-xs text-[#627D98] truncate">{agent.agency.nameAr}</p>
        )}
        <p className="text-xs text-[#627D98]" dir="ltr">{formatPhoneDisplay(agent.phone)}</p>
      </div>
      {showWhatsApp && (
        <WhatsAppCTA
          phone={agent.whatsapp}
          agentName={agent.nameAr}
          listingTitle={listingTitle}
          listingId={listingId}
          variant="icon"
        />
      )}
    </div>
  );
}
