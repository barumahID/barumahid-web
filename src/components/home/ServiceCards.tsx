import Image from "next/image";
import Link from "@/i18n/Link";
import Reveal from "@/components/Reveal";
import type { PhotoCard } from "@/data/beranda";

// Kartu foto yang melebar saat disorot. Dipakai beranda Konstruksi (3 jasa) dan beranda RTO (3 jalur).
export default function ServiceCards({
  id,
  eyebrow,
  title,
  intro,
  items,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: PhotoCard[];
}) {
  return (
    <section id={id} className="scroll-mt-20 bg-brand-cream">
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="type-micro text-brand-red">{eyebrow}</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3.3rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-dark">
                {title}
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-brand-gray md:col-span-4 md:col-start-9">
              {intro}
            </p>
          </div>
        </Reveal>

        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-16 md:h-[560px] md:overflow-visible md:px-0 md:pb-0">
          {items.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="group relative flex h-[480px] w-[84%] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl bg-brand-dark text-white md:h-full md:w-auto md:flex-1 md:transition-[flex-grow] md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[1.7]"
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(min-width: 768px) 50vw, 85vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
              {s.badge && (
                <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-dark md:left-6 md:top-6">
                  {s.badge}
                </span>
              )}
              <div className="relative p-6 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{s.audience}</p>
                <h3 className="mt-3 text-[28px] font-extrabold leading-none tracking-tight md:text-[34px]">{s.name}</h3>
                <p className="mt-3 text-[17px] font-semibold leading-snug text-white">{s.headline}</p>
                <div className="grid transition-[grid-template-rows,opacity] duration-500 md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100 md:group-focus-visible:grid-rows-[1fr] md:group-focus-visible:opacity-100">
                  <div className="overflow-hidden">
                    <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/75">{s.body}</p>
                  </div>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white">
                  {s.cta}
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-[12px] text-brand-mute md:hidden">Geser untuk melihat layanan lain</p>
      </div>
    </section>
  );
}
