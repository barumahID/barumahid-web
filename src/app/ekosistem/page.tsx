import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Ekosistem barumahID",
  description: "4 revenue engine barumahID — ConsTech LBAG, Rent-to-Own, Kosanesia, GreenPoint. Ekosistem pendamping kepemilikan rumah.",
};

const engines = [
  {
    title: "ConsTech LBAG",
    desc: "Layanan konstruksi profesional — Jasa Gambar, Analisa Struktur, Renovasi & Konstruksi. Fee 8–14% dari RAB.",
    status: "active" as const,
    href: "/services",
    icon: "🔨",
  },
  {
    title: "Rent-to-Own (RTO)",
    desc: "Program sewa sambil nabung DP. 25% sewa otomatis masuk tabungan DP.",
    status: "pre-launch" as const,
    href: "/rto",
    icon: "🏠",
  },
  {
    title: "Kosanesia",
    desc: "Ekosistem laundry yang mengubah aktivitas cuci baju menjadi cashback untuk tabungan DP rumahmu.",
    status: "coming-soon" as const,
    href: "#",
    icon: "👕",
  },
  {
    title: "GreenPoint",
    desc: "Program pilah sampah yang memberikan poin untuk dikonversi menjadi tabungan DP.",
    status: "coming-soon" as const,
    href: "#",
    icon: "♻️",
  },
];

export default function EkosistemPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Ekosistem</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              4 engine, satu ekosistem
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              barumahID bukan cuma satu produk — ini ekosistem lengkap yang mendampingi
              perjalanan kepemilikan rumah dari berbagai sisi kehidupan.
            </p>
          </Reveal>
        </div>
      </section>

      <Section background="white">
        <div className="grid gap-8 md:grid-cols-2">
          {engines.map((e, i) => (
            <Reveal key={e.title} delay={i * 100}>
              <div className="flex h-full flex-col gap-5 rounded-xl border border-brand-dark/8 bg-white p-8 card-shadow">
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{e.icon}</span>
                  <Badge variant={e.status}>
                    {e.status === "active" ? "Aktif" : e.status === "pre-launch" ? "Pre-launch" : "Segera Hadir"}
                  </Badge>
                </div>
                <h2 className="text-xl font-extrabold text-brand-dark">{e.title}</h2>
                <p className="flex-1 text-sm leading-relaxed text-brand-gray">{e.desc}</p>
                {e.href !== "#" && (
                  <Link href={e.href} className="inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:underline">
                    Pelajari →
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section background="light">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
              Dalam pengembangan
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-gray">
              Ekosistem pendamping yang membantu kamu mengumpulkan DP lebih cepat dari
              aktivitas sehari-hari — cuci baju, pilah sampah, titip barang, dan lainnya.
            </p>
            <Link
              href="/daftar"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark"
            >
              Daftar Minat
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
