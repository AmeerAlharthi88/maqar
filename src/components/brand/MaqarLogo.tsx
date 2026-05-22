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
  brand: { mark: "#0A3C36", text: "#0A3C36", dot: "#E5BA73" },
  white: { mark: "#FFFFFF", text: "#FFFFFF", dot: "#E5BA73" },
  dark:  { mark: "#102A43", text: "#102A43", dot: "#E5BA73" },
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
      {/* House outline — 2px stroke, premium line style */}
      <path
        d="M24 8L6 23.5h5V41h9V29h8v12h9V23.5h5L24 8z"
        stroke={primary}
        strokeWidth="2"
        strokeLinejoin="round"
        fill={primary}
        fillOpacity="0.06"
      />
      {/* Door */}
      <rect x="19" y="31" width="10" height="10" rx="1.5"
        stroke={primary} strokeWidth="1.5" fill={primary} fillOpacity="0.12" />
      {/* Champagne Gold accent dot */}
      <circle cx="37" cy="11" r="4.5" fill={accent} />
    </svg>
  );
}
