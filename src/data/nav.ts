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
    href: "/layanan/constech",
    label: "ConsTech",
    description: "Jasa gambar, analisa struktur, renovasi, dan bangun.",
    audience: "Untuk pemilik proyek",
  },
  {
    href: "/kemitraan",
    label: "Kemitraan",
    description: "Tumbuh bareng ekosistem barumahID.",
    audience: "Untuk mitra dan profesional",
  },
];

// Menu Artikel baru muncul kalau sudah ada artikel yang terbit.
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan", children: SERVICE_LINKS },
  { href: "/portofolio", label: "Portofolio" },
  ...(ARTICLES.length > 0 ? [{ href: "/artikel", label: "Artikel" }] : []),
  { href: "/tentang", label: "Tentang" },
];
