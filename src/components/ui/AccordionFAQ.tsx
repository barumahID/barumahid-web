"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function AccordionFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t hairline">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border-b hairline">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="group flex w-full items-center justify-between gap-6 py-6 md:py-7 text-left transition-colors"
              aria-expanded={isOpen}
            >
              <span className="flex items-baseline gap-6">
                <span className="type-micro text-brand-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-[clamp(1rem,1.4vw,1.2rem)] font-medium tracking-tight transition-colors ${
                  isOpen ? "text-brand-red" : "text-brand-dark group-hover:text-brand-red"
                }`}>
                  {item.question}
                </span>
              </span>
              <span className={`shrink-0 text-brand-gray transition-transform duration-300 ${
                isOpen ? "rotate-45" : ""
              }`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M10 4v12M4 10h12" />
                </svg>
              </span>
            </button>
            <div className={`accordion-body ${isOpen ? "open" : ""}`}>
              <div>
                <p className="type-body text-brand-gray max-w-2xl pb-6 md:pb-8 pl-14 pr-8">
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
