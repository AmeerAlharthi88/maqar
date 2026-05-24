import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AddListingShell } from "@/components/add-listing/AddListingShell";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `تعديل المسودة ${id} | مقر`,
  };
}

export default async function EditDraftPage({ params }: Props) {
  const { id } = await params;

  return (
    <AppShell>
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3" dir="rtl">
        <div className="w-8 h-8 rounded-xl bg-[#F0F4F8] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-[#102A43]">متابعة المسودة</h1>
          <p className="text-xs text-[#627D98]">المسودة: {id}</p>
        </div>
      </div>
      {/*
        Draft loading: The AddListingShell reads from persisted Zustand store.
        In a future Supabase integration, this page would fetch the draft by id,
        hydrate the store, then render AddListingShell.
        For now, the locally persisted draft is loaded automatically.
      */}
      <AddListingShell />
    </AppShell>
  );
}
