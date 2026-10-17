import { useSyncExternalStore } from "react";
import { f01Prefill, GFORMS } from "@/data/google-forms";
import { BIAYA_PER_M2 } from "@/data/estimasi";
import { budgetBucket, estimate, luasBucket, rupiahSingkat } from "./estimate";
import { encodePlan, planSummary } from "./parse";
import type { Plan } from "./types";

// Denah terakhir dari miniCAD, dipakai bersama oleh tombol "Survei Kebutuhan & Konsultasi Awal" (F01) di
// halaman ConTech: pengunjung cukup mengisi satu form, isian proyeknya sudah terisi dari denah.

export interface DenahShared {
  plan: Plan;
  city: string;
  budget: number | null;
}

let current: DenahShared | null = null;
const listeners = new Set<() => void>();

export function setSharedDenah(v: DenahShared | null) {
  current = v;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useSharedDenah() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/** Link F01 yang sudah terisi dari denah (teks jawaban tetap bahasa Indonesia, dicocokkan dengan form) */
export function f01LinkFor(shared: DenahShared | null) {
  if (!shared) return GFORMS.F01;
  const { plan, city, budget } = shared;
  const est = estimate(plan);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.barumahid.com";
  const jt = (n: number) => Math.round(n / 1_000_000);
  const detail = [
    `Dari miniCAD barumahID: ${planSummary(plan)}`,
    `Estimasi biaya ${rupiahSingkat(est.min, "id")} sampai ${rupiahSingkat(est.max, "id")} (± Rp${jt(BIAYA_PER_M2.min)}-${jt(BIAYA_PER_M2.max)} juta/m², di luar tanah), durasi ± ${est.months[0]}-${est.months[1]} bulan.`,
    budget ? `Target budget ${rupiahSingkat(budget, "id")}.` : "",
    `Buka denah: ${origin}/layanan/contech?denah=${encodePlan(plan)}#konsultasi`,
  ]
    .filter(Boolean)
    .join(" ");
  return f01Prefill({
    kota: city.trim() || undefined,
    layanan: ["Bangun baru dari awal"],
    jenisBangunan: "Rumah tinggal",
    luas: luasBucket(est.area),
    budget: budgetBucket(budget ?? (est.min + est.max) / 2),
    detail,
  });
}
