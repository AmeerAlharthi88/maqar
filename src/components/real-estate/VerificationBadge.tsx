import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  verified: boolean;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function VerificationBadge({ verified, size = "sm", showLabel = true, className }: VerificationBadgeProps) {
  if (!verified) return null;

  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold",
        size === "sm" ? "text-xs px-2 py-0.5 rounded-md" : "text-sm px-2.5 py-1 rounded-lg",
        "bg-[#EAF4FB] text-[#2471A3]",
        className
      )}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {showLabel && "موثوق"}
    </span>
  );
}
