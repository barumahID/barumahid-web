import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import ProjectMap, { type MapOffice } from "@/components/constech/ProjectMap";
import PricingTiers from "@/components/constech/PricingTiers";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import LeadForm from "@/components/forms/LeadForm";
import ClosingCta from "@/components/home/ClosingCta";
import ChannelIcon from "@/components/icons/ChannelIcon";
import { PORTFOLIO, verifiedCities } from "@/data/projects";
import { AHSP_FORMULA, BUILD_STEPS, ORDER_STEPS } from "@/data/pricing";
import { CONTECH_HERO, CONTECH_REACH, GAMBAR_STRUKTUR, RENOVASI_BANGUN } from "@/data/contech";
import { ADDRESSES, JURURANCANG, waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Jasa General Kontraktor: Renovasi, Bangun, Gambar, dan Analisa Struktur",
  description:
    "barumahID, general kontraktor untuk renovasi dan bangun dengan RAB berbasis AHSP. Jasa gambar mulai Rp15.000/m² dan analisa struktur mulai Rp18.000/m² bersama partner Jururancang Engineering Mahaksa.",
  alternates: { canonical: "/layanan/contech" },
};

// Base barumahID (Padang) dan VO (Tangerang), ditandai di peta.
const OFFICES: MapOffice[] = [
  { cityId: "padang", label: `${ADDRESSES.hq.label}, Padang`, short: ADDRESSES.hq.label },
  { cityId: "tangerang", label: `${ADDRESSES.vo.label}, Tangerang`, short: ADDRESSES.vo.label },
];

function SectionHead({ label, title, dark = false }: { label: string; title: string; dark?: boolean }) {
  return (
    <>
      <p className="type-micro text-brand-red">{label}</p>
      <h2
        className={`mt-5 text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.02em] ${
          dark ? "text-white" : "text-brand-dark"
        }`}
      >
        {title}
      </h2>
    </>
  );
}

export default function ContechPage() {
  const cities = verifiedCities();
  const partnerWa = waLink("Halo Jururancang, saya dari website barumahID. Saya mau tanya jasa gambar atau analisa struktur.", JURURANCANG.wa);
  return (
    <>
      {/* 1. Hero: 4 foto saat konstruksi berganti pelan */}
      <PageHero label={CONTECH_HERO.label} title={CONTECH_HERO.title} subtitle={<p>{CONTECH_HERO.subtitle}</p>} slides={CONTECH_HERO.images} size="lg">
        <ButtonLink href="#konsultasi" variant="red">
          Konsultasi gratis
        </ButtonLink>
        <ButtonLink href="#renovasi" variant="outline-light" arrow={false}>
          Lihat harga paket
        </ButtonLink>
      </PageHero>

      {/* 2. Jejak proyek: peta + Base dan VO, wilayah, angka per lini jasa */}
      <section id="peta" className="relative isolate overflow-hidden bg-brand-dark text-white">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionHead label={CONTECH_REACH.label} title={CONTECH_REACH.title} dark />
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-semibold text-white/80 md:text-[17px]">
              {CONTECH_REACH.regions.map((r, i) => (
                <span key={r} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-brand-red" aria-hidden="true" />}
                  {r}
                </span>
              ))}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {CONTECH_REACH.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="flex h-full items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:block sm:p-6">
                  <p className="shrink-0 text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-tight">
                    {s.value}
                    <span className="text-brand-red">+</span>
                  </p>
                  <p className="text-[14px] font-semibold leading-snug text-white/70 sm:mt-3">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-[14px] text-white/55">{CONTECH_REACH.mapHint}</p>
          <div className="mt-4">
            <ProjectMap cities={cities} offices={OFFICES} />
          </div>
        </div>
      </section>

      {/* 3. Renovasi dan bangun (layanan unggulan) */}
      <section id="renovasi" className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-6">
              <SectionHead label={RENOVASI_BANGUN.label} title={RENOVASI_BANGUN.title} />
            </Reveal>
            <Reveal className="space-y-4 lg:col-span-6 lg:pt-10" delay={80}>
              {RENOVASI_BANGUN.body.map((p) => (
                <p key={p} className="text-[16px] leading-relaxed text-brand-gray">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          {/* Paket: cakupan pekerjaan, harga dihitung per item (AHSP) */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {RENOVASI_BANGUN.scopes.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <article className="flex h-full flex-col rounded-3xl border border-brand-dark/10 bg-white p-6 md:p-7">
                  <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">0{i + 1}</span>
                  <h3 className="mt-4 text-[21px] font-extrabold tracking-tight text-brand-dark">{s.name}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-brand-gray">{s.body}</p>
                  <p className="mt-auto border-t border-brand-dark/10 pt-5 text-[13px] font-bold text-brand-dark">{RENOVASI_BANGUN.priceLabel}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="h-full rounded-3xl bg-brand-dark p-6 text-white md:p-7">
                <p className="type-micro text-brand-red">Cara hitung harga dengan AHSP</p>
                <ol className="mt-5 space-y-4">
                  {AHSP_FORMULA.map((f, i) => (
                    <li key={f.label} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red text-[12px] font-black">
                        {i + 1}
                      </span>
                      <span className="text-[14px] leading-relaxed text-white/75">
                        <span className="font-extrabold text-white">{f.label}.</span> {f.body}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="#konsultasi" variant="red">
                    Minta hitungan RAB
                  </ButtonLink>
                  <ButtonLink href={waLink("Halo barumahID, saya mau konsultasi renovasi atau bangun.")} variant="whatsapp" arrow={false}>
                    WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
            <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {BUILD_STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 60}>
                  <li className="flex h-full gap-4 rounded-3xl bg-white p-5 card-shadow">
                    <span className="text-[26px] font-black leading-none text-brand-red/80">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-[16px] font-extrabold text-brand-dark">{s.title}</span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-brand-gray">{s.body}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 4. Gambar & modelling + desain & analisa struktur, bersama partner Jururancang */}
      <section id="harga" className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-6">
              <SectionHead label={GAMBAR_STRUKTUR.label} title={GAMBAR_STRUKTUR.title} />
            </Reveal>
            <Reveal className="space-y-4 lg:col-span-6 lg:pt-10" delay={80}>
              {GAMBAR_STRUKTUR.body.map((p) => (
                <p key={p} className="text-[16px] leading-relaxed text-brand-gray">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          {/* Judul paket harga: logo dan kontak partner */}
          <Reveal>
            <div className="mt-12 rounded-3xl border border-brand-dark/10 bg-white p-6 md:p-7">
              <div className="flex items-center gap-5">
                <Image src={JURURANCANG.logo.src} alt={`Logo ${JURURANCANG.name}`} width={JURURANCANG.logo.w} height={JURURANCANG.logo.h} className="h-16 w-auto md:h-20" />
                <div>
                  <p className="type-micro text-brand-red">{GAMBAR_STRUKTUR.partnerTitle}</p>
                  <h3 className="mt-2 text-[20px] font-extrabold tracking-tight text-brand-dark md:text-[24px]">{JURURANCANG.name}</h3>
                </div>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-brand-dark/10 pt-6">
                <li className="max-w-full">
                  <a
                    href={`mailto:${JURURANCANG.email}`}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-dark/15 px-4 py-2.5 text-[13px] font-semibold text-brand-dark transition-colors hover:border-brand-dark hover:bg-brand-dark hover:text-white"
                  >
                    <span className="shrink-0">
                      <ChannelIcon id="email" size={16} />
                    </span>
                    {/* Email panjang boleh terlipat di HP supaya tidak keluar dari kartu */}
                    <span className="min-w-0 break-all">{JURURANCANG.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={partnerWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-brand-dark/15 px-4 py-2.5 text-[13px] font-semibold text-brand-dark transition-colors hover:border-[#1FA855] hover:bg-[#1FA855] hover:text-white"
                  >
                    <ChannelIcon id="whatsapp" size={16} />
                    WA Admin {JURURANCANG.waLabel}
                  </a>
                </li>
                <li>
                  {JURURANCANG.website ? (
                    <a
                      href={JURURANCANG.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-brand-dark/15 px-4 py-2.5 text-[13px] font-semibold text-brand-dark transition-colors hover:border-brand-dark hover:bg-brand-dark hover:text-white"
                    >
                      <GlobeIcon />
                      Website
                    </a>
                  ) : (
                    <span className="inline-flex cursor-default items-center gap-2 rounded-full border border-dashed border-brand-dark/20 px-4 py-2.5 text-[13px] font-semibold text-brand-mute">
                      <GlobeIcon />
                      Website segera hadir
                    </span>
                  )}
                </li>
                <li>
                  <a
                    href={JURURANCANG.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-brand-dark/15 px-4 py-2.5 text-[13px] font-semibold text-brand-dark transition-colors hover:border-brand-dark hover:bg-brand-dark hover:text-white"
                  >
                    <ChannelIcon id="instagram" size={16} />
                    {JURURANCANG.igHandle}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <div className="mt-6">
            <PricingTiers />
          </div>
          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            {ORDER_STEPS.map((s, i) => (
              <li key={s.title} className="rounded-3xl bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark text-[14px] font-black text-white">{i + 1}</span>
                <p className="mt-4 text-[16px] font-extrabold text-brand-dark">{s.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-brand-gray">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Portofolio pilihan */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="type-micro text-brand-red">Portofolio pilihan</p>
                <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-dark">
                  Karya nyata, bukan gambar contoh.
                </h2>
              </div>
              <Link href="/portofolio" className="shrink-0 text-[14px] font-bold text-brand-red hover:text-brand-red-dark">
                Lihat semua portofolio →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO.slice(0, 6).map((p) => (
              <PortfolioCard key={p.slug} item={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Form konsultasi */}
      <section id="konsultasi" className="bg-brand-dark">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:px-14">
          <div className="text-white lg:col-span-4">
            <p className="type-micro text-brand-red">Konsultasi gratis</p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              Ceritakan proyekmu.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/70">
              Isi singkat saja. Kami balas lewat WhatsApp untuk tanya detail, jadwalkan survei kalau perlu, lalu kirim penawaran.
            </p>
          </div>
          <div className="lg:col-span-8">
            <LeadForm role="konsultasi" tone="card" compact />
          </div>
        </div>
      </section>

      <ClosingCta
        title="Punya gambar tapi ragu strukturnya?"
        body="Kirim gambarnya, kami cek dulu. Konsultasi pertama gratis."
        primaryLabel="Kirim lewat WhatsApp"
        primaryHref={waLink("Halo barumahID, saya mau cek struktur bangunan saya.")}
        secondaryLabel="Lihat portofolio"
        secondaryHref="/portofolio"
      />
    </>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
    </svg>
  );
}
