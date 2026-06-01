// AppIconMark — rounded app icon using the approved house+Meem+key mark
// Used in: home screen shortcut, splash screens, og-image fallback
// Emerald bg + white house/meem + gold right extension and key teeth

interface AppIconMarkProps {
  size?: number;
  className?: string;
}

export function AppIconMark({ size = 60, className = "" }: AppIconMarkProps) {
  // The mark uses a 44×50 viewBox (4:5 ratio).
  // We embed it centred inside the square icon with ~15% padding on each side.
  const pad  = Math.round(size * 0.15);
  const markH = size - pad * 2;           // mark height
  const markW = Math.round(markH * 44 / 50); // mark width (4:5 proportioned)
  const markX = Math.round((size - markW) / 2); // centre horizontally
  const markY = pad;

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
      <rect width={size} height={size} rx={Math.round(size * 0.233)} fill="#0A3C36" />

      {/*
        Mark group — centred inside the icon.
        Nested <svg> with 44×50 viewBox so path coordinates are identical
        to MaqarLogoMark, just recoloured for emerald bg.
      */}
      <svg
        x={markX}
        y={markY}
        width={markW}
        height={markH}
        viewBox="0 0 44 50"
        fill="none"
      >
        {/* House outer left (white on emerald bg) */}
        <path
          d="M 2,48 L 2,19 L 22,2 L 34,12 L 34,19"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* House right extension (Champagne Gold) */}
        <path
          d="M 34,19 L 42,19 L 42,48"
          stroke="#E5BA73"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Meem arc loop (white) */}
        <path
          d="M 10,48 L 10,29 A 6,6 0 0,1 22,29 L 22,41"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Key teeth (Champagne Gold) */}
        <line x1="22" y1="36" x2="27" y2="36" stroke="#E5BA73" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="22" y1="41" x2="27" y2="41" stroke="#E5BA73" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </svg>
  );
}
