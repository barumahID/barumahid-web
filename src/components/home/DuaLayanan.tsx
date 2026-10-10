import Image from "next/image";
import Link from "next/link";
import { DUA_LAYANAN } from "@/data/beranda";

// Dua gambar besar di beranda (gaya "pick your fit" tikalindustries.com) dengan animasi kartu yang sudah ada:
// desktop melebar saat disorot dan deskripsi muncul, foto zoom pelan. HP: bertumpuk.
export default function DuaLayanan() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-5 md:h-[620px] md:flex-row md:gap-5 md:px-10 lg:px-14">
      {DUA_LAYANAN.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="group relative flex h-[460px] flex-col justify-end overflow-hidden rounded-3xl bg-brand-dark text-left text-white md:h-full md:flex-1 md:transition-[flex-grow] md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[1.35]"
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />
          {s.badge && (
            <span className="absolute left-6 top-6 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-dark md:left-8 md:top-8">
              {s.badge}
            </span>
          )}
          <div className="relative p-7 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{s.audience}</p>
            <h3 className="mt-3 text-[34px] font-extrabold leading-none tracking-tight md:text-[48px]">{s.name}</h3>
            <p className="mt-3 text-[18px] font-semibold leading-snug md:text-[20px]">{s.headline}</p>
            <div className="grid transition-[grid-template-rows,opacity] duration-500 md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100 md:group-focus-visible:grid-rows-[1fr] md:group-focus-visible:opacity-100">
              <div className="overflow-hidden">
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">{s.body}</p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-bold text-brand-dark transition-colors group-hover:bg-brand-red group-hover:text-white">
              {s.cta}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
