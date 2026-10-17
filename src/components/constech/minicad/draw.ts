// Konstanta dan pembantu bersama untuk gambar miniCAD (SVG denah dan tampak).

/** 1 meter = 100 unit SVG (sentimeter) */
export const S = 100;
export const FONT = "Arial, Helvetica, sans-serif";
export const INK = "#1b1b1b";
export const THIN = "#5a5a5a";
export const RED = "#C53B3B";

/** Angka gaya Indonesia: 3,25 (tanpa nol di belakang) */
export const fmt = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");

export type Translate = (s: string, vars?: Record<string, string | number>) => string;

export interface Layers {
  dims: boolean;
  furniture: boolean;
  labels: boolean;
}

export const tanggal = (lang: string) =>
  new Date().toLocaleDateString(lang === "en" ? "en-GB" : "id-ID", { day: "numeric", month: "long", year: "numeric" });
