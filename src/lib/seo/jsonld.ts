// ── JSON-LD Structured Data Helpers — Phase 16 ───────────────────────────────
// Generates schema.org JSON-LD for rich search results.
// All schemas use Arabic primary content.
//
// IMPORTANT:
//   - Do not include fake ratings, reviews, or awards.
//   - Market estimate data is clearly labeled as estimated/mock.
//   - Use only data you actually have — partial schemas are better than inflated ones.
// ─────────────────────────────────────────────────────────────────────────────

import { APP_CONFIG } from "@/config/app";

const BASE_URL = APP_CONFIG.url;

// ── Organization ─────────────────────────────────────────────────────────────
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Maqar | مقر",
    alternateName: "مقر",
    url: BASE_URL,
    logo: `${BASE_URL}/icons/icon-512.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: APP_CONFIG.supportPhone,
      email: APP_CONFIG.supportEmail,
      contactType: "customer support",
      availableLanguage: ["Arabic", "English"],
      areaServed: "OM",
    },
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressCountry: "OM",
      addressRegion: "Muscat",
    },
  };
}

// ── WebSite (enables Sitelinks Searchbox) ────────────────────────────────────
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "مقر | Maqar",
    url: BASE_URL,
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ── SoftwareApplication (PWA) ─────────────────────────────────────────────────
export function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "مقر | Maqar",
    operatingSystem: "Android, iOS, Web",
    applicationCategory: "RealEstateApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "OMR",
    },
    inLanguage: "ar",
  };
}

// ── BreadcrumbList ────────────────────────────────────────────────────────────
export interface BreadcrumbItem {
  nameAr: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.nameAr,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}

// ── FAQPage ───────────────────────────────────────────────────────────────────
export interface FAQItem {
  q: string;
  a: string;
}

export function faqJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

// ── RealEstateAgent ───────────────────────────────────────────────────────────
export function agentJsonLd(agent: {
  nameAr: string;
  nameEn?: string;
  id: string;
  phone?: string;
  areasAr: string[];
  isVerified: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.nameAr,
    alternateName: agent.nameEn,
    url: `${BASE_URL}/agents/${agent.id}`,
    telephone: agent.phone,
    areaServed: agent.areasAr,
    knowsAbout: ["عقارات عمان", "بيع وإيجار العقارات"],
    hasCredential: agent.isVerified ? "موثق من مقر" : undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: "OM",
    },
  };
}

// ── LocalBusiness (Agency) ────────────────────────────────────────────────────
export function agencyJsonLd(agency: {
  nameAr: string;
  nameEn?: string;
  id: string;
  phone?: string;
  email?: string;
  website?: string;
  descriptionAr: string;
  wilayatAr?: string;
  governorateAr?: string;
  isVerified: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agency.nameAr,
    alternateName: agency.nameEn,
    url: `${BASE_URL}/agencies/${agency.id}`,
    telephone: agency.phone,
    email: agency.email,
    sameAs: agency.website ? [agency.website] : [],
    description: agency.descriptionAr,
    hasCredential: agency.isVerified ? "موثق من مقر" : undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: "OM",
      addressRegion: agency.governorateAr,
      addressLocality: agency.wilayatAr,
    },
  };
}

// ── RealEstateListing (Accommodation) ────────────────────────────────────────
export function listingJsonLd(listing: {
  id: string;
  titleAr: string;
  descriptionAr: string;
  price: number;
  purpose: "sale" | "rent";
  coverImage?: string;
  areaAr: string;
  wilayatAr: string;
  governorateAr: string;
  bedrooms?: number;
  area?: number;
}) {
  const purposeLabel = listing.purpose === "sale" ? "للبيع" : "للإيجار";
  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: `${listing.titleAr} — ${purposeLabel}`,
    description: listing.descriptionAr.slice(0, 300),
    url: `${BASE_URL}/listing/${listing.id}`,
    image: listing.coverImage,
    numberOfRooms: listing.bedrooms,
    floorSize: listing.area
      ? {
          "@type": "QuantitativeValue",
          value: listing.area,
          unitCode: "MTK",
        }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: "OM",
      addressRegion: listing.governorateAr,
      addressLocality: listing.wilayatAr,
      streetAddress: listing.areaAr,
    },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "OMR",
      availability: "https://schema.org/InStock",
    },
  };
}

// ── Area/LocalBusiness ────────────────────────────────────────────────────────
export function areaJsonLd(area: {
  nameAr: string;
  nameEn: string;
  slug: string;
  governorateAr: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: area.nameAr,
    alternateName: area.nameEn,
    url: `${BASE_URL}/areas/${area.slug}`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "OM",
      addressRegion: area.governorateAr,
      addressLocality: area.nameAr,
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: area.governorateAr,
    },
  };
}

/**
 * Serialize any JSON-LD object to a <script> tag string.
 * Use as: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data);
}
