"use client";

import { BrandLoader } from "@/components/brand/BrandLoader";
import { useLocaleStore } from "@/store/locale.store";

// Route-transition loader for admin pages. Shows a meaningful, bilingual message
// instead of a bare/blank spinner while the admin route streams in (FP6 #6).
export default function AdminLoading() {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  return (
    <BrandLoader message={isAr ? "جاري تحميل لوحة الإدارة..." : "Loading admin dashboard..."} />
  );
}
