import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { MapPageClient } from "@/components/map/MapPageClient";

export const metadata: Metadata = {
  title: "خريطة العقارات",
  description: "ابحث عن العقارات على الخريطة التفاعلية في عُمان",
};

export default function MapPage() {
  return (
    <AppShell>
      <MapPageClient />
    </AppShell>
  );
}
