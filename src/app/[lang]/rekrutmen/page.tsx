import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import TalentField from "@/components/karier/TalentField";
import ChannelIcon from "@/components/icons/ChannelIcon";
import { BATCH, KARIER_BIDANG, KARIER_HERO, KARIER_JALUR, KARIER_PENUTUP, KOLABORASI, MAGANG } from "@/data/karier";
import { CHANNELS, EMAIL, JURURANCANG, WA_ADMIN_1, WA_ADMIN_1_LABEL, waLink } from "@/data/site";
import { alternates, pageLang } from "@/i18n/server";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await pageLang(params);
  return {
    title: t("Karier"),
    description: t(
      "Peluang karier di barumahID: magang arsitektur remote, rekrutmen berkala, dan freelancer Jururancang Team. Lihat posisi dan cara melamar.",
    ),
    alternates: alternates(lang, "/rekrutmen"),
  };
}

// Halaman dibangun ulang tiap jam supaya status buka/tutup batch mengikuti tanggal.
export const revalidate = 3600;

const IG = CHANNELS.find((c) => c.id === "instagram")!;
const pad = (n: number) => String(n).padStart(2, "0");
const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

// Judul dengan sorotan: baris dipisah \n, kata di dalam [..] diberi kotak merah (gaya referensi "Social Media Studio")
function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line
            .split(/(\[[^\]]+\])/)
            .filter(Boolean)
            .map((part, j) =>
              part.startsWith("[") ? (
                <span key={j} className="mx-[0.03em] inline-block rounded-[0.14em] bg-brand-red px-[0.12em] pb-[0.06em] leading-[1.02] text-white">
                  {part.slice(1, -1)}
                </span>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
        </span>
      ))}
    </>
  );
}

// Tombol pil dengan ikon di dalam lingkaran kecil
function Pill({
  href,
  children,
  tone = "red",
  external = false,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "red" | "light" | "dark" | "ghost" | "outline" | "whatsapp";
  external?: boolean;
  icon?: React.ReactNode;
}) {
  const tones = {
    red: ["bg-brand-red text-white hover:bg-brand-red-dark", "bg-white/20"],
    light: ["bg-white text-brand-dark hover:bg-brand-cream", "bg-brand-dark text-white"],
    dark: ["bg-brand-dark text-white hover:bg-black", "bg-brand-red text-white"],
    ghost: ["border border-white/20 bg-white/[0.06] text-white backdrop-blur hover:bg-white/[0.12]", "bg-white/15"],
    outline: ["border border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark", "bg-brand-dark text-white"],
    whatsapp: ["bg-[#1f9d55] text-white hover:bg-[#188a49]", "bg-white/20"],
  }[tone];
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[14px] font-bold transition-colors duration-200 ${tones[0]}`}
    >
      {children}
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${tones[1]}`}>
        {icon ?? (
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12 12 4M5.5 4H12v6.5" />
          </svg>
        )}
      </span>
    </a>
  );
}

function SectionHead({ label, title, subtitle, dark = false }: { label: string; title: string; subtitle: string; dark?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-brand-red">{label}</p>
      <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
        <span className={`block ${dark ? "text-white" : "text-brand-dark"}`}>{title}</span>
        <span className={`block ${dark ? "text-white/35" : "text-brand-dark/30"}`}>{subtitle}</span>
      </h2>
    </div>
  );
}

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-mono text-[11.5px] uppercase tracking-[0.14em] ${className}`}>{children}</p>;
}

export default async function KarierPage({ params }: Props) {
  const { t } = await pageLang(params);
  const batchOpen = new Date() <= new Date(BATCH.closesAt);
  const batchStatus = batchOpen ? t("Dibuka hingga {date}", { date: BATCH.closesLabel }) : t("Ditutup pada {date}", { date: BATCH.closesLabel });

  return (
    <>
      {/* HERO: kerumunan dari atas + cincin sinyal */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0B0B0F] text-white">
        <TalentField className="-z-20" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_62%_52%_at_50%_46%,rgba(11,11,15,0.86),rgba(11,11,15,0.4)_72%,rgba(11,11,15,0.25))]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#0B0B0F] to-transparent" aria-hidden="true" />

        <p className="pointer-events-none absolute right-6 top-28 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 lg:flex lg:right-10">
          <span className="h-3.5 w-3.5 rounded-full border border-brand-red" aria-hidden="true" />
          {t(KARIER_HERO.hint)}
        </p>

        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-5 pb-10 pt-32 text-center md:px-10">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping-soft absolute inset-0 rounded-full bg-brand-red" />
              <span className="relative h-2 w-2 rounded-full bg-brand-red" />
            </span>
            {t(KARIER_HERO.status)}
          </p>
          <h1 className="mt-7 text-[clamp(2.2rem,5.6vw,4.6rem)] font-extrabold leading-[1.06] tracking-[-0.035em]">
            <Marked text={t(KARIER_HERO.title)} />
          </h1>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-white/70 md:text-[17px]">{t(KARIER_HERO.body)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Pill href="#magang">{t("Lamar magang")}</Pill>
            <Pill href="#rekrutmen" tone="ghost">
              {t("Lihat semua peluang")}
            </Pill>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-5 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10">
          <div className="hidden text-left md:block">
            <Mono className="text-white/45">{t("Lokasi kerja")}</Mono>
            <p className="mt-1.5 text-[20px] font-extrabold tracking-tight">{t(KARIER_HERO.location)}</p>
          </div>
          <nav aria-label={t("Jalur karier")} className="flex flex-wrap justify-center gap-2">
            {KARIER_JALUR.map((j, i) => (
              <a
                key={j.id}
                href={`#${j.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 font-mono text-[11.5px] text-white/80 backdrop-blur transition-colors hover:border-brand-red hover:text-white"
              >
                <span className="text-brand-red">{pad(i + 1)}</span>
                {t(j.label)}
              </a>
            ))}
          </nav>
          <div className="hidden text-right md:block">
            <Mono className="text-white/45">{t(BATCH.name)}</Mono>
            <p className="mt-1.5 text-[20px] font-extrabold tracking-tight">{batchStatus}</p>
          </div>
        </div>
      </section>

      {/* Pita bidang yang kami tekuni */}
      <div className="marquee-pause overflow-hidden border-y border-white/10 bg-[#0B0B0F] py-4" aria-hidden="true">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {KARIER_BIDANG.map((b) => (
                <span key={b} className="flex items-center gap-6 px-6 font-mono text-[12px] uppercase tracking-[0.18em] text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                  {t(b)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* (01) MAGANG ARSITEKTUR */}
      <section id="magang" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead label={t(MAGANG.label)} title={t(MAGANG.title)} subtitle={t(MAGANG.subtitle)} />
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] ${
                MAGANG.open ? "bg-brand-red text-white" : "bg-brand-dark/10 text-brand-gray"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${MAGANG.open ? "animate-pulse-dot bg-white" : "bg-brand-gray"}`} aria-hidden="true" />
              {MAGANG.open ? t("Menerima lamaran") : t("Sedang ditutup")}
            </span>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-4">
              <a href={MAGANG.poster.src} target="_blank" rel="noopener noreferrer" className="group block">
                <span className="relative mx-auto block max-w-[320px] -rotate-2 overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgba(20,20,20,0.45)] ring-1 ring-brand-dark/10 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
                  <Image
                    src={MAGANG.poster.src}
                    alt={t(MAGANG.poster.alt)}
                    width={MAGANG.poster.w}
                    height={MAGANG.poster.h}
                    sizes="(min-width: 1024px) 320px, 80vw"
                    className="h-auto w-full"
                  />
                </span>
                <Mono className="mt-5 text-center text-brand-gray transition-colors group-hover:text-brand-red">{t("Lihat brosur")} ↗</Mono>
              </a>
            </Reveal>

            <div className="lg:col-span-8">
              <dl className="grid overflow-hidden rounded-2xl border border-brand-dark/10 bg-brand-dark/10 sm:grid-cols-3 sm:gap-px">
                {MAGANG.meta.map((m) => (
                  <div key={m.label} className="border-b border-brand-dark/10 bg-white p-4 last:border-b-0 sm:border-b-0 md:p-5">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-mute">{t(m.label)}</dt>
                    <dd className="mt-1.5 text-[16px] font-extrabold text-brand-dark">{t(m.value)}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 text-[17px] leading-relaxed text-brand-dark/80">{t(MAGANG.description)}</p>

              <div className="mt-10 grid gap-10 md:grid-cols-2">
                <div>
                  <Mono className="text-brand-red">{t("Tanggung jawab")}</Mono>
                  <ol className="mt-4 border-t border-brand-dark/10">
                    {MAGANG.duties.map((d, i) => (
                      <li key={d} className="flex gap-4 border-b border-brand-dark/10 py-3.5 text-[15px] leading-snug text-brand-dark">
                        <span className="w-6 shrink-0 font-mono text-[12px] leading-[1.4rem] text-brand-mute">{pad(i + 1)}</span>
                        {t(d)}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <Mono className="text-brand-red">{t("Kualifikasi")}</Mono>
                  <ul className="mt-4 space-y-3">
                    {MAGANG.qualifications.map((q) => (
                      <li key={q} className="flex gap-3 text-[15px] leading-snug text-brand-dark">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red" aria-hidden="true">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m2.5 6.2 2.3 2.3 4.7-5" />
                          </svg>
                        </span>
                        {t(q)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Pill href={mailto(MAGANG.emailSubject)} icon={<ChannelIcon id="email" size={15} />}>
                  {t("Kirim lamaran via email")}
                </Pill>
                <Pill href={waLink(t(MAGANG.waMessage), WA_ADMIN_1)} tone="outline" external icon={<ChannelIcon id="whatsapp" size={15} />}>
                  {t("Tanya admin via WhatsApp")}
                </Pill>
                <a href={IG.href} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-2 text-[14px] font-bold text-brand-dark hover:text-brand-red">
                  <ChannelIcon id="instagram" size={17} />
                  {IG.handle}
                </a>
              </div>
            </div>
          </div>

          {/* Cara melamar */}
          <Reveal className="mt-16 rounded-3xl bg-brand-dark p-6 text-white md:mt-20 md:p-10">
            <Mono className="text-brand-red">{t("Cara melamar")}</Mono>
            <ol className="mt-6 grid gap-8 md:grid-cols-3 md:gap-6">
              {MAGANG.steps.map((s, i) => (
                <li key={s.title} className="border-t border-white/12 pt-5">
                  <span className="font-mono text-[13px] text-brand-red">{pad(i + 1)}</span>
                  <p className="mt-2 text-[19px] font-extrabold tracking-tight">{t(s.title)}</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">{t(s.body, { email: EMAIL })}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* (02) REKRUTMEN BERKALA */}
      <section id="rekrutmen" className="scroll-mt-20 bg-[#0B0B0F] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionHead label={t(BATCH.label)} title={t(BATCH.title)} subtitle={t(BATCH.subtitle)} dark />
            </div>
            <p className="text-[15.5px] leading-relaxed text-white/60 lg:col-span-5">{t(BATCH.intro)}</p>
          </div>

          <div
            className={`mt-10 flex flex-col gap-3 rounded-2xl p-5 md:flex-row md:items-center md:justify-between md:gap-8 md:p-6 ${
              batchOpen ? "bg-brand-red" : "border border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="shrink-0">
              <Mono className={batchOpen ? "text-white/75" : "text-white/45"}>{t(BATCH.name)}</Mono>
              <p className="mt-1.5 text-[21px] font-extrabold tracking-tight">{batchStatus}</p>
            </div>
            <p className={`max-w-xl text-[14.5px] leading-relaxed ${batchOpen ? "text-white/85" : "text-white/60"}`}>
              {batchOpen
                ? t("Pilih posisi di bawah, lalu lengkapi formulir lamaran.")
                : t("Terima kasih kepada seluruh pelamar. Batch berikutnya akan kami umumkan melalui Instagram @barumahid dan halaman ini.")}
            </p>
          </div>

          <Mono className="mt-12 text-white/45">{batchOpen ? t("Posisi yang dibuka") : t("Posisi pada batch terakhir")}</Mono>
          <ol className="mt-4 border-t border-white/10">
            {BATCH.positions.map((p, i) => (
              <li
                key={p.title}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 gap-y-1 border-b border-white/10 py-5 md:grid-cols-[3.5rem_1fr_11rem_13rem_6rem] md:items-center md:gap-x-4"
              >
                <span className="font-mono text-[13px] text-white/35 transition-colors group-hover:text-brand-red">{pad(i + 1)}</span>
                <span className="text-[clamp(1.15rem,2.2vw,1.65rem)] font-extrabold tracking-tight">{t(p.title)}</span>
                <span className="col-start-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-brand-red md:col-start-auto">{t(p.dept)}</span>
                <span className="col-start-2 text-[14px] text-white/55 md:col-start-auto">{t(p.location)}</span>
                {batchOpen && BATCH.formUrl ? (
                  <a
                    href={BATCH.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-start-2 mt-2 inline-flex w-fit rounded-full bg-white px-4 py-2 text-[13px] font-bold text-brand-dark hover:bg-brand-red hover:text-white md:col-start-auto md:mt-0 md:justify-self-end"
                  >
                    {t("Lamar")}
                  </a>
                ) : (
                  <span className="hidden text-right font-mono text-[11px] uppercase tracking-[0.14em] text-white/30 md:block">
                    {batchOpen ? "" : t("Ditutup")}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* (03) JALUR LAIN: freelancer Jururancang Team dan lamaran umum */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <SectionHead label={t(KOLABORASI.label)} title={t(KOLABORASI.title)} subtitle={t(KOLABORASI.subtitle)} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <div id="freelance" className="flex h-full scroll-mt-28 flex-col rounded-3xl border border-brand-dark/10 bg-white p-7 md:p-9">
                <div className="flex items-start justify-between gap-4">
                  <Mono className="text-brand-red">{t(KOLABORASI.freelance.kicker)}</Mono>
                  <Image src={JURURANCANG.logo.src} alt="Jururancang Engineering Mahaksa" width={JURURANCANG.logo.w} height={JURURANCANG.logo.h} className="h-12 w-auto" />
                </div>
                <h3 className="mt-4 max-w-md text-[clamp(1.4rem,2.4vw,1.9rem)] font-extrabold leading-tight tracking-tight text-brand-dark">
                  {t(KOLABORASI.freelance.title)}
                </h3>
                <p className="mt-4 text-[15.5px] leading-relaxed text-brand-gray">{t(KOLABORASI.freelance.body)}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
                  <Pill href={waLink(t(KOLABORASI.freelance.waMessage), JURURANCANG.wa)} tone="whatsapp" external icon={<ChannelIcon id="whatsapp" size={15} />}>
                    {t(KOLABORASI.freelance.cta)}
                  </Pill>
                  <span className="font-mono text-[12px] text-brand-gray">{JURURANCANG.waLabel}</span>
                </div>
              </div>
            </Reveal>
            <Reveal className="h-full" delay={100}>
              <div id="lamaran-umum" className="flex h-full scroll-mt-28 flex-col rounded-3xl bg-brand-dark p-7 text-white md:p-9">
                <Mono className="text-brand-red">{t(KOLABORASI.general.kicker)}</Mono>
                <h3 className="mt-4 max-w-md text-[clamp(1.4rem,2.4vw,1.9rem)] font-extrabold leading-tight tracking-tight">{t(KOLABORASI.general.title)}</h3>
                <p className="mt-4 text-[15.5px] leading-relaxed text-white/65">{t(KOLABORASI.general.body, { email: EMAIL })}</p>
                <div className="mt-auto pt-8">
                  <Pill href={mailto(KOLABORASI.general.emailSubject)} tone="light" icon={<ChannelIcon id="email" size={15} />}>
                    {t(KOLABORASI.general.cta)}
                  </Pill>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Penutup: kontak rekrutmen (dari brosur) */}
      <section className="bg-brand-red text-white">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-12 lg:items-end lg:px-14">
          <div className="lg:col-span-7">
            <h2 className="text-[clamp(2rem,4.6vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">{t(KARIER_PENUTUP.title)}</h2>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/80">{t(KARIER_PENUTUP.body)}</p>
          </div>
          <ul className="divide-y divide-white/20 border-y border-white/20 lg:col-span-5">
            {[
              { id: "email" as const, label: t("Email"), value: EMAIL, href: `mailto:${EMAIL}` },
              { id: "instagram" as const, label: "Instagram", value: IG.handle, href: IG.href },
              { id: "whatsapp" as const, label: "WhatsApp", value: WA_ADMIN_1_LABEL, href: waLink(undefined, WA_ADMIN_1) },
            ].map((c) => (
              <li key={c.id}>
                <a
                  href={c.href}
                  target={c.id === "email" ? undefined : "_blank"}
                  rel={c.id === "email" ? undefined : "noopener noreferrer"}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="flex items-center gap-3">
                    <ChannelIcon id={c.id} size={18} />
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-white/70">{c.label}</span>
                  </span>
                  <span className="text-[16px] font-bold underline-offset-4 group-hover:underline">{c.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
