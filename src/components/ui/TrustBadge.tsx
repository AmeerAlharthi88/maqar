import { cn } from "@/lib/utils";

type TrustType = "verified" | "certified" | "new" | "featured" | "premium";

interface TrustBadgeProps {
  type: TrustType;
  className?: string;
}

const config: Record<TrustType, { labelAr: string; bg: string; text: string; icon: string }> = {
  verified:  { labelAr: "موثوق",   bg: "#E6F0EF", text: "#0A3C36", icon: "✓" },
  certified: { labelAr: "معتمد",   bg: "#EBF4FF", text: "#2B6CB0", icon: "★" },
  new:       { labelAr: "جديد",    bg: "#F0F4F8", text: "#627D98", icon: "●" },
  featured:  { labelAr: "مميز",    bg: "#FDF8EE", text: "#B7791F", icon: "▲" },
  premium:   { labelAr: "بريميوم", bg: "#0A3C36", text: "#E5BA73", icon: "◆" },
};

export function TrustBadge({ type, className }: TrustBadgeProps) {
  const { labelAr, bg, text, icon } = config[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md",
        className
      )}
      style={{ backgroundColor: bg, color: text }}
    >
      <span aria-hidden="true" className="text-[10px]">{icon}</span>
      {labelAr}
    </span>
  );
}
