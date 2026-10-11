"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { stripLang } from "@/i18n/config";
import { useLang } from "@/i18n/LangProvider";
import { TRANSLATED_PATHS } from "@/i18n/en";

// Selama terjemahan dikerjakan bertahap: halaman yang belum diterjemahkan tetap tampil dalam bahasa Indonesia,
// dengan pemberitahuan kecil di pojok kiri bawah (versi Inggris saja, bisa ditutup).
// Hilang sendiri saat rutenya masuk TRANSLATED_PATHS di src/i18n/en/index.ts.
export default function TranslationNotice() {
  const lang = useLang();
  const path = stripLang(usePathname());
  const [closed, setClosed] = useState(false);
  if (lang !== "en" || closed) return null;
  const done = TRANSLATED_PATHS.some((p) => (p.endsWith("/*") ? path.startsWith(p.slice(0, -1)) : path === p));
  if (done) return null;
  return (
    <div
      role="status"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 flex max-w-[calc(100%-6.5rem)] items-start gap-3 rounded-2xl bg-brand-dark/95 px-4 py-3 text-[12.5px] leading-snug text-white/85 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur sm:max-w-sm"
    >
      <span>This page is not available in English yet, so it is shown in Indonesian. The English version is coming soon.</span>
      <button type="button" onClick={() => setClosed(true)} aria-label="Close notice" className="-mr-1 shrink-0 rounded-full px-1.5 text-[16px] leading-none text-white/60 hover:text-white">
        ×
      </button>
    </div>
  );
}
