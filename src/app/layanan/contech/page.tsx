import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import ProjectMap from "@/components/constech/ProjectMap";
import PricingTiers from "@/components/constech/PricingTiers";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import LeadForm from "@/components/forms/LeadForm";
import ClosingCta from "@/components/home/ClosingCta";
import { PORTFOLIO, STATS, verifiedCities } from "@/data/projects";
import { AHSP_FORMULA, BUILD_STEPS, ORDER_STEPS } from "@/data/pricing";
import { JURURANCANG_DM, waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Layanan ConTech: Jasa Gambar, Analisa Struktur, Renovasi, dan Bangun",
  description:
    "Jasa gambar mulai Rp15.000/m², analisa struktur mulai Rp18.000/m², renovasi dan bangun dengan RAB berbasis AHSP. Dikerjakan insinyur, 30+ proyek sejak 2018.",
  alternates: { canonical: "/layanan/contech" },
};

const services = [
  {
    name: "Gambar & Modelling",
    body: "Denah, tampak, gambar kerja, dan 3D eksterior untuk rumah, kos, ruko, sampai fasilitas umum.",
    price: "Mulai Rp15.000/m²",
    href: "#harga",
  },
  {
    name: "Desain & Analisa Struktur",
    body: "Hitungan struktur berbasis SNI dengan ETABS atau SAP2000, lengkap dengan dimensi dan penulangan.",
    price: "Mulai Rp18.000/m²",
    href: "#harga",
  },
  {
    name: "Renovasi & Bangun",
    body: "Dikerjakan bersama mitra mandor. Biaya dihitung per item pekerjaan, disepakati sebelum mulai.",
    price: "RAB berbasis AHSP",
    href: "#renovasi",
  },
];

export default function ConstechPage() {
  const cities = verifiedCities();
  return (
    <>
      <PageHero
        label="Layanan ConTech"
        title="Proyekmu, dibikin mudah aja."
        subtitle={
          <p>
            Jasa desain, analisa struktur, renovasi, dan bangun. Dikerjakan insinyur, dihitung transparan, dari Padang untuk
            proyek di seluruh Indonesia.
          </p>
        }
        image="/images/proyek/model-struktur-gedung-baja.webp"
        size="lg"
      >
        <ButtonLink href="#konsultasi" variant="red">
          Konsultasi gratis
        </ButtonLink>
        <ButtonLink href="#harga" variant="outline-light" arrow={false}>
          Lihat harga paket
        </ButtonLink>
      </PageHero>

      {/* Tiga jasa */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 90}>
                <a href={s.href} className="tilt-card flex h-full flex-col rounded-3xl border border-brand-dark/10 bg-white p-6 md:p-7">
                  <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">0{i + 1}</span>
                  <h2 className="mt-4 text-[21px] font-extrabold tracking-tight text-brand-dark">{s.name}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-brand-gray">{s.body}</p>
                  <p className="mt-auto pt-6 text-[14px] font-bold text-brand-dark">{s.price} →</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Peta proyek */}
      <section id="peta" className="relative isolate overflow-hidden bg-brand-dark text-white">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <div className="grid gap-5 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="type-micro text-brand-red">Jejak proyek</p>
                <h2 className="mt-5 text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
                  {STATS.projects}+ proyek di {cities.length} kota, {STATS.provinces} provinsi.
                </h2>
              </div>
              <p className="text-[15px] leading-relaxed text-white/65 md:col-span-4 md:col-start-9">
                Klik titik atau nama kota untuk melihat proyek yang pernah kami kerjakan di sana.
              </p>
            </div>
          </Reveal>
          <div className="mt-12">
            <ProjectMap cities={cities} />
          </div>
        </div>
      </section>

      {/* Harga paket */}
      <section id="harga" className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <div className="max-w-3xl">
              <p className="type-micro text-brand-red">Harga paket gambar dan struktur</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-dark">
                Harga jelas di depan, per meter persegi.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-brand-gray">
                Jasa gambar dan struktur dikerjakan Jururancang Engineering Mahaksa, mitra teknis barumahID. Pemesanan lewat DM
                Instagram{" "}
                <a href={JURURANCANG_DM} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-dark underline underline-offset-4">
                  @jururancang_mahaksa
                </a>
                .
              </p>
            </div>
          </Reveal>
          <div className="mt-12">
            <PricingTiers />
          </div>
          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            {ORDER_STEPS.map((s, i) => (
              <li key={s.title} className="rounded-3xl bg-brand-cream-warm p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark text-[14px] font-black text-white">{i + 1}</span>
                <p className="mt-4 text-[16px] font-extrabold text-brand-dark">{s.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-brand-gray">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Renovasi & bangun */}
      <section id="renovasi" className="bg-brand-cream-warm">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:px-14">
          <Reveal className="lg:col-span-5">
            <p className="type-micro text-brand-red">Renovasi dan bangun</p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-dark">
              Tidak ada harga borongan asal tebak.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-brand-gray">
              Renovasi, bangun, serta pendampingan dan manajemen konstruksi dihitung per item pekerjaan dengan AHSP sesuai Permen
              PUPR No. 1 Tahun 2022 dan harga satuan daerah. Angkanya kamu lihat dan setujui sebelum pekerjaan dimulai.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-brand-gray">
              Dikerjakan barumahID bersama mitra mandor yang sudah pernah bekerja dengan kami. Konsultasi pertama gratis.
            </p>
            <div className="mt-8 rounded-3xl bg-white p-6 card-shadow">
              <p className="type-micro text-brand-red">Cara hitung dengan AHSP</p>
              <ol className="mt-4 space-y-3">
                {AHSP_FORMULA.map((f, i) => (
                  <li key={f.label} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-dark text-[12px] font-black text-white">
                      {i + 1}
                    </span>
                    <span className="text-[14px] leading-relaxed text-brand-gray">
                      <span className="font-extrabold text-brand-dark">{f.label}.</span> {f.body}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#konsultasi" variant="dark">
                Minta hitungan RAB
              </ButtonLink>
              <ButtonLink href={waLink("Halo barumahID, saya mau konsultasi renovasi atau bangun.")} variant="whatsapp" arrow={false}>
                WhatsApp
              </ButtonLink>
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
