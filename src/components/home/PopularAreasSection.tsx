import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AreaCard } from "./AreaCard";
import { ROUTES } from "@/config/routes";
import type { PopularArea } from "@/mock/popular-areas";

interface PopularAreasSectionProps {
  areas: PopularArea[];
}

export function PopularAreasSection({ areas }: PopularAreasSectionProps) {
  return (
    <section className="px-4 py-5 bg-[#FAF7F2]">
      <SectionHeader
        titleAr="أكثر المناطق طلباً"
        subtitleAr="أسعار وإحصاءات السوق لأبرز الأحياء"
        size="md"
        action={
          <Link href={ROUTES.areas} className="text-xs font-semibold text-[#C65D3B] hover:underline">
            جميع المناطق
          </Link>
        }
        className="mb-4"
      />

      {/* Horizontal scroll on mobile, 2-col grid on tablet+ */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:mx-0 sm:px-0">
        {areas.map((area) => (
          <div key={area.id} className="flex-shrink-0 w-[220px] sm:w-auto">
            <AreaCard area={area} />
          </div>
        ))}
      </div>
    </section>
  );
}
