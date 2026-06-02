// MaqarLogoMark — official Maqar brand mark (PNG asset)
//
// Renders the approved mark image (house structure + gold right extension +
// Arabic Meem/key center). Two tonal assets are available:
//   · /brand/maqar-mark.png            — full colour, for light backgrounds
//   · /brand/maqar-mark-white-gold.png — white + gold, for dark/emerald bgs
//
// The source artwork is 467×512 (≈ 0.912 aspect). The `size` prop sets the
// rendered HEIGHT in px; width is auto-proportioned so the mark never distorts.
//
// NOTE: this is an image asset, not inline SVG — the previous stroked SVG
// redraw was rejected for not matching the approved brand identity. The
// `primary` prop is now only a tone hint (light → white/gold asset); the PNG
// itself is never recoloured.

const MARK_ASPECT = 467 / 512;

interface MaqarLogoMarkProps {
  /** Rendered height in px. Width is auto-proportioned (467:512). */
  size?: number;
  /** Tone hint. A white/light value selects the white+gold asset for dark
   *  backgrounds. Any other value (default emerald) selects the colour asset. */
  primary?: string;
  /** Retained for API compatibility with callers; the PNG is not recoloured. */
  accent?: string;
  className?: string;
}

function isLightTone(color?: string): boolean {
  if (!color) return false;
  const c = color.toLowerCase().replace(/\s+/g, "");
  return (
    c === "#fff" ||
    c === "#ffffff" ||
    c === "white" ||
    c === "rgb(255,255,255)" ||
    c.startsWith("rgba(255,255,255")
  );
}

export function MaqarLogoMark({
  size = 40,
  primary = "#0A3C36",
  className = "",
}: MaqarLogoMarkProps) {
  const src = isLightTone(primary)
    ? "/brand/maqar-mark-white-gold.png"
    : "/brand/maqar-mark.png";

  const height = size;
  const width = Math.round(size * MARK_ASPECT);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="مقر"
      width={width}
      height={height}
      className={className}
      style={{ width, height, objectFit: "contain", display: "block" }}
      draggable={false}
    />
  );
}
