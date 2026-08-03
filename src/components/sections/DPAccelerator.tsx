"use client";

import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";

const channels = [
  {
    num: "01",
    title: "Sewa Core",
    desc: "25% sewa → tabungan DP otomatis",
    active: true,
  },
  {
    num: "02",
    title: "Kosanesia Laundry",
    desc: "Cuci baju, cashback masuk DP",
    active: false,
  },
  {
    num: "03",
    title: "Jasa Titip",
    desc: "Titip barang antar kota, cashback DP",
    active: false,
  },
  {
    num: "04",
    title: "Jasa Pindahan",
    desc: "Layanan pindah + cashback DP",
    active: false,
  },
  {
    num: "05",
    title: "GreenPoint",
    desc: "Pilah sampah, dapat poin DP",
    active: false,
  },
];

export default function DPAccelerator() {
  return (
    <Section background="cream">
      <Reveal>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <SectionLabel number="05">Ekosistem DP</SectionLabel>
            <h2 className="mt-6 type-h1 text-brand-dark">
              Lima cara DP-mu<br />terkumpul lebih cepat.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="type-body text-brand-gray max-w-md">
              Selain sewa, layanan ekosistem barumahID lainnya juga berkontribusi ke tabungan DP-mu.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Editorial list */}
      <div className="mt-16 md:mt-20 border-t hairline">
        {channels.map((ch, i) => (
          <Reveal key={ch.num} delay={i * 60}>
            <div className={`flex items-center border-b hairline py-6 md:py-8 gap-6 md:gap-10 ${!ch.active ? "opacity-55" : ""}`}>
              <span className="type-micro text-brand-red min-w-[3ch]">{ch.num}</span>
              <div className="flex-1 grid gap-2 md:grid-cols-12 md:items-baseline md:gap-6">
                <h3 className="md:col-span-3 text-[clamp(1rem,1.4vw,1.2rem)] font-semibold tracking-tight text-brand-dark">
                  {ch.title}
                </h3>
                <p className="md:col-span-6 type-small text-brand-gray">{ch.desc}</p>
                <span className={`md:col-span-3 md:text-right type-micro ${
                  ch.active ? "text-credit" : "text-brand-mute"
                }`}>
                  {ch.active ? "Aktif" : "Segera Hadir"}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
