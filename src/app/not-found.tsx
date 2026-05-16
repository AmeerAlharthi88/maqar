import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center bg-[#FAF7F2]">
      <p className="text-7xl font-bold text-[#C65D3B] mb-4">٤٠٤</p>
      <h1 className="text-xl font-bold text-[#1E1E1E] mb-2">الصفحة غير موجودة</h1>
      <p className="text-sm text-[#7A6B5E] mb-8">
        الرابط الذي تبحث عنه غير موجود أو تم نقله.
      </p>
      <Link
        href={ROUTES.home}
        className="px-6 py-3 rounded-xl bg-[#C65D3B] text-white text-sm font-semibold"
      >
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
