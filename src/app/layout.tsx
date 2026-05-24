import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import { APP_CONFIG } from "@/config/app";
import "./globals.css";

// Primary Arabic/Latin typeface — Maqar brand identity
// Alexandria: modern, premium, supports Arabic + Latin subsets
const alexandriaFont = Alexandria({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Fallback Arabic typeface — used when Alexandria is unavailable
const arabicFallbackFont = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic-fallback",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.nameAr} | Maqar`,
    template: `%s | ${APP_CONFIG.nameAr}`,
  },
  description: "منصة العقارات العُمانية الأولى — ابحث وأعلن وتواصل",
  applicationName: APP_CONFIG.nameAr,
  keywords: ["عقارات عمان", "شقق للبيع", "فيلات للإيجار", "مسقط", "Oman real estate"],
  authors: [{ name: "Maqar" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_CONFIG.nameAr,
  },
  formatDetection: { telephone: true, email: false, address: false },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: APP_CONFIG.brand.primary,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${alexandriaFont.variable} ${arabicFallbackFont.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="min-h-full antialiased"
        style={{ background: "var(--color-background)", color: "var(--color-foreground)" }}
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
