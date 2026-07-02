// ── Card image quality guard (FP17F-2) ──────────────────────────────────────
// Some seeded listings have cover images that are NOT real property photos and
// cannot be detected programmatically (a photographed "Success" app screenshot,
// a watermarked "@architecture999" 3D render, a shop photo of caps). Until the
// owners upload proper photos, we suppress these specific covers on cards so a
// buyer never sees a debug/watermarked/irrelevant image — the branded
// "Image not available" placeholder shows instead. This is a temporary
// data-quality stopgap: remove an id once its image is replaced.
//
// Broken/blank images (e.g. tiny 284-byte JPEGs) are handled generically by
// PropertyImage's load-size check, so they are NOT listed here.
export const KNOWN_BAD_COVER_LISTING_IDS: ReadonlySet<string> = new Set<string>([
  "efffd39c-9c95-41fa-9475-fb09d94f647d", // land · photographed "Success / Succeed submitting the case" screenshot
  "b307d3fe-8d07-4d08-947a-9ac17cfceabd", // villa · watermarked 3D render "@architecture999" (+ "3/3" overlay)
  "6990ad4e-20c4-4c1a-8bba-b68593fd3536", // apartment · photo of caps in a shop (not the property)
]);

/** True when a listing's cover image is a known non-property image that should
 *  be replaced by the branded placeholder on cards (FP17F-2). */
export function isKnownBadCoverListing(id: string): boolean {
  return KNOWN_BAD_COVER_LISTING_IDS.has(id);
}
