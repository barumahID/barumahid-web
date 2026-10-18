// Listing properti untuk halaman Layanan RTO.
//
// ATURAN (PRD Website v1, bagian Layanan RTO):
// - Tidak ada listing dummy. Isi di sini hanya unit asli dari user (founder), lengkap dengan data yang dia berikan.
//   Yang tidak diketahui dikosongkan, bukan dikarang.
// - Alamat persis tidak ditampilkan. Cukup kelurahan dan kecamatan. Nama pemilik tidak ditulis di mana pun
//   (judul, slug, nama file foto).
// - Unit kos dan rumah sewa dari mitra penyedia kos yang mendaftar lewat Portal TIDAK ditulis di sini: datang dari
//   database (unit tayang atau penuh setelah inspeksi, lihat src/lib/rto-listing.ts). Array ini untuk unit yang
//   dikelola manual oleh tim.
// Foto listing manual di /public/images/listing/<slug>/NN.webp, 4:3, lebar maksimal 1600 px, plat nomor diburamkan.

import type { RtoCategory } from "./rto";

/** tersedia, terisi (penuh), segera (belum dibuka), terjual (Siap Beli), selesai (Siap Bangun sudah dibangun) */
export type ListingStatus = "tersedia" | "terisi" | "segera" | "terjual" | "selesai";

export const STATUS_LABEL: Record<ListingStatus, string> = {
  tersedia: "Tersedia",
  terisi: "Penuh",
  segera: "Segera",
  terjual: "Terjual",
  selesai: "Sudah dibangun",
};

/** Status yang tidak bisa dipesan lagi: ditaruh di belakang hasil cari */
export const CLOSED_STATUS: ListingStatus[] = ["terisi", "terjual", "selesai"];

interface ListingBase {
  slug: string;
  category: RtoCategory;
  title: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  status: ListingStatus;
  /** Ganti teks status bawaan, misalnya "Tahap penawaran" */
  statusLabel?: string;
  /** Contoh: "7 Januari 2027" (unit penuh yang sudah jelas kapan kosong lagi) */
  availableFrom?: string;
  /** Ganti sebutan jenis di kartu, misalnya "Rencana kos" atau "Rumah 2 lantai" */
  kindLabel?: string;
  photos: { src: string; alt: string }[];
  videoUrl?: string;
  /** Jarak ke tempat penting, contoh: "5 menit ke Universitas Andalas" */
  nearby?: string[];
  description?: string;
  /** Titik perkiraan untuk peta (sudah digeser atau titik tengah kelurahan, bukan lokasi persis) */
  approx?: { lat: number; lng: number };
  /** Rincian tambahan yang tidak punya kolom sendiri, tampil di bagian Rincian */
  rincian?: { title: string; rows: [string, string][] }[];
}

export interface SiapBerdayaListing extends ListingBase {
  category: "siap-berdaya";
  /** Sewa per bulan (untuk filter dan hitungan saldo DP). Kontrak tahunan: isi sewaPerTahun / 12. */
  sewaPerBulan: number;
  /** Batas atas kalau harganya rentang (beberapa tipe kamar) */
  sewaPerBulanMaks?: number;
  /** Kontrak rumah per tahun: jadi harga utama yang tampil */
  sewaPerTahun?: number;
  /** Unit dari Portal: kos per kamar atau rumah sewa per unit */
  kind?: "kos" | "rumah";
  /** Jumlah kamar di kos atau jumlah unit rumah */
  rooms?: number;
  /** Pemilik bersedia unit diikutkan program RTO. Tidak diisi = dianggap bersedia. */
  rtoReady?: boolean;
  deposit?: number;
  minSewaBulan?: number;
  luasBangunan?: number;
  kamarTidur?: number;
  kamarMandi?: number;
  listrikVA?: number;
  listrikTipe?: "Token" | "Pascabayar";
  air?: string;
  utilitasTermasuk?: string;
  internet?: string;
  perabot?: "Kosong" | "Semi furnished" | "Furnished";
  fasilitas?: string[];
  aturan?: string[];
}

export interface SiapBeliListing extends ListingBase {
  category: "siap-beli";
  hargaJual: number;
  /** Batas atas kalau harganya rentang */
  hargaJualMaks?: number;
  nego?: boolean;
  luasTanah?: number;
  luasBangunan?: number;
  lantai?: number;
  kamarTidur?: number;
  kamarMandi?: number;
  sertifikat?: "SHM" | "SHGB" | "AJB" | "Lainnya";
  pbg?: string;
  pbbTerakhir?: string;
  listrikVA?: number;
  air?: string;
  fasilitas?: string[];
  kondisi?: string;
  tahunBangun?: number;
  lebarJalan?: string;
  hadap?: string;
  riwayatBanjir?: string;
}

export interface SiapBangunListing extends ListingBase {
  category: "siap-bangun";
  hargaLahanPerM2?: number;
  luasLahan?: number;
  /** Kisaran nilai proyek kalau bukan jual lahan (misalnya rumah yang sudah dibangun) */
  harga?: number;
  hargaMaks?: number;
  dimensi?: string;
  kontur?: string;
  sertifikat?: "SHM" | "SHGB" | "AJB" | "Lainnya";
  zonasi?: string;
  kdb?: string;
  klb?: string;
  gsb?: string;
  aksesUtilitas?: string[];
  lebarJalan?: string;
  jenisTanah?: string;
  riwayatBanjir?: string;
  rekomendasi?: string;
}

export type Listing = SiapBerdayaListing | SiapBeliListing | SiapBangunListing;

const foto = (slug: string, alts: string[]) => alts.map((alt, i) => ({ src: `/images/listing/${slug}/${String(i + 1).padStart(2, "0")}.webp`, alt }));

// Data dari user (Okt 2026), untuk mengisi listing awal supaya progres RTO terlihat.
export const LISTINGS: Listing[] = [
  {
    slug: "kos-karet-kuningan-setiabudi",
    category: "siap-berdaya",
    kind: "kos",
    rtoReady: false,
    title: "Kos dekat perkantoran Kuningan, beberapa pilihan kamar",
    kelurahan: "Karet Kuningan",
    kecamatan: "Setiabudi",
    city: "Jakarta Selatan",
    status: "tersedia",
    sewaPerBulan: 2_000_000,
    sewaPerBulanMaks: 3_000_000,
    fasilitas: ["AC", "Kamar mandi dalam", "Tempat tidur", "Lemari"],
    description:
      "Kos di area Karet Kuningan, dekat perkantoran Kuningan dan Setiabudi. Ada beberapa pilihan kamar dengan harga Rp2 sampai 3 juta per bulan, tergantung ukuran dan fasilitasnya. Fasilitas tiap kamar bisa berbeda, tanya admin untuk kamar yang sedang kosong.",
    photos: foto("kos-karet-kuningan-setiabudi", [
      "Kamar kos dengan kasur, lemari, dan wastafel",
      "Kamar kos dilihat dari arah kasur ke pintu",
      "Meja kerja di samping kasur",
      "Pilihan kamar lain dengan jendela dan meja",
      "Kamar mandi dalam",
    ]),
    approx: { lat: -6.22091, lng: 106.82873 },
  },
  {
    slug: "rumah-4-kamar-dekat-rs-m-djamil",
    category: "siap-berdaya",
    kind: "rumah",
    rtoReady: false,
    title: "Rumah 4 kamar dekat RS M. Djamil, bisa kontrak atau per kamar",
    kelurahan: "Sawahan Timur",
    kecamatan: "Padang Timur",
    city: "Padang",
    status: "terisi",
    availableFrom: "7 Januari 2027",
    sewaPerTahun: 25_000_000,
    sewaPerBulan: Math.round(25_000_000 / 12),
    kamarTidur: 4,
    kamarMandi: 2,
    listrikVA: 1300,
    listrikTipe: "Pascabayar",
    air: "PDAM",
    utilitasTermasuk: "Belum termasuk listrik dan air",
    perabot: "Kosong",
    fasilitas: ["Ruang tamu", "Dapur", "Area mesin cuci", "Kamar mandi bersama"],
    aturan: ["Tidak disarankan untuk yang membawa mobil"],
    nearby: [
      "5 menit ke RS M. Djamil",
      "5 menit ke Jl. Sawahan dan Jati",
      "5 menit ke Suzuya (Hypermart)",
      "SD dan SMP di dalam kompleks",
      "10 menit ke Fakultas Kedokteran Unand Jati",
      "10 menit ke FKG Unand Jati",
    ],
    description:
      "Rumah 4 kamar tidur di kompleks perumahan, cocok buat keluarga atau dibagi jadi kos per kamar. Ada ruang tamu, dapur, dan area mesin cuci. Dua kamar mandi ada di luar kamar.\nKontrak satu rumah Rp25 juta per tahun, belum termasuk listrik dan air. Bisa juga disewa per kamar seperti kos, harga per kamar tanya admin.\nLokasinya di samping rel kereta api. Jalan masuknya tidak cocok untuk mobil.",
    rincian: [{ title: "Cara sewa", rows: [["Kontrak satu rumah", "Rp25.000.000 per tahun"], ["Sewa per kamar", "Bisa, tanya admin"]] }],
    photos: foto("rumah-4-kamar-dekat-rs-m-djamil", [
      "Tampak depan rumah 4 kamar",
      "Tampak depan saat sore hari",
      "Ruang tamu",
      "Kamar tidur dengan jendela",
      "Lorong ke ruang depan",
    ]),
    approx: { lat: -0.94175, lng: 100.37386 },
  },
  {
    slug: "rumah-3-kamar-parak-karakah",
    category: "siap-beli",
    kindLabel: "Rumah",
    title: "Rumah 3 kamar dengan garasi, bebas banjir",
    kelurahan: "Kubu Dalam Parak Karakah",
    kecamatan: "Padang Timur",
    city: "Padang",
    status: "terjual",
    hargaJual: 500_000_000,
    hargaJualMaks: 1_000_000_000,
    kamarTidur: 3,
    kamarMandi: 2,
    fasilitas: ["Ruang tamu", "Dapur", "Garasi mobil"],
    kondisi: "Bisa full furnished atau tanpa perabot",
    riwayatBanjir: "Bebas banjir",
    nearby: ["Dekat mushalla", "10 menit ke RS Semen Padang", "10 menit ke Jl. Lubuk Begalung", "10 menit ke kampus UPI"],
    description:
      "Rumah 3 kamar tidur dan 2 kamar mandi di kompleks perumahan, lengkap dengan ruang tamu, dapur, dan garasi mobil. Lingkungannya bebas banjir dan dekat mushalla.\nRumah ini sudah terjual di kisaran Rp500 juta sampai Rp1 miliar.",
    photos: foto("rumah-3-kamar-parak-karakah", [
      "Tampak depan rumah",
      "Ruang tamu memanjang",
      "Kamar tidur utama",
      "Ruang makan",
      "Dapur dan tangga",
    ]),
    approx: { lat: -0.94643, lng: 100.39335 },
  },
  {
    slug: "rencana-kos-16-kamar-jakarta-barat",
    category: "siap-bangun",
    kindLabel: "Rencana kos",
    title: "Rencana kos 2 lantai, 16 kamar",
    kelurahan: "",
    kecamatan: "",
    city: "Jakarta Barat",
    status: "segera",
    statusLabel: "Tahap penawaran",
    luasLahan: 98,
    dimensi: "7 m x 14 m",
    rekomendasi: "Kos 2 lantai (fase 1), struktur siap dikembangkan sampai 4 lantai",
    description:
      "Rumah lama di Jakarta Barat yang direncanakan jadi kos lewat jalur Siap Bangun. Saat ini masih tahap penawaran dengan pemilik.\nRancangan tim barumahID: kos 2 lantai di lahan 7 x 14 m, 8 kamar per lantai (16 kamar), 3 kamar mandi bersama per lantai. Strukturnya beton bertulang supaya nanti bisa ditambah sampai 4 lantai.",
    rincian: [
      {
        title: "Rencana bangunan",
        rows: [
          ["Jumlah lantai (fase 1)", "2 lantai, rencana 4 lantai"],
          ["Jumlah kamar", "16 kamar, 8 per lantai"],
          ["Ukuran kamar", "2,8 m x 2,8 m"],
          ["Kamar mandi", "3 kamar mandi bersama per lantai"],
          ["Struktur", "Beton bertulang untuk 4 lantai"],
          ["Dinding", "Bata ringan"],
        ],
      },
    ],
    photos: foto("rencana-kos-16-kamar-jakarta-barat", [
      "Render tampak depan rencana kos 2 lantai",
      "Visualisasi 3D rencana kos dari beberapa sisi",
      "Denah lantai 1, 8 kamar kos",
      "Denah 2D kos 14 x 7 meter",
      "Kondisi bangunan lama saat ini",
    ]),
  },
  {
    slug: "rumah-2-lantai-hasil-siap-bangun",
    category: "siap-bangun",
    kindLabel: "Rumah 2 lantai",
    title: "Rumah 2 lantai di lahan milik pemilik",
    kelurahan: "",
    kecamatan: "",
    city: "Padang",
    status: "selesai",
    harga: 750_000_000,
    hargaMaks: 1_000_000_000,
    description:
      "Contoh jalur Siap Bangun: rumah 2 lantai yang sudah berdiri di atas lahan milik pemiliknya sendiri. Nilainya di kisaran Rp750 juta sampai Rp1 miliar.\nPunya lahan dan ingin membangun bertahap? Ceritakan rencanamu ke tim barumahID.",
    photos: foto("rumah-2-lantai-hasil-siap-bangun", ["Tampak depan rumah 2 lantai", "Jalan di depan rumah"]),
  },
];

/** Lokasi yang boleh tampil: kelurahan, kecamatan, kota (bagian yang kosong dilewati) */
export function listingPlace(l: Pick<ListingBase, "kelurahan" | "kecamatan" | "city">): string {
  return [l.kelurahan, l.kecamatan, l.city].filter(Boolean).join(", ");
}

/** Sebutan jenis unit: "Kos", "Rumah sewa", atau sebutan khusus listing manual */
export function listingKind(l: Listing): string {
  if (l.kindLabel) return l.kindLabel;
  if (l.category === "siap-berdaya") return l.kind === "kos" ? "Kos" : "Rumah sewa";
  return l.category === "siap-beli" ? "Rumah dijual" : "Lahan";
}

export function listingStatusLabel(l: Listing): string {
  return l.statusLabel ?? STATUS_LABEL[l.status];
}

/** Bisa diikutkan program RTO (unit Siap Berdaya yang pemiliknya bersedia) */
export function listingRto(l: Listing): boolean {
  return l.category === "siap-berdaya" && l.rtoReady !== false;
}

export interface ListingPrice {
  label: string;
  /** null = belum ada harga (misalnya masih tahap penawaran) */
  value: number | null;
  max?: number;
  suffix?: string;
}

export function listingPrice(l: Listing): ListingPrice {
  if (l.category === "siap-berdaya") {
    if (l.sewaPerTahun) return { label: "Kontrak", value: l.sewaPerTahun, suffix: "/tahun" };
    return { label: "Sewa", value: l.sewaPerBulan, max: l.sewaPerBulanMaks, suffix: "/bulan" };
  }
  if (l.category === "siap-beli") return { label: "Harga jual", value: l.hargaJual, max: l.hargaJualMaks };
  if (l.hargaLahanPerM2 && l.luasLahan) return { label: "Harga lahan", value: l.hargaLahanPerM2 * l.luasLahan };
  if (l.harga) return { label: "Kisaran nilai", value: l.harga, max: l.hargaMaks };
  return { label: "Harga", value: null };
}

/** Nilai untuk urutan harga: listing tanpa harga di belakang */
export const priceSortValue = (l: Listing) => listingPrice(l).value ?? Number.POSITIVE_INFINITY;
