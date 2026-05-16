// ── SEO Metadata Helpers — Phase 16 ──────────────────────────────────────────
// Provides consistent Arabic-first metadata patterns across all pages.
// All pages default to Arabic with English secondary.
//
// Usage:
//   export const metadata = buildMetadata({ titleAr: "...", descriptionAr: "..." });
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { APP_CONFIG } from "@/config/app";

const BASE_URL = APP_CONFIG.url;
const SITE_NAME = `${APP_CONFIG.nameAr} | Maqar`;
const DEFAULT_DESCRIPTION =
  "مقر هو تطبيق عقاري عُماني يساعدك على البحث عن العقارات، مقارنة الأسعار، التواصل مع الوسطاء الموثقين، وتحليل السوق العقاري في عُمان.";
const DEFAULT_OG_IMAGE = "/og/default.svg"; // Replace with a real OG PNG image before launch

export interface BuildMetadataOptions {
  titleAr: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  path?: string; // relative path like "/areas/al-qurm"
  ogImagePath?: string;
  noIndex?: boolean;
  /** For paginated or filtered pages */
  canonical?: string;
  keywords?: string[];
}

/**
 * Build a full Next.js Metadata object with Arabic-first content.
 * OG and Twitter cards default to the same Arabic content.
 */
export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const {
    titleAr,
    titleEn,
    descriptionAr = DEFAULT_DESCRIPTION,
    path = "",
    ogImagePath = DEFAULT_OG_IMAGE,
    noIndex = false,
    canonical,
    keywords = [],
  } = opts;

  const pageTitle = `${titleAr} | ${APP_CONFIG.nameAr}`;
  const canonicalUrl = canonical ?? `${BASE_URL}${path}`;
  const ogImage = ogImagePath.startsWith("http") ? ogImagePath : `${BASE_URL}${ogImagePath}`;

  return {
    title: pageTitle,
    description: descriptionAr,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: canonicalUrl,
        ...(titleEn ? { en: canonicalUrl } : {}),
      },
    },
    openGraph: {
      title: pageTitle,
      description: descriptionAr,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "ar_OM",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: titleAr,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: descriptionAr,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Build metadata for a listing detail page.
 */
export function buildListingMetadata(opts: {
  titleAr: string;
  descriptionAr: string;
  price: number;
  purposeAr: string;
  areaAr: string;
  id: string;
  coverImage?: string;
}): Metadata {
  const { titleAr, descriptionAr, price, purposeAr, areaAr, id, coverImage } = opts;
  const desc = `${titleAr} ${purposeAr} في ${areaAr} — ${price.toLocaleString("ar")} ر.ع. ${descriptionAr.slice(0, 100)}`;
  return buildMetadata({
    titleAr: `${titleAr} | ${purposeAr}`,
    descriptionAr: desc,
    path: `/listing/${id}`,
    ogImagePath: coverImage ?? DEFAULT_OG_IMAGE,
    keywords: [titleAr, areaAr, "عقارات عمان", purposeAr],
  });
}

/**
 * Build metadata for an area guide page.
 */
export function buildAreaMetadata(opts: {
  nameAr: string;
  nameEn: string;
  governorateAr: string;
  slug: string;
  avgSalePrice: number;
  avgRentPrice: number;
}): Metadata {
  const { nameAr, governorateAr, slug, avgSalePrice, avgRentPrice } = opts;
  return buildMetadata({
    titleAr: `عقارات ${nameAr} — أسعار ومعلومات الحي`,
    descriptionAr: `دليل شامل للعقارات في ${nameAr}، ${governorateAr}. متوسط سعر البيع ${avgSalePrice.toLocaleString("ar")} ر.ع.، متوسط الإيجار ${avgRentPrice.toLocaleString("ar")} ر.ع./شهر. اطلع على تحليلات السوق والعقارات المتاحة.`,
    path: `/areas/${slug}`,
    keywords: [`عقارات ${nameAr}`, `شقق ${nameAr}`, `فيلا ${nameAr}`, "عقارات عمان", governorateAr],
  });
}

/**
 * Build metadata for an agent profile page.
 */
export function buildAgentMetadata(opts: {
  nameAr: string;
  id: string;
  areasAr: string[];
}): Metadata {
  const { nameAr, id, areasAr } = opts;
  return buildMetadata({
    titleAr: `${nameAr} — وسيط عقاري موثق`,
    descriptionAr: `ملف الوسيط العقاري ${nameAr} في مقر. متخصص في: ${areasAr.slice(0, 3).join("، ")}. تواصل مباشرة عبر واتساب.`,
    path: `/agents/${id}`,
    keywords: [nameAr, "وسيط عقاري عمان", ...areasAr.slice(0, 2)],
  });
}

/**
 * Build metadata for an agency profile page.
 */
export function buildAgencyMetadata(opts: {
  nameAr: string;
  id: string;
  descriptionAr: string;
}): Metadata {
  const { nameAr, id, descriptionAr } = opts;
  return buildMetadata({
    titleAr: `${nameAr} — وكالة عقارية موثقة`,
    descriptionAr: descriptionAr.slice(0, 160),
    path: `/agencies/${id}`,
    keywords: [nameAr, "وكالة عقارية عمان", "مكتب عقارات عمان"],
  });
}

/** Private/auth routes — force noindex */
export const PRIVATE_METADATA: Metadata = {
  robots: { index: false, follow: false },
};

export { DEFAULT_DESCRIPTION, BASE_URL, SITE_NAME };
