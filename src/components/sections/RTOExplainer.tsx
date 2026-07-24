import Link from "next/link";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";

const steps = [
  {
    num: "1",
    title: "Sewa Unit Partner",
    desc: "Tinggal di kos/rumah mitra barumahID yang sudah verified.",
  },
  {
    num: "2",
    title: "25% Otomatis Tersimpan",
    desc: "Setiap bayar sewa, 25% langsung masuk tabungan DP-mu.",
    highlight: true,
  },
  {
    num: "3",
    title: "Rumah Jadi Milikmu",
    desc: "Saat DP terkumpul, jalurmu menuju kepemilikan terbuka.",
  },
];

export default function RTOExplainer() {
  return (
    <Section background="white">
      <Reveal>
        <SectionLabel>Program Rent-to-Own barumahID</SectionLabel>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          Sewa yang menghitung hari menuju rumahmu
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.num} delay={i * 120}>
            <div
              className={`relative flex h-full flex-col gap-4 rounded-xl p-7 ${
                step.highlight
                  ? "border-2 border-brand-red bg-brand-red text-white"
                  : "border border-brand-dark/8 bg-white"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-black ${
                  step.highlight
                    ? "bg-white text-brand-red"
                    : "bg-brand-red text-white"
                }`}
              >
                {step.num}
              </span>
              <h3 className="text-xl font-extrabold">{step.title}</h3>
              <p
                className={`text-sm leading-relaxed ${
                  step.highlight ? "text-white/85" : "text-brand-gray"
                }`}
              >
                {step.desc}
              </p>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C53B3B" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M14 7l5 5-5 5" />
                  </svg>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={400}>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/daftar"
            className="group inline-flex items-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark hover:scale-[1.02]"
          >
            Cek Eligibilitas Saya
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="arrow-nudge">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <span className="text-xs text-brand-gray">
            Pre-launch — program pertama sedang dipersiapkan
          </span>
        </div>
      </Reveal>
    </Section>
  );
}
