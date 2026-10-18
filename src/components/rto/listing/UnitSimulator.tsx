"use client";

import { useState } from "react";
import { Slider } from "@/components/rto/DPSimulator";
import { RTO_PROGRAM_FEE, RTO_RATE, RTO_UNLOCK_MONTHS, dpPerMonth, programRent } from "@/data/rto";
import { CLOSED_STATUS, listingStatusLabel, type Listing } from "@/data/listings";
import { rp, rpShort } from "./format";

// Simulasi di panel unit, mengikuti model bisnis (arahan user Okt 2026):
// - Siap Berdaya (kos/rumah sewa): sewa di unit ini -> 25% sewa program jadi saldo DP -> uang muka rumah tujuan dari
//   developer mitra (bukan unit yang disewa). Isian: harga rumah tujuan dan persen DP.
// - Rumah tujuan (developer mitra): harga rumah ini sudah tetap; isian sewa kos per bulan dan persen DP.
// - Siap Bangun: sewa kos/kontrakan mitra -> saldo DP dikumpulkan sampai 25% dari RAB -> pembangunan dimulai.
// - Siap Beli: listing jual beli di luar program RTO; simulasi DP dan cicilan KPR untuk pembeli.
// Semua angka ilustrasi; ketentuan final ada di kontrak dan keputusan bank.

/** Kanal percepatan yang belum berjalan (laundry, pilah sampah, jastip), angka simulasi PRD per bulan */
const ECO_PER_MONTH = 60_000;

function Row({ label, value, strong = false, tone }: { label: string; value: string; strong?: boolean; tone?: "credit" | "red" }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-brand-dark/10 py-2.5 text-[14px]">
      <span className="text-brand-gray">{label}</span>
      <span className={`text-right ${strong ? "text-[17px] font-black" : "font-bold"} ${tone === "credit" ? "text-credit" : tone === "red" ? "text-brand-red" : "text-brand-dark"}`}>
        {value}
      </span>
    </div>
  );
}

function Chips({ value, options, onChange, label, suffix = "%" }: { value: number; options: number[]; onChange: (n: number) => void; label: string; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-4">
      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gray">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
              value === o ? "bg-brand-dark text-white" : "border border-brand-dark/15 text-brand-dark hover:border-brand-dark"
            }`}
          >
            {o}
            {suffix}
          </button>
        ))}
      </div>
    </div>
  );
}

function Eco({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-2.5 rounded-2xl border border-brand-dark/10 bg-white p-4 text-[13.5px] text-brand-dark">
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#C53B3B]" />
      <span>
        Tambah kanal percepatan DP (laundry, pilah sampah, jastip), sekitar {rp(ECO_PER_MONTH)}/bulan. <span className="text-brand-gray">Segera, belum berjalan.</span>
      </span>
    </label>
  );
}

/** Ringkasan bulan: setelah RTO terbuka, dan total dari awal sewa */
function MonthsNote({ months }: { months: number }) {
  return (
    <p className="pt-1 text-[12.5px] leading-snug text-brand-gray">
      Total sekitar {months + RTO_UNLOCK_MONTHS} bulan dari awal sewa, termasuk {RTO_UNLOCK_MONTHS} bulan sewa biasa sebelum syarat RTO terpenuhi.
    </p>
  );
}

const feePct = Math.round(RTO_PROGRAM_FEE * 100);
const ratePct = Math.round(RTO_RATE * 100);

/** Kos atau rumah sewa mitra: sewanya tetap, rumah tujuan dipilih dari developer mitra */
function Berdaya({ rent }: { rent: number }) {
  const [harga, setHarga] = useState(400_000_000);
  const [pct, setPct] = useState(10);
  const [eco, setEco] = useState(false);
  const perMonth = dpPerMonth(rent) + (eco ? ECO_PER_MONTH : 0);
  const target = (harga * pct) / 100;
  const months = Math.ceil(target / perMonth);
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-brand-cream-warm px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
        Kamu ngekos di unit ini. Saldo DP dari sewanya dipakai untuk uang muka rumah tujuan dari developer mitra, bukan unit ini.
      </p>
      <Slider id="u-harga" label="Harga rumah tujuan (developer mitra)" value={harga} min={150_000_000} max={1_500_000_000} step={25_000_000} onChange={setHarga} display={rpShort(harga)} minLabel="Rp150 jt" maxLabel="Rp1,5 M" />
      <Chips label="DP yang dituju" value={pct} options={[10, 15, 20, 30]} onChange={setPct} />
      <Eco on={eco} set={setEco} />
      <div className="rounded-2xl bg-white p-4">
        <Row label={`Sewa program RTO (termasuk biaya ${feePct}%)`} value={`${rp(programRent(rent))}/bln`} />
        <Row label={`Jadi saldo DP (${ratePct}%)${eco ? " + kanal" : ""}`} value={`${rp(perMonth)}/bln`} tone="credit" />
        <Row label="Target DP rumah tujuan" value={rp(target)} />
        <Row label="DP tercapai" value={`${months} bulan setelah RTO terbuka`} strong tone="red" />
        <MonthsNote months={months} />
      </div>
    </div>
  );
}

/** Rumah dari developer mitra: harga tetap, sewa kos dipilih penyewa */
function Tujuan({ price, dpMin }: { price: number; dpMin: number }) {
  const [rent, setRent] = useState(1_500_000);
  const [pct, setPct] = useState(dpMin);
  const [eco, setEco] = useState(false);
  const perMonth = dpPerMonth(rent) + (eco ? ECO_PER_MONTH : 0);
  const target = (price * pct) / 100;
  const months = Math.ceil(target / perMonth);
  const options = [10, 15, 20, 30].filter((o) => o >= dpMin);
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-brand-cream-warm px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
        Rumah ini jadi tujuan saldo DP. Kamu ngekos di unit mitra, lalu {ratePct}% sewanya terkumpul untuk uang muka rumah ini.
      </p>
      <Slider id="u-rent" label="Sewa kos per bulan" value={rent} min={500_000} max={5_000_000} step={100_000} onChange={setRent} display={rpShort(rent)} minLabel="Rp500 rb" maxLabel="Rp5 jt" />
      <Chips label="DP yang dituju" value={pct} options={options.length ? options : [dpMin]} onChange={setPct} />
      <Eco on={eco} set={setEco} />
      <div className="rounded-2xl bg-white p-4">
        <Row label={`Jadi saldo DP (${ratePct}% sewa program)`} value={`${rp(perMonth)}/bln`} tone="credit" />
        <Row label="Target DP rumah ini" value={rp(target)} />
        <Row label="Reservasi (30% target)" value={`${Math.ceil((target * 0.3) / perMonth)} bulan`} />
        <Row label="DP tercapai" value={`${months} bulan setelah RTO terbuka`} strong tone="red" />
        <MonthsNote months={months} />
      </div>
    </div>
  );
}

/** Siap Bangun: saldo DP dari sewa dikumpulkan sampai 25% RAB */
function Bangun({ start }: { start: number }) {
  const [rab, setRab] = useState(start);
  const [rent, setRent] = useState(1_500_000);
  const [eco, setEco] = useState(false);
  const modal = rab * 0.25;
  const perMonth = dpPerMonth(rent) + (eco ? ECO_PER_MONTH : 0);
  const months = Math.ceil(modal / perMonth);
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-brand-cream-warm px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
        Selama ngekos atau ngontrak di unit mitra dan ikut program RTO, saldo DP dikumpulkan sampai 25% dari RAB. Setelah itu barumahID atau developer mitra mulai membangun di lahanmu.
      </p>
      <Slider id="u-rab" label="Nilai bangunan (RAB)" value={rab} min={100_000_000} max={2_000_000_000} step={25_000_000} onChange={setRab} display={rpShort(rab)} minLabel="Rp100 jt" maxLabel="Rp2 M" />
      <Slider id="u-rent-b" label="Sewa kos atau kontrakan per bulan" value={rent} min={500_000} max={5_000_000} step={100_000} onChange={setRent} display={rpShort(rent)} minLabel="Rp500 rb" maxLabel="Rp5 jt" />
      <Eco on={eco} set={setEco} />
      <div className="rounded-2xl bg-white p-4">
        <Row label="Modal mulai bangun (25% RAB)" value={rp(modal)} />
        <Row label={`Jadi saldo DP (${ratePct}% sewa program)`} value={`${rp(perMonth)}/bln`} tone="credit" />
        <Row label="Sisa 75% dibayar bertahap" value={rp(rab - modal)} />
        <Row label="Pembangunan bisa dimulai" value={`${months} bulan setelah RTO terbuka`} strong tone="red" />
        <MonthsNote months={months} />
        <p className="pt-1 text-[12.5px] leading-snug text-brand-gray">RAB final dihitung tim setelah survei dan desain. Angka ini gambaran awal.</p>
      </div>
    </div>
  );
}

/** Siap Beli: listing jual beli (di luar RTO), simulasi untuk pembeli */
function Beli({ start }: { start: number }) {
  const [harga, setHarga] = useState(start);
  const [pct, setPct] = useState(10);
  const [tenor, setTenor] = useState(15);
  const [rate, setRate] = useState(8);
  const dp = (harga * pct) / 100;
  const loan = harga - dp;
  const r = rate / 100 / 12;
  const n = tenor * 12;
  const installment = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-brand-cream-warm px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
        Listing jual beli, di luar program RTO. barumahID mempertemukan pembeli dan penjual, lalu bantu hitung DP dan KPR.
      </p>
      <Slider id="u-beli" label="Harga rumah" value={harga} min={150_000_000} max={2_000_000_000} step={25_000_000} onChange={setHarga} display={rpShort(harga)} minLabel="Rp150 jt" maxLabel="Rp2 M" />
      <Chips label="DP" value={pct} options={[10, 15, 20, 30]} onChange={setPct} />
      <Chips label="Tenor KPR" value={tenor} options={[10, 15, 20]} onChange={setTenor} suffix=" th" />
      <Slider id="u-rate" label="Bunga per tahun (ilustrasi)" value={rate} min={5} max={12} step={0.5} onChange={setRate} display={`${rate.toLocaleString("id-ID")}%`} minLabel="5%" maxLabel="12%" />
      <div className="rounded-2xl bg-white p-4">
        <Row label="Nilai DP" value={rp(dp)} tone="credit" />
        <Row label="Dibiayai KPR" value={rp(loan)} />
        <Row label="Cicilan per bulan" value={`±${rp(installment)}`} strong tone="red" />
        <p className="pt-1 text-[12.5px] leading-snug text-brand-gray">Ilustrasi bunga tetap. Keputusan KPR, bunga, dan biaya ada di bank. Belum termasuk BPHTB dan notaris.</p>
      </div>
    </div>
  );
}

export default function UnitSimulator({ l }: { l: Listing }) {
  const closed = CLOSED_STATUS.includes(l.status);
  return (
    <div>
      {closed && (
        <p className="mb-3 rounded-xl bg-brand-cream px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
          Unit ini {listingStatusLabel(l).toLowerCase()}. Simulasinya tetap bisa jadi gambaran untuk unit serupa.
        </p>
      )}
      {l.category === "siap-berdaya" ? (
        <Berdaya rent={l.sewaPerBulan} />
      ) : l.category === "rumah-tujuan" ? (
        <Tujuan price={l.harga} dpMin={l.dpMinPct ?? 10} />
      ) : l.category === "siap-bangun" ? (
        <Bangun start={l.harga ?? 500_000_000} />
      ) : (
        <Beli start={l.hargaJual} />
      )}
    </div>
  );
}
