"use client";

import { useId, useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function AccordionFAQ({
  items,
  compact = false,
  dark = false,
}: {
  items: FAQItem[];
  compact?: boolean;
  dark?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId().replace(/:/g, "");
  const line = dark ? "border-white/15" : "border-brand-dark/10";

  return (
    <div className={`border-t ${line}`}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const btnId = `${baseId}-btn-${i}`;
        return (
          <div key={item.question} className={`border-b ${line}`}>
            <h3>
              <button
                id={btnId}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={`group flex w-full items-center justify-between gap-5 text-left ${compact ? "py-4" : "py-6"}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span
                  className={`text-[15px] font-semibold leading-snug tracking-tight transition-colors md:text-[16px] ${
                    isOpen ? "text-brand-red" : dark ? "text-white group-hover:text-brand-red" : "text-brand-dark group-hover:text-brand-red"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                    dark ? "border-white/25 text-white/70" : "border-brand-dark/15 text-brand-gray"
                  } ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden="true"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className={`accordion-body ${isOpen ? "open" : ""}`}>
              <div>
                <p className={`max-w-2xl pb-5 pr-10 text-[14.5px] leading-relaxed ${dark ? "text-white/65" : "text-brand-gray"}`}>
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
