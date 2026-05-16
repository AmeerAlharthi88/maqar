import type { Metadata } from "next";
import { AccountSettings } from "@/components/account/AccountSettings";

export const metadata: Metadata = {
  title: "الإعدادات | مقر",
};

export default function SettingsPage() {
  return <AccountSettings />;
}
