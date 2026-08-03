"use client";

import { useState, useMemo } from "react";

const ecoChannels = [
  { key: "laundry", label: "Rajin laundry (est. 8x/bulan)", monthlyAdd: 80_000 },
  { key: "sampah", label: "Pilah sampah rutin", monthlyAdd: 40_000 },
  { key: "titip", label: "Jasa titip (2x/bulan)", monthlyAdd: 50_000 },
  { key: "pindahan", label: "Jasa pindahan (1x/tahun)", monthlyAdd: 15_000 },
];

function formatRp(n: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));
}

export default function EcosystemSimulator({ sewaPerBulan }: { sewaPerBulan: number }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  const sewaDP = sewaPerBulan * 0.25;
  const ecoTotal = useMemo(
    () => ecoChannels.reduce((sum, ch) => sum + (enabled[ch.key] ? ch.monthlyAdd : 0), 0),
    [enabled]
  );
  const combinedTotal = sewaDP + ecoTotal;

  return (
    <div className="mt-8 rounded-xl border border-brand-dark/10 bg-brand-light/40 p-6">
      <h4 className="text-sm font-extrabold uppercase tracking-wider text-brand-dark">
        Estimasi dengan Ekosistem DP
      </h4>
      <p className="mt-1 text-xs text-brand-gray">
        Aktifkan channel tambahan untuk mempercepat tabungan DP kamu.
      </p>

      <div className="mt-5 space-y-3">
        {ecoChannels.map((ch) => (
          <label
            key={ch.key}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-brand-dark/6 bg-white px-4 py-3 transition hover:border-brand-red/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!enabled[ch.key]}
                  onChange={(e) => setEnabled({ ...enabled, [ch.key]: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-gray-200 transition peer-checked:bg-brand-red" />
                <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-brand-dark">{ch.label}</span>
            </div>
            <span className="text-sm font-bold text-credit">+{formatRp(ch.monthlyAdd)}/bln</span>
          </label>
        ))}
      </div>

      {/* Combined result */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 border border-brand-dark/6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Sewa Core (25%)</p>
          <p className="mt-1 text-lg font-extrabold text-brand-red">{formatRp(sewaDP)}</p>
        </div>
        <div className="rounded-lg bg-white p-4 border border-brand-dark/6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Ekosistem DP</p>
          <p className="mt-1 text-lg font-extrabold text-credit">{formatRp(ecoTotal)}</p>
        </div>
        <div className="rounded-lg bg-brand-dark p-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total DP/bulan</p>
          <p className="mt-1 text-lg font-extrabold">{formatRp(combinedTotal)}</p>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-brand-gray">
        * Angka ekosistem bersifat estimasi. Channel selain Sewa Core masih dalam tahap pengembangan.
      </p>
    </div>
  );
}
