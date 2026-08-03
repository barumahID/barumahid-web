import Link from "next/link";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { IG_JURURANCANG, WA_LINK1 } from "@/constants";

const services = [
  {
    num: "01",
    title: "Jasa Gambar & Modelling",
    tiers: ["Basic Rp 8k/m²", "Plus Rp 12k/m²", "Pro Rp 17k/m²"],
    cta: "DM @jururancang_mahaksa",
    href: IG_JURURANCANG,
  },
  {
    num: "02",
    title: "Analisa Struktur",
    tiers: ["Basic Rp 13k/item", "Plus Rp 18k/item", "Pro Rp 25k/item"],
    cta: "DM @jururancang_mahaksa",
    href: IG_JURURANCANG,
  },
  {
    num: "03",
    title: "Renovasi & Konstruksi",
    tiers: ["AHSP per item", "Fee 8–14% dari RAB"],
    cta: "Hubungi Admin WA",
    href: `${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek renovasi/konstruksi.")}`,
  },
];

export default function ConsTechSection() {
  return (
    <Section background="white">
      <Reveal>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <SectionLabel number="06">Layanan ConsTech</SectionLabel>
            <h2 className="mt-6 type-h1 text-brand-dark">
              Proyekmu,<br />dibikin mudah aja.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="type-body text-brand-gray max-w-md">
              Jasa desain, analisa struktur, renovasi, dan konstruksi — dengan pricing transparan.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 md:mt-20 border-t hairline">
        {services.map((s, i) => (
          <Reveal key={s.num} delay={i * 100}>
            <div className="group border-b hairline py-10 md:py-12 grid gap-4 md:grid-cols-12 md:gap-10">
              <span className="type-micro text-brand-red md:col-span-1">{s.num}</span>
              <div className="md:col-span-5">
                <h3 className="type-h3 text-brand-dark">{s.title}</h3>
              </div>
              <ul className="md:col-span-3 space-y-1.5">
                {s.tiers.map((t) => (
                  <li key={t} className="type-small text-brand-gray">{t}</li>
                ))}
              </ul>
              <div className="md:col-span-3 md:text-right">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-editorial text-[13px] font-medium text-brand-dark hover:text-brand-red transition-colors"
                >
                  {s.cta} →
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-full border hairline-strong px-6 py-3.5 text-[13px] font-medium text-brand-dark hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-all duration-300"
          >
            Semua Layanan
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
