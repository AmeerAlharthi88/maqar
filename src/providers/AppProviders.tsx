"use client";

import { AuthSessionProvider } from "./AuthSessionProvider";
import { ToastProvider } from "./ToastProvider";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthSessionProvider>
      <ToastProvider>
        {/* SW registration + update banner + online/offline sync */}
        <ServiceWorkerRegistration />
        {children}
      </ToastProvider>
    </AuthSessionProvider>
  );
}
