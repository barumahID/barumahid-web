"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const RTO_RATE = 0.25;

function formatRp(n: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));
}

function formatBulan(bulan: number) {
  if (!isFinite(bulan) || bulan <= 0) return "—";
  const tahun = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  if (tahun === 0) return `${sisa} bulan`;
  if (sisa === 0) return `${tahun} tahun`;
  return `${tahun} tahun ${sisa} bulan`;
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-dark">
          {label}
        </label>
        <span className="text-lg font-extrabold text-brand-dark">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full cursor-pointer accent-brand-red"
        style={{
          background: `linear-gradient(to right, #C53B3B 0%, #C53B3B ${pct}%, #EBEBEB ${pct}%, #EBEBEB 100%)`,
          WebkitAppearance: "none",
          appearance: "none",
          height: "6px",
          borderRadius: "999px",
          outline: "none",
        }}
      />
      <div className="mt-1.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-brand-dark/30">
        <span>{format(min)}</span>
        {hint && <span className="text-brand-dark/50">{hint}</span>}
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function RTOSimulator() {
  const [hargaUnit, setHargaUnit] = useState(250_000_000);
  const [sewa, setSewa] = useState(2_500_000);
  const [dpPct, setDpPct] = useState(15);

  const result = useMemo(() => {
    const dpTarget = (hargaUnit * dpPct) / 100;
    const saldoPerBulan = sewa * RTO_RATE;
    const ketMitra = sewa * (1 - RTO_RATE);
    const bulan = saldoPerBulan > 0 ? Math.ceil(dpTarget / saldoPerBulan) : Infinity;
    const totalTerbayar = sewa * bulan;
    return { dpTarget, saldoPerBulan, ketMitra, bulan, totalTerbayar };
  }, [hargaUnit, sewa, dpPct]);

  // Progress markers at 1, 2, 3, 5, 10 tahun
  const yearMarkers = [1, 2, 3, 5, 10];

  return (
    <div className="rounded-2xl border-2 border-brand-dark/10 bg-white p-6 shadow-sm sm:p-10">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
            Simulasi Saldo DP
          </span>
          <h3 className="mt-2 text-2xl font-extrabold text-brand-dark sm:text-3xl">
            Hitung sendiri,
            <br className="sm:hidden" />
            <span className="sm:ml-2">berapa lama sampai DP-mu cukup.</span>
          </h3>
        </div>
        <span className="self-start rounded-full border border-brand-dark/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark/50 sm:self-auto">
          25% sewa → DP
        </span>
      </div>

      {/* Inputs */}
      <div className="mt-8 grid gap-7 md:grid-cols-3">
        <SliderInput
          label="Harga Unit"
          value={hargaUnit}
          onChange={setHargaUnit}
          min={100_000_000}
          max={1_000_000_000}
          step={10_000_000}
          format={formatRp}
        />
        <SliderInput
          label="Sewa per Bulan"
          value={sewa}
          onChange={setSewa}
          min={1_000_000}
          max={10_000_000}
          step={100_000}
          format={formatRp}
        />
        <SliderInput
          label="Target DP"
          value={dpPct}
          onChange={setDpPct}
          min={5}
          max={30}
          step={1}
          format={(n) => `${n}%`}
          hint="dari harga unit"
        />
      </div>

      {/* Headline result */}
      <div className="mt-10 grid gap-4 rounded-2xl bg-brand-dark p-6 text-white sm:grid-cols-3 sm:gap-6 sm:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/40">
            DP yang perlu dikumpulkan
          </p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {formatRp(result.dpTarget)}
          </p>
        </div>
        <div className="border-y border-white/10 py-4 sm:border-x sm:border-y-0 sm:px-6 sm:py-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
            Saldo DP per bulan
          </p>
          <p className="mt-2 text-2xl font-extrabold text-brand-red sm:text-3xl">
            {formatRp(result.saldoPerBulan)}
          </p>
          <p className="mt-1 text-[10px] text-brand-light/40">
            (25% dari sewa, otomatis)
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/40">
            Estimasi waktu DP cukup
          </p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {formatBulan(result.bulan)}
          </p>
          <p className="mt-1 text-[10px] text-brand-light/40">
            ≈ {isFinite(result.bulan) ? `${result.bulan} bulan` : "—"}
          </p>
        </div>
      </div>

      {/* Progress visualization */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-dark">
            Progress Saldo DP
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">
            Garis waktu
          </p>
        </div>
        <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-brand-light">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-red/70 transition-all duration-500"
            style={{
              width: `${Math.min(100, (12 / Math.max(result.bulan, 1)) * 100)}%`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">
          <span>Awal sewa</span>
          <span>1 tahun</span>
          <span>{formatBulan(result.bulan)}</span>
        </div>

        {/* Year markers */}
        <div className="mt-6 grid grid-cols-5 gap-2">
          {yearMarkers.map((y) => {
            const saldoAt = result.saldoPerBulan * y * 12;
            const pct = (saldoAt / result.dpTarget) * 100;
            const reached = saldoAt >= result.dpTarget;
            return (
              <div
                key={y}
                className={`rounded-lg border p-3 text-center ${
                  reached ? "border-brand-red bg-brand-red/5" : "border-brand-dark/10 bg-brand-light/30"
                }`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wider ${reached ? "text-brand-red" : "text-brand-dark/40"}`}>
                  {y} tahun
                </p>
                <p className="mt-1 text-xs font-extrabold text-brand-dark">
                  {Math.min(100, Math.round(pct))}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-brand-light/40 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">
            Yang masuk ke saldo DP
          </p>
          <p className="mt-1 text-lg font-extrabold text-brand-red">
            {formatRp(result.saldoPerBulan * result.bulan)}
          </p>
          <p className="mt-1 text-xs text-brand-gray">
            Selama {formatBulan(result.bulan)} sewa
          </p>
        </div>
        <div className="rounded-xl bg-brand-light/40 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">
            Total yang kamu bayarkan
          </p>
          <p className="mt-1 text-lg font-extrabold text-brand-dark">
            {formatRp(result.totalTerbayar)}
          </p>
          <p className="mt-1 text-xs text-brand-gray">
            Sewa kumulatif sampai DP cukup
          </p>
        </div>
      </div>

      {/* Disclaimer + CTA */}
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-brand-dark/10 bg-brand-light/30 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-brand-gray">
          <strong className="text-brand-dark">Catatan:</strong> Ini simulasi
          indikatif berdasarkan mekanisme 25% sewa → DP. Skema final, opsi
          top-up tabungan, dan harga konversi akan dikomunikasikan saat
          program <strong className="text-brand-red">resmi dibuka</strong>.
        </p>
        <Link
          href="/daftar"
          className="shrink-0 self-start rounded-full bg-brand-red px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-red/30 transition hover:scale-105 sm:self-auto"
        >
          Gabung Waiting List
        </Link>
      </div>
    </div>
  );
}
