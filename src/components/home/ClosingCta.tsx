"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { useT } from "@/i18n/LangProvider";
import { waLink } from "@/data/site";

export default function ClosingCta({
  title = "Mulai dari satu obrolan.",
  body = "Ceritakan rencanamu, mau punya rumah atau mau membangun. Konsultasi pertama gratis.",
  primaryLabel = "Konsultasi gratis via WhatsApp",
  primaryHref,
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
  // Teks dari halaman ditulis dalam bahasa Indonesia, diterjemahkan di sini (lihat src/i18n).
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-brand-red text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10 md:py-12 lg:px-14">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">{t(title)}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-white/85">{t(body)}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <ButtonLink href={primaryHref ?? waLink(t("Halo barumahID, saya mau konsultasi gratis."))} variant="light">
            {t(primaryLabel)}
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="outline-light">
            {t(secondaryLabel)}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
