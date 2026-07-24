import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";

const channels = [
  {
    icon: "🏠",
    title: "Sewa Core",
    desc: "25% sewa → tabungan DP otomatis",
    status: "active" as const,
  },
  {
    icon: "👕",
    title: "Kosanesia Laundry",
    desc: "Cuci baju, dapat cashback DP",
    status: "coming-soon" as const,
  },
  {
    icon: "📦",
    title: "Jasa Titip",
    desc: "Titip barang, cashback masuk DP",
    status: "coming-soon" as const,
  },
  {
    icon: "🚚",
    title: "Jasa Pindahan",
    desc: "Pindah lebih mudah + cashback DP",
    status: "coming-soon" as const,
  },
  {
    icon: "♻️",
    title: "GreenPoint",
    desc: "Pilah sampah, dapat poin DP",
    status: "coming-soon" as const,
  },
];

export default function DPAccelerator() {
  return (
    <Section background="light">
      <Reveal>
        <SectionLabel>DP Acceleration Engine</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          5 cara DP-mu terkumpul lebih cepat
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {channels.map((ch, i) => (
          <Reveal key={ch.title} delay={i * 80}>
            <div className="flex h-full flex-col gap-3 rounded-xl border border-brand-dark/8 bg-white p-6 card-shadow tilt-card">
              <span className="text-3xl">{ch.icon}</span>
              <h3 className="text-sm font-extrabold text-brand-dark">{ch.title}</h3>
              <p className="text-xs leading-relaxed text-brand-gray">{ch.desc}</p>
              <div className="mt-auto">
                <Badge variant={ch.status}>
                  {ch.status === "active" ? "Aktif" : "Segera Hadir"}
                </Badge>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
