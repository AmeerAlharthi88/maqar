import type { Metadata } from "next";
import { OffersView } from "@/components/account/OffersView";

export const metadata: Metadata = {
  title: "عروضي | مقر",
};

export default function OffersPage() {
  return <OffersView />;
}
