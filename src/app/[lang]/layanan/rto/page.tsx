import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import DPSimulator from "@/components/rto/DPSimulator";
import LevelJourney from "@/components/rto/LevelJourney";
import RtoPlatform from "@/components/rto/listing/RtoPlatform";
import Link from "@/i18n/Link";
import {
  DP_CHANNELS,
  FUND_SAFETY,
  PRICE_LOCK_STAGES,
  READINESS_ASPECTS,
  REFUND_POLICY,
  RTO_FAQ,
  RTO_FORMS,
  RTO_ROLES,
  RTO_UNLOCK_MONTHS,
  RTO_UNLOCK_SCORE,
  RTO_CONVERT_YEARS,
  PRICE_EXAMPLE_DEAL,
  RTO_PROGRAM_FEE,
  dpPerMonth,
  programRent,
  regularRent,
} from "@/data/rto";
import { rp } from "@/components/rto/listing/format";
import { GFORMS } from "@/data/google-forms";
import { getAllListings } from "@/lib/rto-listing";
import { waLink } from "@/data/site";

// Halaman Rent-to-Own (arahan user Okt 2026): halaman 1 hero, halaman 2 platform listing yang menggabungkan jalur,
// langkah, level perjalanan, estimasi DP, simulasi per unit, dan formulir minat. Bagian bawah: keamanan dana,
// percepatan DP (kanal + simulasi lengkap), lalu daftar (peran, formulir resmi, FAQ).

export const metadata: Metadata = {
  title: "Rent-to-Own: Sewa Sambil Menabung DP Rumah",
  description:
    "Program Rent-to-Own barumahID: listing kos dan rumah per jalur Siap Berdaya, Siap Bangun, dan Siap Beli, lengkap dengan estimasi DP, simulasi, dan formulir minat. Tahap persiapan.",
  alternates: { canonical: "/layanan/rto" },
};

function Heading({ label, title, body, dark = false }: { label: string; title: string; body?: string; dark?: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <p className="type-micro text-brand-red">{label}</p>
        <h2
          className={`mt-5 text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.02em] ${
            dark ? "text-white" : "text-brand-dark"
          }`}
        >
          {title}
        </h2>
      </div>
      {body && (
        <p className={`text-[15px] leading-relaxed md:col-span-4 md:col-start-9 ${dark ? "text-white/65" : "text-brand-gray"}`}>{body}</p>
      )}
    </div>
  );
}

const ARROW = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

export default async function RtoPage() {
  const listings = await getAllListings();
  const maxAspect = Math.max(...READINESS_ASPECTS.map((a) => a.max));

  // Level perjalanan dan Skor Siap Punya Rumah: tampil di dalam tab Siap Berdaya
  const berdayaExtra = (
    <div className="rounded-3xl bg-brand-cream-warm p-5 md:p-8">
      <p className="type-micro text-brand-red">Level perjalanan</p>
      <p className="mt-3 max-w-2xl text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold leading-tight text-brand-dark">Naik level, buka RTO.</p>
      <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-brand-gray">
        Mulai dari sewa biasa. Selesaikan misinya, dan setelah {RTO_UNLOCK_MONTHS} bulan bayar tepat waktu dengan skor minimal {RTO_UNLOCK_SCORE}, gerbang RTO
        terbuka.
      </p>
      <div className="mt-8">
        <LevelJourney />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="rounded-3xl bg-brand-dark p-6 text-white md:p-7 lg:col-span-5">
          <p className="type-micro text-brand-red">Skor Siap Punya Rumah</p>
          <p className="mt-3 text-[clamp(1.3rem,2.4vw,1.7rem)] font-extrabold leading-tight">Lima hal yang dinilai, total 100.</p>
          <p className="mt-3 text-[14px] leading-relaxed text-white/65">
            Skor menentukan jalur yang paling cocok untukmu, bukan untuk menolakmu. Minimal <span className="font-extrabold text-white">{RTO_UNLOCK_SCORE}</span> untuk
            membuka RTO.
          </p>
        </div>
        <ul className="grid gap-3 rounded-3xl bg-white p-6 card-shadow md:p-7 lg:col-span-7">
          {READINESS_ASPECTS.map((a) => (
            <li key={a.name}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[14.5px] font-extrabold text-brand-dark">{a.name}</span>
                <span className="text-[12.5px] font-bold text-brand-gray">maks {a.max}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-brand-cream" aria-hidden="true">
                <div className="h-2 rounded-full bg-brand-red" style={{ width: `${(a.max / maxAspect) * 100}%` }} />
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-brand-gray">{a.hint}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-brand-gray">Level dan skormu tampil di dashboard akun penyewa barumahID.</p>
    </div>
  );

  return (
    <>
      <PageHero
        label="Program Rent-to-Own"
        title="Sewa hari ini. Miliki hunian nantinya."
        subtitle={
          <>
            <p>
              Pilih jalurmu, lihat unitnya, hitung DP-nya. Setelah RTO terbuka, kamu bayar sewa program dan 25%-nya dicatat jadi saldo DP atas namamu, lalu dikonversi jadi DP
              rumah setelah {RTO_CONVERT_YEARS.min} sampai {RTO_CONVERT_YEARS.max} tahun. Harga rumahnya dikunci sejak awal.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-brand-red" aria-hidden="true" />
              Tahap persiapan. Pendaftaran sudah dibuka.
            </p>
          </>
        }
        image="/images/hero-card.webp"
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
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <Heading
              label="Listing Rent-to-Own"
              title="Pilih jalurmu, lihat unitnya."
              body="Setiap unit masuk salah satu dari tiga jalur. Klik unit untuk melihat estimasi DP, simulasi, dan formulir minat. Alamat persis dibagikan saat survei."
            />
          </Reveal>
          <div className="mt-10">
            <RtoPlatform listings={listings} berdayaExtra={berdayaExtra} />
          </div>
        </div>
      </section>

      {/* Keamanan dana: rekening terpisah, pengembalian, price lock */}
      <section id="dana" className="scroll-mt-20 bg-brand-dark text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <Heading
              label="Keamanan dana"
              title="Uang DP-mu bukan uang kami."
              body="Dana titipan DP dipisah dari kas perusahaan, tercatat per orang, dan aturan pengembaliannya tertulis sejak awal."
              dark
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FUND_SAFETY.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="h-full rounded-3xl border border-white/10 p-6">
                  <p className="text-[18px] font-extrabold">{f.title}</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Dua harga, semuanya terbuka (keputusan user Okt 2026) */}
          <div className="mt-4 rounded-3xl bg-white/[0.06] p-6 md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="max-w-xl">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Dua harga, semuanya terbuka</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">
                  Pemilik kos selalu menerima harga yang disepakati, penuh. Setoran DP baru ditambahkan setelah RTO terbuka, dan itu uangmu sendiri.
                </p>
              </div>
              <p className="text-[12.5px] text-white/45">Contoh: harga yang disepakati dengan pemilik {rp(PRICE_EXAMPLE_DEAL)}</p>
            </div>
            <table className="mt-5 w-full text-left text-[13px] md:text-[14px]">
              <thead>
                <tr className="text-[12px] text-white/55">
                  <th className="py-2 font-semibold">
                    <span className="sr-only">Bagian</span>
                  </th>
                  <th className="py-2 pl-3 text-right font-semibold">
                    Sewa biasa
                    <span className="block text-[11px] font-normal text-white/40">bulan 1-{RTO_UNLOCK_MONTHS} atau tidak ikut RTO</span>
                  </th>
                  <th className="py-2 pl-3 text-right font-semibold">
                    Sewa program
                    <span className="block text-[11px] font-normal text-white/40">setelah RTO terbuka</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const biasa = regularRent(PRICE_EXAMPLE_DEAL);
                  const fee = biasa - PRICE_EXAMPLE_DEAL;
                  const rows: [string, string, string, boolean?][] = [
                    ["Pemilik kos", rp(PRICE_EXAMPLE_DEAL), rp(PRICE_EXAMPLE_DEAL)],
                    [`Layanan barumahID ${Math.round(RTO_PROGRAM_FEE * 100)}%`, rp(fee), rp(fee)],
                    ["Saldo DP atas namamu (25%)", "-", rp(dpPerMonth(biasa))],
                    ["Total yang kamu bayar", rp(biasa), rp(programRent(biasa)), true],
                  ];
                  return rows.map(([k, a, b, total]) => (
                    <tr key={k} className="border-t border-white/10">
                      <td className={`py-2.5 pr-3 ${total ? "font-extrabold text-white" : "text-white/80"}`}>{k}</td>
                      <td className={`py-2.5 pl-3 text-right tabular-nums ${total ? "font-extrabold text-white" : "text-white/80"}`}>{a}</td>
                      <td className={`py-2.5 pl-3 text-right tabular-nums ${total ? "font-extrabold text-white" : k.startsWith("Saldo") ? "font-bold text-brand-red" : "text-white/80"}`}>{b}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white/[0.06] p-6 md:p-7">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Kalau kamu mundur dari program</p>
              <table className="mt-4 w-full text-left text-[14px]">
                <tbody>
                  {REFUND_POLICY.map((r) => (
                    <tr key={r.when} className="border-t border-white/10">
                      <td className="py-2.5 pr-4 text-white/80">{r.when}</td>
                      <td className="py-2.5 text-right text-[16px] font-extrabold text-white">{r.back}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[12.5px] leading-relaxed text-white/50">Saldo DP itu uangmu, tidak ditahan. Persentase dari saldo, dicairkan paling lambat 14 hari kerja.</p>
            </div>
            <div className="rounded-3xl bg-white/[0.06] p-6 md:p-7">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Harga terkunci dari MoU sampai konversi</p>
              <ol className="mt-4 space-y-0">
                {PRICE_LOCK_STAGES.map((s, i) => (
                  <li key={s.at} className="flex gap-4 border-t border-white/10 py-2.5">
                    <span className={`w-28 shrink-0 text-[14px] font-extrabold ${i === 1 ? "text-brand-red" : "text-white"}`}>{s.at}</span>
                    <span className="text-[14px] leading-snug text-white/75">{s.body}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-white/45">
            Ketentuan final tertulis di Kontrak RTO dan dibagikan sebelum kamu tanda tangan.{" "}
            <Link href="/layanan/rto/panduan#dokumen" className="font-bold text-white/80 underline-offset-4 hover:underline">
              Lihat dokumen dan perjanjian
            </Link>
          </p>
        </div>
      </section>

      {/* Percepatan DP: kanal + simulasi lengkap */}
      <section id="percepatan" className="scroll-mt-20 bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <Heading
              label="Percepatan DP"
              title="Empat cara saldo DP-mu bertambah."
              body="Selain sewa, layanan sehari-hari di ekosistem barumahID akan ikut menambah saldo DP. Dibuka bertahap."
            />
          </Reveal>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DP_CHANNELS.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <li className={`flex h-full flex-col rounded-3xl p-5 ${c.status === "inti" ? "bg-brand-dark text-white" : "border border-brand-dark/10 bg-white"}`}>
                  <span
                    className={`self-start rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                      c.status === "inti" ? "bg-brand-red text-white" : "bg-brand-cream text-brand-gray"
                    }`}
                  >
                    {c.status === "inti" ? "Inti program" : "Segera"}
                  </span>
                  <p className={`mt-4 text-[16px] font-extrabold ${c.status === "inti" ? "" : "text-brand-dark"}`}>{c.name}</p>
                  <p className={`mt-1.5 text-[13.5px] leading-relaxed ${c.status === "inti" ? "text-white/70" : "text-brand-gray"}`}>{c.body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <div id="simulasi" className="mt-12 scroll-mt-24">
            <p className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold leading-tight text-brand-dark">Hitung saldo DP-mu saat konversi.</p>
            <p className="mb-6 mt-2 max-w-2xl text-[14.5px] leading-relaxed text-brand-gray">
              Pilih kapan saldo dikonversi jadi DP ({RTO_CONVERT_YEARS.min} sampai {RTO_CONVERT_YEARS.max} tahun), lalu lihat rumah seharga berapa yang DP-nya tertutup.
            </p>
            <DPSimulator formAnchor="#daftar" />
          </div>
        </div>
      </section>

      {/* Daftar: peran, formulir resmi, FAQ */}
      <section id="daftar" className="scroll-mt-20 bg-brand-dark">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="type-micro text-brand-red">Daftar</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">Mulai dari peranmu.</h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-white/70">
                Gratis dan tanpa komitmen. Penyewa membuat akun untuk memantau level dan saldo DP. Pemilik kos dan developer mendaftar lewat formulir resmi.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/portal/daftar?akun=penyewa" variant="red">
                  Buat akun penyewa
                </ButtonLink>
                <ButtonLink href={waLink("Halo barumahID, saya mau tanya soal program Rent-to-Own.")} variant="whatsapp" arrow={false}>
                  Tanya lewat WhatsApp
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-7">
              <AccordionFAQ items={RTO_FAQ} compact dark />
            </div>
          </div>

          <div id="peran" className="mt-14 grid scroll-mt-24 gap-4 md:grid-cols-3">
            {RTO_ROLES.map((r) => (
              <article key={r.id} className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-6">
                <h3 className="text-[19px] font-extrabold text-white">{r.name}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{r.tagline}</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  <a
                    href={GFORMS[r.form.code]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red-dark"
                  >
                    {r.form.label} {ARROW}
                  </a>
                  <Link href={`/layanan/rto/panduan#${r.id}`} className="text-[13.5px] font-bold text-white underline-offset-4 hover:underline">
                    Baca panduan
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Formulir resmi (Google Form; F12 dan F17 diisi tim, tidak ditampilkan) */}
          <div id="formulir" className="mt-4 grid scroll-mt-24 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RTO_FORMS.map((f) => (
              <a
                key={f.code}
                href={GFORMS[f.code]}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl bg-white/[0.08] p-5 transition-colors hover:bg-white/[0.12]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">{f.who}</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[11px] font-bold text-white">{f.code}</span>
                </span>
                <span className="mt-3 text-[15px] font-extrabold leading-snug text-white">{f.title}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-bold text-brand-red">Isi formulir {ARROW}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
