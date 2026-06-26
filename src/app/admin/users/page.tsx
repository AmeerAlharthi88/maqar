"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminDemoBanner } from "@/components/admin/AdminDemoBanner";
import { UserManagementCard } from "@/components/admin/UserManagementCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_ADMIN_USERS } from "@/mock/admin";
import type { AdminUser, UserStatus } from "@/types/admin";
import { USER_STATUS_AR, USER_STATUS_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi } from "@/lib/admin/labels";

const STATUS_FILTERS: (UserStatus | "all")[] = ["all", "active", "suspended", "banned", "pending_verification"];
const STATUS_AR: Record<UserStatus | "all", string> = { all: "الكل", ...USER_STATUS_AR };
const STATUS_EN: Record<UserStatus | "all", string> = { all: "All", ...USER_STATUS_EN };

function useUserQueue() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const suspend    = (id: string) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: "suspended" as UserStatus } : u));
  const reactivate = (id: string) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: "active"    as UserStatus } : u));
  return { users, suspend, reactivate };
}

export default function AdminUsersPage() {
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [search, setSearch] = useState("");
  const { users, suspend, reactivate } = useUserQueue();

  const filtered = users
    .filter((u) => statusFilter === "all" || u.status === statusFilter)
    .filter((u) =>
      search.trim() === "" ||
      u.nameAr.includes(search) ||
      u.phone.includes(search) ||
      (u.email ?? "").includes(search)
    );

  const activeCount = users.filter((u) => u.status === "active").length;
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const statusLabels = isAr ? STATUS_AR : STATUS_EN;

  return (
    <AdminDashboardShell titleAr="إدارة المستخدمين" titleEn="Manage users">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>
        <AdminDemoBanner
          noteAr="إدارة المستخدمين قيد التطوير. البيانات والإجراءات هنا تجريبية ولا تؤثر على حسابات حقيقية."
          noteEn="User management is a work in progress. Data and actions here are demo only and do not affect real accounts."
        />
        <p className="text-xs text-[#627D98]">{bi(isAr, `${activeCount} مستخدم نشط · ${users.length} إجمالي`, `${activeCount} active · ${users.length} total`)}</p>

        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={bi(isAr, "ابحث بالاسم أو الهاتف أو البريد...", "Search by name, phone, or email...")}
          className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E8F0] bg-white text-sm text-[#102A43] placeholder:text-[#627D98] focus:outline-none focus:border-[#0A3C36]"
        />

        {/* Status filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {STATUS_FILTERS.map((f) => {
            const count = f === "all" ? users.length : users.filter((u) => u.status === f).length;
            return (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  statusFilter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
              >
                {statusLabels[f]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا يوجد مستخدمون" titleEn="No users" descriptionAr="لا توجد نتائج مطابقة للبحث أو الفلتر المحدد." descriptionEn="No results match the current search or filter." />
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => (
              <UserManagementCard
                key={user.id}
                user={user}
                onSuspend={suspend}
                onReactivate={reactivate}
                demo
              />
            ))}
          </div>
        )}

        {/* TODO: replace with server action + Supabase query in Phase 12 */}
      </div>
    </AdminDashboardShell>
  );
}
