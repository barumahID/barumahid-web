import { isLang, localizePath, type Lang } from "./config";
import { makeT } from "./t";

// Bantuan untuk halaman (komponen server): bahasa dari params, fungsi terjemah, dan alamat kanonik + hreflang.

export async function pageLang(params: Promise<{ lang: string }>): Promise<{ lang: Lang; t: ReturnType<typeof makeT> }> {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "id";
  return { lang, t: makeT(lang) };
}

/** canonical sesuai bahasa, plus alternatif id/en untuk mesin pencari. `path` ditulis tanpa awalan bahasa. */
export function alternates(lang: Lang, path: string) {
  return {
    canonical: localizePath(lang, path),
    languages: { id: path, en: localizePath("en", path), "x-default": path },
  };
}
