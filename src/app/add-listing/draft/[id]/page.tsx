import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AddListingShell } from "@/components/add-listing/AddListingShell";
import { AddListingHeader } from "@/components/add-listing/AddListingHeader";

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
      <AddListingHeader draftId={id} />
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
