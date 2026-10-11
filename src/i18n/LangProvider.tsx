"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LANG, type Lang } from "./config";
import { makeT } from "./t";

// Bahasa aktif untuk komponen client. Diisi dari layout [lang]. Komponen server memakai makeT(lang) dari params.
const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

export function useT() {
  const lang = useLang();
  return useMemo(() => makeT(lang), [lang]);
}
