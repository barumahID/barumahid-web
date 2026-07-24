import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";

const problems = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Harga naik terus",
    desc: "Properti naik 5–8% per tahun. Kemampuan menabung DP tidak mengejar.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    title: "Syarat KPR berat",
    desc: "Banyak yang penghasilannya cukup tapi tidak lolos administrasi bank.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    title: "Sewa tanpa arah",
    desc: "Bayar sewa setiap bulan tapi tidak ada yang terakumulasi untuk masa depan.",
  },
];

export default function ProblemSection() {
  return (
    <Section background="light">
      <Reveal>
        <SectionLabel>Masalah</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          Kenapa rumah impian selalu terasa jauh?
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="flex h-full flex-col gap-4 rounded-xl border border-brand-dark/8 bg-white p-7 card-shadow tilt-card">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                {p.icon}
              </span>
              <h3 className="text-lg font-extrabold text-brand-dark">{p.title}</h3>
              <p className="text-sm leading-relaxed text-brand-gray">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
