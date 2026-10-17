import { BIAYA_PER_M2, DURASI } from "@/data/estimasi";
import { clamp, totalArea } from "./layout";
import type { Brief, Plan } from "./types";

// Estimasi biaya dan durasi dari denah, dan kebalikannya: kebutuhan rumah dari target budget.

export interface Estimate {
  /** Luas bangunan total (m²) */
  area: number;
  min: number;
  max: number;
  /** Rentang durasi (bulan) */
  months: [number, number];
}

const round5jt = (n: number) => Math.round(n / 5_000_000) * 5_000_000;

export function estimate(plan: Plan): Estimate {
  const area = totalArea(plan);
  const base = DURASI.dasarBulan + area / DURASI.m2PerBulan;
  const lo = Math.max(2, Math.floor(base));
  return {
    area,
    min: round5jt(area * BIAYA_PER_M2.min),
    max: round5jt(area * BIAYA_PER_M2.max),
    months: [lo, lo + 1],
  };
}

/** Rp 350 juta / Rp 1,2 miliar (singkat, gaya Indonesia) */
export function rupiahSingkat(n: number, lang: string) {
  const en = lang === "en";
  if (n >= 1_000_000_000) {
    const v = Math.round((n / 1_000_000_000) * 10) / 10;
    return en ? `Rp${v} billion` : `Rp${String(v).replace(".", ",")} miliar`;
  }
  const v = Math.round(n / 1_000_000);
  return en ? `Rp${v} million` : `Rp${v} juta`;
}

/**
 * Kebutuhan rumah dari target budget: luas = budget / harga tengah per m², lalu jumlah kamar, kamar mandi,
 * dan lantai disesuaikan dengan luas dan lahan. Lahan, carport, atap, dan ruang tambahan tetap pilihan pengguna.
 */
export function briefFromBudget(budget: number, base: Brief): Brief {
  const mid = (BIAYA_PER_M2.min + BIAYA_PER_M2.max) / 2;
  const area = Math.round(clamp(budget / mid, 21, 600));
  const front = base.carport ? 5 : 1.5;
  const footprint = base.landW * Math.max(6, base.landD - front - 1);
  const floors: 1 | 2 = area > footprint * 0.85 ? 2 : 1;
  const [bedrooms, bathrooms] = area < 45 ? [2, 1] : area < 80 ? [3, 2] : area < 120 ? [4, 2] : area < 170 ? [4, 3] : [5, 3];
  return { ...base, floors, bedrooms, bathrooms, targetArea: area };
}

/** Pilihan jawaban Google Form F01 (teks harus sama persis dengan opsi di form) */
export function luasBucket(area: number) {
  return area < 50 ? "< 50 m²" : area < 100 ? "50 – 100 m²" : area < 200 ? "100 – 200 m²" : area < 500 ? "200 – 500 m²" : "> 500 m²";
}

export function budgetBucket(rp: number) {
  return rp < 50e6 ? "< Rp 50 juta" : rp < 150e6 ? "Rp 50 – 150 juta" : rp < 300e6 ? "Rp 150 – 300 juta" : rp <= 1e9 ? "Rp 300 juta – 1 miliar" : "> Rp 1 miliar";
}
