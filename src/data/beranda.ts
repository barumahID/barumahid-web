import { STATS } from "./projects";
import { RTO_RATE } from "./rto";

// Isi beranda dan hub /layanan.
// Arahan user (Okt 2026): beranda bersih seperti tikalindustries.com. Halaman 1 = hero scroll-expand dengan
// DUA gambar (Jasa Konstruksi dan Rent-to-Own). Halaman 2 = deskripsi singkat barumahID + event yang diikuti.

export const HOME_HERO = {
  title: "barumahID",
  // Satu kalimat yang menyatukan dua lini: proyek (ConTech) dan kepemilikan rumah (PropTech).
  tagline: "Wujudkan proyekmu. Miliki hunian nantinya.",
  subline: "Jasa Konstruksi dan Program Kepemilikan Hunian dalam Satu Platform",
};

// Halaman 2 beranda. Arahan user: barumahID bisnis yang sedang berkembang di lini ConTech dan PropTech,
// platform untuk mewujudkan proyek dan mendampingi kepemilikan rumah.
export const HOME_ABOUT = {
  label: "Tentang barumahID",
  // Ditulis dari sudut pandang calon klien: sekali baca langsung paham barumahID itu apa dan bisa bantu apa.
  title: "Wujudkan proyekmu, kami dampingi hingga miliki hunian.",
  body: [
    "barumahID adalah platform properti yang menyatukan dua layanan: jasa konstruksi (ConTech) dan kepemilikan hunian (PropTech). Mulai dari merancang dan membangun rumah, sampai akhirnya punya hunian sendiri, kami temani di setiap langkahnya.",
    `Butuh gambar kerja, hitungan struktur, renovasi, atau bangun rumah? Insinyur kami yang mengerjakan, dengan biaya per item pekerjaan yang transparan sejak awal. Ingin punya hunian tapi DP belum cukup? Lewat program Rent-to-Own barumahID, kamu sewa huniannya dulu, dan ${Math.round(RTO_RATE * 100)}% dari sewa bulananmu otomatis dicatat jadi saldo DP.`,
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
    body: "PT Inditek Bluprim Mahaksa berdiri. barumahID tumbuh di dua lini: ConTech dan PropTech.",
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
  // titik fokus foto (CSS object-position) supaya proporsional di panel tegak maupun lebar
  focus?: string;
  badge?: string;
}

// Dua gambar di hero beranda.
export const DUA_LAYANAN: PhotoCard[] = [
  {
    href: "/layanan/contech",
    audience: "Untuk pemilik proyek",
    name: "Jasa Konstruksi",
    headline: "Proyekmu, dibikin mudah aja.",
    body: "Gambar, analisa struktur, renovasi, dan bangun. Dikerjakan insinyur, biayanya dihitung per item pekerjaan dengan AHSP.",
    cta: "Lihat jasa dan harga",
    // Foto proyek nyata yang sudah selesai (bahan user), malam hari dengan lampu pilar pagar menyala.
    image: "/images/proyek/rumah-selesai-malam.webp",
    alt: "Rumah hasil pengerjaan tim barumahID di malam hari, lampu pilar pagar menyala",
    focus: "62% 60%",
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
    href: "/layanan/contech",
    audience: "Untuk pemilik proyek",
    name: "ConTech",
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
