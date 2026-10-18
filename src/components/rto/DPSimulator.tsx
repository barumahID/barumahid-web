"use client";

import { useMemo, useState } from "react";
import { RTO_RATE, RTO_UNLOCK_MONTHS } from "@/data/rto";

// Simulasi saldo DP Rent-to-Own (PRD Website v1, bagian Layanan RTO).
// Isian: sewa per bulan, target harga rumah, persen DP, tambahan channel percepatan.
// Hasil: saldo DP per bulan, perkiraan bulan sampai DP tercapai, grafik saldo.
// Angka channel percepatan mengikuti simulasi PRD v3.2 (laundry 30 kg, pilah sampah 20 kg per bulan); semua channel
// itu belum berjalan. Saldo DP baru dicatat setelah RTO terbuka, jadi waktu total ditambah masa sewa awal.

const ECO = [
  { id: "laundry", label: "Laundry di mitra Kosanesia (±30 kg)", value: 21_000 },
  { id: "sampah", label: "Pilah sampah GreenPoint (±20 kg)", value: 24_000 },
  { id: "titip", label: "Pakai jasa titip", value: 15_000 },
];

const rp = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n));
const rpShort = (n: number) => {
  if (n >= 1_000_000_000) return `Rp${(n / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  return rp(n);
};

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
  minLabel: string;
  maxLabel: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gray">
          {label}
        </label>
        <span className="text-[17px] font-black text-brand-dark">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rto-slider mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{ background: `linear-gradient(to right, #C53B3B ${pct}%, #E5E0D8 ${pct}%)` }}
      />
      <div className="mt-2 flex justify-between text-[11px] text-brand-mute">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function Chart({ months, perMonth, target }: { months: number; perMonth: number; target: number }) {
  // Grafik saldo DP terhadap waktu, dengan garis target.
  const W = 560;
  const H = 200;
  const pad = { l: 8, r: 8, t: 16, b: 26 };
  const total = Math.max(1, Math.min(months, 240));
  const maxY = Math.max(target, perMonth * total) * 1.08;
  const x = (m: number) => pad.l + (m / total) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / maxY) * (H - pad.t - pad.b);
  const end = Math.min(target, perMonth * total);
  const area = `M${x(0)},${y(0)} L${x(total)},${y(end)} L${x(total)},${y(0)} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * total));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Saldo DP naik sampai ${rp(target)} dalam ${months} bulan`}>
      <path d={area} fill="#C53B3B" opacity="0.18" />
      <line x1={x(0)} y1={y(0)} x2={x(total)} y2={y(end)} stroke="#C53B3B" strokeWidth="3" />
      <line x1={pad.l} x2={W - pad.r} y1={y(target)} y2={y(target)} stroke="#ffffff" strokeOpacity="0.5" strokeDasharray="5 5" />
      <text x={W - pad.r} y={y(target) - 6} textAnchor="end" fontSize="12" fill="#ffffff" fillOpacity="0.75">
        Target DP {rpShort(target)}
      </text>
      {ticks.map((t) => (
        <text key={t} x={x(t)} y={H - 6} textAnchor={t === 0 ? "start" : t === total ? "end" : "middle"} fontSize="11" fill="#ffffff" fillOpacity="0.45">
          {t === 0 ? "Mulai" : `bln ${t}`}
        </text>
      ))}
    </svg>
  );
}

export default function DPSimulator({ formAnchor = "#daftar" }: { formAnchor?: string }) {
  const [harga, setHarga] = useState(250_000_000);
  const [sewa, setSewa] = useState(1_500_000);
  const [dpPct, setDpPct] = useState(10);
  const [eco, setEco] = useState<Record<string, boolean>>({});

  const r = useMemo(() => {
    const target = (harga * dpPct) / 100;
    const core = sewa * RTO_RATE;
    const extra = ECO.reduce((s, c) => s + (eco[c.id] ? c.value : 0), 0);
    const perMonth = core + extra;
    const months = perMonth > 0 ? Math.ceil(target / perMonth) : Infinity;
    const monthsCore = core > 0 ? Math.ceil(target / core) : Infinity;
    return { target, core, extra, perMonth, months, monthsCore };
  }, [harga, sewa, dpPct, eco]);

  const years = (m: number) => (Number.isFinite(m) ? (m / 12).toLocaleString("id-ID", { maximumFractionDigits: 1 }) : "-");

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-3 lg:col-span-6">
        <Slider
          id="sim-sewa"
          label="Sewa per bulan"
          value={sewa}
          min={500_000}
          max={6_000_000}
          step={100_000}
          onChange={setSewa}
          display={rp(sewa)}
          minLabel="Rp500 rb"
          maxLabel="Rp6 jt"
        />
        <Slider
          id="sim-harga"
          label="Target harga rumah"
          value={harga}
          min={100_000_000}
          max={1_500_000_000}
          step={10_000_000}
          onChange={setHarga}
          display={rpShort(harga)}
          minLabel="Rp100 jt"
          maxLabel="Rp1,5 M"
        />
        <Slider
          id="sim-dp"
          label="Target DP"
          value={dpPct}
          min={5}
          max={30}
          step={1}
          onChange={setDpPct}
          display={`${dpPct}% = ${rpShort(r.target)}`}
          minLabel="5%"
          maxLabel="30%"
        />
        <fieldset className="rounded-2xl border border-brand-dark/10 bg-white p-5">
          <legend className="px-1 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gray">
            Tambahan dari channel percepatan (segera)
          </legend>
          <div className="mt-2 space-y-2">
            {ECO.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-brand-cream">
                <span className="flex items-center gap-3 text-[14px] text-brand-dark">
                  <input
                    type="checkbox"
                    checked={Boolean(eco[c.id])}
                    onChange={(e) => setEco((p) => ({ ...p, [c.id]: e.target.checked }))}
                    className="h-4 w-4 accent-[#C53B3B]"
                  />
                  {c.label}
                </span>
                <span className="text-[13px] font-bold text-brand-gray">+{rp(c.value)}/bln</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-brand-mute">
            Angka tambahan adalah perkiraan. Channel percepatan belum berjalan dan akan dibuka bertahap.
          </p>
        </fieldset>
      </div>

      <div className="lg:col-span-6">
        <div className="sticky top-24 rounded-3xl bg-brand-dark p-6 text-white md:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
            25% sewa jadi saldo DP
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-5">
            <div>
              <dt className="text-[12px] text-white/55">Saldo DP per bulan</dt>
              <dd className="mt-1 text-[26px] font-black leading-none text-brand-red md:text-[30px]">{rp(r.perMonth)}</dd>
              {r.extra > 0 && (
                <dd className="mt-1 text-[12px] text-white/50">
                  {rp(r.core)} dari sewa + {rp(r.extra)} tambahan
                </dd>
              )}
            </div>
            <div>
              <dt className="text-[12px] text-white/55">Waktu menabung DP</dt>
              <dd className="mt-1 text-[26px] font-black leading-none md:text-[30px]">
                {Number.isFinite(r.months) ? `${r.months} bln` : "-"}
              </dd>
              <dd className="mt-1 text-[12px] text-white/50">sekitar {years(r.months)} tahun setelah RTO terbuka</dd>
            </div>
          </dl>
          <div className="mt-6">{Number.isFinite(r.months) && <Chart months={r.months} perMonth={r.perMonth} target={r.target} />}</div>
          {r.extra > 0 && Number.isFinite(r.monthsCore) && r.monthsCore > r.months && (
            <p className="mt-3 rounded-2xl bg-white/5 p-3 text-[13px] text-white/75">
              Dengan channel tambahan, {r.monthsCore - r.months} bulan lebih cepat dibanding hanya dari sewa ({r.monthsCore} bulan).
            </p>
          )}
          <p className="mt-5 text-[12px] leading-relaxed text-white/50">
            Saldo DP mulai dicatat setelah RTO terbuka, yaitu setelah {RTO_UNLOCK_MONTHS} bulan sewa tepat waktu.
            {Number.isFinite(r.months) && ` Total dari awal sewa sekitar ${r.months + RTO_UNLOCK_MONTHS} bulan.`} Ini simulasi indikatif dengan harga hari ini. Harga rumah bisa naik selama kamu menabung, dan skema final
            diumumkan saat program dibuka.
          </p>
          <a
            href={formAnchor}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-red-dark"
          >
            Daftar minat program RTO
          </a>
        </div>
      </div>
    </div>
  );
}
