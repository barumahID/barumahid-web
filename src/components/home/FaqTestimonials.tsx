import Reveal from "@/components/Reveal";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import ButtonLink from "@/components/ui/ButtonLink";
import TestimonialSlider from "./TestimonialSlider";
import { HOME_FAQ, TESTIMONIALS, type FaqItem } from "@/data/faq";
import { waLink } from "@/data/site";
import type { Lang } from "@/i18n/config";
import { makeT } from "@/i18n/t";

// Testimoni + FAQ dalam satu section (arahan: FAQ terlalu makan tempat, gabung dengan feedback klien).
// Testimoni wajib dari form F03 dengan izin tampil. Selama datanya kosong, kolom kiri berisi ajakan bertanya.
// Tampil di /tentang. `faq` default HOME_FAQ (pertanyaan umum barumahID).
export default function FaqTestimonials({ faq: faqId = HOME_FAQ, lang = "id" }: { faq?: FaqItem[]; lang?: Lang }) {
  const t = makeT(lang);
  const faq = faqId.map((f) => ({ question: t(f.question), answer: t(f.answer) }));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" className="bg-brand-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-16 lg:px-14">
        <Reveal className="lg:col-span-5">
          <p className="type-micro text-brand-red">{TESTIMONIALS.length > 0 ? t("Kata mereka") : t("Tanya jawab")}</p>
          <h2 className="mt-5 text-[clamp(1.8rem,3.6vw,2.7rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-brand-dark">
            {TESTIMONIALS.length > 0 ? t("Dari klien yang sudah bekerja bersama kami.") : t("Yang paling sering ditanyakan.")}
          </h2>
          {TESTIMONIALS.length > 0 ? (
            <div className="mt-8">
              <TestimonialSlider items={TESTIMONIALS} />
            </div>
          ) : (
            <>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-brand-gray">
                {t("Belum ketemu jawabannya? Tanya langsung ke admin kami. Konsultasi pertama gratis, tanpa komitmen.")}
              </p>
              <div className="mt-7">
                <ButtonLink href={waLink(t("Halo barumahID, saya mau tanya."))} variant="whatsapp">
                  {t("Tanya lewat WhatsApp")}
                </ButtonLink>
              </div>
            </>
          )}
        </Reveal>
        <Reveal delay={100} className="lg:col-span-7">
          {TESTIMONIALS.length > 0 && (
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-mute">{t("Tanya jawab")}</p>
          )}
          <AccordionFAQ items={faq} compact />
        </Reveal>
      </div>
    </section>
  );
}
