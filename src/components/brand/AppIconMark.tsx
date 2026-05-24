// AppIconMark — rounded app icon using the house+Meem+key mark
// Used in: home screen shortcut, splash screens, og-image fallback
// 60×60 default (scales via size prop). Emerald bg + white mark + gold pin.

interface AppIconMarkProps {
  size?: number;
  className?: string;
}

export function AppIconMark({ size = 60, className = "" }: AppIconMarkProps) {
  // The mark was designed on a 48×48 canvas.
  // We embed it centred inside the icon square with uniform padding.
  const pad = size * 0.14;           // ~14% padding on each side
  const markSize = size - pad * 2;   // mark fills the remaining area

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="مقر"
      role="img"
    >
      {/* Rounded square background — Deep Emerald */}
      <rect width={size} height={size} rx={size * 0.233} fill="#0A3C36" />

      {/*
        Mark group — centred inside the icon.
        We use a nested <svg> with the same 48×48 viewBox as MaqarLogoMark
        so the path coordinates are reused exactly.
      */}
      <svg
        x={pad}
        y={pad}
        width={markSize}
        height={markSize}
        viewBox="0 0 48 48"
        fill="none"
      >
        {/* House arch + Meem outer form */}
        <path
          d="M9 45 L9 24 C9 8 17 4 24 4 C31 4 39 8 39 24 L39 45"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#FFFFFF"
          fillOpacity="0.08"
        />
        {/* Inner ring — Meem head / keyhole */}
        <circle
          cx="24"
          cy="21"
          r="6.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
        />
        {/* Key stem — Meem body */}
        <line
          x1="24" y1="27.5"
          x2="24" y2="43"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Key tooth — Meem tail */}
        <line
          x1="24" y1="36"
          x2="28.5" y2="36"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Champagne Gold pin — luxury accent */}
        <circle cx="24" cy="21" r="2.5" fill="#E5BA73" />
      </svg>
    </svg>
  );
}
