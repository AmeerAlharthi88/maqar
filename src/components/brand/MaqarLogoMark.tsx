// MaqarLogoMark — approved geometric brand mark
// Concept: house outline (emerald left / gold right) + Arabic Meem arc + smart-key teeth
//
// viewBox 44×50 matches the approved 4:5 proportions.
// size prop = rendered height (px); width = size × 44/50 auto-proportioned.
//
// Path sources scaled from the approved 400×500 SVG guide:
//   x_new = (x_orig − 100) × 0.2 + 2
//   y_new = (y_orig − 80)  × 0.1704 + 2

interface MaqarLogoMarkProps {
  /** Rendered height in px. Width is auto-proportioned (44:50 aspect ratio). */
  size?: number;
  /** Primary (emerald) colour for house left and Meem. Defaults to #0A3C36. */
  primary?: string;
  /** Accent (champagne gold) colour for house right and key teeth. Defaults to #E5BA73. */
  accent?: string;
  className?: string;
}

export function MaqarLogoMark({
  size = 40,
  primary = "#0A3C36",
  accent = "#E5BA73",
  className = "",
}: MaqarLogoMarkProps) {
  const h = size;
  const w = Math.round(size * 44 / 50); // preserve 4:5 ratio

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 44 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="مقر"
      role="img"
    >
      {/*
        ── House outer left wall + roof (Emerald) ───────────────────────────────
        M 2,48  → bottom of left wall
        L 2,19  → top of left wall
        L 22,2  → roof peak (center-top)
        L 34,12 → roof right shoulder
        L 34,19 → top of right junction where gold begins
      */}
      <path
        d="M 2,48 L 2,19 L 22,2 L 34,12 L 34,19"
        stroke={primary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/*
        ── House right extension (Champagne Gold) ───────────────────────────────
        M 34,19 → junction (continuing from emerald roof)
        L 42,19 → horizontal cap (top of gold right wall)
        L 42,48 → bottom of right wall
      */}
      <path
        d="M 34,19 L 42,19 L 42,48"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/*
        ── Arabic Meem arc loop (Emerald) ───────────────────────────────────────
        M 10,48   → base of left column (inside house, left third)
        L 10,29   → top of left column
        A 6,6 0 0,1 22,29 → D-arc sweeping clockwise to right column top
                              (semi-circle: horizontal dist 12 = 2 × r=6)
        L 22,41   → down the right column to near-base
                    (leaves bottom open — matches Meem letterform)
      */}
      <path
        d="M 10,48 L 10,29 A 6,6 0 0,1 22,29 L 22,41"
        stroke={primary}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />

      {/*
        ── Smart-key teeth (Champagne Gold) ────────────────────────────────────
        Two horizontal notches on the right of the Meem stem — key bits
        Upper tooth at y=36 (mid-stem)
        Lower tooth at y=41 (end of stem)
      */}
      <line
        x1="22" y1="36" x2="27" y2="36"
        stroke={accent} strokeWidth="2.2" strokeLinecap="round"
      />
      <line
        x1="22" y1="41" x2="27" y2="41"
        stroke={accent} strokeWidth="2.2" strokeLinecap="round"
      />
    </svg>
  );
}
