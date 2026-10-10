// Konten program Rent-to-Own. Aturan wajib (PRD Produk v3.2 dan PRD Website v1):
// - Program masih tahap persiapan. Jangan tulis seolah sudah ada transaksi berjalan.
// - Siap Beli BUKAN sewa-beli sampai legal opinion Option Buy selesai. Tulis sebagai unit dijual + simulasi KPR.
// - Jangan sebut nama BTN atau bank lain sebelum ada kerja sama tertulis.

export const RTO_RATE = 0.25;

export type RtoCategory = "siap-berdaya" | "siap-bangun" | "siap-beli";

export interface RtoPath {
  id: RtoCategory;
  name: string;
  explainer: string;
  forWho: string;
  how: string;
  status: string;
}

export const RTO_PATHS: RtoPath[] = [
  {
    id: "siap-berdaya",
    name: "Siap Berdaya",
    explainer: "Sewa sambil menabung DP",
    forWho: "Untuk kamu yang belum punya DP dan ingin mulai dari sewa.",
    how: "Tinggal di unit mitra. 25% dari sewa jadi saldo DP. Saat cukup, lanjut ke KPR bersama developer mitra.",
    status: "Inti program",
  },
  {
    id: "siap-bangun",
    name: "Siap Bangun",
    explainer: "Punya lahan, siap membangun",
    forWho: "Untuk kamu yang sudah punya tanah tapi modal bangun belum cukup.",
    how: "Sewa sambil mengumpulkan modal, lalu bangun di tanahmu sendiri dengan RAB transparan dari tim ConsTech.",
    status: "Inti program",
  },
  {
    id: "siap-beli",
    name: "Siap Beli",
    explainer: "Unit dijual, lengkap dengan simulasi KPR",
    forWho: "Untuk kamu yang ingin langsung membeli rumah siap huni.",
    how: "Unit yang dijual pemiliknya lewat barumahID. Kami bantu hitung DP, cicilan KPR, dan biaya transaksi.",
    status: "Segera",
  },
];

export const RTO_STEPS = [
  { title: "Sewa unit mitra", body: "Pilih unit dari mitra barumahID yang sudah kami cek kondisinya." },
  {
    title: "25% jadi saldo DP",
    body: "Setiap kali bayar sewa, seperempatnya dicatat sebagai saldo DP atas namamu di rekening terpisah atas nama perusahaan.",
  },
  { title: "Pindah ke jalur kepemilikan", body: "Saat saldo cukup, kamu lanjut ke KPR atau membangun di lahan sendiri." },
];

export interface DpChannel {
  name: string;
  body: string;
  status: "inti" | "segera";
}

// Lima channel percepatan DP sesuai PRD v3.2. Hanya Sewa Core yang jadi inti program.
export const DP_CHANNELS: DpChannel[] = [
  { name: "Sewa Core", body: "25% dari sewa bulanan jadi saldo DP.", status: "inti" },
  { name: "Kosanesia Laundry", body: "Cuci di laundry mitra, cashback masuk saldo DP.", status: "segera" },
  { name: "Jasa Titip", body: "Titip barang antarkota, cashback masuk saldo DP.", status: "segera" },
  { name: "Jasa Pindahan", body: "Pindahan lebih mudah, cashback masuk saldo DP.", status: "segera" },
  { name: "GreenPoint", body: "Pilah sampah rutin, poinnya jadi tambahan DP.", status: "segera" },
];

export const FUND_SAFETY = [
  {
    title: "Rekening terpisah",
    body: "Saldo DP disimpan di rekening terpisah atas nama perusahaan, tidak dicampur dengan dana operasional.",
  },
  {
    title: "Laporan tiap bulan",
    body: "Sampai dashboard pelanggan siap, laporan saldo dikirim tiap bulan lewat WhatsApp.",
  },
  {
    title: "Perjanjian tertulis",
    body: "Hak dan kewajiban, termasuk kalau kamu pindah sebelum DP cukup, diatur dalam perjanjian sewa.",
  },
];

export const RTO_FAQ = [
  {
    question: "Apakah program RTO sudah berjalan?",
    answer:
      "Belum. Program pertama sedang kami siapkan bersama mitra penyedia unit. Daftar minat sekarang supaya kamu dapat kabar pertama, lengkap dengan syarat dan simulasinya.",
  },
  {
    question: "Kenapa tidak langsung KPR saja?",
    answer:
      "Banyak pekerja punya penghasilan cukup untuk cicilan, tapi tertahan di DP atau syarat administrasi. Lewat RTO, DP terkumpul dari sewa yang memang sudah kamu bayar setiap bulan.",
  },
  {
    question: "Bagaimana kalau saya pindah sebelum DP cukup?",
    answer:
      "Saldo DP tetap tercatat atas namamu. Mekanisme pengembaliannya diatur jelas di perjanjian sewa sebelum kamu mulai.",
  },
  {
    question: "Apakah ada biaya pendaftaran?",
    answer: "Tidak ada. Daftar minat gratis dan tanpa komitmen.",
  },
  {
    question: "Di kota mana program ini akan dibuka?",
    answer:
      "Kami mulai dari Padang. Jambi, Palembang, dan Pekanbaru menyusul bertahap, mengikuti ketersediaan unit mitra di tiap kota.",
  },
];
