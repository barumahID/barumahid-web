// Bahasa situs (arahan user Okt 2026: tombol ID/EN di pojok kanan atas, untuk semua halaman).
// - Bahasa Indonesia = utama, alamat tanpa awalan (/layanan/contech). Secara internal proxy menulis ulang ke /id/...
// - Bahasa Inggris = /en/... (/en/layanan/contech), supaya bisa diindeks mesin pencari.
// - Teks Indonesia tetap jadi sumber di src/data dan komponen. Terjemahannya di src/i18n/en/*, dicari pakai
//   teks Indonesianya (lihat t.ts). Teks yang belum ada terjemahannya tampil dalam bahasa Indonesia.

export const LANGS = ["id", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "id";
/** Cookie pilihan bahasa, diisi saat tombol ID/EN diklik. */
export const LANG_COOKIE = "barumahid-lang";

export function isLang(v: string | undefined | null): v is Lang {
  return v === "id" || v === "en";
}

/** Alamat tanpa awalan bahasa: "/en/tentang" -> "/tentang", "/en" -> "/". */
export function stripLang(pathname: string): string {
  const p = pathname.replace(/^\/(id|en)(?=\/|$)/, "");
  return p === "" ? "/" : p;
}

/** Portal mitra dan tim (/portal) berdiri sendiri di luar rute bahasa. */
export function isPortal(href: string): boolean {
  return href === "/portal" || href.startsWith("/portal/") || href.startsWith("/portal?") || href.startsWith("/portal#");
}

/** Alamat internal untuk bahasa tertentu. Link luar, mailto, tel, dan anchor (#) tidak diubah. */
export function localizePath(lang: Lang, href: string): string {
  if (lang === DEFAULT_LANG || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/api") || isPortal(href)) return href;
  if (href === "/en" || href.startsWith("/en/") || href.startsWith("/en#") || href.startsWith("/en?")) return href;
  if (href === "/") return "/en";
  if (href.startsWith("/#") || href.startsWith("/?")) return `/en${href.slice(1)}`;
  return `/en${href}`;
}
