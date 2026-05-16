import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

export default function MyListingsPage() {
  return (
    <AppShell>
      <AppHeader variant="back" titleAr="إعلاناتي" />
      <PlaceholderPage titleAr="إعلاناتي" descriptionAr="قائمة العقارات التي أعلنت عنها مع حالة كل إعلان." />
    </AppShell>
  );
}
