import { AppShell } from "@/components/layout/AppShell";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata = {
  title: "البحث عن عقار",
  description: "ابحث في آلاف العقارات في سلطنة عُمان — شقق وفلل وأراضي للبيع والإيجار",
};

export default function SearchPage() {
  return (
    <AppShell>
      <SearchPageClient />
    </AppShell>
  );
}
