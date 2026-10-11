import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/Link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import PillarCards from "@/components/about/PillarCards";
import ValueLetters from "@/components/about/ValueLetters";
import LineIcon from "@/components/about/LineIcon";
import FaqTestimonials from "@/components/home/FaqTestimonials";
import {
  BARUMAHID_INTRO,
  EKOSISTEM_HERO,
  GROUP_SUBTITLE,
  GROUP_TITLE,
  GROUP_UNITS,
  KEUNGGULAN,
  MASALAH,
  MISSIONS,
  MOTTO,
  PILLARS,
  PILLARS_SUBTITLE,
  PILLARS_TITLE,
  VALUES,
  VALUES_SUBTITLE,
  VALUES_TITLE,
  VISION,
} from "@/data/company";
import { alternates, pageLang } from "@/i18n/server";

// Halaman Ekosistem (dulu "Tentang", alamat tetap /tentang). Arahan user Okt 2026: profil PT di hero dengan foto
// kegiatan kompetisi, barumahID itu apa, masalah, keunggulan, visi misi, LBAG, BUILD, grup usaha (menunggu
// revisi), dan tanya jawab. Cerita/timeline, peta proyek, tim, event, dan kanal dihapus.

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await pageLang(params);
  return {
    title: { absolute: t("Ekosistem | PT Inditek Bluprim Mahaksa dan barumahID") },
    description: t(
      "PT Inditek Bluprim Mahaksa, perusahaan konstruksi di balik barumahID sejak 9 Januari 2024. Gambar & modelling, renovasi & bangun, serta desain & analisa struktur dengan pendekatan LBAG.",
    ),
    alternates: alternates(lang, "/tentang"),
  };
}

function SectionTitle({ label, title, subtitle, dark = false }: { label: string; title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className="type-micro text-brand-red">{label}</p>
      <h2
        className={`mt-5 text-[clamp(1.8rem,3.8vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.02em] ${
          dark ? "text-white" : "text-brand-dark"
        }`}
      >
        {title}
      </h2>
      {subtitle && <p className={`mt-4 text-[16px] leading-relaxed ${dark ? "text-white/65" : "text-brand-gray"}`}>{subtitle}</p>}
    </div>
  );
}

export default async function EkosistemPage({ params }: Props) {
  const { lang, t } = await pageLang(params);
  return (
    <>
      {/* 1. Profil PT di atas foto kegiatan kompetisi yang berganti pelan */}
      <PageHero
        label={t(EKOSISTEM_HERO.label)}
        title={EKOSISTEM_HERO.title}
        subtitle={
          <div className="space-y-4">
            {EKOSISTEM_HERO.body.map((p) => (
              <p key={p}>{t(p)}</p>
            ))}
          </div>
        }
        slides={EKOSISTEM_HERO.images.map((im) => ({ ...im, alt: t(im.alt) }))}
        size="lg"
      >
        {EKOSISTEM_HERO.services.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-brand-dark"
          >
            {t(s.label)}
          </Link>
        ))}
      </PageHero>

      {/* 2. barumahID itu apa */}
      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-16 lg:px-14">
          <Reveal className="lg:col-span-6">
            <SectionTitle label={t(BARUMAHID_INTRO.label)} title={t(BARUMAHID_INTRO.title)} />
            <div className="mt-6 space-y-4">
              {BARUMAHID_INTRO.body.map((p) => (
                <p key={p} className="max-w-xl text-[16.5px] leading-[1.75] text-brand-dark/80">
                  {t(p)}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={100}>
            <div className="grid grid-cols-3 gap-3">
              {BARUMAHID_INTRO.steps.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-3 rounded-3xl bg-white px-3 py-6 text-center card-shadow">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                    <LineIcon name={s.icon} size={28} />
                  </span>
                  <span className="text-[11px] font-bold text-brand-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span className="-mt-2 text-[14px] font-extrabold text-brand-dark md:text-[15px]">{t(s.label)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-5 rounded-3xl bg-brand-dark p-6 text-white md:p-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red">
                <LineIcon name="lampu" size={24} />
              </span>
              <div>
                <p className="inline-flex rounded-full bg-brand-red px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                  {t(BARUMAHID_INTRO.innovation.label)}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/80">{t(BARUMAHID_INTRO.innovation.body)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Masalah yang sering terjadi */}
      <section className="relative isolate overflow-hidden bg-brand-dark text-white">
        <Image src="/images/proyek/renovasi-rangka-atap-padang.webp" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-dark/95 via-brand-dark/88 to-brand-dark/80" />
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label={t(MASALAH.label)} title={t(MASALAH.title)} subtitle={t(MASALAH.intro)} dark />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {MASALAH.items.map((m, i) => (
              <Reveal key={m.title} delay={i * 90}>
                <div className="flex h-full gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                    <LineIcon name={m.icon} size={24} />
                  </span>
                  <div>
                    <h3 className="text-[clamp(1.05rem,1.5vw,1.25rem)] font-bold leading-snug tracking-tight">{t(m.title)}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/65">{t(m.body)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-6 text-brand-dark sm:flex-row sm:items-center md:p-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                <LineIcon name="lampu" size={24} />
              </span>
              <div>
                <p className="text-[18px] font-extrabold tracking-tight">{t(MASALAH.answerTitle)}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-brand-gray">{t(MASALAH.answerBody)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Keunggulan kami */}
      <section className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label={t(KEUNGGULAN.label)} title={t(KEUNGGULAN.title)} subtitle={t(KEUNGGULAN.intro)} />
          </Reveal>
          <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {KEUNGGULAN.items.map((k, i) => (
              <Reveal key={k.title} delay={(i % 5) * 60}>
                <li className="flex h-full flex-col rounded-3xl bg-white p-5 card-shadow">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                      <LineIcon name={k.icon} size={22} />
                    </span>
                    <span className="text-[12px] font-black text-brand-red/70">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 text-[15.5px] font-extrabold leading-snug text-brand-dark">{t(k.title)}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-gray">{t(k.body)}</p>
                  {k.soon && (
                    <span className="mt-auto self-start pt-3">
                      <span className="inline-flex rounded-full bg-brand-red/10 px-2.5 py-1 text-[11px] font-bold text-brand-red">{t("Segera")}</span>
                    </span>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={120}>
            <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-brand-dark p-6 text-white sm:flex-row sm:items-center md:p-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red">
                <LineIcon name="perisai" size={24} />
              </span>
              <div>
                <p className="text-[18px] font-extrabold tracking-tight md:text-[20px]">{t(KEUNGGULAN.closingTitle)}</p>
                <p className="mt-1 text-[15px] text-white/70">{t(KEUNGGULAN.closingBody)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Visi dan misi */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <p className="type-micro text-brand-red">{t("Visi")}</p>
            <blockquote className="mt-6 max-w-4xl text-[clamp(1.7rem,3.8vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-brand-dark">
              “{t(VISION)}”
            </blockquote>
          </Reveal>
          <Reveal delay={100}>
            <p className="type-micro mt-16 text-brand-red">{t("Misi")}</p>
          </Reveal>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {MISSIONS.map((m, i) => (
              <Reveal key={m} delay={i * 80}>
                <li className="flex h-full gap-5 rounded-3xl bg-white p-6 card-shadow md:p-7">
                  <span className="text-[34px] font-black leading-none text-brand-red/80">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[15.5px] leading-relaxed text-brand-dark/85">{t(m)}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. LBAG */}
      <section className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label={t("Empat pilar LBAG")} title={t(PILLARS_TITLE)} subtitle={t(PILLARS_SUBTITLE)} />
          </Reveal>
          <div className="mt-12">
            <PillarCards pillars={PILLARS} />
          </div>
        </div>
      </section>

      {/* 7. BUILD */}
      <section className="relative isolate overflow-hidden bg-brand-dark text-white">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label={t("Nilai kami")} title={t(VALUES_TITLE)} subtitle={t(VALUES_SUBTITLE)} dark />
          </Reveal>
          <div className="mt-12">
            <ValueLetters values={VALUES} />
          </div>
          <p className="mt-10 border-t border-white/10 pt-6 text-[14px] text-white/55">
            {t("Motto kami:")} <span className="font-bold italic text-white">{MOTTO}</span>
          </p>
        </div>
      </section>

      {/* 8. Grup usaha (menunggu revisi user) */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label={t("Grup usaha")} title={t(GROUP_TITLE)} subtitle={t(GROUP_SUBTITLE)} />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12">
              {GROUP_UNITS.filter((u) => u.status === "induk").map((u) => (
                <div key={u.name} className="mx-auto max-w-md rounded-3xl bg-brand-dark p-6 text-center text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">{t(u.role)}</p>
                  <p className="mt-2 text-[20px] font-extrabold">{u.name}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/65">{t(u.body)}</p>
                </div>
              ))}
              <div className="mx-auto h-8 w-px bg-brand-dark/25" aria-hidden="true" />
              <div className="relative mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
                <div className="absolute -top-0 left-1/4 right-1/4 hidden h-px bg-brand-dark/25 md:block" aria-hidden="true" />
                {GROUP_UNITS.filter((u) => u.status !== "induk").map((u) => (
                  <div
                    key={u.name}
                    className={`relative rounded-3xl border bg-white p-6 card-shadow md:mt-8 ${
                      u.status === "pengembangan" ? "opacity-60" : ""
                    } ${u.name === "barumahID" ? "border-brand-red" : "border-brand-dark/10"}`}
                  >
                    <span className="absolute -top-8 left-1/2 hidden h-8 w-px bg-brand-dark/25 md:block" aria-hidden="true" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-mute">{t(u.role)}</p>
                    <p className="mt-2 text-[19px] font-extrabold text-brand-dark">{u.name}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-brand-gray">{t(u.body)}</p>
                    <p
                      className={`mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                        u.status === "aktif" ? "bg-credit/10 text-credit" : "bg-brand-dark/5 text-brand-gray"
                      }`}
                    >
                      {t(u.statusLabel)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. Tanya jawab (testimoni otomatis tampil kalau datanya ada) */}
      <FaqTestimonials lang={lang} />
    </>
  );
}
