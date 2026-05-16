// ── Social Sharing Helpers — Phase 16 ────────────────────────────────────────
// Generates platform-agnostic share URLs and Arabic share text.
// Use with the Web Share API (navigator.share) or fallback links.
// ─────────────────────────────────────────────────────────────────────────────

import { APP_CONFIG } from "@/config/app";

const BASE_URL = APP_CONFIG.url;

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Share text for a property listing.
 */
export function buildListingShareText(opts: {
  titleAr: string;
  price: number;
  purposeAr: string;
  areaAr: string;
  id: string;
}): ShareData {
  const { titleAr, price, purposeAr, areaAr, id } = opts;
  const url = `${BASE_URL}/listing/${id}`;
  return {
    title: `${titleAr} | مقر`,
    text: `${titleAr} ${purposeAr} في ${areaAr} — ${price.toLocaleString("ar")} ر.ع.\n${url}`,
    url,
  };
}

/**
 * Share text for an area guide page.
 */
export function buildAreaShareText(opts: {
  nameAr: string;
  governorateAr: string;
  slug: string;
}): ShareData {
  const { nameAr, governorateAr, slug } = opts;
  const url = `${BASE_URL}/areas/${slug}`;
  return {
    title: `دليل ${nameAr} العقاري | مقر`,
    text: `اكتشف أسعار العقارات والعيش في ${nameAr}، ${governorateAr} على منصة مقر.\n${url}`,
    url,
  };
}

/**
 * Generic Arabic share text.
 */
export function buildGenericShareText(opts: {
  titleAr: string;
  path: string;
}): ShareData {
  const url = `${BASE_URL}${opts.path}`;
  return {
    title: `${opts.titleAr} | مقر`,
    text: `${opts.titleAr} — منصة العقارات العُمانية مقر.\n${url}`,
    url,
  };
}

/**
 * WhatsApp deep link for sharing.
 * On mobile, opens WhatsApp directly. On desktop, opens web.whatsapp.com.
 */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Twitter/X share URL.
 */
export function twitterShareUrl(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}
