import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { EMAIL, WA_LINK1, IG_URL, LINKEDIN_URL, HQ_ADDRESS, VO_ADDRESS } from "@/constants";

export const metadata: Metadata = {
  title: "Tentang",
  description: "barumahID (PT Inditek Bluprim Mahaksa) — Platform Pendamping Kepemilikan Rumah dari Padang, Sumatera Barat.",
};

const timeline = [
  { year: "2018", title: "Brand Lahir", desc: "Perusahaan lahir dari pengalaman lapangan konstruksi — melihat langsung betapa sulitnya memiliki rumah bagi pekerja Indonesia." },
  { year: "2024", title: "PT Resmi Berdiri", desc: "PT. Inditek Bluprim Mahaksa (IBM) didirikan secara formal pada 9 Januari 2024." },
  { year: "2026", title: "Full-time & Pivot", desc: "Tim beralih full-time dan fokus mengembangkan platform pendamping kepemilikan rumah." },
];

const pillars = [
  { title: "ConsTech", desc: "Layanan konstruksi profesional dengan pendekatan Lean, BIM, AI, dan Green Construction.", color: "border-brand-red" },
  { title: "PropTech", desc: "Program Rent-to-Own yang mendampingi perjalanan dari penyewa menjadi pemilik.", color: "border-brand-red" },
];

const values = [
  { title: "Transparan", desc: "RAB terbuka, fee jelas, proses terukur." },
  { title: "Berbasis Lokal", desc: "Memahami konteks dan kebutuhan pasar Indonesia dari Sumatera." },
  { title: "Inklusif", desc: "Membuka jalur kepemilikan rumah untuk semua kondisi finansial." },
  { title: "Berkelanjutan", desc: "Pendekatan hijau dan responsible dalam setiap layanan." },
];

export default function TentangPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
          <Reveal>
            <SectionLabel dark>Tentang Kami</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Dibangun dari frustasi lapangan, bukan riset pasar.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Origin Story + Timeline */}
      <Section background="white">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Reveal>
              <SectionLabel>Cerita Kami</SectionLabel>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
                Dari lapangan ke platform
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-8 border-l-2 border-brand-red/20 pl-8">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 120}>
                  <div className="relative">
                    <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-brand-red">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-red">{t.year}</span>
                    <h3 className="mt-1 text-lg font-extrabold text-brand-dark">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-gray">{t.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Misi */}
      <Section background="cream">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Misi</SectionLabel>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
              &ldquo;Mendampingi setiap perjalanan kepemilikan rumah, dari kondisi finansial apapun.&rdquo;
            </h2>
          </div>
        </Reveal>
      </Section>

      {/* 2 Pilar */}
      <Section background="white">
        <Reveal>
          <SectionLabel>Pilar Bisnis</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            ConsTech &middot; PropTech
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className={`flex h-full flex-col gap-3 rounded-xl border-t-4 bg-white p-7 card-shadow ${p.color}`}>
                <h3 className="text-xl font-extrabold text-brand-dark">{p.title}</h3>
                <p className="text-sm leading-relaxed text-brand-gray">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section background="cream">
        <Reveal>
          <SectionLabel>Nilai</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">Yang kami pegang</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="rounded-xl border border-brand-dark/8 bg-white p-6 card-shadow">
                <h3 className="text-base font-extrabold text-brand-dark">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Dual Brand */}
      <Section background="white">
        <Reveal>
          <SectionLabel>Dual Brand</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">IBM &amp; barumahID</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-gray">
            <strong className="text-brand-dark">PT. Inditek Bluprim Mahaksa (IBM)</strong> adalah entitas legal
            perusahaan. <strong className="text-brand-red">barumahID</strong> adalah brand konsumer yang dihadirkan untuk
            publik — platform pendamping kepemilikan rumah untuk masyarakat Indonesia.
          </p>
        </Reveal>
      </Section>

      {/* Contact card */}
      <Section background="cream">
        <Reveal>
          <div className="rounded-xl border border-brand-dark/8 bg-white p-8">
            <h3 className="text-lg font-extrabold text-brand-dark">Kontak</h3>
            <div className="mt-4 grid gap-4 text-sm text-brand-gray sm:grid-cols-2">
              <div>
                <p className="font-semibold text-brand-dark">HQ</p>
                <p>{HQ_ADDRESS}</p>
              </div>
              <div>
                <p className="font-semibold text-brand-dark">Virtual Office</p>
                <p>{VO_ADDRESS}</p>
              </div>
              <div>
                <p><a href={`mailto:${EMAIL}`} className="hover:text-brand-red">{EMAIL}</a></p>
                <p><a href={WA_LINK1} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">+62 851-5788-3292</a></p>
              </div>
              <div>
                <p><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">@barumahid</a></p>
                <p><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">LinkedIn: @barumahID</a></p>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
