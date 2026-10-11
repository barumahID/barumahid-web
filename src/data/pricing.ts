// Harga resmi jasa gambar dan struktur, sesuai pricelist "How to Order" Jururancang (Juli 2026)
// dan PRD Website v1. Ubah di sini saja, semua halaman ikut berubah.

export interface Tier {
  id: "basic" | "plus" | "pro";
  name: string;
  maxDays: number;
  gambar: number; // Rp per m²
  struktur: number; // Rp per m²
  gambarExtra?: string;
  strukturExtra?: string;
}

export const TIERS: Tier[] = [
  { id: "basic", name: "Basic", maxDays: 7, gambar: 15_000, struktur: 18_000 },
  { id: "plus", name: "Plus", maxDays: 10, gambar: 20_000, struktur: 25_000 },
  {
    id: "pro",
    name: "Pro",
    maxDays: 14,
    gambar: 30_000,
    struktur: 35_000,
    gambarExtra: "Layout MEP dan RAB",
    strukturExtra: "Gambar DED dan RAB struktur",
  },
];

// Isi tiap paket di kartu harga (PricingTerrace). Tambahan khusus paket Pro ada di `gambarExtra` / `strukturExtra`.
export const GAMBAR_FEATURES = [
  "Survei lokasi dan konsultasi kebutuhan",
  "Denah lantai",
  "Gambar arsitektur",
  "Gambar 3D eksterior",
  "Gambar struktur",
];

export const STRUKTUR_FEATURES = [
  "Survei lokasi dan konsultasi kebutuhan",
  "Hitungan struktur berbasis SNI (ETABS atau SAP2000)",
  "Dimensi kolom, balok, pelat, dan pondasi",
  "Penulangan atau pembesian",
];

export const PRICE_NOTE = "Harga per m² luas bangunan, menyesuaikan kerumitan proyek dan disepakati di awal. Konsultasi pertama gratis.";

// Cara hitung biaya renovasi dan bangun dengan AHSP (Analisa Harga Satuan Pekerjaan). Rumus umum, tanpa angka contoh.
export const AHSP_FORMULA = [
  {
    label: "Harga satuan",
    body: "Koefisien bahan × harga bahan, ditambah koefisien tenaga × upah, ditambah alat. Lalu ditambah biaya umum dan keuntungan.",
  },
  { label: "Biaya per item", body: "Volume pekerjaan × harga satuan. Misalnya luas dinding dalam m² × harga satuan pasang bata per m²." },
  { label: "RAB", body: "Jumlah biaya semua item pekerjaan. Angka ini yang kamu setujui sebelum pekerjaan dimulai." },
];

export const BUILD_STEPS = [
  { title: "Konsultasi", body: "Gratis. Kami dengarkan kebutuhan dan anggaranmu." },
  { title: "Survei lokasi", body: "Tim cek kondisi lapangan dan ukur kebutuhan pekerjaan." },
  { title: "Penawaran dan RAB", body: "Biaya dihitung per item pekerjaan dengan AHSP dan harga satuan daerah." },
  { title: "Kontrak", body: "Lingkup, harga, jadwal, dan termin pembayaran disepakati tertulis." },
  { title: "Pengerjaan", body: "Dikerjakan bersama mitra mandor, dengan laporan progres berkala." },
  { title: "Serah terima", body: "Hasil dicek bersama, lalu masuk masa garansi pekerjaan." },
];

export function formatRupiah(n: number): string {
  return "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n));
}

/** Rp15.000 -> "15rb" untuk label ringkas */
export function formatRibu(n: number): string {
  return `${Math.round(n / 1000)}rb`;
}
