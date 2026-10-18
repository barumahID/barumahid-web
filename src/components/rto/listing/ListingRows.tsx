"use client";

import { useRef } from "react";
import Link from "@/i18n/Link";
import type { Listing } from "@/data/listings";
import ListingCard from "./ListingCard";

// Deretan kartu yang bisa digeser (dipakai di halaman detail: unit lain di kota yang sama).

export function ListingRow({ title, sub, href, items }: { title: string; sub?: string; href?: string; items: Listing[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {href ? (
            <Link href={href} className="group inline-flex items-center gap-1.5 text-[19px] font-extrabold tracking-tight text-brand-dark md:text-[21px]">
              {title}
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <h3 className="text-[19px] font-extrabold tracking-tight text-brand-dark md:text-[21px]">{title}</h3>
          )}
          {sub && <p className="mt-0.5 text-[13.5px] text-brand-gray">{sub}</p>}
        </div>
        {items.length > 3 && (
          <div className="hidden shrink-0 gap-2 md:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scroll(d)}
                aria-label={d < 0 ? "Geser ke kiri" : "Geser ke kanan"}
                className="grid h-8 w-8 place-items-center rounded-full border border-brand-dark/15 bg-white text-brand-dark transition-colors hover:border-brand-dark"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                  <path d={d < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={track} className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:mx-0 md:scroll-px-0 md:px-0">
        {items.map((l) => (
          <div key={l.slug} className="w-[74%] shrink-0 snap-start sm:w-[44%] md:w-[31%] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)]">
            <ListingCard l={l} sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 640px) 44vw, 74vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
