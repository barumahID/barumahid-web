"use client";

import { useState } from "react";
import Image from "next/image";
import SemestaOrbit from "./SemestaOrbit";
import DivisionFolders from "./DivisionFolders";
import { DIVISIONS, SEMESTA, UNITS } from "@/data/semesta";
import { useT } from "@/i18n/LangProvider";

// Bagian "Semesta Mahaksa" di halaman Ekosistem (menggantikan "Grup usaha", arahan user Okt 2026), mengikuti
// "Architecture Mahaksa Group": PT di pusat, tiga divisi INDITEK, BLUPRIM, MAHAKSA.
// Kiri: cerita singkat dan detail unit yang dipilih. Kanan: orbit. Bawah: tiga map divisi berisi kartu unit.
export default function SemestaMahaksa() {
  const t = useT();
  const [selected, setSelected] = useState(UNITS[0].id);
  const unit = UNITS.find((u) => u.id === selected) ?? UNITS[0];
  const div = DIVISIONS.find((d) => d.id === unit.division)!;
  const running = unit.status === "berjalan";

  return (
    <section id="semesta" className="relative isolate overflow-hidden bg-[#0B0B0F] text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute left-[62%] top-[40%] -z-10 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="type-micro text-brand-red">{t(SEMESTA.label)}</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">{t(SEMESTA.title)}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/65">{t(SEMESTA.intro)}</p>

            {/* Tiga divisi */}
            <ul className="mt-6 flex flex-wrap gap-2">
              {DIVISIONS.map((d) => (
                <li key={d.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${d.color})` }} aria-hidden="true" />
                  <span className="font-black tracking-[0.06em]">{d.name}</span>
                  <span className="text-white/50">{t(d.focus)}</span>
                </li>
              ))}
            </ul>

            {/* Detail unit yang dipilih */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm" aria-live="polite">
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full ${unit.logo ? "bg-white" : "bg-[#0B0B0F]"}`}
                  style={unit.logo ? undefined : { border: `1px solid rgba(${div.color},0.6)` }}
                >
                  {unit.logo ? (
                    <Image src={unit.logo} alt="" width={80} height={80} className="h-[72%] w-[72%] object-contain" />
                  ) : (
                    <span className="text-[13px] font-black" style={{ color: `rgb(${div.color})` }}>
                      {unit.initials}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[21px] font-extrabold leading-tight tracking-tight">{unit.name}</p>
                  <p className="mt-0.5 text-[12.5px] font-semibold text-white/50">
                    {div.name} · {t(div.focus)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                    running ? "bg-brand-red text-white" : "bg-white/10 text-white/70"
                  }`}
                >
                  {running ? t("Berjalan") : t("Ide")}
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${Math.max(unit.progress, 2)}%`, background: `rgb(${div.color})` }} />
                </div>
                <span className="w-12 text-right text-[15px] font-black">{unit.progress}%</span>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/75">{t(unit.body)}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SemestaOrbit units={UNITS} core={SEMESTA.core} selected={selected} onSelect={setSelected} />
            <p className="mt-2 text-center text-[12px] text-white/40">{t(SEMESTA.hint)}</p>
          </div>
        </div>

        {/* Tiga map divisi berisi kartu unit */}
        <div className="mt-12">
          <DivisionFolders divisions={DIVISIONS} units={UNITS} selected={selected} onSelect={setSelected} />
        </div>
      </div>
    </section>
  );
}
