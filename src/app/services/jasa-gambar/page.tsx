import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { IG_JURURANCANG } from "@/constants";

export const metadata: Metadata = {
  title: "Jasa Gambar Arsitektur & Struktur",
  description: "Jasa gambar arsitektur dan struktur barumahID — DED, gambar kerja, site plan, potongan, dan detail. 3 paket: Basic, Plus, Pro.",
};

const packages = [
  { name: "Basic", desc: "Gambar denah, tampak, dan potongan standar.", target: "Rumah tinggal sederhana" },
  { name: "Plus", desc: "Termasuk gambar struktur, detail konstruksi, dan site plan.", target: "Rumah tinggal menengah" },
  { name: "Pro", desc: "Paket lengkap termasuk MEP, RAB, dan 3D visualization.", target: "Bangunan komersial & rumah mewah" },
];

const includes = ["Denah arsitektur", "Tampak & potongan", "Gambar kerja detail", "Site plan", "Gambar struktur", "Detail konstruksi"];

const process = [
  { num: "1", title: "Konsultasi", desc: "Diskusi kebutuhan, luas bangunan, dan gaya arsitektur." },
  { num: "2", title: "Survey", desc: "Survey lokasi untuk data lapangan." },
  { num: "3", title: "Gambar", desc: "Proses desain dan pembuatan gambar kerja." },
  { num: "4", title: "Revisi", desc: "Revisi sesuai feedback (maksimal sesuai paket)." },
  { num: "5", title: "Finalisasi", desc: "Gambar final siap untuk pengajuan IMB dan pelaksanaan." },
];

export default function JasaGambarPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Jasa Gambar</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Jasa Gambar Arsitektur &amp; Struktur
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Dari denah sampai detail konstruksi — gambar kerja profesional untuk proyekmu.
            </p>
          </Reveal>
        </div>
      </section>

      <Section background="white">
        <Reveal>
          <SectionLabel>Paket Layanan</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">3 paket sesuai kebutuhan</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div className="flex h-full flex-col gap-4 rounded-xl border border-brand-dark/8 bg-white p-7 card-shadow tilt-card">
                <span className="inline-block self-start rounded-full bg-brand-red px-4 py-1 text-xs font-bold text-white">{p.name}</span>
                <p className="text-sm leading-relaxed text-brand-gray">{p.desc}</p>
                <p className="mt-auto text-xs font-semibold text-brand-dark/50">{p.target}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={350}>
          <p className="mt-6 text-xs text-brand-gray">Pricing: per m² — hubungi untuk estimasi.</p>
        </Reveal>
      </Section>

      <Section background="light">
        <Reveal>
          <SectionLabel>Include</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">Yang kamu dapat</h2>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {includes.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <div className="flex items-center gap-3 rounded-lg bg-white p-4 card-shadow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C53B3B" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 5" /></svg>
                <span className="text-sm font-semibold text-brand-dark">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section background="white">
        <Reveal>
          <SectionLabel>Proses</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">5 tahap pengerjaan</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div className="flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-sm font-black text-white">{s.num}</span>
                <h3 className="text-sm font-extrabold text-brand-dark">{s.title}</h3>
                <p className="text-xs leading-relaxed text-brand-gray">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-brand-red text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold">Butuh jasa gambar?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">Hubungi langsung tim teknis kami di Instagram.</p>
            <a href={IG_JURURANCANG} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-brand-red transition hover:scale-[1.02]">
              Hubungi @jururancang_mahaksa
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
