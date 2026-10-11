import Image from "next/image";
import { MARQUEE_LOGOS } from "@/data/partners";

// Marquee beranda: hanya logo yang bergerak (arahan user), tanpa kartu atau teks.
// Tinggi logo diatur dari luas bidangnya, jadi logo lebar dan logo kotak terlihat seimbang.
const AREA = 11000;
const logoHeight = (w: number, h: number) => Math.round(Math.min(88, Math.max(48, Math.sqrt(AREA / (w / h)))));

export default function EventMarquee() {
  // Diulang 4 kali supaya animasi -50% mulus walau daftarnya pendek.
  const loop = [...MARQUEE_LOGOS, ...MARQUEE_LOGOS, ...MARQUEE_LOGOS, ...MARQUEE_LOGOS];
  return (
    <section className="border-y border-brand-dark/5 bg-white py-14 md:py-16" aria-labelledby="judul-logo">
      <p id="judul-logo" className="type-micro px-5 text-center text-brand-gray">
        Event &amp; Partner
      </p>
      <div className="edge-fade marquee-pause mt-8 overflow-hidden [--logo-scale:0.7] md:[--logo-scale:1]" aria-hidden="true">
        <div className="animate-marquee-slow flex w-max items-center">
          {loop.map((m, i) => (
            <div key={`${m.name}-${i}`} className="flex shrink-0 items-center px-7 md:px-11">
              <Image
                src={m.logo.src}
                width={m.logo.w}
                height={m.logo.h}
                alt=""
                className="w-auto rounded-md transition-transform duration-300 hover:scale-105"
                style={{ height: `calc(${logoHeight(m.logo.w, m.logo.h)}px * var(--logo-scale))` }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Versi teks untuk pembaca layar */}
      <ul className="sr-only">
        {MARQUEE_LOGOS.map((m) => (
          <li key={m.name}>{m.name}</li>
        ))}
      </ul>
    </section>
  );
}
