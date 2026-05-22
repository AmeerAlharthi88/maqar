import { MaqarLogo } from "@/components/brand/MaqarLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col bg-[#F8F9FA]">
      <div className="flex justify-center pt-12 pb-8">
        <MaqarLogo size="md" />
      </div>
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-sm mx-auto">{children}</div>
      </div>
    </div>
  );
}
