"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { UserManagementCard } from "@/components/admin/UserManagementCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_ADMIN_USERS } from "@/mock/admin";
import type { AdminUser, UserStatus } from "@/types/admin";
import { USER_STATUS_AR } from "@/types/admin";

const STATUS_FILTERS: (UserStatus | "all")[] = ["all", "active", "suspended", "banned", "pending_verification"];
const STATUS_AR: Record<UserStatus | "all", string> = { all: "الكل", ...USER_STATUS_AR };

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

  return (
    <AdminDashboardShell titleAr="إدارة المستخدمين">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        <p className="text-xs text-[#627D98]">{activeCount} مستخدم نشط · {users.length} إجمالي</p>

        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الهاتف أو البريد..."
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
                {STATUS_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا يوجد مستخدمون" descriptionAr="لا توجد نتائج مطابقة للبحث أو الفلتر المحدد." />
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => (
              <UserManagementCard
                key={user.id}
                user={user}
                onSuspend={suspend}
                onReactivate={reactivate}
              />
            ))}
          </div>
        )}

        {/* TODO: replace with server action + Supabase query in Phase 12 */}
      </div>
    </AdminDashboardShell>
  );
}
