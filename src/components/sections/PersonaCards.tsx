import Link from "next/link";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";

const personas = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10l9-5 9 5-9 5-9-5z" />
        <path d="M7 12v4c2 2 8 2 10 0v-4" />
        <path d="M21 10v6" />
      </svg>
    ),
    title: "Fresh Graduate",
    name: "Aldi, 25 tahun",
    desc: "Baru kerja, belum punya tabungan DP.",
    detail: "Gaji Rp 4–6 juta",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    ),
    title: "Karyawan Swasta",
    name: "Sari, 30 tahun",
    desc: "Sudah menabung tapi DP tetap tidak cukup.",
    detail: "Gaji Rp 5–7 juta",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V8l7-5 7 5v13" />
        <path d="M10 21v-6h4v6" />
      </svg>
    ),
    title: "Pengusaha Kecil",
    name: "Budi, 34 tahun",
    desc: "Income fluktuatif, butuh jalur yang fleksibel.",
    detail: "Pengusaha, sudah menikah",
  },
];

export default function PersonaCards() {
  return (
    <Section background="light">
      <Reveal>
        <SectionLabel>Untuk Siapa</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          Apakah barumahID untuk kamu?
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {personas.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="flex h-full flex-col gap-4 rounded-xl border border-brand-dark/8 bg-white p-7 card-shadow tilt-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark text-white">
                {p.icon}
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark">{p.title}</h3>
                <p className="mt-0.5 text-xs font-semibold text-brand-gray">{p.detail}</p>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-brand-gray">{p.desc}</p>
              <p className="text-xs font-semibold italic text-brand-dark/50">
                &ldquo;{p.name}&rdquo;
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={350}>
        <div className="mt-10">
          <Link
            href="/daftar"
            className="group inline-flex items-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark hover:scale-[1.02]"
          >
            Cek apakah kamu eligible
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="arrow-nudge">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
