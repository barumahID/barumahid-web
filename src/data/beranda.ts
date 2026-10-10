import { STATS } from "./projects";

// Isi beranda dan hub /layanan.
// Arahan user (Okt 2026): beranda bersih seperti tikalindustries.com. Halaman 1 = hero scroll-expand dengan
// DUA gambar (Jasa Konstruksi dan Rent-to-Own). Halaman 2 = deskripsi singkat barumahID + event yang diikuti.

export const HOME_HERO = {
  title: "barumahID",
  tagline: "Platform pendamping kepemilikan rumah",
  // Latar dari bahan user: kartu nama PT tanpa teks (no HP, alamat, email dihapus), di-blur,
  // diwarnai ulang ke palet situs. Logo PT dipindah ke footer (arahan user).
  background: "/images/beranda/hero-bg.webp",
};

// Halaman 2 beranda. Arahan user: barumahID bisnis yang sedang berkembang di lini ConsTech dan PropTech,
// platform untuk mewujudkan proyek dan mendampingi kepemilikan rumah.
export const HOME_ABOUT = {
  label: "Tentang barumahID",
  title: "Wujudkan proyekmu. Kami dampingi sampai punya rumah.",
  body: [
    "barumahID adalah bisnis yang terus bertumbuh di dua lini, ConsTech dan PropTech. Kami jadi platform tempat proyekmu diwujudkan, sekaligus teman jalan menuju rumah milik sendiri.",
    "Di ConsTech, insinyur kami mengerjakan gambar, analisa struktur, renovasi, dan bangun. Biayanya dihitung per item pekerjaan, jadi jelas dari awal. Di PropTech, kami sedang menyiapkan program Rent-to-Own: sewa hari ini, miliki hunian nantinya.",
  ],
  cta: { label: "Kenali barumahID", href: "/tentang" },
};

// Roadmap singkat di sebelah kanan "Tentang barumahID". Versi lengkap ada di TIMELINE (company.ts, /tentang).
export interface HistoryStep {
  period: string;
  title: string;
  body: string;
  current?: boolean;
}

export const HOME_HISTORY: HistoryStep[] = [
  {
    period: "2018 – 2020",
    title: "Mulai dari gambar dan hitungan",
    body: "Jasa desain dan analisa struktur jadi pijakan pertama. Sambil jalan, kami ikut kompetisi dan program startup nasional.",
  },
  {
    period: "2021 – 2023",
    title: `${STATS.projects}+ proyek selesai`,
    body: "Proyek desain, analisa struktur, renovasi, dan bangun tuntas di berbagai kota di Indonesia.",
  },
  {
    period: "2024 – sekarang",
    title: "Resmi jadi PT",
    body: "PT Inditek Bluprim Mahaksa berdiri. barumahID tumbuh di dua lini: ConsTech dan PropTech.",
    current: true,
  },
];

export interface PhotoCard {
  href: string;
  audience: string;
  name: string;
  headline: string;
  body: string;
  cta: string;
  image: string;
  alt: string;
  badge?: string;
}

// Dua gambar di hero beranda.
export const DUA_LAYANAN: PhotoCard[] = [
  {
    href: "/layanan/constech",
    audience: "Untuk pemilik proyek",
    name: "Jasa Konstruksi",
    headline: "Proyekmu, dibikin mudah aja.",
    body: "Gambar, analisa struktur, renovasi, dan bangun. Dikerjakan insinyur, biayanya dihitung per item pekerjaan dengan AHSP.",
    cta: "Lihat jasa dan harga",
    image: "/images/proyek/bangun-rumah-2-lantai-padang.webp",
    alt: "Rumah dua lantai yang sedang dibangun tim barumahID di Padang",
  },
  {
    href: "/layanan/rto",
    audience: "Untuk calon pemilik rumah",
    name: "Rent-to-Own",
    headline: "Sewa hari ini. Miliki hunian nantinya.",
    body: "Sewa unit mitra, 25% dari sewa dicatat jadi saldo DP. Ada simulasi DP dan tiga jalur kepemilikan.",
    cta: "Lihat program RTO",
    image: "/images/hero-card.webp",
    alt: "Rumah tinggal satu lantai dengan pagar dan taman depan",
    badge: "Tahap persiapan",
  },
];

// Hub /layanan: tiga layanan barumahID.
export const LAYANAN_CARDS: PhotoCard[] = [
  {
    href: "/layanan/rto",
    audience: "Untuk calon pemilik rumah",
    name: "Rent-to-Own",
    headline: "Sewa hari ini. Miliki hunian nantinya.",
    body: "Sewa unit mitra, 25% dari sewa jadi saldo DP. Ada listing rumah, simulasi DP, dan tiga jalur kepemilikan.",
    cta: "Lihat program RTO",
    image: "/images/hero-card.webp",
    alt: "Rumah tinggal satu lantai dengan pagar dan taman depan",
  },
  {
    href: "/layanan/constech",
    audience: "Untuk pemilik proyek",
    name: "ConsTech",
    headline: "Proyekmu, dibikin mudah aja.",
    body: "Jasa gambar, analisa struktur, renovasi, dan bangun. Dikerjakan insinyur, dihitung transparan.",
    cta: "Lihat jasa dan harga",
    image: "/images/proyek/render-rumah-2-lantai.webp",
    alt: "Render 3D desain rumah dua lantai karya tim barumahID",
  },
  {
    href: "/kemitraan",
    audience: "Untuk mitra dan profesional",
    name: "Kemitraan",
    headline: "Tumbuh bareng ekosistem barumahID.",
    body: "Penyedia kos, developer, kontraktor, tukang, supplier, freelancer, dan institusi pendidikan.",
    cta: "Pilih peran mitra",
    image: "/images/proyek/bangun-rumah-2-lantai-padang.webp",
    alt: "Rumah dua lantai yang sedang dibangun bersama mitra mandor",
  },
];
