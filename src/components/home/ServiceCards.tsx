import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const services = [
  {
    href: "/layanan/rto",
    audience: "Untuk calon pemilik rumah",
    name: "Rent-to-Own",
    headline: "Sewa hari ini. Miliki hunian nantinya.",
    body: "Sewa unit mitra, 25% dari sewa jadi saldo DP. Ada listing rumah, simulasi DP, dan tiga jalur kepemilikan.",
    cta: "Lihat program RTO",
    image: "/images/hero-card.webp",
    alt: "Rumah tinggal satu lantai dengan pagar dan taman depan",
  },
  {
    href: "/layanan/constech",
    audience: "Untuk pemilik proyek",
    name: "ConsTech",
    headline: "Proyekmu, dibikin mudah aja.",
    body: "Jasa gambar, analisa struktur, renovasi, dan bangun. Dikerjakan insinyur, dihitung transparan.",
    cta: "Lihat jasa dan harga",
    image: "/images/proyek/render-rumah-2-lantai.webp",
    alt: "Render 3D desain rumah dua lantai karya tim barumahID",
  },
  {
    href: "/kemitraan",
    audience: "Untuk mitra dan profesional",
    name: "Kemitraan",
    headline: "Tumbuh bareng ekosistem barumahID.",
    body: "Penyedia kos, developer, kontraktor, tukang, supplier, freelancer, dan institusi pendidikan.",
    cta: "Pilih peran mitra",
    image: "/images/proyek/bangun-rumah-2-lantai-padang.webp",
    alt: "Rumah dua lantai yang sedang dibangun bersama mitra mandor",
  },
];

export default function ServiceCards() {
  return (
    <section id="layanan" className="bg-brand-cream">
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="type-micro text-brand-red">Tiga layanan, satu tujuan</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3.3rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-dark">
                Pilih pintu yang paling pas buat kamu.
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-brand-gray md:col-span-4 md:col-start-9">
              Mau punya rumah, butuh jasa konstruksi, atau ingin jadi bagian dari ekosistemnya. Semua dimulai dari sini.
            </p>
          </div>
        </Reveal>

        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-16 md:h-[560px] md:overflow-visible md:px-0 md:pb-0">
          {services.map((s) => (
            <Link
              key={s.href}
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
