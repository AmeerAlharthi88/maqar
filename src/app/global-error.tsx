"use client";

import { useEffect, useState } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error renders its own <html> shell — Zustand stores are available
// but we can't use React context safely at this level.
// We read the persisted locale directly from localStorage via a lazy initializer
// (avoids setState-in-effect; try/catch covers SSR where localStorage is absent).
function usePersistedLocale(): "ar" | "en" {
  const [locale] = useState<"ar" | "en">(() => {
    try {
      const stored = localStorage.getItem("maqar-locale");
      if (stored) {
        const parsed = JSON.parse(stored) as { state?: { locale?: string } };
        if (parsed?.state?.locale === "en") return "en";
      }
    } catch {
      // ignore — localStorage unavailable (SSR) or JSON parse failure
    }
    return "ar";
  });
  return locale;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const locale = usePersistedLocale();
  const isAr = locale === "ar";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale} dir={isAr ? "rtl" : "ltr"}>
      <body style={{ background: "#F8F9FA", margin: 0, fontFamily: "system-ui, Arial, sans-serif" }}>
        <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#102A43", marginBottom: "8px" }}>
            {isAr ? "خطأ غير متوقع" : "Unexpected Error"}
          </h1>
          <p style={{ fontSize: "14px", color: "#627D98", marginBottom: "24px" }}>
            {isAr ? "تعذّر تحميل التطبيق. يرجى تحديث الصفحة." : "Failed to load the app. Please refresh the page."}
          </p>
          <button
            onClick={reset}
            style={{ padding: "12px 24px", borderRadius: "12px", background: "#0A3C36", color: "white", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
          >
            {isAr ? "إعادة تحميل" : "Reload"}
          </button>
        </div>
      </body>
    </html>
  );
}
