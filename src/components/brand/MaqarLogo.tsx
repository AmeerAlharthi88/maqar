// MaqarLogo — brand logo system
// Variants:
//   full        — header/nav logo: MARK ONLY (no wordmark) — the mark is the
//                 unified brand lockup; pairing a tiny mark with a large "مقر"
//                 looked disconnected, so headers show the mark alone, enlarged.
//   horizontal  — same as full: MARK ONLY (header/nav use).
//   stacked     — mark above "مقر" + "MAQAR" — for auth / brand presentation only.
//   mark-only   — bare mark at the token size.
//   white-on-emerald — inverse pill card (mark + text on emerald).
// Sizes: xs | sm | md | lg   ·   Colors: brand | white | dark

import { MaqarLogoMark } from "./MaqarLogoMark";

// Header/nav mark-only variants render the mark slightly larger than the token
// (no wordmark beside it to carry visual weight). The result still fits inside
// the fixed-height headers (h-14 = 56px, h-16 = 64px) so header height is
// unchanged.
const HEADER_MARK_SCALE = 1.4;

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

  // ── horizontal & full (header/nav): MARK ONLY, enlarged ─────────────────────
  // Both header variants render only the mark — no adjacent "مقر" wordmark.
  // The mark alone is the brand lockup in compact header/nav contexts.
  return (
    <MaqarLogoMark
      size={Math.round(s.mark * HEADER_MARK_SCALE)}
      primary={c.primary}
      accent={c.accent}
      className={className}
    />
  );
}
