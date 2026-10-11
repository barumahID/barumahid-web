import Image from "next/image";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import ButtonLink from "@/components/ui/ButtonLink";
import ProjectMap from "@/components/constech/ProjectMap";
import { STATS, verifiedCities } from "@/data/projects";
import { ADDRESSES } from "@/data/site";

// Peta penyebaran proyek di /tentang (arahan user): titik proyek + Base barumahID di Padang dan VO di Tangerang.
// Kartu alamat bisa diklik, membuka Google Maps.
// Angka dari STATS, titik kota hanya yang verified (aturan CLAUDE.md).
const OFFICES = [
  { cityId: "padang", label: `${ADDRESSES.hq.label}, Padang`, short: ADDRESSES.hq.label },
  { cityId: "tangerang", label: `${ADDRESSES.vo.label}, Tangerang`, short: ADDRESSES.vo.label },
];

export default function PetaProyek() {
  const stats = [
    { value: STATS.projects, suffix: "+", label: "Proyek selesai" },
    { value: STATS.cities, suffix: "", label: "Kota" },
    { value: STATS.provinces, suffix: "", label: "Provinsi" },
    { value: STATS.countries, suffix: "", label: "Negara" },
  ];

  return (
    <section id="peta" className="relative isolate scroll-mt-20 overflow-hidden bg-brand-dark text-white">
      <Image src="/images/proyek/analisa-dermaga.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-brand-dark/90" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="type-micro text-brand-red">Peta penyebaran proyek</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3.3rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
                Berbasis di Padang, bekerja untuk proyek di {STATS.cities} kota.
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
                  <CountUp end={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-[14px] font-bold text-white/80">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 md:mt-12">
          <ProjectMap cities={verifiedCities()} offices={OFFICES} />
        </div>

        {/* Basis kantor */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[ADDRESSES.hq, ADDRESSES.vo].map((a) => (
            <Reveal key={a.label}>
              <a
                href={a.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka di Google Maps"
                aria-label={`${a.label}: ${a.lines.join(", ")} (buka di Google Maps)`}
                className="group flex h-full gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/[0.1] md:p-7"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-white/80" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5 9.5V21h14V9.5" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13px] font-bold tracking-wide text-brand-red">{a.label}</p>
                  {a.lines.map((l) => (
                    <p key={l} className="mt-1 text-[15px] leading-relaxed text-white/85 group-hover:text-white">
                      {l}
                    </p>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/portofolio" variant="red">
            Lihat portofolio
          </ButtonLink>
          <ButtonLink href="/layanan/contech" variant="outline-light">
            Jasa konstruksi
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
