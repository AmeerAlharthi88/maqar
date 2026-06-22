import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AddListingShell } from "@/components/add-listing/AddListingShell";
import { AddListingHeader } from "@/components/add-listing/AddListingHeader";

export const metadata: Metadata = {
  title: "نشر إعلان عقاري | مقر",
  description: "أضف إعلانك العقاري في مقر بخطوات سهلة وسريعة — بيع، إيجار، أو استثمار.",
};

export default function AddListingPage() {
  return (
    <AppShell>
      <AddListingHeader />
      <AddListingShell />
    </AppShell>
  );
}
