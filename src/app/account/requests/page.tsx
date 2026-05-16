import type { Metadata } from "next";
import { RequestsView } from "@/components/account/RequestsView";

export const metadata: Metadata = {
  title: "طلباتي | مقر",
};

export default function RequestsPage() {
  return <RequestsView />;
}
