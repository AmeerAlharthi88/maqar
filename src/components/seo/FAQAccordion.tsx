"use client";

// ── FAQAccordion — Phase 16 ───────────────────────────────────────────────────
// Keyboard-accessible accordion for FAQ sections.
// Client component because of open/close state.
// JSON-LD FAQPage schema is rendered server-side via faqJsonLd() in the parent.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  className?: string;
}

function FAQRow({ faq, id }: { faq: FAQItem; id: string }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-answer-${id}`;
  const questionId = `faq-question-${id}`;

  return (
    <div className="border border-[#F0EBE3] rounded-xl overflow-hidden">
      <button
        id={questionId}
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-4 text-right bg-white hover:bg-[#FAF7F4] transition-colors min-h-[52px]"
      >
        <span className="text-sm font-semibold text-[#1E1E1E] leading-relaxed text-right">
          {faq.q}
        </span>
        <span
          aria-hidden="true"
          className={`flex-shrink-0 mr-3 w-5 h-5 rounded-full border border-[#D4C4B4] flex items-center justify-center transition-transform ${
            open ? "rotate-180 border-[#C65D3B]" : ""
          }`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke={open ? "#C65D3B" : "#A89480"}
            strokeWidth="1.5"
          >
            <path d="M2 3.5L5 6.5L8 3.5" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={answerId}
          role="region"
          aria-labelledby={questionId}
          className="px-4 pb-4 bg-white"
        >
          <p className="text-sm text-[#7A6B5E] leading-relaxed text-right">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQAccordion({ faqs, className = "" }: FAQAccordionProps) {
  if (faqs.length === 0) {
    return (
      <p className="text-sm text-[#A89480] text-center py-6">
        لا توجد أسئلة شائعة متاحة حالياً.
      </p>
    );
  }

  return (
    <div className={`space-y-2 ${className}`} dir="rtl">
      {faqs.map((faq, idx) => (
        <FAQRow key={idx} faq={faq} id={String(idx)} />
      ))}
    </div>
  );
}
