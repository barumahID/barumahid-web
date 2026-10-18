"use client";

import { useState } from "react";
import { Chips, Row, Slider } from "@/components/rto/SimParts";
import {
  DP_BOOST_TOTAL,
  DP_PCT_OPTIONS,
  KPR_ILUSTRASI,
  RTO_CONVERT_OPTIONS,
  RTO_CONVERT_YEARS,
  RTO_PROGRAM_FEE,
  RTO_RATE,
  RTO_UNLOCK_MONTHS,
  dpPerMonth,
  kprInstallment,
  maxHomePrice,
  programRent,
  rentForDp,
  saldoAfter,
  topUpPerMonth,
} from "@/data/rto";
import { BIAYA_PER_M2 } from "@/data/estimasi";
import { CLOSED_STATUS, listingStatusLabel, type Listing } from "@/data/listings";
import { rp, rpShort } from "./format";

// Simulasi di panel unit, mengikuti model bisnis dan model konversi (arahan user Okt 2026):
// - Siap Berdaya (kos/rumah sewa): sewa di unit ini, 25% sewa program jadi saldo DP, MoU rumah tujuan dengan developer
//   mitra di awal, lalu setelah 2 sampai 4 tahun saldo dikonversi jadi DP rumah itu (bukan unit yang disewa).
//   Hasil: saldo saat konversi, harga rumah yang DP-nya tertutup, dan perkiraan cicilan KPR.
// - Rumah tujuan (developer mitra): harga tetap; isian sewa kos dan lama RTO, hasil: DP tertutup atau kurang berapa.
// - Siap Bangun: saldo 2 sampai 4 tahun ditambah tabungan sendiri sampai 25% RAB, lalu pembangunan dimulai.
// - Siap Beli: listing jual beli di luar program RTO; simulasi DP dan cicilan KPR untuk pembeli.
// Semua angka ilustrasi; ketentuan final ada di Kontrak RTO, MoU, dan keputusan bank.

const feePct = Math.round(RTO_PROGRAM_FEE * 100);
const ratePct = Math.round(RTO_RATE * 100);
const kprNote = `${KPR_ILUSTRASI.tenorYears} th, bunga ilustrasi ${KPR_ILUSTRASI.ratePct}%`;

function Eco({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-2.5 rounded-2xl border border-brand-dark/10 bg-white p-4 text-[13.5px] text-brand-dark">
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#C53B3B]" />
      <span>
        Tambah channel percepatan DP (laundry, pilah sampah, jasa titip dan pindahan), sekitar {rp(DP_BOOST_TOTAL)}/bulan.{" "}
        <span className="text-brand-gray">Segera, belum berjalan.</span>
      </span>
    </label>
  );
}

function YearsChips({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return <Chips label="Konversi jadi DP setelah" value={value} options={RTO_CONVERT_OPTIONS} onChange={onChange} suffix=" tahun" />;
}

/** Ringkasan waktu: 6 bulan sewa biasa, lalu masa RTO sampai konversi */
function TimeNote({ years }: { years: number }) {
  const total = (years * 12 + RTO_UNLOCK_MONTHS) / 12;
  return (
    <p className="pt-1 text-[12.5px] leading-snug text-brand-gray">
      Total sekitar {total.toLocaleString("id-ID", { maximumFractionDigits: 1 })} tahun dari awal sewa: {RTO_UNLOCK_MONTHS} bulan sewa biasa, lalu {years} tahun RTO.
      Rumah, harga, dan jadwal konversi dicatat di MoU sejak awal.
    </p>
  );
}

/** Kos atau rumah sewa mitra: sewanya tetap, rumah tujuan dipilih dari developer mitra */
function Berdaya({ rent }: { rent: number }) {
  const [years, setYears] = useState<number>(RTO_CONVERT_YEARS.default);
  const [pct, setPct] = useState(10);
  const [eco, setEco] = useState(false);
  const extra = eco ? DP_BOOST_TOTAL : 0;
  const saldo = saldoAfter(rent, years, extra);
  const max = maxHomePrice(saldo, pct);
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-brand-cream-warm px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
        Kamu ngekos di unit ini. Saldo DP dari sewanya dipakai untuk uang muka rumah tujuan dari developer mitra, bukan unit ini.
      </p>
      <YearsChips value={years} onChange={setYears} />
      <Chips label="DP rumah dari developer" value={pct} options={DP_PCT_OPTIONS} onChange={setPct} />
      <Eco on={eco} set={setEco} />
      <div className="rounded-2xl bg-white p-4">
        <Row label={`Sewa program RTO (termasuk biaya ${feePct}%)`} value={`${rp(programRent(rent))}/bln`} />
        <Row label={`Jadi saldo DP (${ratePct}%)${eco ? " + channel" : ""}`} value={`${rp(dpPerMonth(rent) + extra)}/bln`} tone="credit" />
        <Row label={`Saldo setelah ${years} tahun`} value={rp(saldo)} tone="credit" />
        <Row label={`Rumah yang bisa dituju (DP ${pct}%)`} value={`s.d. ${rpShort(max)}`} strong tone="red" />
        <Row label={`Perkiraan cicilan KPR (${kprNote})`} value={`±${rpShort(kprInstallment(max - saldo))}/bln`} />
        <TimeNote years={years} />
      </div>
    </div>
  );
}

/** Rumah dari developer mitra: harga tetap, sewa kos dipilih penyewa */
function Tujuan({ price, dpMin }: { price: number; dpMin: number }) {
  const [rent, setRent] = useState(1_500_000);
  const [years, setYears] = useState<number>(RTO_CONVERT_YEARS.default);
  const [eco, setEco] = useState(false);
  const extra = eco ? DP_BOOST_TOTAL : 0;
  const dp = (price * dpMin) / 100;
  const saldo = saldoAfter(rent, years, extra);
  const gap = Math.max(0, dp - saldo);
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-brand-cream-warm px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
        Rumah ini jadi tujuan saldo DP. Kamu ngekos di unit mitra, {ratePct}% sewanya terkumpul, lalu dikonversi jadi DP rumah ini sesuai jadwal di MoU.
      </p>
      <Slider id="u-rent" label="Sewa kos per bulan" value={rent} min={500_000} max={5_000_000} step={100_000} onChange={setRent} display={rpShort(rent)} minLabel="Rp500 rb" maxLabel="Rp5 jt" />
      <YearsChips value={years} onChange={setYears} />
      <Eco on={eco} set={setEco} />
      <div className="rounded-2xl bg-white p-4">
        <Row label={`DP rumah ini (${dpMin}%)`} value={rp(dp)} />
        <Row label={`Saldo setelah ${years} tahun`} value={rp(saldo)} tone="credit" />
        {gap > 0 ? (
          <>
            <Row label="Kurang saat konversi" value={rp(gap)} strong tone="red" />
            <p className="pt-1 text-[12.5px] leading-snug text-brand-gray">
              Tutup dengan tabungan sekitar {rp(topUpPerMonth(gap, years))}/bulan, atau pilih kos dengan sewa sekitar {rpShort(rentForDp(dp, years))}/bulan.
            </p>
          </>
        ) : (
          <Row label="DP rumah ini" value="Tertutup saldo" strong tone="credit" />
        )}
        <Row label={`Perkiraan cicilan KPR (${kprNote})`} value={`±${rpShort(kprInstallment(price - Math.max(saldo, dp)))}/bln`} />
        <TimeNote years={years} />
      </div>
    </div>
  );
}

/** Siap Bangun: saldo DP dari sewa ditambah tabungan sendiri sampai 25% RAB */
function Bangun({ start }: { start: number }) {
  const [rab, setRab] = useState(start);
  const [rent, setRent] = useState(1_500_000);
  const [years, setYears] = useState<number>(RTO_CONVERT_YEARS.default);
  const [own, setOwn] = useState(0);
  const [eco, setEco] = useState(false);
  const need = rab * 0.25;
  const saldo = saldoAfter(rent, years, eco ? DP_BOOST_TOTAL : 0);
  const total = saldo + own;
  const gap = Math.max(0, need - total);
  const rabBisa = Math.floor(total / 0.25 / 5_000_000) * 5_000_000;
  const luas = Math.floor(rabBisa / ((BIAYA_PER_M2.min + BIAYA_PER_M2.max) / 2));
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-brand-cream-warm px-4 py-2.5 text-[13px] leading-snug text-brand-dark">
        Selama ngekos atau ngontrak di unit mitra dan ikut RTO, saldo DP terkumpul. Saat konversi, saldo ditambah tabunganmu sampai 25% dari RAB, lalu pembangunan
        dimulai di lahanmu.
      </p>
      <Slider id="u-rab" label="Nilai bangunan (RAB)" value={rab} min={100_000_000} max={2_000_000_000} step={25_000_000} onChange={setRab} display={rpShort(rab)} minLabel="Rp100 jt" maxLabel="Rp2 M" />
      <Slider id="u-rent-b" label="Sewa kos atau kontrakan per bulan" value={rent} min={500_000} max={5_000_000} step={100_000} onChange={setRent} display={rpShort(rent)} minLabel="Rp500 rb" maxLabel="Rp5 jt" />
      <YearsChips value={years} onChange={setYears} />
      <Slider id="u-own" label="Tabungan sendiri saat konversi" value={own} min={0} max={300_000_000} step={5_000_000} onChange={setOwn} display={own ? rpShort(own) : "Belum ada"} minLabel="Rp0" maxLabel="Rp300 jt" />
      <Eco on={eco} set={setEco} />
      <div className="rounded-2xl bg-white p-4">
        <Row label="Modal mulai bangun (25% RAB)" value={rp(need)} />
        <Row label={`Saldo setelah ${years} tahun`} value={rp(saldo)} tone="credit" />
        {own > 0 && <Row label="Ditambah tabungan sendiri" value={rp(own)} tone="credit" />}
        {gap > 0 ? (
          <>
            <Row label="Kurang dari 25% RAB" value={rp(gap)} strong tone="red" />
            <p className="pt-1 text-[12.5px] leading-snug text-brand-gray">
              Atau mulai dari tahap pertama: modal ini cukup untuk RAB sekitar {rpShort(rabBisa)}, kira-kira {luas} m² bangunan (patokan {rpShort(BIAYA_PER_M2.min)}-
              {rpShort(BIAYA_PER_M2.max).replace(/^Rp/, "")}/m²).
            </p>
          </>
        ) : (
          <Row label="Pembangunan bisa dimulai" value="Modal cukup" strong tone="credit" />
        )}
        <Row label="Sisa 75% dibayar bertahap" value={rp(rab - need)} />
        <TimeNote years={years} />
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
        <Row label="Cicilan per bulan" value={`±${rp(kprInstallment(loan, rate, tenor))}`} strong tone="red" />
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
