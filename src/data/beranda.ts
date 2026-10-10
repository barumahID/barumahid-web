// Isi beranda dan hub /layanan.
// Arahan user (Okt 2026): beranda bersih seperti tikalindustries.com. Halaman 1 = hero scroll-expand dengan
// DUA gambar (Jasa Konstruksi dan Rent-to-Own). Halaman 2 = deskripsi singkat barumahID + event yang diikuti.

export const HOME_HERO = {
  title: "barumahID",
  tagline: "Platform pendamping kepemilikan rumah",
};

export const HOME_ABOUT = {
  label: "Tentang barumahID",
  title: "Satu tempat untuk membangun dan memiliki rumah.",
  body: [
    "barumahID adalah platform pendamping kepemilikan rumah dari PT Inditek Bluprim Mahaksa, berbasis di Padang sejak 2018.",
    "Lewat ConsTech, tim insinyur kami mengerjakan gambar, analisa struktur, renovasi, dan bangun dengan biaya yang dihitung per item pekerjaan. Lewat program Rent-to-Own yang sedang kami siapkan, kami membuka jalan untuk memiliki rumah dari sewa.",
  ],
  cta: { label: "Kenali barumahID", href: "/tentang" },
};

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
