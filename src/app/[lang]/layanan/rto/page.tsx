import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import DPSimulator from "@/components/rto/DPSimulator";
import ListingGrid from "@/components/rto/ListingGrid";
import LeadForm from "@/components/forms/LeadForm";
import { DP_CHANNELS, FUND_SAFETY, RTO_FAQ, RTO_PATHS, RTO_STEPS } from "@/data/rto";
import { LISTINGS } from "@/data/listings";

export const metadata: Metadata = {
  title: "Rent-to-Own: Sewa Sambil Menabung DP Rumah",
  description:
    "Program Rent-to-Own barumahID: 25% dari sewa jadi saldo DP, tiga jalur kepemilikan, simulasi DP, dan listing rumah. Tahap persiapan, daftar minat dibuka.",
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

export default function RtoPage() {
  return (
    <>
      <PageHero
        label="Program Rent-to-Own"
        title="Sewa hari ini. Miliki hunian nantinya."
        subtitle={
          <>
            <p>Setiap bulan sewa, 25% dicatat jadi saldo DP atas namamu. Saat cukup, kamu lanjut ke jalur kepemilikan.</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-brand-red" aria-hidden="true" />
              Tahap persiapan. Daftar minat sudah dibuka.
            </p>
          </>
        }
        image="/images/hero-card.webp"
        size="lg"
      >
        <ButtonLink href="#simulasi" variant="red">
          Hitung DP-mu
        </ButtonLink>
        <ButtonLink href="#listing" variant="outline-light" arrow={false}>
          Lihat listing
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
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {RTO_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <li className={`flex h-full flex-col rounded-3xl p-6 md:p-7 ${i === 1 ? "bg-brand-red text-white" : "bg-white text-brand-dark card-shadow"}`}>
                  <span className={`text-[44px] font-black leading-none ${i === 1 ? "text-white/90" : "text-brand-red/85"}`}>{i + 1}</span>
                  <p className="mt-5 text-[19px] font-extrabold">{s.title}</p>
                  <p className={`mt-2 text-[14.5px] leading-relaxed ${i === 1 ? "text-white/85" : "text-brand-gray"}`}>{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
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
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Percepatan DP */}
      <section className="bg-brand-cream">
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
      <section id="simulasi" className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading label="Simulasi DP" title="Hitung sendiri perjalanan DP-mu." body="Geser angkanya sesuai kondisimu. Hasilnya langsung berubah." />
          </Reveal>
          <div className="mt-12">
            <DPSimulator />
          </div>
        </div>
      </section>

      {/* Keamanan dana */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <Heading label="Keamanan dana" title="Uang DP-mu bukan uang kami." dark />
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
          <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-white/45">
            Mekanisme lengkap, termasuk perjanjian dan laporan saldo, kami umumkan sebelum unit pertama dibuka.
          </p>
        </div>
      </section>

      {/* Listing */}
      <section id="listing" className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <Heading
              label="Listing rumah"
              title="Unit yang bisa kamu tempati."
              body="Setiap unit kami cek langsung. Alamat persis dibagikan saat survei, bukan di website."
            />
          </Reveal>
          <div className="mt-10">
            <ListingGrid listings={LISTINGS} />
          </div>
        </div>
      </section>

      {/* FAQ + daftar minat */}
      <section id="daftar" className="bg-brand-dark">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-5">
            <p className="type-micro text-brand-red">Daftar minat</p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">
              Jadi yang pertama dikabari.
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/70">
              Gratis dan tanpa komitmen. Data ini kami pakai untuk mencocokkan unit dan menyiapkan simulasi yang pas untukmu.
            </p>
            <div className="mt-10">
              <AccordionFAQ items={RTO_FAQ} compact dark />
            </div>
          </div>
          <div className="lg:col-span-7">
            <LeadForm role="customer-rto" tone="card" />
          </div>
        </div>
      </section>
    </>
  );
}
