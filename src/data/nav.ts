import { ARTICLES } from "./articles";

export interface NavChild {
  href: string;
  label: string;
  description: string;
  audience: string;
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
  },
  {
    href: "/layanan/contech",
    label: "ConTech",
    description: "Jasa gambar, analisa struktur, renovasi, dan bangun.",
    audience: "Untuk pemilik proyek",
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
