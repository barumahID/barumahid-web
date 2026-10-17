import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import DPSimulator from "@/components/rto/DPSimulator";
import ListingGrid from "@/components/rto/ListingGrid";
import LevelJourney from "@/components/rto/LevelJourney";
import Link from "@/i18n/Link";
import {
  DP_CHANNELS,
  FUND_SAFETY,
  PRICE_LOCK_STAGES,
  READINESS_ASPECTS,
  REFUND_POLICY,
  RTO_FAQ,
  RTO_FORMS,
  RTO_PATHS,
  RTO_ROLES,
  RTO_STEPS,
  RTO_UNLOCK_MONTHS,
  RTO_UNLOCK_SCORE,
} from "@/data/rto";
import { GFORMS } from "@/data/google-forms";
import { LISTINGS } from "@/data/listings";
import { waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Rent-to-Own: Sewa Sambil Menabung DP Rumah",
  description:
    "Program Rent-to-Own barumahID: sewa di unit mitra, naik level, buka RTO, lalu 25% sewa jadi saldo DP. Tiga jalur kepemilikan, simulasi DP, panduan, dan formulir. Tahap persiapan.",
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

export default function RtoPage() {
  const maxAspect = Math.max(...READINESS_ASPECTS.map((a) => a.max));
  return (
    <>
      <PageHero
        label="Program Rent-to-Own"
        title="Sewa hari ini. Miliki hunian nantinya."
        subtitle={
          <>
            <p>
              Sewa di unit mitra barumahID, naik level, lalu buka RTO. Setelah itu 25% dari setiap sewa dicatat jadi saldo DP atas
              namamu.
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
        <ButtonLink href="#level" variant="red">
          Lihat level perjalanan
        </ButtonLink>
        <ButtonLink href="#simulasi" variant="outline-light" arrow={false}>
          Hitung DP-mu
        </ButtonLink>
      </PageHero>

      {/* Apa itu RTO */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading
              label="Apa itu Rent-to-Own"
              title="Sewa yang tidak sia-sia."
              body="Banyak pekerja sanggup bayar cicilan, tapi tertahan di DP. Di RTO, DP terkumpul dari sewa yang memang kamu bayar setiap bulan."
            />
          </Reveal>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {RTO_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <li className={`flex h-full flex-col rounded-3xl p-6 md:p-7 ${i === 2 ? "bg-brand-red text-white" : "bg-white text-brand-dark card-shadow"}`}>
                  <span className={`text-[44px] font-black leading-none ${i === 2 ? "text-white/90" : "text-brand-red/85"}`}>{i + 1}</span>
                  <p className="mt-5 text-[19px] font-extrabold">{s.title}</p>
                  <p className={`mt-2 text-[14.5px] leading-relaxed ${i === 2 ? "text-white/85" : "text-brand-gray"}`}>{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Level perjalanan: gamifikasi menuju RTO */}
      <section id="level" className="scroll-mt-20 bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading
              label="Level perjalanan"
              title="Naik level, buka RTO."
              body={`Mulai dari sewa biasa. Selesaikan misinya, dan setelah ${RTO_UNLOCK_MONTHS} bulan bayar tepat waktu dengan skor minimal ${RTO_UNLOCK_SCORE}, gerbang RTO terbuka.`}
            />
          </Reveal>
          <div className="mt-12">
            <LevelJourney />
          </div>

          {/* Skor Siap Punya Rumah */}
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="rounded-3xl bg-brand-dark p-6 text-white md:p-8 lg:col-span-5">
              <p className="type-micro text-brand-red">Skor Siap Punya Rumah</p>
              <p className="mt-4 text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">Lima hal yang dinilai, total 100.</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">
                Skor menentukan jalur yang paling cocok untukmu, bukan untuk menolakmu. Skor dihitung ulang berkala, jadi kondisi yang
                membaik ikut terlihat.
              </p>
              <p className="mt-5 rounded-2xl bg-white/[0.07] p-4 text-[13.5px] leading-relaxed text-white/80">
                Minimal <span className="font-extrabold text-white">{RTO_UNLOCK_SCORE}</span> untuk membuka RTO. Di bawah itu, kamu tetap
                bisa sewa biasa sambil dibantu edukasi keuangan.
              </p>
            </div>
            <ul className="grid gap-3 rounded-3xl bg-white p-6 card-shadow md:p-8 lg:col-span-7">
              {READINESS_ASPECTS.map((a) => (
                <li key={a.name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-extrabold text-brand-dark">{a.name}</span>
                    <span className="text-[13px] font-bold text-brand-gray">maks {a.max}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-brand-cream" aria-hidden="true">
                    <div className="h-2 rounded-full bg-brand-red" style={{ width: `${(a.max / maxAspect) * 100}%` }} />
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-brand-gray">{a.hint}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-brand-gray">
            Status levelmu nanti tampil di dashboard akun barumahID. Dashboard penyewa sedang kami siapkan.
          </p>
        </div>
      </section>

      {/* Tiga jalur (anchor #jalur dan #<id-jalur> dipakai kartu di beranda Rent-to-Own) */}
      <section id="jalur" className="relative isolate scroll-mt-20 overflow-hidden bg-brand-dark text-white">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading
              label="Tiga jalur kepemilikan"
              title="Pilih jalur yang sesuai kondisimu."
              body="Kategori ini juga yang kamu lihat di listing, supaya jelas unit mana cocok untuk jalur mana."
              dark
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {RTO_PATHS.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <article id={p.id} className="flex h-full scroll-mt-28 flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-6 md:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">0{i + 1}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        p.status === "Segera" ? "bg-white/10 text-white/70" : "bg-white text-brand-dark"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[26px] font-extrabold leading-none tracking-tight">{p.name}</h3>
                  <p className="mt-2 text-[15px] font-semibold text-white/85">{p.explainer}</p>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-white/65">{p.forWho}</p>
                  <p className="mt-3 border-t border-white/10 pt-4 text-[14.5px] leading-relaxed text-white/80">{p.how}</p>
                  {p.id === "siap-bangun" && (
                    <Link href="/layanan/contech" className="mt-4 text-[13px] font-bold text-white underline-offset-4 hover:underline">
                      Lihat Jasa Konstruksi barumahID
                    </Link>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tiga peran di platform */}
      <section id="peran" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading
              label="Siapa saja di platform ini"
              title="Satu ekosistem, tiga peran."
              body="Penyewa naik level menuju rumah sendiri. Penyedia kos mendapat penyewa terverifikasi. Developer menerima pembeli yang DP-nya sudah terkumpul."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {RTO_ROLES.map((r, i) => (
              <Reveal key={r.id} delay={i * 90}>
                <article className={`flex h-full flex-col rounded-3xl p-6 md:p-7 ${i === 0 ? "bg-brand-dark text-white" : "bg-white card-shadow"}`}>
                  <p className={`text-[12px] font-bold uppercase tracking-[0.16em] ${i === 0 ? "text-brand-red" : "text-brand-red"}`}>0{i + 1}</p>
                  <h3 className={`mt-4 text-[24px] font-extrabold leading-tight ${i === 0 ? "" : "text-brand-dark"}`}>{r.name}</h3>
                  <p className={`mt-2 text-[14.5px] leading-relaxed ${i === 0 ? "text-white/70" : "text-brand-gray"}`}>{r.tagline}</p>
                  <ul className="mt-5 space-y-2.5">
                    {r.gets.map((g) => (
                      <li key={g} className={`flex gap-2.5 text-[14px] leading-snug ${i === 0 ? "text-white/85" : "text-brand-dark"}`}>
                        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                        {g}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                    <a
                      href={GFORMS[r.form.code]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red-dark"
                    >
                      {r.form.label} {ARROW}
                    </a>
                    <Link
                      href={`/layanan/rto/panduan#${r.id}`}
                      className={`text-[13.5px] font-bold underline-offset-4 hover:underline ${i === 0 ? "text-white" : "text-brand-dark"}`}
                    >
                      Baca panduan
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Percepatan DP */}
      <section className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <Heading
              label="Percepatan DP"
              title="Lima cara saldo DP-mu bertambah."
              body="Selain sewa, layanan sehari-hari di ekosistem barumahID akan ikut menambah saldo DP. Dibuka bertahap."
            />
          </Reveal>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
        </div>
      </section>

      {/* Simulasi */}
      <section id="simulasi" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading label="Simulasi DP" title="Hitung sendiri perjalanan DP-mu." body="Geser angkanya sesuai kondisimu. Hasilnya langsung berubah." />
          </Reveal>
          <div className="mt-12">
            <DPSimulator formAnchor="#formulir" />
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
              <p className="mt-3 text-[12.5px] leading-relaxed text-white/50">Persentase dari saldo DP. Dicairkan paling lambat 14 hari kerja.</p>
            </div>
            <div className="rounded-3xl bg-white/[0.06] p-6 md:p-7">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Harga unit dikunci bertahap</p>
              <ol className="mt-4 space-y-0">
                {PRICE_LOCK_STAGES.map((s, i) => (
                  <li key={s.at} className="flex gap-4 border-t border-white/10 py-2.5">
                    <span className={`w-28 shrink-0 text-[14px] font-extrabold ${i === 2 ? "text-brand-red" : "text-white"}`}>{s.at}</span>
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

      {/* Listing */}
      <section id="listing" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading
              label="Listing kos dan rumah"
              title="Unit yang bisa kamu tempati."
              body="Setiap unit kami cek langsung sebelum tayang. Alamat persis dibagikan saat survei, bukan di website."
            />
          </Reveal>
          <div className="mt-10">
            <ListingGrid listings={LISTINGS} />
          </div>
        </div>
      </section>

      {/* Formulir RTO (Google Form resmi; F12 dan F17 diisi tim, tidak ditampilkan) */}
      <section id="formulir" className="scroll-mt-20 bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <Heading
              label="Formulir"
              title="Mulai dari formulir yang sesuai peranmu."
              body="Formulir resmi barumahID. Tim kami menghubungimu setelah formulir masuk."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RTO_FORMS.map((f, i) => (
              <Reveal key={f.code} delay={i * 70}>
                <a
                  href={GFORMS[f.code]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-3xl bg-white p-6 card-shadow transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray">{f.who}</span>
                    <span className="rounded-md bg-brand-cream px-2 py-0.5 font-mono text-[11px] font-bold text-brand-dark">{f.code}</span>
                  </div>
                  <p className="mt-4 text-[18px] font-extrabold leading-tight text-brand-dark group-hover:text-brand-red">{f.title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-brand-gray">{f.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13.5px] font-bold text-brand-red">
                    Isi formulir {ARROW}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + bantuan */}
      <section id="daftar" className="scroll-mt-20 bg-brand-dark">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-5">
            <p className="type-micro text-brand-red">Daftar</p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">
              Jadi yang pertama dikabari.
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/70">
              Gratis dan tanpa komitmen. Datamu kami pakai untuk mencocokkan unit dan menyiapkan simulasi yang pas untukmu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={GFORMS.F11} variant="red">
                Daftar calon penyewa
              </ButtonLink>
              <ButtonLink href={waLink("Halo barumahID, saya mau tanya soal program Rent-to-Own.")} variant="whatsapp" arrow={false}>
                Tanya lewat WhatsApp
              </ButtonLink>
            </div>
            <p className="mt-6 text-[13px] text-white/50">
              Pemilik kos atau developer?{" "}
              <a href="#formulir" className="font-bold text-white/80 underline-offset-4 hover:underline">
                Pilih formulirmu
              </a>
            </p>
          </div>
          <div className="lg:col-span-7">
            <AccordionFAQ items={RTO_FAQ} compact dark />
          </div>
        </div>
      </section>
    </>
  );
}
