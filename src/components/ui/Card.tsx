import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "card" | "elevated";
  radius?: "sm" | "md" | "lg" | "xl";
  border?: boolean;
  as?: React.ElementType;
}

const paddingClasses = {
  none: "",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-6",
};

const shadowClasses = {
  none:     "",
  sm:       "shadow-[0_1px_4px_0_rgb(10_60_54/0.06)]",
  card:     "shadow-[0_4px_20px_0_rgb(10_60_54/0.04)]",
  elevated: "shadow-[0_8px_24px_0_rgb(10_60_54/0.10)]",
};

const radiusClasses = {
  sm:  "rounded-lg",
  md:  "rounded-xl",
  lg:  "rounded-2xl",
  xl:  "rounded-3xl",
};

export function Card({
  className,
  children,
  padding = "md",
  shadow = "card",
  radius = "xl",
  border = true,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "bg-white overflow-hidden",
        paddingClasses[padding],
        shadowClasses[shadow],
        radiusClasses[radius],
        border && "border border-[#E2E8F0]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
