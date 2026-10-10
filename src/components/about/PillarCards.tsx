"use client";

import { useState } from "react";
import type { Pillar } from "@/data/company";

// Empat kartu LBAG. Tiap kartu punya toggle kecil ConsTech / PropTech untuk menunjukkan perannya.
function PillarCard({ p }: { p: Pillar }) {
  const [wing, setWing] = useState<"constech" | "proptech">("constech");
  return (
    <article className="flex h-full flex-col rounded-3xl border border-brand-dark/10 bg-white p-6 card-shadow md:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[64px] font-black leading-none tracking-tighter text-brand-red">{p.letter}</span>
        <div className="flex rounded-full bg-brand-cream p-1 text-[11px] font-bold" role="group" aria-label={`Peran ${p.name}`}>
          {(["constech", "proptech"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWing(w)}
              aria-pressed={wing === w}
              className={`rounded-full px-3 py-1.5 transition-colors ${
                wing === w ? "bg-brand-dark text-white" : "text-brand-gray hover:text-brand-dark"
              }`}
            >
              {w === "constech" ? "ConsTech" : "PropTech"}
            </button>
          ))}
        </div>
      </div>
      <h3 className="mt-4 text-[19px] font-extrabold tracking-tight text-brand-dark">{p.name}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-brand-gray">{p.body}</p>
      <div className="mt-auto pt-5">
        <div className="rounded-2xl bg-brand-cream px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-red">
            Di {wing === "constech" ? "ConsTech" : "PropTech"}
          </p>
          <p className="mt-1 text-[14px] font-medium leading-snug text-brand-dark" aria-live="polite">
            {wing === "constech" ? p.constech : p.proptech}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function PillarCards({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => (
        <PillarCard key={p.letter} p={p} />
      ))}
    </div>
  );
}
