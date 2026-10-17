"use client";

import { useState } from "react";
import { RTO_LEVELS, type RtoLevel } from "@/data/rto";

// Perjalanan level penyewa (arahan user Okt 2026: seperti game, RTO terbuka setelah syarat tertentu).
// Desktop: jalur mendatar dengan garis progres; HP: daftar tegak. Pilih tahap untuk melihat misi dan yang terbuka.
// Ini penjelasan publik, bukan status akun. Status pribadi nanti tampil di dashboard Portal.

function Icon({ level, active }: { level: RtoLevel; active: boolean }) {
  const cls = `h-5 w-5 ${active ? "text-white" : level.stage === "rto" ? "text-brand-red" : level.stage === "gerbang" ? "text-[#C25E20]" : "text-brand-dark"}`;
  if (level.stage === "gerbang")
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="8" cy="15" r="4" />
        <path d="M10.85 12.15 19 4M18 5l2 2M15 8l2 2" />
      </svg>
    );
  if (level.stage === "rto")
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    );
  return <span className={`text-[15px] font-black ${active ? "text-white" : "text-brand-dark"}`}>{level.n}</span>;
}

function Detail({ level }: { level: RtoLevel }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-brand-cream p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray">Misi</p>
        <ul className="mt-3 space-y-2.5">
          {level.missions.map((m) => (
            <li key={m} className="flex gap-2.5 text-[14.5px] leading-snug text-brand-dark">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-brand-dark/25" aria-hidden="true" />
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className={`rounded-2xl p-5 ${level.stage === "rto" ? "bg-brand-red text-white" : level.stage === "gerbang" ? "bg-[#C25E20] text-white" : "bg-brand-dark text-white"}`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">Yang terbuka</p>
        <ul className="mt-3 space-y-2.5">
          {level.unlocks.map((u) => (
            <li key={u} className="flex gap-2.5 text-[14.5px] leading-snug">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12 5 5 9-10" />
              </svg>
              {u}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LevelJourney() {
  const [sel, setSel] = useState(0);
  const level = RTO_LEVELS[sel];
  const last = RTO_LEVELS.length - 1;
  const label = (l: RtoLevel) => (l.n === null ? l.name : `Level ${l.n}`);

  return (
    <div className="rounded-3xl bg-white p-5 card-shadow md:p-8">
      {/* Desktop: jalur mendatar */}
      <div className="relative hidden lg:block" role="tablist" aria-label="Tahap perjalanan RTO">
        <div className="absolute left-[7%] right-[7%] top-7 h-1.5 rounded-full bg-brand-cream" aria-hidden="true" />
        <div
          className="absolute left-[7%] top-7 h-1.5 rounded-full bg-brand-red transition-[width] duration-500 ease-out"
          style={{ width: `${(sel / last) * 86}%` }}
          aria-hidden="true"
        />
        <ol className="relative grid grid-cols-7">
          {RTO_LEVELS.map((l, i) => {
            const active = i === sel;
            const done = i < sel;
            return (
              <li key={l.id} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="level-detail"
                  onClick={() => setSel(i)}
                  className={`grid h-14 w-14 place-items-center rounded-full border-2 transition-all duration-300 ${
                    active
                      ? l.stage === "gerbang"
                        ? "scale-110 border-[#C25E20] bg-[#C25E20]"
                        : "scale-110 border-brand-red bg-brand-red"
                      : done
                        ? "border-brand-red bg-white"
                        : l.stage === "gerbang"
                          ? "border-dashed border-[#C25E20] bg-white hover:scale-105"
                          : "border-brand-dark/15 bg-white hover:scale-105 hover:border-brand-dark/40"
                  }`}
                >
                  <Icon level={l} active={active} />
                  <span className="sr-only">{label(l)}</span>
                </button>
                <p className={`mt-3 text-[11px] font-bold uppercase tracking-[0.12em] ${active ? "text-brand-red" : "text-brand-mute"}`}>{label(l)}</p>
                <p className="mt-1 px-1 text-[14px] font-extrabold leading-tight text-brand-dark">{l.name}</p>
                <p className="mt-1 px-2 text-[12px] leading-snug text-brand-gray">{l.short}</p>
              </li>
            );
          })}
        </ol>
        <div id="level-detail" role="tabpanel" className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[18px] font-extrabold text-brand-dark">
              {label(level)} · {level.name}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSel((s) => Math.max(0, s - 1))}
                disabled={sel === 0}
                className="rounded-full border border-brand-dark/15 px-4 py-2 text-[13px] font-bold text-brand-dark transition-colors hover:bg-brand-cream disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setSel((s) => Math.min(last, s + 1))}
                disabled={sel === last}
                className="rounded-full bg-brand-dark px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-brand-red disabled:opacity-40"
              >
                Naik level
              </button>
            </div>
          </div>
          <Detail level={level} />
        </div>
      </div>

      {/* HP dan tablet: daftar tegak, tahap terpilih terbuka */}
      <ol className="relative lg:hidden">
        <span className="absolute bottom-6 left-[27px] top-6 w-0.5 bg-brand-cream" aria-hidden="true" />
        {RTO_LEVELS.map((l, i) => {
          const active = i === sel;
          return (
            <li key={l.id} className="relative pb-3 last:pb-0">
              <button
                type="button"
                onClick={() => setSel(i)}
                aria-expanded={active}
                className="flex w-full items-center gap-4 rounded-2xl py-2 pr-2 text-left"
              >
                <span
                  className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 ${
                    active
                      ? l.stage === "gerbang"
                        ? "border-[#C25E20] bg-[#C25E20]"
                        : "border-brand-red bg-brand-red"
                      : l.stage === "gerbang"
                        ? "border-dashed border-[#C25E20] bg-white"
                        : "border-brand-dark/15 bg-white"
                  }`}
                >
                  <Icon level={l} active={active} />
                </span>
                <span className="min-w-0">
                  <span className={`block text-[11px] font-bold uppercase tracking-[0.12em] ${active ? "text-brand-red" : "text-brand-mute"}`}>{label(l)}</span>
                  <span className="block text-[16px] font-extrabold leading-tight text-brand-dark">{l.name}</span>
                  <span className="block text-[13px] text-brand-gray">{l.short}</span>
                </span>
              </button>
              {active && (
                <div className="ml-[72px] mt-2">
                  <Detail level={l} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
