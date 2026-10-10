"use client";

import Link from "next/link";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { STATS } from "@/data/projects";

// Hero beranda dipertahankan (arahan: "awalannya memang bagus").
// Perubahan: latar jadi kolase foto proyek asli yang bergerak pelan, tombol kedua mengarah ke section layanan.
function HeroContent() {
  return (
    <div className="mx-auto max-w-4xl bg-brand-cream px-5 pb-20 pt-16 text-center">
      <p className="mb-6 text-xs font-bold uppercase tracking-widest text-brand-red">Platform pendamping kepemilikan rumah</p>
      <h2 className="mx-auto mb-6 text-4xl font-black leading-tight text-brand-dark md:text-5xl lg:text-6xl">
        Sewa yang tidak sia-sia.
      </h2>
      <p className="mx-auto mb-10 max-w-[520px] text-base leading-[1.7] text-brand-gray md:text-lg">
        Lewat Rent-to-Own, 25% dari sewa bulananmu dicatat jadi saldo DP. Mau membangun? Tim konstruksi kami
        yang mengerjakan. Dari sewa sampai punya rumah, cukup di satu tempat.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/layanan/rto"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition-all hover:bg-brand-red-dark hover:shadow-xl"
        >
          Mulai Perjalanan Saya
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
        <Link
          href="#layanan"
          className="inline-flex items-center gap-2 rounded-full border-2 border-brand-dark/15 px-8 py-[14px] text-sm font-semibold text-brand-dark transition-all hover:border-brand-dark hover:bg-brand-dark hover:text-white"
        >
          Pelajari Program
        </Link>
      </div>
      <p className="mt-6 text-center text-xs tracking-wide text-brand-mute">
        {STATS.projects}+ proyek selesai · {STATS.provinces} provinsi · sejak {STATS.since}
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
