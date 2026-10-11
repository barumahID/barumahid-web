import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { ARTICLES } from "@/data/articles";
import { LISTINGS } from "@/data/listings";
import { PARTNER_ROLES } from "@/data/roles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/layanan", priority: 0.7 },
    { path: "/layanan/rto", priority: 0.9 },
    { path: "/layanan/contech", priority: 0.9 },
    { path: "/kemitraan", priority: 0.8 },
    { path: "/tentang", priority: 0.6 },
    { path: "/kontak", priority: 0.5 },
    { path: "/rekrutmen", priority: 0.3 },
    { path: "/kebijakan-privasi", priority: 0.2 },
    ...PARTNER_ROLES.map((r) => ({ path: `/kemitraan/daftar/${r.slug}`, priority: 0.4 })),
    ...LISTINGS.map((l) => ({ path: `/layanan/rto/${l.slug}`, priority: 0.8 })),
    ...(ARTICLES.length ? [{ path: "/artikel", priority: 0.6 }] : []),
    ...ARTICLES.map((a) => ({ path: `/artikel/${a.slug}`, priority: 0.5 })),
  ];
  return pages.map((p) => ({ url: `${base}${p.path}`, lastModified: now, priority: p.priority }));
}
