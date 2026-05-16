"use client";

import { useUIStore } from "@/store/ui.store";
import { Toast } from "@/components/ui/Toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useUIStore();

  return (
    <>
      {children}
      {/* Render up to 3 toasts stacked */}
      <div className="fixed top-4 inset-x-0 z-[500] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.slice(0, 3).map((t) => (
          <div key={t.id} className="pointer-events-auto w-full max-w-sm">
            <Toast
              open
              onClose={() => removeToast(t.id)}
              type={t.type}
              title={t.title}
              description={t.description}
            />
          </div>
        ))}
      </div>
    </>
  );
}
