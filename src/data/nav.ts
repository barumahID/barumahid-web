import { ARTICLES } from "./articles";

export interface NavChild {
  href: string;
  label: string;
  description: string;
  audience: string;
  /** Sub layanan di dropdown (arahan user Okt 2026, masukan pelanggan: layanan di bawah halaman tidak terlihat tanpa scroll) */
  subs?: { href: string; label: string }[];
}

export interface NavItem {
  href: string;
  label: string;
  children?: NavChild[];
}

export const SERVICE_LINKS: NavChild[] = [
  {
    href: "/layanan/rto",
    label: "Rent-to-Own",
    description: "Sewa sambil menabung DP, lalu miliki rumahnya.",
    audience: "Untuk calon pemilik rumah",
    subs: [
      { href: "/layanan/rto#siap-berdaya", label: "Rumah Berdaya" },
      { href: "/layanan/rto#siap-bangun", label: "Rumah Bangun" },
      { href: "/layanan/rto#siap-beli", label: "Rumah Beli" },
      { href: "/layanan/rto/cari", label: "Cari unit" },
    ],
  },
  {
    href: "/layanan/contech",
    label: "ConTech",
    description: "Jasa gambar, analisa struktur, renovasi, dan bangun.",
    audience: "Untuk pemilik proyek",
    subs: [
      { href: "/layanan/contech#renovasi", label: "Renovasi & Bangun" },
      { href: "/layanan/contech#harga", label: "Gambar, Modelling & Struktur" },
      { href: "/layanan/contech#konsultasi", label: "miniCAD: denah gratis" },
    ],
  },
];

// Menu Artikel baru muncul kalau sudah ada artikel yang terbit.
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan", children: SERVICE_LINKS },
  // Kemitraan punya menu sendiri, tidak lagi di bawah Layanan (arahan user Okt 2026)
  { href: "/kemitraan", label: "Kemitraan" },
  ...(ARTICLES.length > 0 ? [{ href: "/artikel", label: "Artikel" }] : []),
  // Dulu "Tentang", lalu "Ekosistem", sekarang "Profil" (EN: About Us). Alamat tetap /tentang: /ekosistem sudah
  // dipakai link lama yang mengarah ke RTO.
  { href: "/tentang", label: "Profil" },
];
