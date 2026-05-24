import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center bg-[#F8F9FA]">
      <p className="text-7xl font-bold text-[#0A3C36] mb-4">٤٠٤</p>
      <h1 className="text-xl font-bold text-[#102A43] mb-2">الصفحة غير موجودة</h1>
      <p className="text-sm text-[#627D98] mb-8">
        الرابط الذي تبحث عنه غير موجود أو تم نقله.
      </p>
      <Link
        href={ROUTES.home}
        className="px-6 py-3 rounded-xl bg-[#0A3C36] text-white text-sm font-semibold"
      >
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
