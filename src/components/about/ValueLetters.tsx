"use client";

import { useState } from "react";
import type { Value } from "@/data/company";

// Lima huruf B-U-I-L-D. Desktop: hover membuka penjelasan. HP: tap.
export default function ValueLetters({ values }: { values: Value[] }) {
  const [active, setActive] = useState(0);
  const v = values[active];
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 md:gap-4" role="tablist" aria-label="Nilai BUILD">
        {values.map((val, i) => (
          <button
            key={val.name}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls="nilai-build-panel"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`group flex aspect-square flex-col items-center justify-center rounded-2xl border transition-colors duration-300 md:rounded-3xl ${
              active === i
                ? "border-brand-red bg-brand-red text-white"
                : "border-white/15 bg-white/[0.04] text-white/80 hover:border-white/40"
            }`}
          >
            <span className="text-[clamp(2.2rem,8vw,6rem)] font-black leading-none tracking-tighter">{val.letter}</span>
            <span className="mt-1 hidden text-[11px] font-semibold uppercase tracking-[0.12em] md:block">{val.name}</span>
          </button>
        ))}
      </div>
      <div id="nilai-build-panel" role="tabpanel" className="mt-8 min-h-[110px] md:mt-10" aria-live="polite">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-red">{v.name}</p>
        <p className="mt-3 max-w-2xl text-[clamp(1.1rem,1.8vw,1.45rem)] font-medium leading-snug text-white">{v.body}</p>
      </div>
    </div>
  );
}
