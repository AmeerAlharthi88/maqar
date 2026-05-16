import { cn } from "@/lib/utils";

type TrustType = "verified" | "certified" | "new" | "featured" | "premium";

interface TrustBadgeProps {
  type: TrustType;
  className?: string;
}

const config: Record<TrustType, { labelAr: string; bg: string; text: string; icon: string }> = {
  verified:  { labelAr: "موثوق",  bg: "#EDF4ED", text: "#5B8C5A", icon: "✓" },
  certified: { labelAr: "معتمد",  bg: "#EAF4FB", text: "#2471A3", icon: "★" },
  new:       { labelAr: "جديد",   bg: "#FDF6EE", text: "#C49060", icon: "●" },
  featured:  { labelAr: "مميز",   bg: "#FBF0EB", text: "#C65D3B", icon: "▲" },
  premium:   { labelAr: "بريميوم", bg: "#1E1E1E", text: "#D4A373", icon: "◆" },
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
