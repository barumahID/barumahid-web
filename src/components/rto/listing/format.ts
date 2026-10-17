// Format angka untuk listing (kartu, pin peta, detail).

export const rp = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n));

/** Ringkas untuk pin peta: Rp850 rb, Rp1,2 jt, Rp1,5 M */
export function rpShort(n: number): string {
  const f = (v: number) => v.toLocaleString("id-ID", { maximumFractionDigits: 1 });
  if (n >= 1e9) return `Rp${f(n / 1e9)} M`;
  if (n >= 1e6) return `Rp${f(n / 1e6)} jt`;
  if (n >= 1e3) return `Rp${Math.round(n / 1e3)} rb`;
  return rp(n);
}

/** Batas sewa per bulan untuk filter */
export const BUDGETS = [
  { value: 0, label: "Semua harga" },
  { value: 500_000, label: "Sampai Rp500 rb" },
  { value: 1_000_000, label: "Sampai Rp1 jt" },
  { value: 1_500_000, label: "Sampai Rp1,5 jt" },
  { value: 2_000_000, label: "Sampai Rp2 jt" },
  { value: 3_000_000, label: "Sampai Rp3 jt" },
  { value: 5_000_000, label: "Sampai Rp5 jt" },
];

export const KINDS = [
  { value: "", label: "Semua jenis" },
  { value: "kos", label: "Kos" },
  { value: "rumah", label: "Rumah sewa" },
  { value: "beli", label: "Rumah dijual" },
  { value: "lahan", label: "Lahan" },
] as const;

export type KindFilter = (typeof KINDS)[number]["value"];
