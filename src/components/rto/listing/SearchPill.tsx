"use client";

import { BUDGETS, KINDS, type KindFilter } from "./format";

// Kolom cari berbentuk pil (kota, jenis, sewa maksimal). Dipakai di halaman RTO (lalu pindah ke halaman cari)
// dan di halaman cari (langsung menyaring).

export interface PillValue {
  kota: string;
  jenis: KindFilter;
  maks: number;
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`group relative flex min-w-0 flex-1 cursor-pointer flex-col rounded-full px-5 py-2 transition-colors hover:bg-brand-dark/[0.05] ${className}`}>
      <span className="text-[11.5px] font-bold text-brand-dark">{label}</span>
      {children}
    </label>
  );
}

const select = "w-full cursor-pointer appearance-none truncate bg-transparent pr-4 text-[14px] text-brand-gray outline-none focus-visible:text-brand-dark";

export default function SearchPill({
  cities,
  value,
  onChange,
  onSubmit,
  compact = false,
}: {
  cities: string[];
  value: PillValue;
  onChange: (v: PillValue) => void;
  onSubmit?: () => void;
  compact?: boolean;
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={`flex w-full items-center rounded-full border border-brand-dark/10 bg-white shadow-[0_6px_22px_-10px_rgba(20,20,20,0.35)] ${
        compact ? "max-w-3xl p-1" : "max-w-4xl p-1.5"
      }`}
    >
      <Field label="Lokasi">
        <select aria-label="Kota" value={value.kota} onChange={(e) => onChange({ ...value, kota: e.target.value })} className={select}>
          <option value="">Semua kota</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <span className="h-8 w-px shrink-0 bg-brand-dark/10" aria-hidden />
      <Field label="Jenis" className="hidden sm:flex">
        <select aria-label="Jenis unit" value={value.jenis} onChange={(e) => onChange({ ...value, jenis: e.target.value as KindFilter })} className={select}>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </Field>
      <span className="hidden h-8 w-px shrink-0 bg-brand-dark/10 sm:block" aria-hidden />
      <Field label="Sewa per bulan">
        <select aria-label="Sewa maksimal per bulan" value={value.maks} onChange={(e) => onChange({ ...value, maks: Number(e.target.value) })} className={select}>
          {BUDGETS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </Field>
      <button
        type="submit"
        aria-label="Cari unit"
        className={`ml-1 grid shrink-0 place-items-center rounded-full bg-brand-red text-white transition-colors hover:bg-brand-red-dark ${
          compact ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      </button>
    </form>
  );
}
