import Image from "next/image";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import ButtonLink from "@/components/ui/ButtonLink";
import ProjectMap from "@/components/constech/ProjectMap";
import { STATS, verifiedCities } from "@/data/projects";

// Section unggulan beranda Konstruksi (arahan: "hebohkan dengan peta map Indonesia").
// Angka dari STATS, titik kota hanya yang verified (aturan CLAUDE.md).
export default function PetaProyek() {
  const cities = verifiedCities();
  const provinces = Array.from(new Set(cities.map((c) => c.province)));
  const stats = [
    { value: STATS.projects, suffix: "+", label: "Proyek selesai" },
    { value: STATS.cities, suffix: "", label: "Kota" },
    { value: STATS.provinces, suffix: "", label: "Provinsi" },
    { value: STATS.since, suffix: "", label: "Mulai berkarya", plain: true },
  ];

  return (
    <section id="peta-proyek" className="relative isolate scroll-mt-20 overflow-hidden bg-brand-dark text-white">
      <Image src="/images/proyek/analisa-dermaga.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-brand-dark/90" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="type-micro text-brand-red">Peta proyek</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3.3rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
                Jejak kerja kami, dari {provinces[0]} sampai {provinces[provinces.length - 1]}.
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-white/65 md:col-span-4 md:col-start-9">
              Klik titik atau nama kota untuk lihat proyek di sana. Semua dari arsip proyek kami, tidak ada titik hiasan.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:mt-14 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="bg-brand-dark/70 backdrop-blur-sm">
              <div className="h-full p-6 md:p-8">
                <p className="text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-none tracking-tight">
                  {s.plain ? s.value : <CountUp end={s.value} suffix={s.suffix} />}
                </p>
                <p className="mt-3 text-[14px] font-bold text-white/80">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 md:mt-12">
          <ProjectMap cities={cities} />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/layanan/constech" variant="red">
            Lihat jasa dan harga
          </ButtonLink>
          <ButtonLink href="/portofolio" variant="outline-light">
            Lihat portofolio
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
