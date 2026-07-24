import Link from "next/link";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { IG_JURURANCANG, WA_LINK1 } from "@/constants";

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    title: "Jasa Gambar",
    pricing: "Basic / Plus / Pro — per m²",
    cta: "DM @jururancang_mahaksa",
    ctaHref: IG_JURURANCANG,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Analisa Struktur",
    pricing: "Basic / Plus / Pro — per item",
    cta: "DM @jururancang_mahaksa",
    ctaHref: IG_JURURANCANG,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Renovasi & Konstruksi",
    pricing: "AHSP-based per item — RAB transparan",
    cta: "WA Admin",
    ctaHref: `${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek renovasi/konstruksi.")}`,
  },
];

export default function ConsTechSection() {
  return (
    <Section background="white">
      <Reveal>
        <SectionLabel>Layanan ConsTech LBAG</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          Proyekmu, dibikin mudah aja.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-gray">
          Selain program RTO, barumahID aktif mengerjakan proyek konstruksi dan
          desain. Fee 8–14% dari RAB proyek.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 100}>
            <div className="flex h-full flex-col gap-5 rounded-xl border border-brand-dark/8 bg-white p-7 card-shadow tilt-card">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-dark text-white">
                {s.icon}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-extrabold text-brand-dark">{s.title}</h3>
                <p className="mt-2 text-sm text-brand-gray">{s.pricing}</p>
              </div>
              <a
                href={s.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-red transition hover:underline"
              >
                {s.cta}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={350}>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-lg bg-brand-dark px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-gray hover:scale-[1.02]"
          >
            Konsultasikan Proyek
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="arrow-nudge">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <p className="max-w-sm text-xs text-brand-gray">
            Untuk Jasa Gambar dan Analisa Struktur, hubungi langsung{" "}
            <a href={IG_JURURANCANG} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-dark hover:text-brand-red">
              @jururancang_mahaksa
            </a>{" "}
            di Instagram.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
