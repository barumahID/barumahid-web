import Image from "next/image";
import { EVENTS_AND_PROGRAMS, GROUP_UNITS, type PartnerMark } from "@/data/partners";

function Mark({ item }: { item: PartnerMark }) {
  if (item.logo) {
    return (
      <span className="flex h-12 shrink-0 items-center px-6" title={item.note ?? item.name}>
        <Image
          src={item.logo}
          alt={item.name}
          width={160}
          height={48}
          className="h-10 w-auto object-contain opacity-60 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
        />
      </span>
    );
  }
  return (
    <span
      className="flex shrink-0 items-center gap-3 px-6 text-[16px] font-extrabold tracking-tight text-brand-dark/45 transition-colors duration-300 hover:text-brand-dark md:text-[19px]"
      title={item.note}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-red/60" aria-hidden="true" />
      {item.name}
    </span>
  );
}

function Row({ items, reverse = false }: { items: PartnerMark[]; reverse?: boolean }) {
  // Diulang 4 kali supaya animasi -50% mulus walau daftarnya pendek.
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="edge-fade marquee-pause overflow-hidden">
      <div className={`flex w-max items-center py-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee-slow"}`}>
        {loop.map((it, i) => (
          <Mark key={`${it.name}-${i}`} item={it} />
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <section className="border-y border-brand-dark/10 bg-brand-cream-warm py-14 md:py-16" aria-labelledby="judul-jejak">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 lg:px-14">
        <p id="judul-jejak" className="text-center text-[13px] font-semibold text-brand-gray">
          Program dan event yang pernah kami ikuti, serta grup usaha kami
        </p>
      </div>
      <div className="mt-6 space-y-2" aria-hidden="true">
        <Row items={EVENTS_AND_PROGRAMS} />
        <Row items={GROUP_UNITS} reverse />
      </div>
      {/* Versi teks untuk pembaca layar */}
      <ul className="sr-only">
        {[...EVENTS_AND_PROGRAMS, ...GROUP_UNITS].map((it) => (
          <li key={it.name}>
            {it.name}
            {it.note ? `, ${it.note}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
