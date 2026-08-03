"use client";

import Link from "next/link";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

function HeroContent() {
  return (
    <div className="mx-auto max-w-4xl bg-[#F8F5F0] pt-16 pb-20 text-center">
      <p className="mb-6 text-xs font-bold uppercase tracking-widest text-brand-red">
        PLATFORM PENDAMPING KEPEMILIKAN RUMAH
      </p>
      <h2 className="mx-auto mb-6 text-4xl font-black leading-tight text-[#1A1A1A] md:text-5xl lg:text-6xl">
        Sewa yang tidak sia-sia.
      </h2>
      <p className="mx-auto mb-10 max-w-[480px] text-base leading-[1.7] text-[#666] md:text-lg">
        Setiap bulan sewa, 25% langsung jadi tabungan saldo DP, otomatis tanpa
        perlu disiplin ekstra. Kami bantu kamu keluar dari jebakan sewa
        selamanya.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/rto"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition-all hover:bg-brand-red-dark hover:shadow-xl"
        >
          Mulai Perjalanan Saya
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
        <Link
          href="#program"
          className="inline-flex items-center gap-2 rounded-full border-2 border-brand-dark/15 px-8 py-[14px] text-sm font-semibold text-brand-dark transition-all hover:border-brand-dark hover:bg-brand-dark hover:text-white"
        >
          Pelajari Program
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
      <p className="mt-6 text-center text-xs tracking-wide text-[#aaa]">
        Sudah 30+ proyek · sejak 2018
      </p>
    </div>
  );
}

export default function ScrollExpandHero() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/images/hero-card.png"
      bgImageSrc="/images/hero-bg.png"
      title="barumahID"
      date="Sewa hari ini. Miliki hunian nantinya."
      scrollToExpand=""
      textBlend={false}
    >
      <HeroContent />
    </ScrollExpandMedia>
  );
}
