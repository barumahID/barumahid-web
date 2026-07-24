import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { FORM_REKRUTMEN } from "@/constants";

export const metadata: Metadata = {
  title: "Rekrutmen",
  description: "Bergabung dengan tim barumahID — posisi terbuka di marketing, administrasi, engineering, arsitektur, dan desain.",
};

const positions = [
  { title: "Marketing Specialist", dept: "Marketing", location: "Padang / Remote", type: "Full-time" },
  { title: "Customer Administration", dept: "Operations", location: "Padang", type: "Full-time" },
  { title: "AI Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "BIM Modeller", dept: "Engineering", location: "Padang / Remote", type: "Full-time" },
  { title: "Arsitek", dept: "Design", location: "Padang", type: "Full-time" },
  { title: "Desainer Interior & Eksterior", dept: "Design", location: "Padang / Remote", type: "Full-time" },
];

const DEADLINE = "31 Juli 2026";
const deadlinePassed = new Date() > new Date("2026-07-31T23:59:59+07:00");

export default function RekrutmenPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Karir</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Bangun masa depan perumahan Indonesia
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Bergabung dengan tim barumahID dan bantu jutaan orang punya rumah.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Banner */}
      {!deadlinePassed && (
        <div className="bg-brand-red py-3 text-center text-sm font-bold text-white">
          Rekrutmen Aktif — Deadline {DEADLINE}
        </div>
      )}

      <Section background="white">
        <Reveal>
          <SectionLabel>Posisi Terbuka</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            {deadlinePassed ? "Posisi Ditutup" : "6 posisi tersedia"}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {positions.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className={`flex h-full flex-col gap-3 rounded-xl border border-brand-dark/8 bg-white p-6 card-shadow ${deadlinePassed ? "opacity-60" : "tilt-card"}`}>
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-brand-red/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-red">
                    {p.dept}
                  </span>
                  <span className="text-[10px] font-semibold text-brand-gray">{p.type}</span>
                </div>
                <h3 className="text-base font-extrabold text-brand-dark">{p.title}</h3>
                <p className="text-xs text-brand-gray">{p.location}</p>
                {!deadlinePassed && (
                  <a
                    href={FORM_REKRUTMEN !== "#" ? FORM_REKRUTMEN : "#"}
                    target={FORM_REKRUTMEN !== "#" ? "_blank" : undefined}
                    rel={FORM_REKRUTMEN !== "#" ? "noopener noreferrer" : undefined}
                    className="mt-auto rounded-lg bg-brand-dark px-5 py-2.5 text-center text-xs font-bold text-white transition hover:bg-brand-gray"
                  >
                    Lamar Sekarang
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
