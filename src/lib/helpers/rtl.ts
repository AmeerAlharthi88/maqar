export function getDir(locale: string): "rtl" | "ltr" {
  const rtlLocales = ["ar", "ar-OM", "ar-SA", "ar-EG", "fa", "he", "ur"];
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

export function isRTL(locale = "ar"): boolean {
  return getDir(locale) === "rtl";
}

export function rtlClass(rtlCls: string, ltrCls: string, dir: "rtl" | "ltr" = "rtl"): string {
  return dir === "rtl" ? rtlCls : ltrCls;
}

/** Returns the logical "start" side based on direction */
export function startSide(dir: "rtl" | "ltr" = "rtl"): "right" | "left" {
  return dir === "rtl" ? "right" : "left";
}

/** Returns the logical "end" side based on direction */
export function endSide(dir: "rtl" | "ltr" = "rtl"): "left" | "right" {
  return dir === "rtl" ? "left" : "right";
}
