import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";

const problems = [
  {
    num: "01",
    title: "Harga naik terus.",
    desc: "Properti naik 5–8% per tahun. Kemampuan menabung DP tidak mengejar.",
  },
  {
    num: "02",
    title: "Syarat KPR berat.",
    desc: "Banyak yang penghasilannya cukup tapi tidak lolos administrasi bank.",
  },
  {
    num: "03",
    title: "Sewa tanpa arah.",
    desc: "Bayar sewa tiap bulan, tapi tidak ada yang terakumulasi untuk masa depan.",
  },
];

export default function ProblemSection() {
  return (
    <Section background="cream">
      <Reveal>
        <div className="max-w-3xl">
          <SectionLabel number="03">Masalah</SectionLabel>
          <h2 className="mt-6 type-h1 text-brand-dark">
            Kenapa rumah impian selalu terasa jauh?
          </h2>
        </div>
      </Reveal>

      <div className="mt-16 md:mt-20 grid gap-8 md:grid-cols-3 md:gap-12">
        {problems.map((p, i) => (
          <Reveal key={p.num} delay={i * 120}>
            <div className="border-t hairline-strong pt-6">
              <p className="type-micro text-brand-red">{p.num}</p>
              <h3 className="mt-4 text-[clamp(1.25rem,2vw,1.6rem)] font-semibold tracking-tight text-brand-dark leading-[1.2]">
                {p.title}
              </h3>
              <p className="mt-3 type-small text-brand-gray max-w-xs">
                {p.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
