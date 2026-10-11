import type { Lang } from "./config";
import { EN } from "./en";

// t("Teks Indonesia") -> teks Inggris kalau bahasa = en dan terjemahannya ada, selain itu teks aslinya.
// Variabel ditulis {nama} di kedua bahasa: t("Maksimal {n} hari kerja", { n: 7 }).
// Di mode dev, teks yang belum diterjemahkan dicatat di console browser/server ("[i18n] belum diterjemahkan").

export type TFn = (s: string, vars?: Record<string, string | number>) => string;

const missing = new Set<string>();
function miss(s: string) {
  if (process.env.NODE_ENV !== "production" && !missing.has(s)) {
    missing.add(s);
    console.warn("[i18n] belum diterjemahkan:", s);
  }
  return s;
}

export function makeT(lang: Lang): TFn {
  return (s, vars) => {
    let out = lang === "en" ? (EN[s] ?? miss(s)) : s;
    if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
    return out;
  };
}
