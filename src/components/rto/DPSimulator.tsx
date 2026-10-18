"use client";

import { useMemo, useState } from "react";
import {
  DP_BOOST,
  DP_PCT_OPTIONS,
  KPR_ILUSTRASI,
  RTO_CONVERT_OPTIONS,
  RTO_CONVERT_YEARS,
  RTO_PROGRAM_FEE,
  RTO_UNLOCK_MONTHS,
  dpPerMonth,
  kprInstallment,
  maxHomePrice,
  programRent,
  saldoAfter,
  topUpPerMonth,
} from "@/data/rto";
import { rp, rpShort } from "./listing/format";
import { Chips, Slider } from "./SimParts";

// Simulasi lengkap Rent-to-Own (/layanan/rto#simulasi). Model konversi, arahan user Okt 2026:
// 6 bulan sewa biasa -> RTO terbuka, rumah tujuan dipilih dan MoU dengan developer mitra di awal -> 25% sewa program
// jadi saldo DP selama 2 sampai 4 tahun -> saldo dikonversi jadi DP -> PPJB dan KPR.
// Hasil utama: saldo saat konversi dan harga rumah yang DP-nya tertutup. Kalau sudah punya rumah incaran, ditampilkan
// kekurangannya dan cara menutupnya. Angka channel percepatan dari simulasi PRD v3.2; channel itu belum berjalan.

const fee = Math.round(RTO_PROGRAM_FEE * 100);
const years1 = (m: number) => (m / 12).toLocaleString("id-ID", { maximumFractionDigits: 1 });

export default function DPSimulator({ formAnchor = "#daftar" }: { formAnchor?: string }) {
  const [sewa, setSewa] = useState(2_000_000);
  const [years, setYears] = useState<number>(RTO_CONVERT_YEARS.default);
  const [dpPct, setDpPct] = useState(10);
  const [boost, setBoost] = useState<Record<string, boolean>>({});
  const [incaran, setIncaran] = useState(false);
  const [harga, setHarga] = useState(250_000_000);

  const r = useMemo(() => {
    const extra = DP_BOOST.reduce((s, c) => s + (boost[c.id] ? c.value : 0), 0);
    const perMonth = dpPerMonth(sewa) + extra;
    const options = RTO_CONVERT_OPTIONS.map((y) => {
      const saldo = saldoAfter(sewa, y, extra);
      return { y, saldo, max: maxHomePrice(saldo, dpPct) };
    });
    const saldo = saldoAfter(sewa, years, extra);
    const maxPrice = maxHomePrice(saldo, dpPct);
    const price = incaran ? harga : maxPrice;
    const dpNeed = (price * dpPct) / 100;
    const gap = Math.max(0, dpNeed - saldo);
    const yearsNeeded = Math.ceil(dpNeed / (perMonth * 12));
    // Seluruh saldo dipakai sebagai uang muka; kalau kurang, dianggap ditutup tabungan sampai DP minimal
    const kpr = kprInstallment(price - Math.max(saldo, dpNeed));
    return { extra, perMonth, options, saldo, maxPrice, dpNeed, gap, yearsNeeded, kpr };
  }, [sewa, years, dpPct, boost, incaran, harga]);

  const top = Math.max(...r.options.map((o) => o.saldo));

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-3 lg:col-span-5">
        <Slider id="sim-sewa" label="Sewa kos per bulan" value={sewa} min={500_000} max={6_000_000} step={100_000} onChange={setSewa} display={rp(sewa)} minLabel="Rp500 rb" maxLabel="Rp6 jt" />
        <Chips label="Konversi jadi DP setelah" value={years} options={RTO_CONVERT_OPTIONS} onChange={setYears} suffix=" tahun" />
        <Chips label="DP rumah dari developer" value={dpPct} options={DP_PCT_OPTIONS} onChange={setDpPct} />
        <div className="rounded-2xl border border-brand-dark/10 bg-white p-4">
          <label className="flex cursor-pointer items-center gap-3 text-[14px] font-semibold text-brand-dark">
            <input type="checkbox" checked={incaran} onChange={(e) => setIncaran(e.target.checked)} className="h-4 w-4 accent-[#C53B3B]" />
            Sudah punya rumah incaran
          </label>
          {incaran && (
            <div className="mt-3">
              <Slider id="sim-harga" label="Harga rumah incaran" value={harga} min={100_000_000} max={1_500_000_000} step={5_000_000} onChange={setHarga} display={rpShort(harga)} minLabel="Rp100 jt" maxLabel="Rp1,5 M" />
            </div>
          )}
        </div>
        <fieldset className="rounded-2xl border border-brand-dark/10 bg-white p-5">
          <legend className="px-1 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gray">Tambahan dari channel percepatan (segera)</legend>
          <div className="mt-2 space-y-2">
            {DP_BOOST.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-brand-cream">
                <span className="flex items-center gap-3 text-[14px] text-brand-dark">
                  <input
                    type="checkbox"
                    checked={Boolean(boost[c.id])}
                    onChange={(e) => setBoost((p) => ({ ...p, [c.id]: e.target.checked }))}
                    className="h-4 w-4 accent-[#C53B3B]"
                  />
                  {c.label}
                </span>
                <span className="text-[13px] font-bold text-brand-gray">+{rp(c.value)}/bln</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-brand-mute">Angka tambahan adalah perkiraan. Channel percepatan belum berjalan dan akan dibuka bertahap.</p>
        </fieldset>
      </div>

      <div className="lg:col-span-7">
        <div className="sticky top-24 rounded-3xl bg-brand-dark p-6 text-white md:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
            Konversi setelah {years} tahun RTO
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-5">
            <div>
              <dt className="text-[12px] text-white/55">Saldo DP saat konversi</dt>
              <dd className="mt-1 text-[28px] font-black leading-none text-brand-red md:text-[34px]">{rpShort(r.saldo)}</dd>
              <dd className="mt-1.5 text-[12px] text-white/50">
                {rp(r.perMonth)}/bulan × {years * 12} bulan
                {r.extra > 0 && ` (termasuk ${rp(r.extra)} tambahan)`}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] text-white/55">{incaran ? `DP ${dpPct}% rumah incaran` : "Rumah yang bisa kamu tuju"}</dt>
              <dd className="mt-1 text-[28px] font-black leading-none md:text-[34px]">{incaran ? rpShort(r.dpNeed) : `s.d. ${rpShort(r.maxPrice)}`}</dd>
              <dd className="mt-1.5 text-[12px] text-white/50">{incaran ? `dari harga ${rpShort(harga)}` : `DP ${dpPct}% tertutup saldo`}</dd>
            </div>
          </dl>

          <div className="mt-6 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Bandingkan lama RTO">
            {r.options.map((o) => {
              const on = o.y === years;
              return (
                <button
                  key={o.y}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setYears(o.y)}
                  className={`rounded-2xl p-3 text-left transition-colors ${on ? "bg-white/[0.12] ring-1 ring-brand-red" : "bg-white/5 hover:bg-white/10"}`}
                >
                  <span className="flex h-16 items-end" aria-hidden="true">
                    <span className="w-full rounded-md bg-brand-red transition-[height] duration-300" style={{ height: `${Math.max(8, (o.saldo / top) * 100)}%`, opacity: on ? 1 : 0.4 }} />
                  </span>
                  <span className="mt-2 block text-[12px] text-white/60">{o.y} tahun</span>
                  <span className="block text-[15px] font-extrabold leading-tight">{rpShort(o.saldo)}</span>
                  <span className="block text-[11.5px] leading-snug text-white/55">rumah s.d. {rpShort(o.max)}</span>
                </button>
              );
            })}
          </div>

          {incaran && (
            <p className={`mt-4 rounded-2xl p-4 text-[13.5px] leading-snug ${r.gap > 0 ? "bg-white/5 text-white/80" : "bg-credit/30 text-white"}`}>
              {r.gap > 0 ? (
                <>
                  Saldo menutup {Math.floor((r.saldo / r.dpNeed) * 100)}% DP, kurang <span className="font-extrabold text-white">{rpShort(r.gap)}</span>. Bisa ditutup tabungan sekitar{" "}
                  {rp(topUpPerMonth(r.gap, years))}/bulan
                  {r.yearsNeeded > years && r.yearsNeeded <= RTO_CONVERT_YEARS.max ? `, konversi di tahun ke-${r.yearsNeeded}` : ""}, atau pilih rumah sampai{" "}
                  {rpShort(r.maxPrice)}.
                </>
              ) : (
                <>Saldo cukup untuk DP rumah incaranmu.{r.saldo > r.dpNeed && ` Lebihnya ${rpShort(r.saldo - r.dpNeed)} ikut jadi uang muka.`}</>
              )}
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="text-[12px] text-white/55">Perkiraan cicilan KPR</p>
              <p className="mt-1 text-[20px] font-extrabold">±{rpShort(r.kpr)}/bln</p>
              <p className="text-[11.5px] text-white/45">
                {KPR_ILUSTRASI.tenorYears} tahun, bunga ilustrasi {KPR_ILUSTRASI.ratePct}%
              </p>
            </div>
            <div>
              <p className="text-[12px] text-white/55">Sewa program sekarang</p>
              <p className="mt-1 text-[20px] font-extrabold">{rpShort(programRent(sewa))}/bln</p>
              <p className="text-[11.5px] text-white/45">termasuk biaya program {fee}%</p>
            </div>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-white/50">
            Total sekitar {years1(years * 12 + RTO_UNLOCK_MONTHS)} tahun dari awal sewa: {RTO_UNLOCK_MONTHS} bulan sewa biasa, lalu {years} tahun RTO sampai konversi. Rumah,
            harga, dan jadwal konversi dicatat di MoU dengan developer mitra. Belum termasuk biaya akad (notaris, BPHTB, asuransi), dan keputusan KPR ada di bank.
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
