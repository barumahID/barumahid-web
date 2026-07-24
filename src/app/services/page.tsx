import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { IG_JURURANCANG, WA_LINK1 } from "@/constants";

export const metadata: Metadata = {
  title: "Layanan ConsTech LBAG",
  description: "Jasa konstruksi profesional barumahID — Jasa Gambar, Analisa Struktur, Renovasi & Konstruksi. Fee kompetitif 8–14% dari RAB proyek.",
};

const pillars = [
  { title: "Lean Construction", desc: "Metodologi efisien yang meminimalkan pemborosan material, waktu, dan biaya.", icon: "📐" },
  { title: "BIM", desc: "Building Information Modeling untuk perencanaan dan koordinasi yang presisi.", icon: "📊" },
  { title: "AI", desc: "Estimasi biaya dan optimasi desain dengan teknologi kecerdasan buatan.", icon: "🤖" },
  { title: "Green Construction", desc: "Pendekatan pembangunan berkelanjutan yang ramah lingkungan.", icon: "🌿" },
];

const services = [
  {
    href: "/services/jasa-gambar",
    title: "Jasa Gambar",
    desc: "Gambar arsitektur dan struktur — DED, gambar kerja, site plan, potongan, dan detail.",
    pricing: "Basic / Plus / Pro — per m²",
    contact: "DM @jururancang_mahaksa",
    contactHref: IG_JURURANCANG,
  },
  {
    href: "/services/analisa-struktur",
    title: "Analisa Struktur",
    desc: "Analisa beban, material, fondasi, dan tulangan untuk keamanan struktur bangunan.",
    pricing: "Basic / Plus / Pro — per item",
    contact: "DM @jururancang_mahaksa",
    contactHref: IG_JURURANCANG,
  },
  {
    href: "/services/renovasi",
    title: "Renovasi & Konstruksi",
    desc: "Renovasi dan pembangunan baru dengan RAB transparan berdasarkan AHSP.",
    pricing: "AHSP-based — fee 8–14% dari RAB",
    contact: "WA Admin",
    contactHref: `${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek.")}`,
  },
];

const processSteps = [
  { num: "1", title: "Konsultasi Awal", desc: "Diskusi kebutuhan dan requirement proyek." },
  { num: "2", title: "Survey Lokasi", desc: "Tim survey langsung ke lokasi proyek." },
  { num: "3", title: "Perencanaan & RAB", desc: "Desain dan perhitungan anggaran transparan." },
  { num: "4", title: "Pengerjaan", desc: "Eksekusi dengan monitoring progres berkala." },
  { num: "5", title: "Serah Terima", desc: "Inspeksi final dan dokumentasi lengkap." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="animate-blob-drift absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand-red/15 blur-3xl" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>ConsTech LBAG</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Proyekmu, dibikin mudah aja.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Layanan konstruksi profesional dengan pendekatan modern — Lean, BIM, AI, Green Construction. Fee 8–14% dari RAB proyek.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Keunggulan — 4 pillars */}
      <Section background="light">
        <Reveal>
          <SectionLabel>Keunggulan</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            4 pilar pendekatan LBAG
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-brand-dark/8 bg-white p-6 card-shadow tilt-card">
                <span className="text-3xl">{p.icon}</span>
                <h3 className="text-base font-extrabold text-brand-dark">{p.title}</h3>
                <p className="text-sm leading-relaxed text-brand-gray">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 3 Layanan */}
      <Section background="white">
        <Reveal>
          <SectionLabel>Layanan</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            3 layanan utama
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="flex h-full flex-col gap-5 rounded-xl border border-brand-dark/8 bg-white p-7 card-shadow tilt-card">
                <h3 className="text-xl font-extrabold text-brand-dark">{s.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-brand-gray">{s.desc}</p>
                <p className="text-xs font-semibold text-brand-dark/60">{s.pricing}</p>
                <div className="flex items-center justify-between gap-4 border-t border-brand-dark/8 pt-4">
                  <Link href={s.href} className="text-sm font-bold text-brand-red hover:underline">
                    Detail →
                  </Link>
                  <a href={s.contactHref} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-gray hover:text-brand-dark">
                    {s.contact}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Track record */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Track Record</SectionLabel>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Kenapa barumahID
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <Reveal><div className="text-center"><p className="text-3xl font-black sm:text-4xl"><CountUp end={7} suffix="+" /></p><p className="mt-2 text-sm text-white/60">Tahun Pengalaman</p></div></Reveal>
            <Reveal delay={80}><div className="text-center"><p className="text-3xl font-black sm:text-4xl"><CountUp end={457} prefix="Rp " suffix=" Jt" /></p><p className="mt-2 text-sm text-white/60">Revenue 2024–Mar 2026</p></div></Reveal>
            <Reveal delay={160}><div className="text-center"><p className="text-3xl font-black sm:text-4xl"><CountUp end={30} suffix="+" /></p><p className="mt-2 text-sm text-white/60">Proyek Selesai</p></div></Reveal>
            <Reveal delay={240}><div className="text-center"><p className="text-3xl font-black sm:text-4xl"><CountUp end={4} /></p><p className="mt-2 text-sm text-white/60">Kota Pilot Market</p></div></Reveal>
          </div>
        </div>
      </section>

      {/* Partner */}
      <Section background="light">
        <Reveal>
          <SectionLabel>Partner Engineering</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Tim teknis yang berpengalaman
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-gray">
            Untuk Jasa Gambar dan Analisa Struktur, barumahID bermitra dengan{" "}
            <a href={IG_JURURANCANG} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-red hover:underline">
              @jururancang_mahaksa
            </a>{" "}
            — tim arsitektur dan teknik sipil yang profesional.
          </p>
        </Reveal>
      </Section>

      {/* Proses */}
      <Section background="white">
        <Reveal>
          <SectionLabel>Proses Kerja</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            5 tahap dari konsultasi sampai selesai
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div className="flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-sm font-black text-white">
                  {s.num}
                </span>
                <h3 className="text-sm font-extrabold text-brand-dark">{s.title}</h3>
                <p className="text-xs leading-relaxed text-brand-gray">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-brand-red text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Punya proyek?</h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80">
              Konsultasikan proyek konstruksi kamu — gratis, tanpa komitmen.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-brand-red shadow-xl transition hover:scale-[1.02]"
              >
                Konsultasi via WA
              </a>
              <a
                href={IG_JURURANCANG}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                DM @jururancang_mahaksa
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
