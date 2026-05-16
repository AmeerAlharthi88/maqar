import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

function CTACard({
  href,
  titleAr,
  descriptionAr,
  accentColor,
  icon,
}: {
  href: string;
  titleAr: string;
  descriptionAr: string;
  accentColor: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex-1 flex flex-col gap-3 p-4 rounded-2xl border border-[#F0EBE3] bg-white",
        "shadow-[0_2px_8px_0_rgb(30_30_30/0.06)] hover:shadow-[0_6px_20px_0_rgb(30_30_30/0.10)]",
        "transition-shadow duration-200"
      )}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: accentColor + "1A", color: accentColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-[#1E1E1E]">{titleAr}</p>
        <p className="text-xs text-[#7A6B5E] mt-0.5 leading-relaxed">{descriptionAr}</p>
      </div>
      <span className="text-xs font-semibold" style={{ color: accentColor }}>
        ابدأ الآن ←
      </span>
    </Link>
  );
}

export function HomeCTABanner() {
  return (
    <section className="px-4 py-5">
      <div className="flex gap-3">
        <CTACard
          href={ROUTES.addListing}
          titleAr="أضف عقارك"
          descriptionAr="انشر إعلانك وتواصل مع المشترين مباشرة"
          accentColor="#C65D3B"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          }
        />
        <CTACard
          href={ROUTES.map}
          titleAr="تصفح الخريطة"
          descriptionAr="استكشف العقارات على خريطة تفاعلية"
          accentColor="#5B8C5A"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          }
        />
      </div>
    </section>
  );
}
