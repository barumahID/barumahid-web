"use client";

import type { Pillar } from "@/data/company";
import { useT } from "@/i18n/LangProvider";

// Empat kartu LBAG: huruf, nama, penjelasan singkat, lalu artinya buat klien.
export default function PillarCards({ pillars }: { pillars: Pillar[] }) {
  const t = useT();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => (
        <article key={p.letter} className="flex h-full flex-col rounded-3xl border border-brand-dark/10 bg-white p-6 card-shadow md:p-7">
          <span className="text-[64px] font-black leading-none tracking-tighter text-brand-red">{p.letter}</span>
          <h3 className="mt-4 text-[19px] font-extrabold leading-snug tracking-tight text-brand-dark">{t(p.name)}</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-brand-gray">{t(p.body)}</p>
          <div className="mt-auto pt-5">
            <div className="rounded-2xl bg-brand-cream px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-red">{t("Artinya buat kamu")}</p>
              <p className="mt-1 text-[14px] font-medium leading-snug text-brand-dark">{t(p.benefit)}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
