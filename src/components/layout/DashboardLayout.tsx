import Link from "next/link";
import { MaqarLogoMark } from "@/components/brand/MaqarLogoMark";
import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { PageContainer } from "./PageContainer";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarSlot?: React.ReactNode;
}

const sidebarLinks = [
  { href: "/dashboard",           labelAr: "لوحة التحكم" },
  { href: "/dashboard/listings",  labelAr: "إعلاناتي" },
  { href: "/dashboard/messages",  labelAr: "الرسائل" },
  { href: "/dashboard/analytics", labelAr: "التحليلات" },
  { href: "/dashboard/settings",  labelAr: "الإعدادات" },
];

export function DashboardLayout({ children, sidebarSlot }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-svh bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-s border-[#E2E8F0] sticky top-0 h-svh overflow-y-auto">
        <div className="p-5 border-b border-[#E2E8F0]">
          <MaqarLogo size="sm" />
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-[#627D98] hover:bg-[#F0F4F8] hover:text-[#102A43] transition-colors"
            >
              {link.labelAr}
            </Link>
          ))}
        </nav>
        {sidebarSlot && <div className="p-3 border-t border-[#E2E8F0]">{sidebarSlot}</div>}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] h-14 flex items-center px-5 lg:hidden">
          <MaqarLogoMark size={32} />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
