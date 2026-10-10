// Isi beranda dan hub /layanan.
// Arahan user (Okt 2026): beranda bersih seperti tikalindustries.com. Setelah hero langsung 2 gambar besar
// yang mengarah ke 2 layanan utama: Jasa Konstruksi dan Rent-to-Own. Penjelasan barumahID ada di /tentang.

export const HOME_INTRO = {
  label: "Platform pendamping kepemilikan rumah",
  title: "Mau bangun, atau mau punya rumah?",
  body: "Pilih jalurmu. Dua-duanya dikerjakan tim yang sama, dari Padang untuk seluruh Indonesia.",
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

// Dua gambar besar di beranda.
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
