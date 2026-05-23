// MaqarLogoMark — Cyber Luxury PropTech mark
// Concept: house arch + Arabic Meem (م) + smart key — integrated into one geometric symbol
// House outer arch = Meem upper form. Inner ring+stem = keyhole + Meem body. Gold dot = key pin.

interface MaqarLogoMarkProps {
  size?: number;
  /** Primary stroke/fill color. Defaults to Maqar Deep Emerald. */
  primary?: string;
  /** Accent color for the key-pin dot. Defaults to Champagne Gold. */
  accent?: string;
  className?: string;
}

export function MaqarLogoMark({
  size = 40,
  primary = "#0A3C36",
  accent = "#E5BA73",
  className = "",
}: MaqarLogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="مقر"
      role="img"
    >
      {/*
        Outer arch — forms the house silhouette AND the upper arch of Arabic م
        Path: rise up left wall → smooth bezier arch over peak → down right wall
        Left wall at x=9, right wall at x=39, arch peak at (24, 4)
        Control points create a symmetric, softly-pointed premium arch
      */}
      <path
        d="M9 45 L9 24 C9 8 17 4 24 4 C31 4 39 8 39 24 L39 45"
        stroke={primary}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={primary}
        fillOpacity="0.05"
      />

      {/*
        Inner ring — Meem head & keyhole circle
        Sits in the upper interior of the house arch
        Reads simultaneously as: the circular belly of م, a keyhole ring, a window
      */}
      <circle
        cx="24"
        cy="21"
        r="6.5"
        stroke={primary}
        strokeWidth="2"
        fill="none"
      />

      {/*
        Key stem — Meem body
        Drops from the bottom of the ring to near the house base
        Reads as: the downward stroke of م, a key shaft
      */}
      <line
        x1="24"
        y1="27.5"
        x2="24"
        y2="43"
        stroke={primary}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/*
        Key tooth — Meem tail / key bit
        Single horizontal notch on the right side of the stem
        Reads as: the tail curl of م, the bit of a key
      */}
      <line
        x1="24"
        y1="36"
        x2="28.5"
        y2="36"
        stroke={primary}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/*
        Champagne Gold pin — lock core / luxury accent
        Filled circle inside the ring — the only filled element in accent color
        Reads as: the lock mechanism pin, the jewel of the brand
      */}
      <circle cx="24" cy="21" r="2.5" fill={accent} />
    </svg>
  );
}
