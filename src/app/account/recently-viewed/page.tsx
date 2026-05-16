import type { Metadata } from "next";
import { RecentlyViewedView } from "@/components/account/RecentlyViewedView";

export const metadata: Metadata = {
  title: "المشاهدة مؤخراً | مقر",
};

export default function RecentlyViewedPage() {
  return <RecentlyViewedView />;
}
