import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import AccordionFAQ from "@/components/ui/AccordionFAQ";
import RTOSimulator from "@/components/RTOSimulator";
import { FORM_CUSTOMER_RTO } from "@/constants";

export const metadata: Metadata = {
  title: "Program Rent-to-Own",
  description: "Sewa hari ini, miliki hunian nantinya. Program RTO barumahID mendampingi perjalanan kepemilikan rumah kamu dari penyewa menjadi pemilik.",
};

const steps = [
  { num: "1", title: "Daftar & Verifikasi", desc: "Isi form minat, tim kami asesmen kelayakan dan cocokkan dengan unit mitra yang tersedia." },
  { num: "2", title: "Sewa Unit Mitra", desc: "Tinggal di unit mitra barumahID yang sudah terverifikasi. Sewa bulanan seperti biasa." },
  { num: "3", title: "25% Otomatis Tersimpan", desc: "Setiap bulan, 25% dari sewa langsung masuk tabungan DP kamu secara otomatis." },
  { num: "4", title: "Konversi ke Kepemilikan", desc: "Saat DP terkumpul cukup, kamu bisa mengambil jalur kepemilikan yang sesuai kondisi finansialmu." },
];

const dpChannels = [
  { icon: "🏠", title: "Sewa Core", desc: "25% sewa → tabungan DP otomatis", active: true },
  { icon: "👕", title: "Kosanesia Laundry", desc: "Cuci baju, dapat cashback DP", active: false },
  { icon: "📦", title: "Jasa Titip", desc: "Titip barang, cashback masuk DP", active: false },
  { icon: "🚚", title: "Jasa Pindahan", desc: "Pindah lebih mudah + cashback DP", active: false },
  { icon: "♻️", title: "GreenPoint", desc: "Pilah sampah, dapat poin DP", active: false },
];

const faqItems = [
  { question: "Apa syarat untuk ikut program RTO?", answer: "Kamu cukup mengisi form minat dan tim kami akan melakukan asesmen sederhana. Tidak ada syarat DP minimal atau slip gaji seperti KPR bank." },
  { question: "Apakah 25% dari sewa benar-benar masuk tabungan saya?", answer: "Ya. 25% dari sewa bulanan kamu otomatis tercatat sebagai tabungan DP. Dana ini terkelola dan transparan melalui sistem wallet barumahID." },
  { question: "Bagaimana kalau saya pindah sebelum DP cukup?", answer: "Tabungan DP kamu tetap tercatat di sistem. Detail mekanisme pengembalian akan diatur dalam perjanjian sewa." },
  { question: "Apa itu Skor Siap Punya Rumah?", answer: "Ini adalah sistem scoring barumahID yang menilai kesiapan finansial kamu dari 5 aspek. Skor menentukan jalur kepemilikan yang paling sesuai — Credit, Build, atau Buy." },
  { question: "Apa bedanya Option Credit, Build, dan Buy?", answer: "Credit = sewa → escrow → KPR via developer mitra. Build = sewa → modal → bangun di tanah sendiri. Buy = direct purchase (sedang dalam persiapan, pending legal review)." },
  { question: "Wallet 1 dan Wallet 2 itu apa?", answer: "Wallet 1 adalah tabungan DP dari 25% sewa (escrow). Wallet 2 adalah poin tambahan dari ekosistem barumahID (Kosanesia, GreenPoint, dll) yang bisa dikonversi menjadi DP." },
  { question: "Apakah program ini sudah berjalan?", answer: "Program pertama sedang dipersiapkan. Daftar minat sekarang agar kamu jadi yang pertama mendapat info saat program diluncurkan." },
  { question: "Berapa lama sampai DP terkumpul?", answer: "Tergantung harga unit, besaran sewa, dan target DP. Gunakan simulasi DP di halaman ini untuk estimasi." },
  { question: "Apakah ada biaya pendaftaran?", answer: "Tidak ada biaya pendaftaran. Cukup isi form minat." },
  { question: "Di kota mana program ini tersedia?", answer: "Pilot market saat ini: Padang, Jambi, Palembang, dan Riau." },
];

export default function RTOPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="animate-blob-drift absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand-red/15 blur-3xl" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <Badge variant="pre-launch" className="mb-6">Pre-launch</Badge>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Program Rent-to-Own barumahID
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Sewa hari ini. Miliki hunian nantinya. Program pertama sedang dipersiapkan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Masalah → Solusi */}
      <Section background="light">
        <Reveal>
          <SectionLabel>Masalah</SectionLabel>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Kenapa bukan KPR langsung?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-gray">
            Banyak pekerja Indonesia punya penghasilan cukup untuk cicilan, tapi gagal
            di syarat administrasi bank — DP besar, slip gaji formal, riwayat kredit.
            Program RTO barumahID membuka jalur alternatif.
          </p>
        </Reveal>
      </Section>

      {/* Cara Kerja — 4 langkah */}
      <Section background="white">
        <Reveal>
          <SectionLabel>Cara Kerja</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            4 langkah menuju rumah
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div className={`relative flex h-full flex-col gap-4 rounded-xl p-7 ${
                i === 2 ? "border-2 border-brand-red bg-brand-red text-white" : "border border-brand-dark/8 bg-white"
              }`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-black ${
                  i === 2 ? "bg-white text-brand-red" : "bg-brand-red text-white"
                }`}>
                  {s.num}
                </span>
                <h3 className="text-lg font-extrabold">{s.title}</h3>
                <p className={`text-sm leading-relaxed ${i === 2 ? "text-white/85" : "text-brand-gray"}`}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 3 Jalur */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Skor Siap Punya Rumah&trade;</SectionLabel>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tiga jalur adaptif
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/60">
              Sistem scoring barumahID menilai kesiapan finansialmu dari 5 aspek dan
              merekomendasikan jalur terbaik.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col gap-4 rounded-xl border-2 border-credit bg-white/5 p-7">
                <h3 className="text-xl font-extrabold">Option Credit</h3>
                <p className="text-xs font-semibold text-white/50">Skor 36–75</p>
                <p className="text-sm text-white/70">Sewa → Escrow → KPR via developer mitra. Jalur bagi yang ingin memanfaatkan skema kredit perumahan.</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex h-full flex-col gap-4 rounded-xl border-2 border-build bg-white/5 p-7">
                <h3 className="text-xl font-extrabold">Option Build</h3>
                <p className="text-xs font-semibold text-white/50">Skor 36–75 + Punya Tanah</p>
                <p className="text-sm text-white/70">Sewa → Modal → Bangun di tanah sendiri melalui IndDev (Individual Developer) barumahID.</p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="flex h-full flex-col gap-4 rounded-xl border-2 border-white/10 bg-white/5 p-7 opacity-60">
                <h3 className="text-xl font-extrabold">Option Buy</h3>
                <p className="text-xs font-semibold text-white/50">Skor 76–100</p>
                <p className="text-sm text-white/70">Sedang Dipersiapkan — pending legal review.</p>
                <Badge variant="coming-soon">Segera Hadir</Badge>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Wallet System */}
      <Section background="white">
        <Reveal>
          <SectionLabel>Wallet System</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Dua dompet, satu tujuan
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="rounded-xl border-2 border-credit bg-credit/5 p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-credit">Wallet 1 — Escrow DP</span>
              <h3 className="mt-3 text-2xl font-extrabold text-brand-dark">Tabungan dari Sewa</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray">
                25% dari sewa bulanan otomatis masuk ke wallet ini. Dana terkelola
                secara transparan dan tercatat di akun barumahID kamu.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-xl border-2 border-build bg-build/5 p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-build">Wallet 2 — Poin Ekosistem</span>
              <h3 className="mt-3 text-2xl font-extrabold text-brand-dark">Poin dari Aktivitas</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray">
                Poin dari Kosanesia, GreenPoint, dan ekosistem lainnya yang bisa
                dikonversi ke tabungan DP. Sedang dikembangkan.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* DP Acceleration */}
      <Section background="light">
        <Reveal>
          <SectionLabel>DP Acceleration Engine</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            5 channel percepatan DP
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {dpChannels.map((ch, i) => (
            <Reveal key={ch.title} delay={i * 80}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-brand-dark/8 bg-white p-6 card-shadow">
                <span className="text-3xl">{ch.icon}</span>
                <h3 className="text-sm font-extrabold text-brand-dark">{ch.title}</h3>
                <p className="text-xs text-brand-gray">{ch.desc}</p>
                <Badge variant={ch.active ? "active" : "coming-soon"} className="mt-auto">
                  {ch.active ? "Aktif" : "Segera Hadir"}
                </Badge>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Simulator */}
      <Section background="white" id="simulasi">
        <Reveal>
          <SectionLabel>Simulasi DP</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Coba hitung estimasi perjalanan DP-mu
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-10">
            <RTOSimulator />
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section background="light">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Pertanyaan seputar RTO
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-10 max-w-3xl">
            <AccordionFAQ items={faqItems} />
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <section className="bg-brand-red text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Tertarik dengan program RTO?</h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80">
              Daftar minat sekarang — gratis, tanpa komitmen. Tim kami akan menghubungi kamu via WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/daftar"
                className="rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-brand-red shadow-xl transition hover:scale-[1.02]"
              >
                Daftar Minat
              </Link>
              {FORM_CUSTOMER_RTO !== "#" && (
                <a
                  href={FORM_CUSTOMER_RTO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Isi Google Form
                </a>
              )}
            </div>
            <p className="mt-4 text-xs text-white/50">
              Program pertama sedang dipersiapkan
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
