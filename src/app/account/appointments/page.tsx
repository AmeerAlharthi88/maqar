import type { Metadata } from "next";
import { AppointmentsView } from "@/components/account/AppointmentsView";

export const metadata: Metadata = {
  title: "مواعيدي | مقر",
};

export default function AppointmentsPage() {
  return <AppointmentsView />;
}
