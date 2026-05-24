"use client";

// ── Sync Center — Phase 15 ────────────────────────────────────────────────────
// Shows the offline action queue: pending, syncing, synced, and failed items.
// Users can retry failed items or clear synced ones.
// ─────────────────────────────────────────────────────────────────────────────

import { AppShell } from "@/components/layout/AppShell";
import { ConnectionStatusIndicator } from "@/components/pwa/ConnectionStatusIndicator";
import { useOfflineStore, type QueuedAction, type QueuedActionStatus } from "@/store/offline.store";

const ACTION_LABEL_AR: Record<string, string> = {
  favorite_toggle: "إضافة إلى المفضلة",
  remove_favorite: "إزالة من المفضلة",
  contact_request: "طلب تواصل",
  contact_intent: "نية تواصل (محفوظة)",
  appointment_request: "طلب معاينة",
  save_search: "حفظ بحث",
  add_listing_draft_save: "حفظ مسودة إعلان",
  recently_viewed: "عقار تم مشاهدته",
};

const STATUS_CONFIG: Record<
  QueuedActionStatus,
  { labelAr: string; colorClass: string; bgClass: string }
> = {
  pending: {
    labelAr: "في الانتظار",
    colorClass: "text-[#C8860A]",
    bgClass: "bg-[#FEF9EC]",
  },
  syncing: {
    labelAr: "جارٍ المزامنة",
    colorClass: "text-[#2471A3]",
    bgClass: "bg-[#EAF4FB]",
  },
  synced: {
    labelAr: "تمت المزامنة",
    colorClass: "text-[#0A3C36]",
    bgClass: "bg-[#E6F0EF]",
  },
  failed: {
    labelAr: "فشل",
    colorClass: "text-[#C0392B]",
    bgClass: "bg-[#FEF0EE]",
  },
};

function QueuedActionCard({ action }: { action: QueuedAction }) {
  const { dequeue } = useOfflineStore();
  const cfg = STATUS_CONFIG[action.status];
  const labelAr = action.labelAr ?? ACTION_LABEL_AR[action.type] ?? action.type;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-[#102A43]">{labelAr}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bgClass} ${cfg.colorClass}`}>
          {cfg.labelAr}
        </span>
      </div>

      <p className="text-[10px] text-[#627D98] mb-2">
        {new Date(action.createdAt).toLocaleString("ar-OM", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
        {action.retries > 0 && ` · ${action.retries} محاولة`}
      </p>

      {(action.status === "synced" || action.status === "failed") && (
        <button
          onClick={() => dequeue(action.id)}
          className="text-[11px] text-[#627D98] underline underline-offset-2"
          aria-label="حذف هذا الإجراء من القائمة"
        >
          حذف
        </button>
      )}
    </div>
  );
}

export default function SyncCenterPage() {
  const { queue, isOnline, clearSynced, clearQueue } = useOfflineStore();

  const pending = queue.filter((a) => a.status === "pending");
  const syncing = queue.filter((a) => a.status === "syncing");
  const synced = queue.filter((a) => a.status === "synced");
  const failed = queue.filter((a) => a.status === "failed");

  const totalActive = pending.length + syncing.length;

  return (
    <AppShell>
      <div className="px-4 py-6 space-y-5 max-w-lg mx-auto" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#102A43]">مركز المزامنة</h1>
            <p className="text-sm text-[#627D98]">
              الإجراءات المحفوظة أثناء عدم الاتصال
            </p>
          </div>
          <ConnectionStatusIndicator showOnlineLabel />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#FEF9EC] rounded-2xl px-3 py-3 text-center">
            <p className="text-xl font-bold text-[#C8860A]">{totalActive}</p>
            <p className="text-[10px] text-[#C8860A]">في الانتظار</p>
          </div>
          <div className={`${failed.length > 0 ? "bg-[#FEF0EE]" : "bg-[#E6F0EF]"} rounded-2xl px-3 py-3 text-center`}>
            <p className={`text-xl font-bold ${failed.length > 0 ? "text-[#C0392B]" : "text-[#0A3C36]"}`}>
              {failed.length > 0 ? failed.length : synced.length}
            </p>
            <p className={`text-[10px] ${failed.length > 0 ? "text-[#C0392B]" : "text-[#0A3C36]"}`}>
              {failed.length > 0 ? "فشل" : "تمت المزامنة"}
            </p>
          </div>
        </div>

        {/* Sync notice */}
        {!isOnline && queue.length > 0 && (
          <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-[#C8860A]">
              ستتم المزامنة تلقائياً عند استعادة الاتصال
            </p>
          </div>
        )}

        {isOnline && totalActive > 0 && (
          <div className="bg-[#EAF4FB] border border-[#2471A3]/20 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-[#2471A3]">
              أنت متصل — ستتم المزامنة تلقائياً قريباً
            </p>
          </div>
        )}

        {/* Empty state */}
        {queue.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-[#E6F0EF] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#102A43]">لا توجد إجراءات معلّقة</p>
            <p className="text-xs text-[#627D98] mt-1">
              كل إجراءاتك تمت مزامنتها مع الخادم
            </p>
          </div>
        )}

        {/* Failed */}
        {failed.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#C0392B] mb-2">
              فشل الإرسال ({failed.length})
            </p>
            <div className="space-y-2">
              {failed.map((a) => <QueuedActionCard key={a.id} action={a} />)}
            </div>
          </div>
        )}

        {/* Pending & Syncing */}
        {(pending.length > 0 || syncing.length > 0) && (
          <div>
            <p className="text-xs font-bold text-[#102A43] mb-2">
              في الانتظار ({totalActive})
            </p>
            <div className="space-y-2">
              {[...syncing, ...pending].map((a) => (
                <QueuedActionCard key={a.id} action={a} />
              ))}
            </div>
          </div>
        )}

        {/* Synced */}
        {synced.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#0A3C36]">
                تمت المزامنة ({synced.length})
              </p>
              <button
                onClick={clearSynced}
                className="text-[11px] text-[#627D98] underline underline-offset-2"
                aria-label="مسح الإجراءات المزامنة"
              >
                مسح الكل
              </button>
            </div>
            <div className="space-y-2">
              {synced.map((a) => <QueuedActionCard key={a.id} action={a} />)}
            </div>
          </div>
        )}

        {/* Danger zone */}
        {queue.length > 0 && (
          <div className="pt-2">
            <button
              onClick={clearQueue}
              className="w-full py-3 rounded-xl border border-[#C0392B]/30 text-[#C0392B] text-xs font-bold min-h-[44px]"
              aria-label="مسح جميع الإجراءات المعلّقة"
            >
              مسح جميع الإجراءات
            </button>
          </div>
        )}

        {/* Info note */}
        <p className="text-[11px] text-[#627D98] text-center leading-relaxed">
          البيانات محفوظة محلياً على جهازك فقط · لا يتم مشاركة بيانات الجلسة مع الخادم أثناء عدم الاتصال
        </p>
      </div>
    </AppShell>
  );
}
