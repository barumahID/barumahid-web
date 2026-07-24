import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";

const ecosystems = [
  {
    icon: "👕",
    title: "Kosanesia",
    desc: "Ekosistem laundry yang mengubah aktivitas cuci baju menjadi cashback untuk tabungan DP rumahmu.",
  },
  {
    icon: "♻️",
    title: "GreenPoint",
    desc: "Program pilah sampah yang memberikan poin untuk dikonversi menjadi tabungan DP.",
  },
];

export default function EcosystemPreview() {
  return (
    <Section background="light">
      <Reveal>
        <SectionLabel>Ekosistem</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          Lebih dari sekadar RTO
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {ecosystems.map((eco, i) => (
          <Reveal key={eco.title} delay={i * 120}>
            <div className="flex h-full flex-col gap-4 rounded-xl border border-brand-dark/8 bg-white p-8 card-shadow">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{eco.icon}</span>
                <h3 className="text-xl font-extrabold text-brand-dark">{eco.title}</h3>
                <span className="rounded-full bg-brand-gray/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-gray">
                  Sedang Dikembangkan
                </span>
              </div>
              <p className="text-sm leading-relaxed text-brand-gray">{eco.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={280}>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-brand-gray">
          Dalam pengembangan: ekosistem pendamping yang membantu kamu
          mengumpulkan DP lebih cepat dari aktivitas sehari-hari.
        </p>
      </Reveal>
    </Section>
  );
}
