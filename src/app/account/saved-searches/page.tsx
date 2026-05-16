import type { Metadata } from "next";
import { SavedSearchesView } from "@/components/account/SavedSearchesView";

export const metadata: Metadata = {
  title: "البحث المحفوظ | مقر",
};

export default function SavedSearchesPage() {
  return <SavedSearchesView />;
}
