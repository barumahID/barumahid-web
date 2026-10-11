import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Rute bahasa (lihat src/i18n/config.ts). Semua halaman ada di app/[lang]/.
// - /en/...                 -> langsung (bahasa Inggris)
// - /id/...                 -> dialihkan ke alamat tanpa awalan, supaya tiap halaman Indonesia punya satu URL
// - selain itu (/, /tentang) -> ditulis ulang ke /id/... tanpa mengubah URL di browser,
//   kecuali pengunjung pernah memilih EN (cookie): diarahkan ke versi /en.
// Portal mitra dan tim (/portal) di luar rute bahasa: proxy hanya menyegarkan sesi login Supabase di cookie.
const LANG_COOKIE = "barumahid-lang";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/portal" || pathname.startsWith("/portal/")) return refreshPortalSession(request);

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

// Pola resmi @supabase/ssr: token yang kedaluwarsa diperbarui di sini lalu ditulis ke cookie respons.
async function refreshPortalSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Lewati API, file internal Next, dan semua file statis (yang punya titik: gambar, robots.txt, sitemap.xml, dst.)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
