// AppIconMark — rounded app-icon tile using the official Maqar mark (PNG asset)
// Used for: home-screen shortcut, splash screens, og-image fallback.
//
// Renders the white+gold mark centred on a Deep Emerald rounded square so it
// stays legible on dark surfaces. The mark artwork is 467×512 (≈0.912 aspect).

const MARK_ASPECT = 467 / 512;

interface AppIconMarkProps {
  size?: number;
  className?: string;
}

export function AppIconMark({ size = 60, className = "" }: AppIconMarkProps) {
  const pad = Math.round(size * 0.17); // ~17% padding each side
  const markH = size - pad * 2;
  const markW = Math.round(markH * MARK_ASPECT);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.233),
        background: "#0A3C36",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-label="مقر"
      role="img"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/maqar-mark-white-gold.png"
        alt="مقر"
        width={markW}
        height={markH}
        style={{ width: markW, height: markH, objectFit: "contain", display: "block" }}
        draggable={false}
      />
    </div>
  );
}
