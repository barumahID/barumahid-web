"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useT } from "@/i18n/LangProvider";

// Huruf interaktif untuk LBAG dan BUILD (satu bagian "Cara kami bekerja" di halaman Ekosistem).
// Huruf aktif berganti otomatis dengan garis progres saat terlihat di layar. Arahkan kursor, fokus, atau ketuk
// huruf untuk memilih sendiri (pergantian otomatis berhenti selama kursor di atas kartu).
// Teks langsung diganti di DOM lalu muncul dengan animasi CSS (.letter-in), jadi tidak pernah tertahan.
// Reduced motion: tidak berganti otomatis, teks langsung tampil tanpa animasi.

export interface LetterItem {
  letter: string;
  name: string;
  body: string;
  note?: string;
}

export default function LetterShowcase({
  label,
  items,
  noteLabel,
  interval = 4800,
  accent = "red",
}: {
  label: string;
  items: LetterItem[];
  noteLabel?: string;
  interval?: number;
  accent?: "red" | "light";
}) {
  const t = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const panelId = useId();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = inView && !paused && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [running, items.length, interval]);

  const item = items[active];
  const on = accent === "red" ? "border-brand-red bg-brand-red text-white" : "border-white bg-white text-brand-dark";

  return (
    <div
      ref={ref}
      className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm md:p-7"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/60">{t(label)}</p>

      <div className="mt-5 grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }} role="tablist" aria-label={t(label)}>
        {items.map((it, i) => (
          <button
            key={it.letter + i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={panelId}
            aria-label={t(it.name)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border transition-[background-color,border-color,color,transform] duration-300 ${
              active === i ? `${on} scale-[1.03]` : "border-white/15 bg-white/[0.03] text-white/75 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="text-[clamp(2rem,4.6vw,4rem)] font-black leading-none tracking-tighter">{it.letter}</span>
            {/* Garis progres pergantian otomatis */}
            {active === i && running && (
              <span
                key={`bar-${active}`}
                className={`absolute inset-x-0 bottom-0 h-1 origin-left ${accent === "red" ? "bg-white/70" : "bg-brand-red"}`}
                style={{ animation: `letter-progress ${interval}ms linear both` }}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <div id={panelId} role="tabpanel" className="relative mt-6 min-h-[150px] flex-1 md:min-h-[140px]" aria-live="polite">
        <div key={active} className="letter-in">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-red">{t(item.name)}</p>
            <p className="mt-2 text-[clamp(1.05rem,1.6vw,1.3rem)] font-medium leading-snug text-white">{t(item.body)}</p>
            {item.note && (
              <p className="mt-4 inline-flex flex-wrap items-baseline gap-x-2 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] leading-snug text-white/80">
                {noteLabel && <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">{t(noteLabel)}</span>}
                {t(item.note)}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
