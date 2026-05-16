import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-7 h-7 text-xs",
  sm: "w-9 h-9 text-sm",
  md: "w-11 h-11 text-base",
  lg: "w-14 h-14 text-lg",
  xl: "w-18 h-18 text-2xl",
};

function getInitials(name?: string): string {
  if (!name) return "م";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0);
  return words[0].charAt(0) + (words[1]?.charAt(0) ?? "");
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center",
        "bg-gradient-to-br from-[#C65D3B] to-[#D4A373] text-white font-semibold select-none",
        sizeClasses[size],
        className
      )}
      aria-label={name}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt={name ?? ""} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
