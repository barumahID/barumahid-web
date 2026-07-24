import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { IG_JURURANCANG } from "@/constants";

export const metadata: Metadata = {
  title: "Analisa Struktur Bangunan",
  description: "Analisa struktur bangunan barumahID — analisa beban, material, fondasi, dan tulangan. 3 paket: Basic, Plus, Pro.",
};

const packages = [
  { name: "Basic", desc: "Analisa beban dan dimensi struktur utama.", target: "Rumah tinggal 1–2 lantai" },
  { name: "Plus", desc: "Termasuk analisa fondasi, tulangan, dan rekomendasi material.", target: "Rumah tinggal & ruko" },
  { name: "Pro", desc: "Analisa komprehensif termasuk gempa, tanah, dan detail sambungan.", target: "Bangunan komersial & multi-lantai" },
];

const scope = ["Analisa beban", "Dimensi struktur", "Analisa fondasi", "Perhitungan tulangan", "Rekomendasi material", "Analisa gempa"];

export default function AnalisaStrukturPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Analisa Struktur</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Analisa Struktur Bangunan
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Pastikan bangunanmu aman dan sesuai standar dengan analisa struktur profesional.
            </p>
          </Reveal>
        </div>
      </section>

      <Section background="white">
        <Reveal>
          <SectionLabel>Paket</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">3 paket analisa</h2>
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
      </Section>

      <Section background="light">
        <Reveal>
          <SectionLabel>Ruang Lingkup</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">Cakupan analisa</h2>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scope.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <div className="flex items-center gap-3 rounded-lg bg-white p-4 card-shadow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C53B3B" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 5" /></svg>
                <span className="text-sm font-semibold text-brand-dark">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-brand-red text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold">Butuh analisa struktur?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">Hubungi tim teknis kami di Instagram.</p>
            <a href={IG_JURURANCANG} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-brand-red transition hover:scale-[1.02]">
              Hubungi @jururancang_mahaksa
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
