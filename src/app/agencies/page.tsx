import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { AgencyDirectoryCard } from "@/components/agency/AgencyDirectoryCard";
import { MOCK_AGENCIES } from "@/mock/agencies";

export default function AgenciesPage() {
  return (
    <AppShell>
      <AppHeader variant="back" titleAr="شركات العقارات" />
      <div className="px-4 py-4 space-y-3" dir="rtl">
        {/* Summary bar */}
        <p className="text-xs text-[#627D98]">
          {MOCK_AGENCIES.length} شركة مرخّصة في سلطنة عُمان
        </p>

        {/* Agency cards */}
        {MOCK_AGENCIES.map((agency) => (
          <AgencyDirectoryCard key={agency.id} agency={agency} />
        ))}

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#627D98] pb-2">
          جميع البيانات تجريبية — سيتم ربطها بقاعدة البيانات في المرحلة القادمة
        </p>
      </div>
    </AppShell>
  );
}
