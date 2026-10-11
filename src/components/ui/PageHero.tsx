import Image from "next/image";

// Hero gelap untuk semua halaman selain beranda. Navbar transparan butuh latar gelap di atas.
// Foto proyek dipakai sebagai "bayangan" dengan overlay gelap 75-85% (arahan visual PRD).
// `slides`: beberapa foto yang berganti pelan (crossfade + zoom halus, CSS saja). Overlay dibuat sedikit
// lebih terang di sisi kanan supaya fotonya terasa, teks tetap terbaca di sisi kiri.

const SLIDE_SECONDS = 6;

export default function PageHero({
  label,
  title,
  subtitle,
  image,
  imageAlt = "",
  slides,
  children,
  align = "left",
  size = "md",
}: {
  label?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  slides?: { src: string; alt: string }[];
  children?: React.ReactNode;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
}) {
  const pad =
    size === "lg" ? "pt-36 pb-24 md:pt-44 md:pb-32" : size === "sm" ? "pt-32 pb-14 md:pt-36 md:pb-16" : "pt-36 pb-20 md:pt-40 md:pb-24";
  const hasSlides = !!slides && slides.length > 1;
  const cycle = (slides?.length ?? 0) * SLIDE_SECONDS;
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      {hasSlides ? (
        <div className="hero-slides absolute inset-0 -z-20" style={{ ["--slide-cycle" as string]: `${cycle}s` }}>
          {slides!.map((s, i) => (
            <div
              key={s.src}
              className="hero-slide absolute inset-0"
              // Foto pertama langsung tampil saat halaman dibuka (delay negatif 1 detik).
              style={{ animationDelay: `${i * SLIDE_SECONDS - 1}s` }}
            >
              <Image src={s.src} alt={s.alt} fill priority={i === 0} loading={i === 0 ? undefined : "eager"} sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        image && <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-20 object-cover" />
      )}
      <div
        className={`absolute inset-0 -z-10 ${
          hasSlides
            ? "bg-gradient-to-r from-brand-dark/90 via-brand-dark/65 to-brand-dark/35"
            : image
              ? "bg-gradient-to-b from-brand-dark/85 via-brand-dark/80 to-brand-dark/95"
              : ""
        }`}
      />
      {hasSlides && <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-dark/80 via-transparent to-brand-dark/40" />}
      {!hasSlides && <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />}
      <div className={`relative mx-auto max-w-[1280px] px-5 md:px-10 lg:px-14 ${pad} ${align === "center" ? "text-center" : ""}`}>
        {label && <p className="type-micro text-brand-red">{label}</p>}
        <h1
          className={`mt-4 text-[clamp(2.1rem,5.2vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.025em] ${
            align === "center" ? "mx-auto max-w-4xl" : "max-w-4xl"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <div
            className={`mt-6 text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-white/80 ${
              align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {subtitle}
          </div>
        )}
        {children && <div className={`mt-9 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>{children}</div>}
        {hasSlides && (
          // Penanda foto yang sedang tampil, ikut berjalan bersama animasi foto
          <div className="mt-12 flex gap-2" aria-hidden="true">
            {slides!.map((s, i) => (
              <span key={s.src} className="h-[3px] w-10 overflow-hidden rounded-full bg-white/20">
                <span className="hero-slide-bar block h-full w-full origin-left bg-white" style={{ animationDelay: `${i * SLIDE_SECONDS - 1}s` }} />
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
