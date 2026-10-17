"use client";

import { useT } from "@/i18n/LangProvider";
import { f01LinkFor, useSharedDenah } from "@/lib/denah/shared";

// Tombol form F01 "Survei Kebutuhan & Konsultasi Awal". Kalau pengunjung sudah membuat denah di miniCAD,
// isian proyeknya (jenis layanan, luas, budget, detail, tautan denah) sudah terisi otomatis.

export default function SurveyCta() {
  const t = useT();
  const shared = useSharedDenah();
  return (
    <a
      href={f01LinkFor(shared)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-2xl bg-brand-red px-5 py-4 text-white transition-colors hover:bg-brand-red-dark"
    >
      <span>
        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">F01 · {t("Sebelum proyek")}</span>
        <span className="mt-0.5 block text-[17px] font-extrabold leading-snug">{t("Survei Kebutuhan & Konsultasi Awal")}</span>
        <span className="mt-1 block text-[12.5px] text-white/80">{shared ? t("Isian proyek sudah terisi dari denahmu.") : t("Isi data diri dan kebutuhan proyekmu dalam satu form.")}</span>
      </span>
      <span className="text-[20px] font-bold transition-transform group-hover:translate-x-0.5">↗</span>
    </a>
  );
}
