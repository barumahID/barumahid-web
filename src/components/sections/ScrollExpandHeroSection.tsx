"use client";

import Link from "next/link";
import DualScrollHero from "@/components/ui/dual-scroll-hero";
import HeroBackdrop from "@/components/ui/hero-backdrop";
import EventMarquee from "@/components/home/EventMarquee";
import HistoryRoadmap from "@/components/home/HistoryRoadmap";
import { DUA_LAYANAN, HOME_ABOUT, HOME_HERO } from "@/data/beranda";

// Beranda: halaman 1 = hero scroll-expand dua gambar (Jasa Konstruksi, Rent-to-Own).
// Halaman 2 = deskripsi singkat barumahID + roadmap histori, lalu marquee logo event dan partner.
function HomeAbout() {
  return (
    <div className="w-full bg-brand-cream">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-16 lg:px-14">
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
        <div className="lg:col-span-5">
          <HistoryRoadmap />
        </div>
      </div>
      <EventMarquee />
    </div>
  );
}

export default function ScrollExpandHero() {
  return (
    <DualScrollHero
      panels={DUA_LAYANAN}
      title={HOME_HERO.title}
      tagline={HOME_HERO.tagline}
      background={<HeroBackdrop image={HOME_HERO.background} />}
    >
      <HomeAbout />
    </DualScrollHero>
  );
}
