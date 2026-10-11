"use client";

import { useState } from "react";
import type { Testimonial } from "@/data/faq";

export default function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  if (items.length === 0) return null;
  const t = items[i];
  const go = (d: number) => setI((prev) => (prev + d + items.length) % items.length);

  return (
    <figure className="rounded-3xl bg-brand-dark p-7 text-white md:p-9" aria-roledescription="carousel" aria-label="Testimoni klien">
      <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true" className="text-brand-red">
        <path d="M0 26V15.6C0 6.9 4.7 1.7 14 0l1.5 3.6C10.6 5 8.2 7.8 8 12h6v14H0zm19 0V15.6C19 6.9 23.7 1.7 33 0l1 3.6C29.6 5 27.2 7.8 27 12h6v14H19z" fill="currentColor" />
      </svg>
      <blockquote className="mt-6 min-h-[120px] text-[18px] font-medium leading-relaxed" aria-live="polite">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-6 text-[14px]">
        <span className="font-bold">{t.name}</span>
        <span className="text-white/55"> · {t.role} · {t.service}</span>
      </figcaption>
      {items.length > 1 && (
        <div className="mt-7 flex items-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label="Testimoni sebelumnya" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 hover:bg-white/10">
            ‹
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Testimoni berikutnya" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 hover:bg-white/10">
            ›
          </button>
          <span className="ml-2 text-[12px] text-white/50">
            {i + 1} / {items.length}
          </span>
        </div>
      )}
    </figure>
  );
}
