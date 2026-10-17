import { BIAYA_PER_M2, DURASI } from "@/data/estimasi";
import { buildPlan, clamp, totalArea } from "./layout";
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
 * Beberapa susunan dicoba dan denahnya benar-benar disusun, supaya hasil akhirnya masuk budget
 * (kamar yang terlalu banyak untuk lahan kecil bisa membuat luas melewati target).
 */
export function briefFromBudget(budget: number, base: Brief): Brief {
  const mid = (BIAYA_PER_M2.min + BIAYA_PER_M2.max) / 2;
  const area = Math.round(clamp(budget / mid, 21, 600));
  const [idealKt, idealKm] = area < 45 ? [2, 1] : area < 80 ? [3, 2] : area < 120 ? [4, 2] : area < 170 ? [4, 3] : [5, 3];
  let best: { brief: Brief; score: number; fits: boolean; area: number } | null = null;
  for (const floors of [1, 2] as const)
    for (let kt = idealKt; kt >= Math.max(1, idealKt - 2); kt--)
      for (let km = Math.min(idealKm, kt); km >= 1; km--) {
        const brief: Brief = { ...base, floors, bedrooms: kt, bathrooms: km, targetArea: area };
        const built = totalArea(buildPlan(brief));
        const fits = built * mid <= budget * 1.02;
        // Utamakan luas yang mendekati target, lalu jumlah kamar; 1 lantai sedikit lebih disukai
        const score = Math.min(built / area, 1) + 0.08 * kt + 0.03 * km - (floors === 2 ? 0.02 : 0);
        const better = !best || (fits && !best.fits) || (fits === best.fits && (fits ? score > best.score : built < best.area));
        if (better) best = { brief, score, fits, area: built };
      }
  return best!.brief;
}

/** Pilihan jawaban Google Form F01 (teks harus sama persis dengan opsi di form) */
export function luasBucket(area: number) {
  return area < 50 ? "< 50 m²" : area < 100 ? "50 – 100 m²" : area < 200 ? "100 – 200 m²" : area < 500 ? "200 – 500 m²" : "> 500 m²";
}

export function budgetBucket(rp: number) {
  return rp < 50e6 ? "< Rp 50 juta" : rp < 150e6 ? "Rp 50 – 150 juta" : rp < 300e6 ? "Rp 150 – 300 juta" : rp <= 1e9 ? "Rp 300 juta – 1 miliar" : "> Rp 1 miliar";
}
