import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/config/app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_CONFIG.nameAr} | Maqar`,
    short_name: APP_CONFIG.nameAr,
    description: "منصة العقارات العُمانية الأولى — ابحث وأعلن وتواصل",
    start_url: "/",
    display: "standalone",
    background_color: APP_CONFIG.brand.background,
    theme_color: APP_CONFIG.brand.primary,
    orientation: "portrait",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // App shortcuts — surface key actions directly from home screen long-press
    shortcuts: [
      {
        name: "البحث عن عقار",
        short_name: "البحث",
        description: "ابحث عن العقارات في عُمان",
        url: "/search",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "الخريطة",
        short_name: "الخريطة",
        description: "استعرض العقارات على الخريطة",
        url: "/map",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "أضف عقارك",
        short_name: "إضافة عقار",
        description: "انشر إعلانك العقاري مجاناً",
        url: "/add-listing",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "المفضلة",
        short_name: "المفضلة",
        description: "عقاراتك المحفوظة",
        url: "/account/favorites",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
    screenshots: [],
    categories: ["real estate", "lifestyle"],
  };
}
