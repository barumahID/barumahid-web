import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import ProjectGlobe, { type GlobeOffice } from "@/components/constech/ProjectGlobe";
import PricingTerrace from "@/components/constech/PricingTerrace";
import KaryaStrip from "@/components/constech/KaryaStrip";
import DrawingCanvas from "@/components/constech/DrawingCanvas";
import LeadForm from "@/components/forms/LeadForm";
import ClosingCta from "@/components/home/ClosingCta";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import { PROJECT_CITIES, verifiedCities } from "@/data/projects";
import { AHSP_FORMULA, BUILD_STEPS } from "@/data/pricing";
import { GFORMS } from "@/data/google-forms";
import { CONTECH_FAQ, CONTECH_HERO, FORM_KLIEN, CONTECH_REACH, FOTO_RENOVASI, GAMBAR_STRUKTUR, KARYA, RENOVASI_BANGUN, SETELAH_KIRIM } from "@/data/contech";
import { ADDRESSES, waLink } from "@/data/site";
import { alternates, pageLang } from "@/i18n/server";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await pageLang(params);
  return {
    title: t("Jasa General Kontraktor: Renovasi, Bangun, Gambar, dan Analisa Struktur"),
    description: t(
      "barumahID, general kontraktor untuk renovasi dan bangun dengan RAB berbasis AHSP. Jasa gambar mulai Rp15.000/m² dan analisa struktur mulai Rp18.000/m² bersama partner Jururancang Engineering Mahaksa.",
    ),
    alternates: alternates(lang, "/layanan/contech"),
  };
}

// Base barumahID (Padang) dan VO (Tangerang), ditandai di globe tanpa tulisan (keterangan ada di bawah globe).
const cityLL = (id: string) => {
  const c = PROJECT_CITIES.find((x) => x.id === id)!;
  return { lat: c.lat, lon: c.lon };
};
const OFFICES: GlobeOffice[] = [
  { label: `${ADDRESSES.hq.label}, Padang`, ...cityLL("padang") },
  { label: `${ADDRESSES.vo.label}, Tangerang`, ...cityLL("tangerang") },
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

export default async function ContechPage({ params }: Props) {
  const { t } = await pageLang(params);
  const cities = verifiedCities();
  return (
    <>
      {/* 1. Hero: 4 foto saat konstruksi berganti pelan */}
      <PageHero label={t(CONTECH_HERO.label)} title={t(CONTECH_HERO.title)} subtitle={
          <p>
            {t(CONTECH_HERO.subtitle)}
            <br />
            <span className="font-semibold text-white">{CONTECH_HERO.partner}</span>
          </p>
        } slides={CONTECH_HERO.images.map((im) => ({ ...im, alt: t(im.alt) }))} size="lg">
        <ButtonLink href="#konsultasi" variant="red">
          {t("Konsultasi gratis")}
        </ButtonLink>
        <ButtonLink href="#renovasi" variant="outline-light" arrow={false}>
          {t("Lihat harga paket")}
        </ButtonLink>
      </PageHero>

      {/* 2. Jejak proyek: globe + Base dan VO, wilayah, angka per lini jasa */}
      <section id="peta" className="relative isolate overflow-hidden bg-brand-dark text-white">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <SectionHead label={t(CONTECH_REACH.label)} title={t(CONTECH_REACH.title)} dark />
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-semibold text-white/80 md:text-[17px]">
              {CONTECH_REACH.regions.map((r, i) => (
                <span key={r} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-brand-red" aria-hidden="true" />}
                  {t(r)}
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
                  <p className="text-[14px] font-semibold leading-snug text-white/70 sm:mt-3">{t(s.label)}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <ProjectGlobe cities={cities} offices={OFFICES} />
          </div>
        </div>
      </section>

      {/* 3. Renovasi dan bangun (layanan unggulan) */}
      <section id="renovasi" className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-14">
            <Reveal className="lg:col-span-7">
              <SectionHead label={t(RENOVASI_BANGUN.label)} title={t(RENOVASI_BANGUN.title)} />
            </Reveal>
            <Reveal className="lg:col-span-5" delay={80}>
              <p className="text-[16.5px] leading-relaxed text-brand-gray">{t(RENOVASI_BANGUN.body)}</p>
            </Reveal>
          </div>

          {/* 4 foto konstruksi, ukuran sama */}
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {FOTO_RENOVASI.map((f, i) => (
              <Reveal key={f.src} delay={i * 70}>
                <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-dark/5">
                  <Image
                    src={f.src}
                    alt={t(f.alt)}
                    fill
                    sizes="(min-width: 1280px) 290px, (min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-12 text-[12.5px] font-semibold text-white md:px-4 md:pb-4 md:text-[14px]">
                    {t(f.caption)}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          {/* Paket: cakupan pekerjaan, harga dihitung per item (AHSP) */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {RENOVASI_BANGUN.scopes.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <article className="flex h-full flex-col rounded-3xl border border-brand-dark/10 bg-white p-6 md:p-7">
                  <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">0{i + 1}</span>
                  <h3 className="mt-4 text-[21px] font-extrabold tracking-tight text-brand-dark">{t(s.name)}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-brand-gray">{t(s.body)}</p>
                  <p className="mt-auto border-t border-brand-dark/10 pt-5 text-[13px] font-bold text-brand-dark">{t(RENOVASI_BANGUN.priceLabel)}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="h-full rounded-3xl bg-brand-dark p-6 text-white md:p-7">
                <p className="type-micro text-brand-red">{t("Cara hitung harga dengan AHSP")}</p>
                <ol className="mt-5 space-y-4">
                  {AHSP_FORMULA.map((f, i) => (
                    <li key={f.label} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red text-[12px] font-black">
                        {i + 1}
                      </span>
                      <span className="text-[14px] leading-relaxed text-white/75">
                        <span className="font-extrabold text-white">{t(f.label)}.</span> {t(f.body)}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="#konsultasi" variant="red">
                    {t("Minta hitungan RAB")}
                  </ButtonLink>
                  <ButtonLink href={waLink(t("Halo barumahID, saya mau konsultasi renovasi atau bangun."))} variant="whatsapp" arrow={false}>
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
                      <span className="block text-[16px] font-extrabold text-brand-dark">{t(s.title)}</span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-brand-gray">{t(s.body)}</span>
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
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-14">
            <Reveal className="lg:col-span-7">
              <SectionHead label={t(GAMBAR_STRUKTUR.label)} title={t(GAMBAR_STRUKTUR.title)} />
            </Reveal>
            <Reveal className="lg:col-span-5" delay={80}>
              <p className="text-[16.5px] leading-relaxed text-brand-gray">{t(GAMBAR_STRUKTUR.body)}</p>
            </Reveal>
          </div>
          <Reveal className="mt-10">
            <KaryaStrip items={KARYA} label="Karya desain rumah dan analisa struktur" />
          </Reveal>
          <Reveal className="mt-8">
            <PricingTerrace partnerTitle={GAMBAR_STRUKTUR.partnerTitle} />
          </Reveal>
        </div>
      </section>

      {/* Form konsultasi */}
      <section id="konsultasi" className="bg-brand-dark">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="max-w-3xl text-white">
            <p className="type-micro text-brand-red">{t("Konsultasi gratis")}</p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              {t("Ceritakan proyekmu.")}
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/70">
              {t("Gambarkan idemu di kanvas, sesederhana apa pun. Lalu isi data di sebelahnya, kami balas lewat WhatsApp untuk tanya detail dan kirim penawaran.")}
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="flex flex-col lg:col-span-7">
              <DrawingCanvas />
              <p className="mt-3 text-[13px] text-white/55">
                {t("Sketsa tersimpan di browsermu. Unduh lewat tombol panah bawah, lalu kirimkan ke admin WhatsApp kami setelah mengisi data.")}
              </p>
              {/* FAQ singkat supaya kolom kiri tidak kosong. FAQ dan daftar "Setelah kamu kirim" sama-sama menempel
                  di dasar baris, jadi ujung bawahnya selalu sejajar (info tambahan form dibuka atau tidak). */}
              <div className="mt-10 lg:mt-auto lg:pt-10">
                <p className="type-micro text-brand-red">{t("Yang sering ditanyakan")}</p>
                <div className="mt-3">
                  <AccordionFAQ items={CONTECH_FAQ.map((q) => ({ question: t(q.question), answer: t(q.answer) }))} compact dark />
                </div>
              </div>
            </div>
            {/* Form, lalu langkah setelah kirim yang menempel di bawah supaya sejajar dengan akhir FAQ */}
            <div className="flex flex-col lg:col-span-5">
              <LeadForm role="konsultasi" tone="card" compact />
              <div className="mt-10 lg:mt-auto lg:pt-10">
                <p className="type-micro text-brand-red">{t("Setelah kamu kirim")}</p>
                <ol className="mt-3 border-t border-white/15">
                  {SETELAH_KIRIM.map((s, i) => (
                    <li key={s.title} className="flex gap-4 border-b border-white/15 py-3.5">
                      <span className="pt-0.5 text-[13px] font-black text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block text-[15px] font-semibold leading-snug text-white md:text-[16px]">{t(s.title)}</span>
                        <span className="mt-1 block text-[13.5px] leading-relaxed text-white/60">{t(s.body)}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulir klien E2E: tiga tahap, diisi langsung oleh klien */}
      <section id="formulir-klien" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="type-micro text-brand-red">{t("Formulir klien")}</p>
              <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-brand-dark">
                {t("Tiga formulir, sesuai tahap proyekmu.")}
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-brand-gray lg:col-span-5">
              {t("Diisi langsung oleh klien. Datanya membantu kami menyiapkan penawaran, menjalankan pesanan, dan memperbaiki layanan.")}
            </p>
          </div>
          <ol className="mt-8 grid gap-3 md:grid-cols-3">
            {FORM_KLIEN.map((f, i) => (
              <li key={f.code}>
                <a
                  href={GFORMS[f.code]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-brand-dark/10 bg-white p-5 transition-colors hover:border-brand-red"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-mute">
                      {String(i + 1).padStart(2, "0")} · {t(f.stage)}
                    </span>
                    <span className="rounded-md bg-brand-dark/[0.06] px-2 py-0.5 font-mono text-[11px] font-bold text-brand-dark">{f.code}</span>
                  </span>
                  <span className="mt-3 text-[17px] font-extrabold leading-snug text-brand-dark group-hover:text-brand-red">{t(f.title)}</span>
                  <span className="mt-1.5 text-[14px] leading-relaxed text-brand-gray">{t(f.body)}</span>
                  <span className="mt-auto pt-4 text-[13px] font-bold text-brand-red">{t("Isi formulir")} ↗</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCta
        title="Punya gambar tapi ragu strukturnya?"
        body="Kirim gambarnya, kami cek dulu. Konsultasi pertama gratis."
        primaryLabel="Kirim lewat WhatsApp"
        primaryHref={waLink(t("Halo barumahID, saya mau cek struktur bangunan saya."))}
        secondaryLabel="Lihat jasa dan harga"
        secondaryHref="#harga"
      />
    </>
  );
}
