import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/routes";

// Maps a listing status to an Arabic badge label + colour.
const STATUS_META: Record<string, { ar: string; cls: string }> = {
  active:         { ar: "نشط",          cls: "bg-[#E6F0EF] text-[#0A3C36]" },
  approved:       { ar: "مقبول",        cls: "bg-[#E6F0EF] text-[#0A3C36]" },
  pending_review: { ar: "قيد المراجعة", cls: "bg-[#FFF8E7] text-[#C8860A]" },
  pending:        { ar: "قيد المراجعة", cls: "bg-[#FFF8E7] text-[#C8860A]" },
  needs_changes:  { ar: "يحتاج تعديل",  cls: "bg-[#F3EAFB] text-[#7C3AED]" },
  rejected:       { ar: "مرفوض",        cls: "bg-[#FEF0EE] text-[#C0392B]" },
  draft:          { ar: "مسودة",        cls: "bg-[#F0F4F8] text-[#627D98]" },
};

interface MyListingRow {
  id: string;
  title_ar: string | null;
  price_omr: number | null;
  purpose: string | null;
  status: string | null;
  created_at: string | null;
}

function Notice({ titleAr, descAr }: { titleAr: string; descAr: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F0F4F8] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
      </div>
      <p className="text-sm font-bold text-[#102A43] mb-1">{titleAr}</p>
      <p className="text-xs text-[#627D98] max-w-xs leading-relaxed">{descAr}</p>
    </div>
  );
}

export default async function MyListingsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let rows: MyListingRow[] = [];
  let loadError = false;
  if (user) {
    // RLS lets an owner read their own listings in any status.
    const { data, error } = await supabase
      .from("listings")
      .select("id, title_ar, price_omr, purpose, status, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    if (error) loadError = true;
    else rows = (data ?? []) as MyListingRow[];
  }

  return (
    <AppShell>
      <AppHeader variant="back" titleAr="إعلاناتي" />
      <div className="px-4 py-4 space-y-3" dir="rtl">
        {!user ? (
          <Notice titleAr="سجّل الدخول لعرض إعلاناتك" descAr="يجب تسجيل الدخول لعرض قائمة إعلاناتك وحالاتها." />
        ) : loadError ? (
          <Notice titleAr="تعذّر تحميل إعلاناتك" descAr="حدث خطأ أثناء تحميل إعلاناتك. يرجى المحاولة مرة أخرى لاحقاً." />
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F0F4F8] flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
            <p className="text-sm font-bold text-[#102A43] mb-1">لا توجد إعلانات بعد</p>
            <p className="text-xs text-[#627D98] max-w-xs leading-relaxed mb-4">
              ابدأ بإضافة إعلانك الأول وسيظهر هنا مع حالته بعد الإرسال للمراجعة.
            </p>
            <Link href={ROUTES.addListing} className="px-4 py-2.5 rounded-xl bg-[#0A3C36] text-white text-xs font-bold">
              أضف إعلاناً جديداً
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#627D98]">{rows.length} إعلان</p>
            {rows.map((r) => {
              const meta = STATUS_META[r.status ?? "draft"] ?? STATUS_META.draft;
              const price = (r.price_omr ?? 0).toLocaleString("en-US");
              const priceLabel = r.purpose === "rent" ? `${price} ر.ع/شهر` : `${price} ر.ع`;
              return (
                <Link
                  key={r.id}
                  href={`/listing/${r.id}`}
                  className="block bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 hover:border-[#0A3C36]/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#102A43] flex-1 min-w-0">{r.title_ar || "—"}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.cls}`}>
                      {meta.ar}
                    </span>
                  </div>
                  <p className="text-xs text-[#0A3C36] font-semibold mt-1">{priceLabel}</p>
                  {r.created_at && (
                    <p className="text-[10px] text-[#627D98] mt-0.5">
                      {new Date(r.created_at).toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </Link>
              );
            })}
          </>
        )}
      </div>
    </AppShell>
  );
}
