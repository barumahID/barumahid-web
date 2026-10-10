import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import PillarCards from "@/components/about/PillarCards";
import ValueLetters from "@/components/about/ValueLetters";
import ChannelGrid from "@/components/ui/ChannelGrid";
import ChannelIcon from "@/components/icons/ChannelIcon";
import {
  ABOUT_HERO,
  GROUP_SUBTITLE,
  GROUP_TITLE,
  GROUP_UNITS,
  MISSIONS,
  MOTTO,
  PILLARS,
  PILLARS_SUBTITLE,
  PILLARS_TITLE,
  STORY,
  STORY_TITLE,
  TEAM,
  TEAM_SUBTITLE,
  TEAM_TITLE,
  TIMELINE,
  VALUES,
  VALUES_SUBTITLE,
  VALUES_TITLE,
  VISION,
} from "@/data/company";
import { STATS } from "@/data/projects";

export const metadata: Metadata = {
  title: { absolute: "Tentang Kami | PT Inditek Bluprim Mahaksa, di balik barumahID" },
  description:
    "PT Inditek Bluprim Mahaksa, perusahaan konstruksi dan teknologi properti dari Padang di balik barumahID. Sejak 2018, 30+ proyek selesai.",
  alternates: { canonical: "/tentang" },
};

function Trophy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 6h3a3 3 0 0 1-3 4M7 6H4a3 3 0 0 0 3 4" />
    </svg>
  );
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

export default function TentangPage() {
  return (
    <>
      <PageHero
        label={ABOUT_HERO.label}
        title={ABOUT_HERO.title}
        subtitle={<p>{ABOUT_HERO.subtitle}</p>}
        image="/images/proyek/bangun-rumah-2-lantai-padang-2.webp"
        size="lg"
      >
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] font-semibold text-white/85">
          <li>
            <span className="text-2xl font-black text-white">{STATS.projects}+</span> proyek selesai
          </li>
          <li>
            Berjalan sejak <span className="text-2xl font-black text-white">2018</span>
          </li>
          <li>
            PT resmi <span className="text-2xl font-black text-white">2024</span>
          </li>
        </ul>
      </PageHero>

      {/* Cerita kami */}
      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTitle label="Cerita kami" title={STORY_TITLE} />
            </Reveal>
            <div className="mt-8 space-y-5">
              {STORY.map((para, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="max-w-2xl text-[16.5px] leading-[1.75] text-brand-dark/80">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <ol className="relative space-y-7 border-l-2 border-brand-red/25 pl-7 lg:mt-24">
                {TIMELINE.map((m) => (
                  <li key={m.year} className="relative">
                    <span
                      className={`absolute -left-[39px] top-0 flex h-[22px] w-[22px] items-center justify-center rounded-full ${
                        m.award ? "bg-brand-red text-white" : "border-2 border-brand-red bg-brand-cream"
                      }`}
                      aria-hidden="true"
                    >
                      {m.award && <Trophy />}
                    </span>
                    <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">{m.year}</p>
                    <p className="mt-1 text-[17px] font-extrabold text-brand-dark">{m.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-brand-gray">{m.body}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Visi & misi */}
      <section className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <p className="type-micro text-brand-red">Visi</p>
            <blockquote className="mt-6 max-w-4xl text-[clamp(1.7rem,3.8vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-brand-dark">
              “{VISION}”
            </blockquote>
          </Reveal>
          <Reveal delay={100}>
            <p className="type-micro mt-16 text-brand-red">Misi</p>
          </Reveal>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {MISSIONS.map((m, i) => (
              <Reveal key={i} delay={i * 80}>
                <li className="flex h-full gap-5 rounded-3xl bg-white p-6 card-shadow md:p-7">
                  <span className="text-[34px] font-black leading-none text-brand-red/80">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[15.5px] leading-relaxed text-brand-dark/85">{m}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* LBAG */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label="Empat pilar LBAG" title={PILLARS_TITLE} subtitle={PILLARS_SUBTITLE} />
          </Reveal>
          <div className="mt-12">
            <PillarCards pillars={PILLARS} />
          </div>
        </div>
      </section>

      {/* BUILD */}
      <section className="relative isolate overflow-hidden bg-brand-dark text-white">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label="Nilai kami" title={VALUES_TITLE} subtitle={VALUES_SUBTITLE} dark />
          </Reveal>
          <div className="mt-12">
            <ValueLetters values={VALUES} />
          </div>
          <p className="mt-10 border-t border-white/10 pt-6 text-[14px] text-white/55">
            Motto kami: <span className="font-bold italic text-white">{MOTTO}</span>
          </p>
        </div>
      </section>

      {/* Grup usaha */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label="Grup usaha" title={GROUP_TITLE} subtitle={GROUP_SUBTITLE} />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12">
              {GROUP_UNITS.filter((u) => u.status === "induk").map((u) => (
                <div key={u.name} className="mx-auto max-w-md rounded-3xl bg-brand-dark p-6 text-center text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">{u.role}</p>
                  <p className="mt-2 text-[20px] font-extrabold">{u.name}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/65">{u.body}</p>
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-mute">{u.role}</p>
                    <p className="mt-2 text-[19px] font-extrabold text-brand-dark">{u.name}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-brand-gray">{u.body}</p>
                    <p
                      className={`mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                        u.status === "aktif" ? "bg-credit/10 text-credit" : "bg-brand-dark/5 text-brand-gray"
                      }`}
                    >
                      {u.statusLabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tim */}
      <section className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionTitle label="Tim" title={TEAM_TITLE} subtitle={TEAM_SUBTITLE} />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <article className="flex h-full flex-col rounded-3xl bg-white p-6 card-shadow">
                  <div
                    className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-dark to-[#2b2b2b] text-[44px] font-black tracking-tight text-white/90"
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <p className="mt-5 text-[17px] font-extrabold leading-snug text-brand-dark">{t.name}</p>
                  <p className="mt-1 text-[13px] font-semibold text-brand-red">{t.role}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-brand-gray">{t.bio}</p>
                  {t.linkedin && (
                    <a
                      href={t.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn ${t.name}`}
                      className="mt-auto inline-flex h-10 w-10 items-center justify-center self-start rounded-full border border-brand-dark/15 text-brand-dark transition-colors hover:border-brand-red hover:text-brand-red"
                    >
                      <ChannelIcon id="linkedin" size={16} />
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-[15px] text-brand-dark">
            Mau ikut membangun?{" "}
            <Link href="/rekrutmen" className="font-bold text-brand-red underline underline-offset-4 hover:text-brand-red-dark">
              Lihat posisi yang sedang dibuka
            </Link>
          </p>
        </div>
      </section>

      {/* Kanal */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <SectionTitle label="Kanal barumahID" title="Ikuti dan hubungi kami." subtitle="Pilih kanal yang paling nyaman buat kamu." />
          </Reveal>
          <div className="mt-10">
            <ChannelGrid />
          </div>
        </div>
      </section>
    </>
  );
}
