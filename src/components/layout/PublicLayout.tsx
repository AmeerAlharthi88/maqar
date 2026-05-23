import Link from "next/link";
import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { PageContainer } from "./PageContainer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-svh">
      <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <PageContainer>
          <div className="flex items-center justify-between h-16">
            <Link href="/" aria-label="مقر – الصفحة الرئيسية">
              <MaqarLogo size="md" />
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#627D98]">
              <Link href="/search" className="hover:text-[#0A3C36] transition-colors">البحث</Link>
              <Link href="/agents" className="hover:text-[#0A3C36] transition-colors">الوكلاء</Link>
              <Link href="/market" className="hover:text-[#0A3C36] transition-colors">السوق</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#102A43] px-4 h-9 rounded-lg hover:bg-[#F0F4F8] transition-colors"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-[#0A3C36] px-4 h-9 rounded-lg hover:bg-[#082E29] transition-colors flex items-center"
              >
                تسجيل
              </Link>
            </div>
          </div>
        </PageContainer>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#102A43] text-white py-10 mt-auto">
        <PageContainer>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <MaqarLogo size="sm" color="white" />
            <p className="text-xs text-[#627D98]">
              © {new Date().getFullYear()} مقر — جميع الحقوق محفوظة
            </p>
            <p className="text-xs text-[#627D98]">مقرك يبدأ هنا</p>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
