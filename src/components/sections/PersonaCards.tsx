import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { FORM_MITRA_HUNIAN, FORM_DEVELOPER, WA_LINK1 } from "@/constants";

const mitraCards = [
  {
    num: "01",
    title: "mitrabarumahID Construction",
    desc: "Subkontraktor, supplier material, konsultan teknis.",
    ctaHref: `${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin mendaftar sebagai Mitra Konstruksi.")}`,
  },
  {
    num: "02",
    title: "mitrabarumahID Projectlink",
    desc: "Jaringan proyek konstruksi profesional & partner ekosistem.",
    ctaHref: FORM_DEVELOPER,
  },
  {
    num: "03",
    title: "mitrabarumahID Knowledges",
    desc: "Ekosistem edukasi dan pengembangan SDM konstruksi.",
    ctaHref: FORM_MITRA_HUNIAN,
  },
];

export default function PersonaCards() {
  return (
    <Section background="warm">
      <Reveal>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <SectionLabel number="08">Kemitraan</SectionLabel>
            <h2 className="mt-6 type-h1 text-brand-dark">
              Bergabung dalam<br />ekosistem barumahID.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="type-body text-brand-gray max-w-md">
              Tiga jalur kemitraan — untuk konstruksi, proyek, dan pengembangan SDM.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 md:mt-20 border-t hairline">
        {mitraCards.map((m, i) => (
          <Reveal key={m.num} delay={i * 100}>
            <a
              href={m.ctaHref !== "#" ? m.ctaHref : `${WA_LINK1}?text=${encodeURIComponent(`Halo barumahID, saya tertarik dengan ${m.title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group row-hover flex items-center border-b hairline py-8 md:py-10 gap-6 md:gap-10"
            >
              <span className="type-micro text-brand-red min-w-[3ch]">{m.num}</span>
              <div className="flex-1 grid gap-2 md:grid-cols-12 md:items-baseline md:gap-8">
                <h3 className="md:col-span-5 text-[clamp(1.15rem,1.8vw,1.5rem)] font-semibold tracking-tight text-brand-dark">
                  {m.title}
                </h3>
                <p className="md:col-span-4 type-small text-brand-gray">{m.desc}</p>
                <span className="md:col-span-3 md:text-right text-[13px] font-medium text-brand-gray group-hover:text-brand-red transition-colors">
                  Daftar sekarang →
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
