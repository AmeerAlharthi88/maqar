/**
 * Auth layout — intentionally minimal.
 * All auth pages use <AppShell> internally, which provides the full
 * header/nav chrome. This layout is a passthrough so that AppShell
 * renders full-width without being constrained by a legacy wrapper.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
