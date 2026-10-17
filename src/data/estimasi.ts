// Patokan estimasi biaya dan durasi di miniCAD (arahan user Okt 2026).
// Biaya bangun per m² luas bangunan, sudah termasuk upah, alat, dan biaya lain, di luar beli tanah.
// Acuan: board "Adaptive Hive House" barumahID, Rp200-250 juta untuk rumah ±36-45 m².
// Angka pasti tetap dari survei lokasi dan RAB (AHSP). Ubah di sini kalau patokannya berubah.

export const BIAYA_PER_M2 = { min: 5_000_000, max: 6_000_000 };

/** Durasi pengerjaan (bulan) ≈ persiapan dan struktur + 1 bulan per ±30 m² luas bangunan */
export const DURASI = { dasarBulan: 2, m2PerBulan: 30 };

export const ESTIMASI_CATATAN =
  "Estimasi kasar untuk perencanaan, sudah termasuk upah, alat, dan biaya lain, di luar beli tanah. Angka pasti dari survei lokasi dan RAB.";
