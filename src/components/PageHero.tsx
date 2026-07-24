import Link from "next/link";

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-brand-red/5 blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        {breadcrumb && (
          <nav className="mb-6 flex items-center gap-2 text-xs text-brand-light/40">
            <Link href="/" className="transition hover:text-brand-light">
              Home
            </Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-brand-light/20">/</span>
                {b.href ? (
                  <Link href={b.href} className="transition hover:text-brand-light">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-brand-light/70">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <span className="block h-px w-10 bg-brand-red" />
          <span className="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-light/60">
            {eyebrow}
          </span>
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-5 max-w-xl text-base text-brand-light/60 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
