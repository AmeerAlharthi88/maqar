"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body style={{ background: "#F8F9FA", margin: 0, fontFamily: "system-ui, Arial, sans-serif" }}>
        <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#102A43", marginBottom: "8px" }}>
            خطأ غير متوقع
          </h1>
          <p style={{ fontSize: "14px", color: "#627D98", marginBottom: "24px" }}>
            تعذّر تحميل التطبيق. يرجى تحديث الصفحة.
          </p>
          <button
            onClick={reset}
            style={{ padding: "12px 24px", borderRadius: "12px", background: "#0A3C36", color: "white", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
          >
            إعادة تحميل
          </button>
        </div>
      </body>
    </html>
  );
}
