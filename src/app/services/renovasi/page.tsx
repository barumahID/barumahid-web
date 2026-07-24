import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { WA_LINK1, WA_LINK2 } from "@/constants";

export const metadata: Metadata = {
  title: "Renovasi & Konstruksi",
  description: "Layanan renovasi dan konstruksi barumahID — RAB transparan, AHSP-based, fee 8–14%. Cakupan Sumatera Barat dan ekspansi.",
};

const highlights = [
  { title: "RAB Transparan", desc: "Setiap item pekerjaan dihitung berdasarkan AHSP — kamu tahu persis ke mana uang dialokasikan." },
  { title: "Fee Kompetitif", desc: "Fee barumahID 8–14% dari total RAB, tergantung kompleksitas dan skala proyek." },
  { title: "Monitoring Progres", desc: "Laporan berkala dengan dokumentasi foto dan video selama proses pengerjaan." },
  { title: "Cakupan Luas", desc: "Sumatera Barat dan ekspansi ke Padang, Jambi, Palembang, Riau." },
];

export default function RenovasiPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Renovasi &amp; Konstruksi</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Renovasi &amp; Konstruksi
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Renovasi rumah atau pembangunan baru dengan RAB transparan dan pengerjaan profesional.
            </p>
          </Reveal>
        </div>
      </section>

      <Section background="white">
        <Reveal>
          <SectionLabel>Keunggulan</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">Kenapa renovasi bareng barumahID?</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 100}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-brand-dark/8 bg-white p-7 card-shadow">
                <h3 className="text-lg font-extrabold text-brand-dark">{h.title}</h3>
                <p className="text-sm leading-relaxed text-brand-gray">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section background="light">
        <Reveal>
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">Model pricing</h2>
          <div className="mt-8 rounded-xl border border-brand-dark/8 bg-white p-8 card-shadow">
            <p className="text-sm leading-relaxed text-brand-gray">
              Pricing berbasis <strong className="text-brand-dark">AHSP (Analisa Harga Satuan Pekerjaan)</strong> — setiap item
              pekerjaan dihitung transparan per item RAB. Fee barumahID: <strong className="text-brand-red">8–14%</strong> dari
              total RAB tergantung kompleksitas proyek.
            </p>
          </div>
        </Reveal>
      </Section>

      <section className="bg-brand-red text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold">Siap renovasi atau bangun?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">Konsultasi gratis via WhatsApp.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek renovasi/konstruksi.")}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-brand-red transition hover:scale-[1.02]">
                WA Admin 1
              </a>
              <a href={`${WA_LINK2}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek renovasi/konstruksi.")}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                WA Admin 2
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
