import { cn } from "@/lib/utils";
import { buildWhatsAppLink, buildListingWhatsAppMessage } from "@/lib/helpers/whatsapp";

interface WhatsAppCTAProps {
  phone: string;
  agentName: string;
  listingTitle: string;
  listingId: string;
  variant?: "button" | "icon" | "full";
  className?: string;
}

export function WhatsAppCTA({
  phone,
  agentName,
  listingTitle,
  listingId,
  variant = "button",
  className,
}: WhatsAppCTAProps) {
  const message = buildListingWhatsAppMessage({ listingTitle, listingId, agentName });
  const href = buildWhatsAppLink(phone, message);

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className={cn(
          "w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white",
          "hover:bg-[#1EBE58] transition-colors shadow-sm",
          className
        )}
      >
        <WhatsAppSVG size={22} />
      </a>
    );
  }

  if (variant === "full") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center justify-center gap-2.5 w-full h-12 rounded-xl",
          "bg-[#25D366] text-white font-semibold text-base",
          "hover:bg-[#1EBE58] transition-colors active:scale-[0.98]",
          className
        )}
      >
        <WhatsAppSVG size={20} />
        تواصل عبر واتساب
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 px-4 h-10 rounded-xl",
        "bg-[#25D366] text-white font-semibold text-sm",
        "hover:bg-[#1EBE58] transition-colors active:scale-[0.98]",
        className
      )}
    >
      <WhatsAppSVG size={18} />
      واتساب
    </a>
  );
}

function WhatsAppSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2.003c-5.514 0-9.998 4.483-9.998 9.997 0 1.762.46 3.524 1.34 5.077L2 22l5.023-1.315A9.96 9.96 0 0 0 12.004 22c5.514 0 9.997-4.483 9.997-9.997s-4.483-9.997-9.997-10zM12 20.003a8 8 0 0 1-4.079-1.113l-.292-.174-3.025.793.808-2.951-.19-.304A7.953 7.953 0 0 1 4 12c0-4.411 3.589-8 8.004-8C16.411 4 20 7.589 20 12s-3.589 8-8 8z" />
    </svg>
  );
}
