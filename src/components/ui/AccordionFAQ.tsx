"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function AccordionFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-brand-dark/8">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-brand-dark transition hover:text-brand-red sm:text-lg"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </button>
            <div
              className={`accordion-body ${isOpen ? "open" : ""}`}
              style={{ paddingBottom: isOpen ? "20px" : "0" }}
            >
              <p className="text-sm leading-relaxed text-brand-gray pr-8">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
