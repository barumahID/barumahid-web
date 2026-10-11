import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import ClosingCta from "@/components/home/ClosingCta";
import { PARTNER_ROLES } from "@/data/roles";
import { waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Kemitraan: Tumbuh Bareng Ekosistem barumahID",
  description:
    "Jadi mitra barumahID sebagai penyedia kos, developer, kontraktor dan mandor, tenaga kerja, supplier, freelancer Projectlink, atau mitra Knowledges.",
  alternates: { canonical: "/kemitraan" },
};

const FAQ = [
  { question: "Apakah ada biaya untuk jadi mitra?", answer: "Tidak ada biaya pendaftaran untuk semua peran." },
  {
    question: "Berapa lama sampai saya dihubungi?",
    answer: "Biasanya 1 sampai 3 hari kerja lewat WhatsApp, untuk verifikasi data dan menjelaskan langkah berikutnya.",
  },
  {
    question: "Kapan ada akun atau dashboard untuk mitra?",
    answer:
      "Sedang kami bangun bertahap, dimulai setelah jumlah mitra aktif cukup. Sampai itu, koordinasi proyek, termin, dan laporan lewat WhatsApp.",
  },
  {
    question: "Apakah mitra harus berada di Padang?",
    answer:
      "Proyek konstruksi kami saat ini paling banyak di Sumatera Barat. Freelancer Projectlink, developer, dan institusi bisa dari kota mana pun.",
  },
];

// Diagram ekosistem: barumahID di tengah, pelanggan dan mitra di sekelilingnya.
const ORBIT = [
  { label: "Calon pemilik rumah", kind: "customer" },
  { label: "Klien konstruksi", kind: "customer" },
  ...PARTNER_ROLES.map((r) => ({ label: r.name, kind: "mitra" as const })),
];

function Ecosystem() {
  const n = ORBIT.length;
  return (
    <>
      {/* Desktop: radial */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[640px] md:block" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="1 1.5" strokeWidth="0.3" />
          {ORBIT.map((_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 38 * Math.cos(a)}
                y2={50 + 38 * Math.sin(a)}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="0.25"
              />
            );
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-brand-red text-center text-white shadow-[0_0_80px_rgba(197,59,59,0.45)]">
          <span className="text-[20px] font-black">barumahID</span>
          <span className="mt-1 text-[11px] font-semibold text-white/80">ConTech + PropTech</span>
        </div>
        {ORBIT.map((o, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + 38 * Math.cos(a);
          const top = 50 + 38 * Math.sin(a);
          return (
            <div
              key={o.label}
              className={`absolute w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-2xl px-3 py-2.5 text-center text-[12px] font-bold leading-tight ${
                o.kind === "customer" ? "bg-white text-brand-dark" : "border border-white/20 bg-brand-dark text-white"
              }`}
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              {o.label}
            </div>
          );
        })}
      </div>
      {/* Mobile: daftar */}
      <div className="md:hidden">
        <div className="mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full bg-brand-red text-center text-white">
          <span className="text-[16px] font-black">barumahID</span>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-2">
          {ORBIT.map((o) => (
            <li
              key={o.label}
              className={`rounded-2xl px-3 py-3 text-center text-[13px] font-bold leading-tight ${
                o.kind === "customer" ? "bg-white text-brand-dark" : "border border-white/20 text-white"
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-center text-[13px] text-white/55">
        <span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-white align-middle" aria-hidden="true" />
        Pelanggan
        <span className="ml-5 mr-2 inline-block h-2.5 w-2.5 rounded-sm border border-white/50 align-middle" aria-hidden="true" />
        Mitra
      </p>
    </>
  );
}

export default function KemitraanPage() {
  return (
    <>
      <PageHero
        label="Kemitraan"
        title="Tumbuh bareng ekosistem barumahID."
        subtitle={
          <p>
            Rumah dibangun banyak tangan. Di barumahID, penyedia kos, developer, kontraktor, tukang, supplier, freelancer, dan
            institusi pendidikan bekerja dalam satu ekosistem.
          </p>
        }
        image="/images/proyek/bangun-rumah-2-lantai-padang.webp"
        size="lg"
      >
        <ButtonLink href="#peran" variant="red">
          Pilih peranmu
        </ButtonLink>
        <ButtonLink href={waLink("Halo barumahID, saya mau tanya soal kemitraan.")} variant="outline-light" arrow={false}>
          Tanya dulu via WhatsApp
        </ButtonLink>
      </PageHero>

      <section className="relative isolate overflow-hidden bg-brand-dark text-white">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:px-14">
          <Reveal className="lg:col-span-4">
            <p className="type-micro text-brand-red">Ekosistem</p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              Satu ekosistem, banyak peran.
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/65">
              Pelanggan datang lewat Rent-to-Own dan ConTech. Mitra yang mengerjakan, memasok, dan menyediakan unitnya. Makin banyak
              yang bergabung, makin cepat orang punya rumah.
            </p>
          </Reveal>
          <div className="lg:col-span-8">
            <Ecosystem />
          </div>
        </div>
      </section>

      <section id="peran" className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <div className="max-w-3xl">
              <p className="type-micro text-brand-red">Tujuh peran mitra</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-dark">
                Kamu masuk di bagian mana?
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PARTNER_ROLES.map((r, i) => (
              <Reveal key={r.slug} delay={(i % 3) * 80}>
                <article className="flex h-full flex-col rounded-3xl border border-brand-dark/10 bg-white p-6 md:p-7">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-mute">{r.short}</p>
                  <h3 className="mt-2 text-[21px] font-extrabold leading-snug tracking-tight text-brand-dark">{r.name}</h3>
                  <p className="mt-3 text-[14.5px] font-medium leading-relaxed text-brand-dark/85">{r.benefit}</p>
                  <div className="mt-5 rounded-2xl bg-brand-cream p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray">Syarat singkat</p>
                    <ul className="mt-2 space-y-1.5">
                      {r.requirements.map((q) => (
                        <li key={q} className="flex gap-2 text-[13.5px] text-brand-dark/80">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-semibold text-brand-gray">
                    {r.steps.map((s, idx) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-[10px] text-white">{idx + 1}</span>
                        {s}
                        {idx < r.steps.length - 1 && <span aria-hidden="true">→</span>}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-auto pt-6">
                    <Link
                      href={`/kemitraan/daftar/${r.slug}`}
                      className="flex items-center justify-center gap-2 rounded-full bg-brand-dark px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-red"
                    >
                      Daftar sebagai mitra ini →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream-warm">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-5">
            <p className="type-micro text-brand-red">Tanya jawab mitra</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-brand-dark">
              Sebelum kamu daftar.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <AccordionFAQ items={FAQ} compact />
          </div>
        </div>
      </section>

      <ClosingCta
        title="Belum yakin peran yang pas?"
        body="Ceritakan usaha atau keahlianmu, kami bantu arahkan."
        primaryLabel="Ngobrol via WhatsApp"
        primaryHref={waLink("Halo barumahID, saya mau jadi mitra tapi belum yakin perannya.")}
        secondaryLabel="Lihat semua peran"
        secondaryHref="#peran"
      />
    </>
  );
}
