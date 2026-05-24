// MaqarLogo — brand wordmark system
// Variants: full (mark + Arabic), horizontal (mark + Arabic + MAQAR), stacked (mark above text),
//           mark-only, white-on-emerald (inverse card)
// Sizes: xs | sm | md | lg
// Colors: brand | white | dark

import { MaqarLogoMark } from "./MaqarLogoMark";

type LogoVariant = "full" | "horizontal" | "stacked" | "mark-only" | "white-on-emerald";
type LogoSize   = "xs" | "sm" | "md" | "lg";
type LogoColor  = "brand" | "white" | "dark";

interface MaqarLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  color?: LogoColor;
  className?: string;
}

const sizes: Record<LogoSize, { mark: number; arAr: string; enAr: string; gap: string }> = {
  xs: { mark: 22, arAr: "text-sm",   enAr: "text-[9px]",  gap: "gap-1.5" },
  sm: { mark: 28, arAr: "text-lg",   enAr: "text-[10px]", gap: "gap-2"   },
  md: { mark: 36, arAr: "text-2xl",  enAr: "text-xs",     gap: "gap-2.5" },
  lg: { mark: 48, arAr: "text-3xl",  enAr: "text-sm",     gap: "gap-3"   },
};

const colors: Record<LogoColor, { primary: string; accent: string; text: string; sub: string }> = {
  brand: { primary: "#0A3C36", accent: "#E5BA73", text: "#0A3C36", sub: "#627D98" },
  white: { primary: "#FFFFFF", accent: "#E5BA73", text: "#FFFFFF", sub: "rgba(255,255,255,0.7)" },
  dark:  { primary: "#102A43", accent: "#E5BA73", text: "#102A43", sub: "#627D98" },
};

export function MaqarLogo({
  variant = "full",
  size = "md",
  color = "brand",
  className = "",
}: MaqarLogoProps) {
  const s = sizes[size];
  const c = colors[color];

  // ── white-on-emerald: pill/card with emerald bg ─────────────────────────────
  if (variant === "white-on-emerald") {
    return (
      <div
        className={`inline-flex items-center ${s.gap} px-3 py-2 rounded-2xl ${className}`}
        style={{ background: "#0A3C36" }}
      >
        <MaqarLogoMark size={s.mark} primary="#FFFFFF" accent="#E5BA73" />
        <div className="flex flex-col leading-none" style={{ fontFamily: "var(--font-arabic), sans-serif" }}>
          <span className={`${s.arAr} font-bold tracking-tight`} style={{ color: "#FFFFFF" }}>
            مقر
          </span>
          {size !== "xs" && (
            <span className={`${s.enAr} font-semibold tracking-widest`} style={{ color: "#E5BA73" }}>
              MAQAR
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── mark-only ───────────────────────────────────────────────────────────────
  if (variant === "mark-only") {
    return (
      <MaqarLogoMark
        size={s.mark}
        primary={c.primary}
        accent={c.accent}
        className={className}
      />
    );
  }

  // ── stacked: mark above text (centered) ─────────────────────────────────────
  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <MaqarLogoMark size={s.mark} primary={c.primary} accent={c.accent} />
        <div className="flex flex-col items-center leading-none" style={{ fontFamily: "var(--font-arabic), sans-serif" }}>
          <span className={`${s.arAr} font-bold tracking-tight`} style={{ color: c.text }}>
            مقر
          </span>
          {size !== "xs" && (
            <span className={`${s.enAr} font-semibold tracking-widest mt-0.5`} style={{ color: c.sub }}>
              MAQAR
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── horizontal: mark + Arabic + MAQAR tagline ───────────────────────────────
  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center ${s.gap} ${className}`}>
        <MaqarLogoMark size={s.mark} primary={c.primary} accent={c.accent} />
        <div className="flex flex-col leading-none" style={{ fontFamily: "var(--font-arabic), sans-serif" }}>
          <span className={`${s.arAr} font-bold tracking-tight`} style={{ color: c.text }}>
            مقر
          </span>
          <span className={`${s.enAr} font-semibold tracking-widest mt-0.5`} style={{ color: c.sub }}>
            MAQAR
          </span>
        </div>
      </div>
    );
  }

  // ── full (default): mark + Arabic wordmark ──────────────────────────────────
  return (
    <div className={`inline-flex items-center ${s.gap} ${className}`}>
      <MaqarLogoMark size={s.mark} primary={c.primary} accent={c.accent} />
      <span
        className={`${s.arAr} font-bold tracking-tight leading-none`}
        style={{ color: c.text, fontFamily: "var(--font-arabic), sans-serif" }}
      >
        مقر
      </span>
    </div>
  );
}
