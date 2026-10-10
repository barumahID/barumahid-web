import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { STATS, verifiedCities } from "@/data/projects";

export default function ProofStats() {
  const cities = verifiedCities().map((c) => c.name);
  const provinces = Array.from(new Set(verifiedCities().map((c) => c.province)));
  const stats = [
    { value: STATS.projects, suffix: "+", label: "Proyek selesai", note: "Desain, struktur, renovasi, dan bangun" },
    { value: STATS.provinces, suffix: "", label: "Provinsi", note: provinces.join(", ") },
    { value: STATS.since, suffix: "", label: "Mulai berkarya", note: "Lahir 11 November 2018 di Padang", plain: true },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      <Image src="/images/proyek/analisa-dermaga.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-brand-dark/85" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="type-micro text-brand-red">Bukti dalam angka</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3.3rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
                Dibangun dari lapangan, bukan dari ruang rapat.
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-white/65 md:col-span-4 md:col-start-9">
              Semua angka di sini bisa ditelusuri ke arsip proyek kami. Tidak ada angka hiasan.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:mt-16 md:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 110} className="bg-brand-dark/60 backdrop-blur-sm">
              <div className="h-full p-7 md:p-9">
                <p className="text-[clamp(3rem,6.5vw,5.2rem)] font-black leading-none tracking-tight">
                  {s.plain ? s.value : <CountUp end={s.value} suffix={s.suffix} />}
                </p>
                <p className="mt-4 text-[15px] font-bold">{s.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-white/55">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-[13.5px] leading-relaxed text-white/55">
              Kota proyek dan klien: {cities.join(", ")}.
            </p>
            <Link
              href="/layanan/constech#peta"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white hover:text-brand-dark"
            >
              Lihat peta proyek
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
