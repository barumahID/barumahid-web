"use client";

import Link from "next/link";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import DuaLayanan from "@/components/home/DuaLayanan";
import { STATS } from "@/data/projects";
import { HOME_INTRO } from "@/data/beranda";

// Hero beranda dipertahankan (arahan: "awalannya memang bagus").
// Setelah media terbuka, langsung muncul 2 gambar besar: Jasa Konstruksi dan Rent-to-Own (gaya tikalindustries.com).
function HeroContent() {
  return (
    <div className="w-full bg-brand-cream pb-20 pt-16">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest text-brand-red">{HOME_INTRO.label}</p>
        <h2 className="text-4xl font-black leading-tight text-brand-dark md:text-5xl lg:text-6xl">{HOME_INTRO.title}</h2>
        <p className="mx-auto mt-5 max-w-[520px] text-base leading-[1.7] text-brand-gray md:text-lg">{HOME_INTRO.body}</p>
      </div>

      <div className="mt-12">
        <DuaLayanan />
      </div>

      <p className="mt-10 px-5 text-center text-[13px] text-brand-gray">
        {STATS.projects}+ proyek selesai · sejak {STATS.since} ·{" "}
        <Link href="/tentang" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
          Kenali barumahID
        </Link>
      </p>
    </div>
  );
}

export default function ScrollExpandHero() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/images/hero-card.webp"
      bgImageSrc="/images/hero-kolase.webp"
      title="barumahID"
      date="Sewa hari ini. Miliki hunian nantinya."
      scrollToExpand=""
      textBlend={false}
    >
      <HeroContent />
    </ScrollExpandMedia>
  );
}
