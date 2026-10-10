import Image from "next/image";

// Hero gelap untuk semua halaman selain beranda. Navbar transparan butuh latar gelap di atas.
// Foto proyek dipakai sebagai "bayangan" dengan overlay gelap 75-85% (arahan visual PRD).

export default function PageHero({
  label,
  title,
  subtitle,
  image,
  imageAlt = "",
  children,
  align = "left",
  size = "md",
}: {
  label?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
}) {
  const pad =
    size === "lg" ? "pt-36 pb-24 md:pt-44 md:pb-32" : size === "sm" ? "pt-32 pb-14 md:pt-36 md:pb-16" : "pt-36 pb-20 md:pt-40 md:pb-24";
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      {image && (
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}
      <div className={`absolute inset-0 -z-10 ${image ? "bg-gradient-to-b from-brand-dark/85 via-brand-dark/80 to-brand-dark/95" : ""}`} />
      <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
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
            className={`mt-6 text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-white/75 ${
              align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {subtitle}
          </div>
        )}
        {children && <div className={`mt-9 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>{children}</div>}
      </div>
    </section>
  );
}
