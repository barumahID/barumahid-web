import Image from "next/image";
import { EVENTS_AND_PROGRAMS, type PartnerMark } from "@/data/partners";

// Grafis bergerak: program dan lomba yang pernah diikuti barumahID (arahan user).
// Logo diambil dari `logo` di partners.ts (file di /public/logos/). Selama kosong, tampil nama + keterangan.
function Item({ item }: { item: PartnerMark }) {
  return (
    <div
      className="mx-2.5 flex h-[88px] shrink-0 items-center gap-4 rounded-2xl border border-brand-dark/10 bg-white px-5 shadow-[0_8px_24px_-18px_rgba(20,20,20,0.35)] md:mx-3 md:h-[100px] md:px-6"
      title={item.note ? `${item.name}, ${item.note}` : item.name}
    >
      {item.logo ? (
        <Image src={item.logo} alt="" width={160} height={64} className="h-12 w-auto max-w-[140px] object-contain md:h-14" />
      ) : (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
            <path d="M17 6h3a3 3 0 0 1-3 4M7 6H4a3 3 0 0 0 3 4" />
          </svg>
        </span>
      )}
      <div className="max-w-[240px]">
        <p className="text-[15px] font-extrabold leading-tight text-brand-dark md:text-[16px]">{item.name}</p>
        {item.note && <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-brand-gray">{item.note}</p>}
      </div>
    </div>
  );
}

export default function EventMarquee() {
  // Diulang 4 kali supaya animasi -50% mulus walau daftarnya pendek.
  const loop = [...EVENTS_AND_PROGRAMS, ...EVENTS_AND_PROGRAMS, ...EVENTS_AND_PROGRAMS, ...EVENTS_AND_PROGRAMS];
  return (
    <section className="border-y border-brand-dark/10 bg-brand-cream-warm py-14 md:py-16" aria-labelledby="judul-event">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 lg:px-14">
        <p id="judul-event" className="type-micro text-center text-brand-red">
          Program dan lomba yang pernah kami ikuti
        </p>
      </div>
      <div className="edge-fade marquee-pause mt-8 overflow-hidden" aria-hidden="true">
        <div className="animate-marquee-slow flex w-max items-center py-2">
          {loop.map((it, i) => (
            <Item key={`${it.name}-${i}`} item={it} />
          ))}
        </div>
      </div>
      {/* Versi teks untuk pembaca layar */}
      <ul className="sr-only">
        {EVENTS_AND_PROGRAMS.map((it) => (
          <li key={it.name}>
            {it.name}
            {it.note ? `, ${it.note}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
