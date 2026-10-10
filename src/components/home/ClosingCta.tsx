import ButtonLink from "@/components/ui/ButtonLink";
import { waLink } from "@/data/site";

export default function ClosingCta({
  title = "Mulai dari satu obrolan.",
  body = "Ceritakan rencanamu, mau punya rumah atau mau membangun. Konsultasi pertama gratis.",
  primaryLabel = "Konsultasi gratis via WhatsApp",
  primaryHref = waLink("Halo barumahID, saya mau konsultasi gratis."),
  secondaryLabel = "Lihat listing RTO",
  secondaryHref = "/layanan/rto#listing",
}: {
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-red text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20 lg:px-14">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">{title}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-white/85">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <ButtonLink href={primaryHref} variant="light">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="outline-light">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
