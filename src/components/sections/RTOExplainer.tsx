"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";

const steps = [
  { num: "01", title: "Sewa unit mitra", desc: "Tinggal di properti verified partner barumahID." },
  { num: "02", title: "25% tersimpan otomatis", desc: "Setiap bayar sewa, seperempatnya masuk saldo DP-mu." },
  { num: "03", title: "Rumah jadi milikmu", desc: "Saat DP terkumpul, jalur menuju kepemilikan terbuka." },
];

const pathways = [
  {
    key: "credit",
    num: "01",
    title: "Option Credit",
    tagline: "Sewa → Escrow → KPR",
    detail: "25% sewa masuk escrow. Saat DP terkumpul, barumahID memfasilitasi KPR dengan developer mitra. Rekam jejak pembayaran jadi kekuatan.",
    status: "Aktif",
  },
  {
    key: "build",
    num: "02",
    title: "Option Build",
    tagline: "Sewa → Modal → Bangun",
    detail: "Sudah punya tanah? Sewa dulu sambil kumpulkan modal. Tim ConsTech barumahID siap membangun dengan RAB transparan.",
    status: "Aktif",
  },
  {
    key: "buy",
    num: "03",
    title: "Option Buy",
    tagline: "Lease-option & buyback",
    detail: "Jalur lease-option dan buyback yang sedang dikembangkan. Nantikan update dari barumahID.",
    status: "Segera Hadir",
    disabled: true,
  },
];

export default function RTOExplainer() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Section background="warm">
      <Reveal>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <SectionLabel number="04">Rent-to-Own</SectionLabel>
            <h2 className="mt-6 type-h1 text-brand-dark">
              Sewa yang<br />tidak sia-sia.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="type-body text-brand-gray max-w-md">
              Setiap bulan sewa, seperempatnya langsung jadi tabungan DP rumahmu. Otomatis. Tanpa disiplin ekstra.
            </p>
          </div>
        </div>
      </Reveal>

      {/* 3-step editorial flow */}
      <div className="mt-16 md:mt-20 grid gap-8 md:grid-cols-3 md:gap-0 md:border-t hairline">
        {steps.map((step, i) => (
          <Reveal key={step.num} delay={i * 100}>
            <div className={`border-t hairline md:border-t-0 pt-8 md:pt-10 md:pb-10 ${i > 0 ? "md:border-l md:pl-10" : ""}`}>
              <div className="flex items-baseline gap-4">
                <span className="type-micro text-brand-red">{step.num}</span>
                <span className="h-px flex-1 bg-brand-line" />
              </div>
              <h3 className="mt-5 text-[clamp(1.15rem,1.8vw,1.5rem)] font-semibold tracking-tight text-brand-dark">
                {step.title}
              </h3>
              <p className="mt-2 type-small text-brand-gray max-w-xs">
                {step.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Pathways — editorial list */}
      <Reveal>
        <div className="mt-24 md:mt-32">
          <SectionLabel number="04.1">Tiga Jalur Adaptif</SectionLabel>
          <h3 className="mt-4 type-h2 text-brand-dark max-w-xl">
            Pilih jalur konversi kepemilikanmu.
          </h3>
        </div>
      </Reveal>

      <div className="mt-12 border-t hairline">
        {pathways.map((p, i) => (
          <Reveal key={p.key} delay={i * 80}>
            <button
              type="button"
              onClick={() => !p.disabled && setExpanded(expanded === p.key ? null : p.key)}
              disabled={p.disabled}
              aria-expanded={expanded === p.key}
              className={`group flex w-full flex-col gap-4 border-b hairline py-8 md:py-10 text-left transition-colors ${
                p.disabled ? "opacity-50 cursor-default" : "hover:bg-brand-dark/[0.02]"
              }`}
            >
              <div className="flex items-center gap-6 md:gap-10 px-2">
                <span className="type-micro text-brand-red min-w-[3ch]">{p.num}</span>
                <div className="flex-1 grid gap-2 md:grid-cols-12 md:items-baseline md:gap-6">
                  <h4 className="md:col-span-3 text-[clamp(1.15rem,1.8vw,1.5rem)] font-semibold tracking-tight text-brand-dark">
                    {p.title}
                  </h4>
                  <p className="md:col-span-6 type-small text-brand-gray">{p.tagline}</p>
                  <span className={`md:col-span-3 md:text-right type-micro ${
                    p.disabled ? "text-brand-mute" : "text-credit"
                  }`}>
                    {p.status}
                  </span>
                </div>
                {!p.disabled && (
                  <span className={`hidden md:block text-brand-gray transition-transform duration-300 ${
                    expanded === p.key ? "rotate-45" : ""
                  }`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                  </span>
                )}
              </div>

              <div className={`accordion-body px-2 ${expanded === p.key ? "open" : ""}`}>
                <div>
                  <div className="pt-4 md:pl-16 max-w-2xl">
                    <p className="type-body text-brand-gray">{p.detail}</p>
                  </div>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Link
            href="/daftar"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3.5 text-[13px] font-medium text-white hover:bg-brand-red transition-all duration-300"
          >
            Cek Eligibilitas
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <p className="type-micro text-brand-mute inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse-dot" />
            Program pertama sedang dipersiapkan
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
