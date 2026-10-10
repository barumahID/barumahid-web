import Image from "next/image";
import Reveal from "@/components/Reveal";
import { PROBLEMS, type BerandaId } from "@/data/beranda";

export default function ProblemSection({ variant = "konstruksi" }: { variant?: BerandaId }) {
  const { title, closing, items } = PROBLEMS[variant];
  const problems = items.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0") }));
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      <Image
        src="/images/proyek/renovasi-rangka-atap-padang.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-90"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-dark/95 via-brand-dark/85 to-brand-dark/80" />
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <p className="type-micro text-brand-red">Masalah yang kami lihat di lapangan</p>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.9rem,4.4vw,3.3rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            {title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {problems.map((p, i) => (
            <Reveal key={p.num} delay={i * 110}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:p-8">
                <span className="type-micro text-brand-red">{p.num}</span>
                <h3 className="mt-5 text-[clamp(1.15rem,1.7vw,1.4rem)] font-bold leading-snug tracking-tight">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-12 flex items-center gap-4 text-[clamp(1.1rem,1.8vw,1.45rem)] font-semibold md:mt-16">
            <span className="h-px w-10 bg-brand-red md:w-16" aria-hidden="true" />
            {closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
