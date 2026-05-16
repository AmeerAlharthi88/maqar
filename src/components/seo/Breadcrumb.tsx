// ── Breadcrumb Component — Phase 16 ──────────────────────────────────────────
// Accessible, RTL-safe breadcrumb navigation.
// Renders both the visible UI and a machine-readable <nav> for screen readers.
// JSON-LD breadcrumb schema is injected separately via breadcrumbJsonLd().
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

export interface BreadcrumbItem {
  labelAr: string;
  href?: string; // omit for the current (last) item
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="مسار التنقل" className={`${className}`} dir="rtl">
      <ol
        className="flex items-center flex-wrap gap-1 text-[11px] text-[#A89480]"
        role="list"
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1" role="listitem">
              {idx > 0 && (
                <span aria-hidden="true" className="text-[#D4C4B4]">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={`${isLast ? "text-[#1E1E1E] font-semibold" : "text-[#A89480]"}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.labelAr}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#A89480] hover:text-[#C65D3B] transition-colors underline-offset-2 hover:underline"
                >
                  {item.labelAr}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
