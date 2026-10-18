import { dpPerMonth } from "@/data/rto";
import type { Listing } from "@/data/listings";
import { rp, rpShort } from "./format";

// Estimasi DP per jalur, tampil di bawah harga kartu dan di panel unit:
// - Siap Berdaya: saldo DP per bulan dari sewa program (sewa mitra + biaya program, 25% jadi saldo DP).
// - Siap Bangun: modal mulai bangun, 25% dari nilai bangunan (RAB).
// - Siap Beli: DP 10 sampai 20% dari harga.
// - Rumah tujuan (developer mitra): DP minimal developer (bawaan 10%), dikumpulkan dari saldo DP sewa.
// Unit sewa yang pemiliknya belum ikut program tetap diberi estimasi dengan label "kalau ikut RTO".

export interface DpEstimate {
  label: string;
  value: string;
}

export function dpEstimate(l: Listing): DpEstimate | null {
  if (l.category === "siap-berdaya") {
    return { label: l.rtoReady === false ? "Estimasi kalau ikut RTO" : "Saldo DP saat RTO", value: `${rp(dpPerMonth(l.sewaPerBulan))}/bulan` };
  }
  if (l.category === "siap-beli") {
    const hi = l.hargaJualMaks ?? l.hargaJual;
    return { label: "Estimasi DP 10-20%", value: `${rpShort(l.hargaJual * 0.1)} - ${rpShort(hi * 0.2).replace(/^Rp/, "")}` };
  }
  if (l.category === "rumah-tujuan") {
    const pct = l.dpMinPct ?? 10;
    return { label: `Target DP ${pct}%`, value: rpShort((l.harga * pct) / 100) };
  }
  if (l.harga) {
    const lo = l.harga * 0.25;
    return { label: "Modal mulai bangun 25%", value: l.hargaMaks ? `${rpShort(lo)} - ${rpShort(l.hargaMaks * 0.25).replace(/^Rp/, "")}` : rpShort(lo) };
  }
  if (l.hargaLahanPerM2 && l.luasLahan) return { label: "Harga lahan", value: rpShort(l.hargaLahanPerM2 * l.luasLahan) };
  return { label: "Modal mulai bangun", value: "25% dari RAB" };
}
