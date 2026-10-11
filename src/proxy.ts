import { NextResponse, type NextRequest } from "next/server";

// Rute bahasa (lihat src/i18n/config.ts). Semua halaman ada di app/[lang]/.
// - /en/...                 -> langsung (bahasa Inggris)
// - /id/...                 -> dialihkan ke alamat tanpa awalan, supaya tiap halaman Indonesia punya satu URL
// - selain itu (/, /tentang) -> ditulis ulang ke /id/... tanpa mengubah URL di browser,
//   kecuali pengunjung pernah memilih EN (cookie): diarahkan ke versi /en.
const LANG_COOKIE = "barumahid-lang";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/id" || pathname.startsWith("/id/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (request.cookies.get(LANG_COOKIE)?.value === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/id" : `/id${pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Lewati API, file internal Next, dan semua file statis (yang punya titik: gambar, robots.txt, sitemap.xml, dst.)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
