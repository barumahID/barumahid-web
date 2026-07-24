import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { FORM_MITRA_HUNIAN, FORM_DEVELOPER, WA_LINK1 } from "@/constants";

export const metadata: Metadata = {
  title: "Mitra barumahID",
  description: "Bergabung menjadi mitra barumahID — Mitra Hunian, Developer Mitra, atau Mitra Konstruksi.",
};

const mitraTypes = [
  {
    id: "hunian",
    icon: "🏠",
    title: "Mitra Hunian",
    subtitle: "Pemilik kos / rumah sewa",
    desc: "Properti terisi, pendapatan terjamin, tanpa repot manajemen penyewa.",
    benefits: [
      "Penyewa terseleksi oleh barumahID",
      "Pembayaran sewa terjamin",
      "Monitoring via dashboard (Phase 2)",
      "Kontrak sewa yang jelas",
    ],
    ctaLabel: "Daftar Sebagai Mitra Hunian",
    ctaHref: FORM_MITRA_HUNIAN,
    color: "border-credit",
  },
  {
    id: "developer",
    icon: "🏗️",
    title: "Developer Mitra",
    subtitle: "Developer perumahan",
    desc: "Pipeline customer yang sudah menabung DP dan siap KPR.",
    benefits: [
      "Leads berkualitas — customer sudah menabung DP",
      "Tracking progress DP real-time",
      "Price lock mechanism",
      "Akses ke ekosistem barumahID",
    ],
    ctaLabel: "Daftar Sebagai Developer Mitra",
    ctaHref: FORM_DEVELOPER,
    color: "border-build",
  },
  {
    id: "konstruksi",
    icon: "🔧",
    title: "Mitra Konstruksi",
    subtitle: "Subkontraktor & supplier",
    desc: "Subkontraktor, supplier material, dan konsultan teknis.",
    benefits: [
      "Akses ke proyek-proyek barumahID",
      "Jaringan kerja profesional",
      "Sistem pembayaran terstruktur",
      "Peluang kolaborasi jangka panjang",
    ],
    ctaLabel: "Daftar Mitra Konstruksi",
    ctaHref: FORM_MITRA_HUNIAN,
    color: "border-brand-red",
  },
];

export default function MitraPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Partnership</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Tumbuh bersama barumahID
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              3 jalur partnership untuk pemilik properti, developer, dan kontraktor.
            </p>
          </Reveal>
        </div>
      </section>

      <Section background="white">
        <div className="grid gap-8 lg:grid-cols-3">
          {mitraTypes.map((m, i) => (
            <Reveal key={m.id} delay={i * 120}>
              <div className={`flex h-full flex-col gap-5 rounded-xl border-t-4 bg-white p-8 card-shadow ${m.color}`}>
                <span className="text-4xl">{m.icon}</span>
                <div>
                  <h2 className="text-xl font-extrabold text-brand-dark">{m.title}</h2>
                  <p className="mt-0.5 text-xs font-semibold text-brand-gray">{m.subtitle}</p>
                </div>
                <p className="text-sm leading-relaxed text-brand-gray">{m.desc}</p>
                <ul className="flex-1 space-y-2">
                  {m.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-brand-gray">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C53B3B" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0"><path d="M3 8l3.5 3.5L13 5" /></svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={m.ctaHref !== "#" ? m.ctaHref : `${WA_LINK1}?text=${encodeURIComponent(`Halo barumahID, saya ingin mendaftar sebagai ${m.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto rounded-lg bg-brand-red px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark"
                >
                  {m.ctaLabel}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
