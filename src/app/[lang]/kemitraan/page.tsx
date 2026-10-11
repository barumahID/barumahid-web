import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/Link";
import Reveal from "@/components/Reveal";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import ChannelIcon from "@/components/icons/ChannelIcon";
import { ALUR, FORM_GROUPS, GALERI, JALUR, KEMITRAAN_FAQ, KEMITRAAN_HERO, PERUBAHAN, type JalurId } from "@/data/kemitraan";
import { GFORMS } from "@/data/google-forms";
import { JURURANCANG, waLink } from "@/data/site";
import { alternates, pageLang } from "@/i18n/server";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await pageLang(params);
  return {
    title: t("Kemitraan"),
    description: t(
      "Kemitraan barumahID untuk Jasa Konstruksi (tenaga kerja, kontraktor dan mandor, supplier dan vendor) dan program Rent-to-Own (penyedia kos, developer mitra). Freelancer dan fresh graduate melalui Jururancang.",
    ),
    alternates: alternates(lang, "/kemitraan"),
  };
}

// Halaman Kemitraan (arahan user Okt 2026): tampilan formal, padat informasi, ukuran huruf sedang.
// Portal Mitra ada di /portal (di luar rute bahasa). Link dari @/i18n/Link tidak memberi awalan /en untuk /portal.

const STATUS_TONE: Record<JalurId, string> = {
  konstruksi: "bg-[#2D7A4F]/10 text-[#2D7A4F]",
  jururancang: "bg-brand-dark/[0.06] text-brand-dark",
  rto: "bg-[#C25E20]/10 text-[#C25E20]",
};

function SectionHead({ label, title, body, dark = false }: { label: string; title: string; body?: string; dark?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">{label}</p>
      <h2 className={`mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.015em] ${dark ? "text-white" : "text-brand-dark"}`}>
        {title}
      </h2>
      {body && <p className={`mt-3 text-[15px] leading-relaxed ${dark ? "text-white/65" : "text-brand-gray"}`}>{body}</p>}
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

export default async function KemitraanPage({ params }: Props) {
  const { t } = await pageLang(params);
  const waJururancang = waLink(t("Halo Admin Jururancang, saya ingin bergabung sebagai freelancer Jururancang Team."), JURURANCANG.wa);

  return (
    <>
      {/* HERO */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 pb-16 pt-32 md:px-10 md:pb-20 md:pt-36 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-6">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">{t(KEMITRAAN_HERO.label)}</p>
            <h1 className="mt-4 text-[clamp(2rem,3.6vw,2.8rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">{t(KEMITRAAN_HERO.title)}</h1>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/70">{t(KEMITRAAN_HERO.body)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#jalur" className="rounded-full bg-brand-red px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-red-dark">
                {t("Lihat jalur kemitraan")}
              </a>
              <a href="#formulir" className="rounded-full border border-white/25 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-white/10">
                {t("Formulir pendaftaran")}
              </a>
              <Link href="/portal" className="rounded-full px-3 py-3 text-[14px] font-bold text-white/75 underline-offset-4 hover:text-white hover:underline">
                {t("Masuk Portal Mitra →")}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <figure className="overflow-hidden rounded-2xl border border-white/10">
              <Image src={KEMITRAAN_HERO.image} alt={t(KEMITRAAN_HERO.imageAlt)} width={1600} height={1200} priority sizes="(min-width: 1024px) 560px, 100vw" className="h-auto w-full" />
            </figure>
          </div>
        </div>
      </section>

      {/* JALUR KEMITRAAN */}
      <section id="jalur" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <SectionHead
            label={t("Jalur kemitraan")}
            title={t("Tiga jalur, sesuai peran Anda.")}
            body={t("Lini bisnis barumahID berfokus pada Jasa Konstruksi dan Rent-to-Own. Kolaborasi freelancer dan fresh graduate dikelola Jururancang Engineering Mahaksa.")}
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {JALUR.map((j, i) => (
              <Reveal key={j.id} delay={i * 80} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-brand-dark/10 bg-white p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-black text-brand-red">{j.no}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${STATUS_TONE[j.id]}`}>{t(j.status)}</span>
                  </div>
                  <h3 className="mt-3 text-[19px] font-extrabold leading-snug text-brand-dark">{t(j.name)}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-brand-gray">{t(j.body)}</p>
                  <dl className="mt-5 divide-y divide-brand-dark/10 border-y border-brand-dark/10">
                    {j.members.map((m) => (
                      <div key={m.name} className="py-3">
                        <dt className="text-[14px] font-bold text-brand-dark">{t(m.name)}</dt>
                        <dd className="mt-0.5 text-[13px] leading-relaxed text-brand-gray">{t(m.body)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-auto pt-5">
                    {j.id === "jururancang" ? (
                      <a
                        href={waJururancang}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-full bg-[#1f9d55] px-4 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#188a49]"
                      >
                        <ChannelIcon id="whatsapp" size={15} />
                        {t("WhatsApp admin Jururancang")}
                      </a>
                    ) : (
                      <a
                        href={`#formulir-${j.id}`}
                        className="flex items-center justify-center rounded-full bg-brand-dark px-4 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red"
                      >
                        {t("Lihat formulir")}
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULIR */}
      <section id="formulir" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <SectionHead
            label={t("Formulir")}
            title={t("Formulir pendaftaran dan umpan balik.")}
            body={t("Seluruh formulir dibuka di Google Form. Gunakan nomor WhatsApp aktif agar tim kami dapat menghubungi Anda.")}
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {FORM_GROUPS.map((g) => (
              <div key={g.id} id={`formulir-${g.id}`} className="scroll-mt-24 rounded-2xl border border-brand-dark/10">
                <div className="border-b border-brand-dark/10 bg-brand-cream/60 px-5 py-4">
                  <h3 className="text-[17px] font-extrabold text-brand-dark">{t(g.title)}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-brand-gray">{t(g.note)}</p>
                </div>
                <div className="px-5 py-2">
                  {g.sections.map((s) => (
                    <div key={s.label} className="py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-mute">{t(s.label)}</p>
                      <ul className="mt-2 divide-y divide-brand-dark/[0.07]">
                        {s.forms.map((f) => (
                          <li key={f.code}>
                            <a href={GFORMS[f.code]} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-3">
                              <span className="w-11 shrink-0 rounded-md bg-brand-dark/[0.06] py-1 text-center font-mono text-[11px] font-bold text-brand-dark">
                                {f.code}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[14.5px] font-bold text-brand-dark group-hover:text-brand-red">{t(f.title)}</span>
                                <span className="block text-[12.5px] text-brand-gray">{t(f.body)}</span>
                              </span>
                              <span className="flex shrink-0 items-center gap-1 text-[12.5px] font-bold text-brand-red">
                                {t("Isi")}
                                <ExternalIcon />
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13.5px] text-brand-gray">
            {t("Pertanyaan lain seputar kemitraan:")}{" "}
            <a href={GFORMS.F19} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              {t("Formulir Kontak & Pertanyaan Umum (F19)")}
            </a>
          </p>
        </div>
      </section>

      {/* STRUKTUR DAN ALUR */}
      <section className="bg-brand-cream-warm">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-6">
            <SectionHead label={t(PERUBAHAN.label)} title={t(PERUBAHAN.title)} body={t(PERUBAHAN.body)} />
            <div className="mt-6 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-brand-dark/[0.04] text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gray">
                  <tr>
                    <th className="px-4 py-3 font-bold">{t("Sebelumnya")}</th>
                    <th className="px-4 py-3 font-bold">{t("Sekarang")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-dark/[0.07]">
                  {PERUBAHAN.rows.map((r) => (
                    <tr key={r.before}>
                      <td className="px-4 py-3 align-top text-brand-gray">{r.before}</td>
                      <td className="px-4 py-3 align-top">
                        <span className="block font-bold text-brand-dark">{t(r.after)}</span>
                        <span className="text-[12px] text-brand-mute">{t(r.note)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-6">
            <SectionHead label={t("Alur kemitraan")} title={t("Dari pendaftaran hingga aktif.")} />
            <ol className="mt-6 border-t border-brand-dark/10">
              {ALUR.map((a, i) => (
                <li key={a.title} className="flex gap-4 border-b border-brand-dark/10 py-4">
                  <span className="pt-0.5 font-mono text-[12px] font-bold text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[15px] font-bold text-brand-dark">{t(a.title)}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-relaxed text-brand-gray">{t(a.body)}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/portal/daftar" className="rounded-full bg-brand-dark px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-red">
                {t("Buat akun mitra")}
              </Link>
              <Link href="/portal" className="rounded-full border border-brand-dark/20 px-5 py-2.5 text-[13.5px] font-bold text-brand-dark transition-colors hover:border-brand-dark">
                {t("Masuk Portal Mitra")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI MITRA */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <SectionHead label={t("Di lapangan")} title={t("Mitra yang bekerja bersama kami.")} />
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {GALERI.map((g) => (
              <figure key={g.src} className="overflow-hidden rounded-xl bg-brand-cream">
                <Image src={g.src} alt={t(g.alt)} width={g.w} height={g.h} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[4/5] h-full w-full object-cover" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-4">
            <SectionHead label={t("Tanya jawab")} title={t("Sebelum Anda mendaftar.")} />
          </div>
          <div className="lg:col-span-8">
            <AccordionFAQ items={KEMITRAAN_FAQ.map((q) => ({ question: t(q.question), answer: t(q.answer) }))} compact />
          </div>
        </div>
      </section>
    </>
  );
}
