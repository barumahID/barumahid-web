"use client";

import Link from "next/link";
import DualScrollHero from "@/components/ui/dual-scroll-hero";
import EventMarquee from "@/components/home/EventMarquee";
import { STATS } from "@/data/projects";
import { DUA_LAYANAN, HOME_ABOUT, HOME_HERO } from "@/data/beranda";

// Beranda: halaman 1 = hero scroll-expand dua gambar (Jasa Konstruksi, Rent-to-Own).
// Halaman 2 = deskripsi singkat barumahID, angka bukti, lalu grafis bergerak program/lomba yang diikuti.
function HomeAbout() {
  const stats = [
    { value: `${STATS.projects}+`, label: "Proyek selesai" },
    { value: `${STATS.cities}`, label: "Kota" },
    { value: `${STATS.since}`, label: "Mulai berkarya" },
  ];
  return (
    <div className="w-full bg-brand-cream">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-16 lg:px-14">
        <div className="lg:col-span-7">
          <p className="type-micro text-brand-red">{HOME_ABOUT.label}</p>
          <h2 className="mt-5 text-[clamp(1.9rem,4.2vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-dark">
            {HOME_ABOUT.title}
          </h2>
          <div className="mt-6 space-y-4">
            {HOME_ABOUT.body.map((p) => (
              <p key={p} className="max-w-2xl text-[16.5px] leading-[1.75] text-brand-dark/80">
                {p}
              </p>
            ))}
          </div>
          <Link
            href={HOME_ABOUT.cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-dark px-7 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-red"
          >
            {HOME_ABOUT.cta.label}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
        <dl className="grid content-end gap-px self-end overflow-hidden rounded-3xl border border-brand-dark/10 bg-brand-dark/10 lg:col-span-5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline justify-between gap-4 bg-white px-6 py-5">
              <dt className="text-[14px] font-semibold text-brand-gray">{s.label}</dt>
              <dd className="text-[34px] font-black leading-none tracking-tight text-brand-dark">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <EventMarquee />
    </div>
  );
}

export default function ScrollExpandHero() {
  return (
    <DualScrollHero panels={DUA_LAYANAN} title={HOME_HERO.title} tagline={HOME_HERO.tagline}>
      <HomeAbout />
    </DualScrollHero>
  );
}
