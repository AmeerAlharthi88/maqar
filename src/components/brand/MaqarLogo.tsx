interface MaqarLogoProps {
  variant?: "full" | "wordmark";
  size?: "sm" | "md" | "lg";
  color?: "brand" | "white" | "dark";
  className?: string;
}

const sizes = {
  sm: { mark: 28, font: "text-lg" },
  md: { mark: 36, font: "text-2xl" },
  lg: { mark: 48, font: "text-3xl" },
};

const colors = {
  brand: { mark: "#C65D3B", text: "#1E1E1E", dot: "#D4A373" },
  white: { mark: "#FFFFFF", text: "#FFFFFF", dot: "#D4A373" },
  dark:  { mark: "#1E1E1E", text: "#1E1E1E", dot: "#C65D3B" },
};

export function MaqarLogo({
  variant = "full",
  size = "md",
  color = "brand",
  className = "",
}: MaqarLogoProps) {
  const s = sizes[size];
  const c = colors[color];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <MaqarIconSVG size={s.mark} primary={c.mark} accent={c.dot} />
      {variant === "full" && (
        <span
          className={`${s.font} font-bold tracking-tight leading-none`}
          style={{ color: c.text, fontFamily: "var(--font-arabic), sans-serif" }}
        >
          مقر
        </span>
      )}
    </div>
  );
}

interface MaqarIconSVGProps {
  size: number;
  primary: string;
  accent: string;
}

function MaqarIconSVG({ size, primary, accent }: MaqarIconSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* House silhouette */}
      <path
        d="M24 6L4 22h6v20h10V30h8v12h10V22h6L24 6z"
        fill={primary}
        fillOpacity="0.12"
      />
      <path
        d="M24 8L6 23.5h5V41h9V29h8v12h9V23.5h5L24 8z"
        stroke={primary}
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Door */}
      <rect x="19" y="31" width="10" height="10" rx="1.5" fill={primary} fillOpacity="0.3" />
      {/* Accent dot – Desert Sand */}
      <circle cx="37" cy="11" r="5" fill={accent} />
    </svg>
  );
}
