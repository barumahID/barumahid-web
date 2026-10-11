"use client";

import { useState } from "react";
import Image from "next/image";
import type { Division, Unit } from "@/data/semesta";
import { useT } from "@/i18n/LangProvider";

// Tiga map divisi (referensi visual "Card Folder" dari user, dibuat ulang): tiap map berisi kartu unit usahanya.
// Tertutup: kartu mengintip dari balik kantong map. Disorot (desktop) atau diketuk (HP): kartu naik dan menyebar.
// Kartu menyebar seperti kipas kartu di tangan; kartu yang disorot naik ke depan supaya isinya terbaca penuh.
// Klik kartu = pilih unit (sinkron dengan orbit dan panel detail).

const CARD_W = 104;

function Card({ u, color, selected, onSelect }: { u: Unit; color: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-[132px] w-[104px] flex-col items-center rounded-2xl border bg-[#141419] px-2 pb-3 pt-3 text-center shadow-[0_14px_30px_-12px_rgba(0,0,0,0.8)] transition-[border-color,transform] duration-300 group-hover/card:-translate-y-3 group-focus-within/card:-translate-y-3 ${
        selected ? "border-white" : "border-white/12 hover:border-white/40"
      }`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ${u.logo ? "" : "bg-[#0B0B0F]"}`}
        style={u.logo ? { background: u.logoBg ?? "#FFFFFF" } : { border: `1px solid rgba(${color},0.6)` }}
      >
        {u.logo ? (
          <Image src={u.logo} alt="" width={80} height={80} className="h-[80%] w-[80%] object-contain" />
        ) : (
          <span className="text-[11px] font-black" style={{ color: `rgb(${color})` }}>
            {u.initials}
          </span>
        )}
      </span>
      <span className="mt-2 line-clamp-1 text-[12px] font-bold text-white">{u.name}</span>
      <span className="mt-auto w-full">
        <span className="block text-[11px] font-black" style={{ color: `rgb(${color})` }}>
          {u.progress}%
        </span>
        <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full rounded-full" style={{ width: `${Math.max(u.progress, 3)}%`, background: `rgb(${color})` }} />
        </span>
      </span>
    </button>
  );
}

function Folder({
  d,
  units,
  selected,
  onSelect,
  open,
  setOpen,
}: {
  d: Division;
  units: Unit[];
  selected: string;
  onSelect: (id: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const t = useT();
  const n = units.length;
  const running = units.filter((u) => u.status === "berjalan").length;
  // Jarak kartu saat menyebar, menyesuaikan jumlah kartu
  const step = n > 1 ? Math.min(CARD_W * 0.8, 260 / (n - 1)) : 0;

  return (
    <div
      className="relative h-[250px] select-none"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      {/* Badan belakang map + tab nama divisi */}
      <div className="absolute inset-x-0 bottom-0 top-6 rounded-3xl border border-white/10" style={{ background: `linear-gradient(180deg, rgba(${d.color},0.18), rgba(${d.color},0.06))` }} />
      <div className="absolute left-0 top-0 h-8 w-32 rounded-t-2xl border border-b-0 border-white/10" style={{ background: `rgba(${d.color},0.18)` }} aria-hidden="true" />

      {/* Kartu unit */}
      <div className="absolute inset-x-0 bottom-[22px] h-[132px]">
        {units.map((u, i) => {
          const mid = (n - 1) / 2;
          const off = i - mid;
          const transform = open
            ? `translate(calc(-50% + ${off * step}px), ${-72 - (mid - Math.abs(off)) * 8}px) rotate(${off * 7}deg)`
            : `translate(calc(-50% + ${off * 7}px), ${-Math.abs(off) * 2}px) rotate(${off * 2.5}deg)`;
          return (
            <div
              key={u.id}
              className="group/card absolute bottom-0 left-1/2 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:!z-50 focus-within:!z-50"
              style={{ transform, zIndex: 10 + i, transitionDelay: open ? `${i * 35}ms` : "0ms" }}
            >
              <Card u={u} color={d.color} selected={selected === u.id} onSelect={() => onSelect(u.id)} />
            </div>
          );
        })}
      </div>

      {/* Kantong depan map */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="absolute inset-x-0 bottom-0 z-30 flex h-[112px] flex-col justify-end rounded-3xl border border-white/10 px-5 pb-4 text-left backdrop-blur-md"
        style={{ background: `linear-gradient(180deg, rgba(20,20,25,0.82), rgba(11,11,15,0.95))`, boxShadow: `inset 0 1px 0 rgba(${d.color},0.45)` }}
      >
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${d.color})` }} aria-hidden="true" />
          <span className="text-[15px] font-black tracking-[0.08em] text-white">{d.name}</span>
        </span>
        <span className="mt-1 text-[13px] font-semibold text-white/60">{t(d.focus)}</span>
        <span className="mt-1.5 text-[12px] text-white/45">
          {t("{n} unit · {r} berjalan", { n, r: running })}
        </span>
      </button>
    </div>
  );
}

export default function DivisionFolders({
  divisions,
  units,
  selected,
  onSelect,
}: {
  divisions: Division[];
  units: Unit[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState<string>("");
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {divisions.map((d) => (
        <Folder
          key={d.id}
          d={d}
          units={units.filter((u) => u.division === d.id)}
          selected={selected}
          onSelect={onSelect}
          open={open === d.id}
          setOpen={(v) => setOpen((cur) => (v ? d.id : cur === d.id ? "" : cur))}
        />
      ))}
    </div>
  );
}
