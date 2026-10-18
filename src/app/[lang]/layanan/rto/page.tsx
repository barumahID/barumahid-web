import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import DPSimulator from "@/components/rto/DPSimulator";
import LevelJourney from "@/components/rto/LevelJourney";
import RtoPlatform from "@/components/rto/listing/RtoPlatform";
import RtoHeroMotion from "@/components/rto/RtoHeroMotion";
import LightStreaks from "@/components/ui/LightStreaks";
import Link from "@/i18n/Link";
import {
  DP_CHANNELS,
  FUND_SAFETY,
  REFUND_POLICY,
  REFUND_PROCESS,
  RTO_CONVERT_YEARS,
  RTO_FAQ,
  RTO_FORMS,
  RTO_ROLES,
  RTO_UNLOCK_MONTHS,
  RTO_UNLOCK_SCORE,
  WHY_RTO,
} from "@/data/rto";
import { GFORMS } from "@/data/google-forms";
import { getAllListings } from "@/lib/rto-listing";
import { waLink } from "@/data/site";

// Halaman Rent-to-Own (arahan user Okt 2026): halaman 1 hero (latar bergerak RtoHeroMotion: setoran mengisi rumah, plus
// tiga fakta singkat), halaman 2 platform listing tiga jalur (Rumah Berdaya,
// Rumah Bangun, Rumah Beli). Bagian bawah dibuat ringkas: kenapa lewat barumahID + keamanan dana + aturan mundur
// (tanpa rincian persen dan pembagian, karena itu model bisnis), percepatan DP + simulasi, lalu daftar (peran, akun
// Portal, formulir resmi, FAQ). Dua bagian gelap memakai latar garis cahaya (LightStreaks) yang sama dengan halaman Profil.

export const metadata: Metadata = {
  title: "Rent-to-Own: Sewa Sambil Menabung DP Rumah",
  description:
    "Program Rent-to-Own barumahID: Rumah Berdaya, Rumah Bangun, dan Rumah Beli. Listing kos dan rumah, harga rumah terkunci di MoU, simulasi DP, dan formulir minat. Tahap persiapan.",
  alternates: { canonical: "/layanan/rto" },
};

function Heading({ label, title, body, dark = false }: { label: string; title: string; body?: string; dark?: boolean }) {
  return (
    <div className="grid gap-3 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <p className="type-micro text-brand-red">{label}</p>
        <h2 className={`mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em] ${dark ? "text-white" : "text-brand-dark"}`}>{title}</h2>
      </div>
      {body && <p className={`text-[14.5px] leading-relaxed md:col-span-5 ${dark ? "text-white/65" : "text-brand-gray"}`}>{body}</p>}
    </div>
  );
}

const ARROW = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

const section = "mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-16 lg:px-14";

const CHECK = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

const HERO_FACTS = ["Harga rumah dikunci di MoU", "25% sewa program jadi saldo DP", `Jadi DP dalam ${RTO_CONVERT_YEARS.min}-${RTO_CONVERT_YEARS.max} tahun`];

export default async function RtoPage() {
  const listings = await getAllListings();

  return (
    <>
      <PageHero
        label="Program Rent-to-Own"
        title="Sewa hari ini. Miliki hunian nantinya."
        subtitle={
          <>
            <p>Ngekos di unit mitra sambil mengumpulkan DP rumah. Harga rumah tujuanmu dikunci sejak awal, jadi tidak ikut naik.</p>
            <ul className="mt-5 flex flex-wrap gap-2 text-[13px] font-semibold text-white">
              {HERO_FACTS.map((f) => (
                <li key={f} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-brand-red">{CHECK}</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-white/70">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-brand-red" aria-hidden="true" />
              Tahap persiapan. Pendaftaran sudah dibuka.
            </p>
          </>
        }
        image="/images/hero-card.webp"
        backdrop={<RtoHeroMotion />}
        size="lg"
      >
        <ButtonLink href="#listing" variant="red">
          Lihat unit
        </ButtonLink>
        <ButtonLink href="#simulasi" variant="outline-light" arrow={false}>
          Hitung DP-mu
        </ButtonLink>
      </PageHero>

      {/* Halaman 2: platform listing per jalur */}
      <section id="listing" className="scroll-mt-20 bg-brand-cream">
        <div className={section}>
          <Reveal>
            <Heading
              label="Listing Rent-to-Own"
              title="Pilih jalurmu, lihat unitnya."
              body="Klik unit untuk estimasi DP, simulasi, dan formulir minat. Alamat persis dibagikan saat survei."
            />
          </Reveal>
          <div className="mt-8">
            <RtoPlatform
              listings={listings}
              levels={
                <div className="rounded-3xl bg-brand-cream-warm p-5 md:p-7">
                  <p className="text-[15px] font-extrabold text-brand-dark">Level perjalanan</p>
                  <p className="mt-1 text-[13.5px] text-brand-gray">
                    Mulai dari sewa biasa. Setelah {RTO_UNLOCK_MONTHS} bulan tepat waktu dan skor minimal {RTO_UNLOCK_SCORE}, gerbang RTO terbuka. Level dan skormu
                    tampil di dashboard.
                  </p>
                  <div className="mt-6">
                    <LevelJourney />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Kenapa lewat barumahID + keamanan dana + aturan mundur, ringkas */}
      <section id="dana" className="relative isolate scroll-mt-20 overflow-hidden bg-brand-dark text-white">
        <LightStreaks className="-z-10" />
        <div className={section}>
          <Reveal>
            <Heading
              label="Aman dan masuk akal"
              title="Kenapa nabung DP di sini, bukan sendiri di bank?"
              body="Dananya tetap atas namamu. Bedanya, harga rumah terkunci dan riwayat sewamu jadi jalan menuju KPR."
              dark
            />
          </Reveal>
          {/* Empat alasan sebaris, lalu keamanan dana dan aturan mundur berdampingan (tinggi seimbang, tanpa kartu kosong) */}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_RTO.map((w, i) => (
              <li key={w.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-[2px]">
                <span className="text-[12px] font-extrabold text-brand-red">0{i + 1}</span>
                <p className="mt-1 text-[16px] font-extrabold leading-snug">{w.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/65">{w.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-4 lg:grid-cols-12">
            <div className="flex flex-col rounded-2xl bg-white/[0.06] p-5 lg:col-span-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Keamanan dana</p>
              <ul className="mb-4 mt-3 space-y-3">
                {FUND_SAFETY.map((f) => (
                  <li key={f.title} className="flex gap-3 text-[13.5px] leading-snug">
                    <span className="mt-0.5 text-brand-red">{CHECK}</span>
                    <span>
                      <span className="block font-bold text-white">{f.title}</span>
                      <span className="text-white/65">{f.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto border-t border-white/10 pt-3 text-[12.5px] leading-relaxed text-white/50">
                Saldo DP berstatus dana titipan: tetap milikmu, dipakai untuk DP rumah tujuan atau modal bangun.
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-5 lg:col-span-7">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Kalau mundur dari program</p>
              <ul className="mt-2 divide-y divide-white/10">
                {REFUND_POLICY.map((r) => (
                  <li key={r.when} className="grid gap-0.5 py-2 text-[13px] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-3">
                    <span className="font-semibold text-white">{r.when}</span>
                    <span className="text-white/65">{r.rule}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12px] leading-relaxed text-white/45">
                {REFUND_PROCESS}{" "}
                <Link href="/layanan/rto/panduan#dana" className="font-bold text-white/80 underline-offset-4 hover:underline">
                  Aturan lengkap
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Percepatan DP: channel + simulasi lengkap */}
      <section id="percepatan" className="scroll-mt-20 bg-brand-cream-warm">
        <div className={section}>
          <Reveal>
            <Heading label="Percepatan DP" title="Empat cara saldo DP-mu bertambah." body="Selain sewa, layanan Kosanesia ikut menambah saldo. Dibuka bertahap." />
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DP_CHANNELS.map((c) => (
              <li key={c.name} className={`flex h-full flex-col rounded-2xl p-4 ${c.status === "inti" ? "bg-brand-dark text-white" : "border border-brand-dark/10 bg-white"}`}>
                <span
                  className={`self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    c.status === "inti" ? "bg-brand-red text-white" : "bg-brand-cream text-brand-gray"
                  }`}
                >
                  {c.status === "inti" ? "Inti program" : "Segera"}
                </span>
                <p className={`mt-3 text-[15.5px] font-extrabold ${c.status === "inti" ? "" : "text-brand-dark"}`}>{c.name}</p>
                <p className={`mt-1 text-[13px] leading-snug ${c.status === "inti" ? "text-white/70" : "text-brand-gray"}`}>{c.body}</p>
              </li>
            ))}
          </ul>
          <div id="simulasi" className="mt-10 scroll-mt-24">
            <p className="text-[clamp(1.3rem,2.4vw,1.7rem)] font-extrabold leading-tight text-brand-dark">Hitung saldo DP-mu saat konversi.</p>
            <p className="mb-5 mt-1 max-w-2xl text-[14px] leading-relaxed text-brand-gray">
              Geser sewa, pilih lama RTO ({RTO_CONVERT_YEARS.min}-{RTO_CONVERT_YEARS.max} tahun), lalu lihat rumah seharga berapa yang DP-nya tertutup saldo.
            </p>
            <DPSimulator formAnchor="#daftar" />
          </div>
        </div>
      </section>

      {/* Daftar: peran (akun Portal, formulir, panduan) dan FAQ */}
      <section id="daftar" className="relative isolate scroll-mt-20 overflow-hidden bg-brand-dark">
        <LightStreaks flares={4} className="-z-10" />
        <div className={section}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="type-micro text-brand-red">Daftar</p>
              <h2 className="mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">Mulai dari peranmu.</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">Gratis. Tiap peran punya dashboard di Portal, formulir resmi, dan panduan.</p>
              <div id="peran" className="mt-6 scroll-mt-24 space-y-3">
                {RTO_ROLES.map((r) => (
                  <article key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[16px] font-extrabold text-white">{r.name}</h3>
                      <p className="text-[12.5px] text-white/55">{r.tagline}</p>
                    </div>
                    <p className="mt-1 text-[12.5px] text-white/65">{r.gets.join(" · ")}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-bold">
                      <Link href={r.portal.href} className="rounded-full bg-brand-red px-4 py-2 text-white transition-colors hover:bg-brand-red-dark">
                        {r.portal.label}
                      </Link>
                      <a href={GFORMS[r.form.code]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white hover:underline">
                        {r.form.label} ({r.form.code}) {ARROW}
                      </a>
                      <Link href={`/layanan/rto/panduan#${r.id}`} className="text-white/70 hover:text-white hover:underline">
                        Panduan
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <div id="formulir" className="mt-4 flex scroll-mt-24 flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
                <ButtonLink href={waLink("Halo barumahID, saya mau tanya soal program Rent-to-Own.")} variant="whatsapp" arrow={false}>
                  Tanya lewat WhatsApp
                </ButtonLink>
                {RTO_FORMS.filter((f) => f.code === "F13").map((f) => (
                  <a key={f.code} href={GFORMS[f.code]} target="_blank" rel="noopener noreferrer" className="font-bold text-white/70 hover:text-white hover:underline">
                    {f.title} ({f.code})
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <AccordionFAQ items={RTO_FAQ} compact dark />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
