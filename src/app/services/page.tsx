"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SegmentNavbar from "@/components/layout/SegmentNavbar";
import { IG_JURURANCANG, WA_LINK1 } from "@/constants";

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
    <path d="M3 8.5l3.5 3.5L13 4" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CROSS = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
    <path d="M4 4l8 8M12 4l-8 8" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const tabs = ["Jasa Gambar", "Analisa Struktur", "Renovasi & Konstruksi"];

interface PricingCard {
  tier: string;
  price: string;
  unit: string;
  duration: string;
  features: { label: string; included: boolean }[];
  highlighted?: boolean;
  badge?: string;
  ctaStyle: "outline" | "solid";
  ctaLabel: string;
  ctaHref: string;
}

const jasaGambarCards: PricingCard[] = [
  {
    tier: "BASIC",
    price: "Rp 15.000",
    unit: "/m²",
    duration: "Maks. 7 hari pengerjaan",
    features: [
      { label: "Survey lokasi", included: true },
      { label: "Konsultasi kebutuhan", included: true },
      { label: "Denah lantai", included: true },
      { label: "Gambar 3D eksterior", included: true },
      { label: "Gambar arsitektur", included: true },
      { label: "Gambar struktur", included: true },
      { label: "Denah listrik & air (MEP)", included: false },
      { label: "RAB", included: false },
    ],
    ctaStyle: "outline",
    ctaLabel: "DM @jururancang_mahaksa →",
    ctaHref: IG_JURURANCANG,
  },
  {
    tier: "PLUS",
    price: "Rp 20.000",
    unit: "/m²",
    duration: "Maks. 10 hari pengerjaan",
    features: [
      { label: "Survey lokasi", included: true },
      { label: "Konsultasi kebutuhan", included: true },
      { label: "Denah lantai", included: true },
      { label: "Gambar 3D eksterior", included: true },
      { label: "Gambar arsitektur", included: true },
      { label: "Gambar struktur", included: true },
      { label: "Denah listrik & air (MEP)", included: false },
      { label: "RAB", included: false },
    ],
    ctaStyle: "outline",
    ctaLabel: "DM @jururancang_mahaksa →",
    ctaHref: IG_JURURANCANG,
  },
  {
    tier: "PRO",
    price: "Rp 30.000",
    unit: "/m²",
    duration: "Maks. 14 hari pengerjaan",
    highlighted: true,
    badge: "PALING LENGKAP",
    features: [
      { label: "Survey lokasi", included: true },
      { label: "Konsultasi kebutuhan", included: true },
      { label: "Denah lantai", included: true },
      { label: "Gambar 3D eksterior", included: true },
      { label: "Gambar arsitektur", included: true },
      { label: "Gambar struktur", included: true },
      { label: "Denah listrik & air (MEP)", included: true },
      { label: "RAB", included: true },
    ],
    ctaStyle: "solid",
    ctaLabel: "DM @jururancang_mahaksa →",
    ctaHref: IG_JURURANCANG,
  },
];

const analisaStrukturCards: PricingCard[] = [
  {
    tier: "BASIC",
    price: "Rp 18.000",
    unit: "/item",
    duration: "Maks. 7 hari pengerjaan",
    features: [
      { label: "Laporan perhitungan struktur (SNI)", included: true },
      { label: "Dimensi kolom, balok, pelat, pondasi", included: true },
      { label: "Penulangan / pembesian", included: true },
      { label: "Gambar Detail Engineering Design (DED)", included: false },
      { label: "RAB Struktur", included: false },
    ],
    ctaStyle: "outline",
    ctaLabel: "DM @jururancang_mahaksa →",
    ctaHref: IG_JURURANCANG,
  },
  {
    tier: "PLUS",
    price: "Rp 25.000",
    unit: "/item",
    duration: "Maks. 10 hari pengerjaan",
    features: [
      { label: "Laporan perhitungan struktur (SNI)", included: true },
      { label: "Dimensi kolom, balok, pelat, pondasi", included: true },
      { label: "Penulangan / pembesian", included: true },
      { label: "Gambar Detail Engineering Design (DED)", included: true },
      { label: "RAB Struktur", included: false },
    ],
    ctaStyle: "outline",
    ctaLabel: "DM @jururancang_mahaksa →",
    ctaHref: IG_JURURANCANG,
  },
  {
    tier: "PRO",
    price: "Rp 35.000",
    unit: "/item",
    duration: "Maks. 14 hari pengerjaan",
    highlighted: true,
    badge: "PALING LENGKAP",
    features: [
      { label: "Laporan perhitungan struktur (SNI)", included: true },
      { label: "Dimensi kolom, balok, pelat, pondasi", included: true },
      { label: "Penulangan / pembesian", included: true },
      { label: "Gambar Detail Engineering Design (DED)", included: true },
      { label: "RAB Struktur", included: true },
    ],
    ctaStyle: "solid",
    ctaLabel: "DM @jururancang_mahaksa →",
    ctaHref: IG_JURURANCANG,
  },
];

const tabFooterNotes = [
  "* Harga dapat berubah sesuai kompleksitas project",
  "* Perhitungan berbasis SNI + ETABS/SAP2000 · Harga dapat berubah sesuai kompleksitas project",
  "* Harga sesuai AHSP — disepakati bersama klien",
];

function Card({ card }: { card: PricingCard }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 ${
        card.highlighted
          ? "border-2 border-[#C53B3B] bg-[#FFF8F8]"
          : "border border-black/[0.08] bg-white"
      }`}
    >
      {card.badge && (
        <span className="absolute right-4 top-4 rounded-full bg-[#C53B3B] px-3 py-1 text-xs font-bold text-white">
          {card.badge}
        </span>
      )}
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#888]">
        {card.tier}
      </p>
      <p className="text-4xl font-black text-[#1A1A1A]">
        {card.price}
        <span className="ml-1 text-base font-normal text-[#888]">{card.unit}</span>
      </p>
      <p className="mb-6 mt-1 text-xs text-[#aaa]">{card.duration}</p>

      <div className="my-6 border-t border-black/[0.06]" />

      <div className="flex flex-1 flex-col gap-2">
        {card.features.map((f) => (
          <div key={f.label} className="flex items-start gap-2 text-sm">
            {f.included ? CHECK : CROSS}
            <span className={f.included ? "text-[#1A1A1A]" : "text-[#bbb]"}>
              {f.label}
            </span>
          </div>
        ))}
      </div>

      <a
        href={card.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 block w-full rounded-full py-3 text-center text-sm font-semibold transition ${
          card.ctaStyle === "solid"
            ? "bg-[#C53B3B] text-white hover:bg-red-700"
            : "border border-black/20 text-[#1A1A1A] hover:border-black/50"
        }`}
      >
        {card.ctaLabel}
      </a>
    </div>
  );
}

function RenovasiTab() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-black/[0.08] bg-white p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#888]">
              Yang Klien Dapatkan:
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                "Konsultasi & estimasi biaya awal",
                "Pendampingan dan pengawasan lapangan",
                "Koordinasi mandor, tukang & supplier",
                "Manajemen proyek: perencanaan hingga serah terima",
                "Pengadaan material dengan referensi harga pasar",
                "Kontrol kualitas sesuai spesifikasi",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  {CHECK}
                  <span className="text-[#1A1A1A]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#888]">
              Cara Kami Menghitung Biaya:
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                "Dihitung berdasarkan AHSP (Analisa Harga Satuan Pekerjaan)",
                "Standar resmi konstruksi Indonesia",
                "RAB transparan disepakati di awal",
                "Tidak ada biaya tersembunyi",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mt-0.5 shrink-0"
                  >
                    <path
                      d="M5 8h6M11 8l-2-2M11 8l-2 2"
                      stroke="#C53B3B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[#1A1A1A]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#C53B3B] bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-[#1A1A1A]">
            Konsultasi pertama GRATIS.
          </p>
          <p className="mt-1 text-sm text-[#666]">
            Hubungi kami untuk penawaran sesuai project Anda.
          </p>
          <a
            href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek konstruksi.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full bg-[#C53B3B] px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Hubungi Admin WA →
          </a>
        </div>
      </div>
    </div>
  );
}

const tabHeaders = [
  {
    title: "Jasa Gambar & Modelling Konstruksi",
    sub: "Via @jururancang_mahaksa · Gambar arsitektur, struktur, dan 3D lengkap",
  },
  {
    title: "Jasa Desain & Analisa Struktur",
    sub: "Via @jururancang_mahaksa · Perhitungan berbasis SNI + ETABS/SAP2000",
  },
  {
    title: "Jasa Renovasi & Bangun Konstruksi",
    sub: "Pendampingan & Manajemen Konstruksi — Fee berdasarkan RAB proyek",
  },
];

const serviceMenuItems = [
  { label: "Home", href: "/" },
  { label: "Layanan", href: "/services" },
  { label: "Tentang", href: "/tentang" },
];

const featureChips = [
  "Jasa Gambar & Modelling",
  "Analisa Struktur",
  "Renovasi & Konstruksi",
];

const chipIcons = [
  <svg key="g" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20" /><path d="M5 20V7l7-4 7 4v13" /><path d="M9 20v-4h6v4" /><path d="M9 12h.01M15 12h.01" /></svg>,
  <svg key="s" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20v18H2z" /><path d="M2 9h20" /><path d="M9 21V9" /></svg>,
  <svg key="r" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C53B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <SegmentNavbar segment="services" menuItems={serviceMenuItems} />

      {/* Split Hero */}
      <section className="bg-[#F8F5F0] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-[55fr_45fr]">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#C53B3B]">
              LAYANAN CONSTECH LBAG
            </p>
            <h1 className="mb-6 text-4xl font-black leading-tight text-[#1A1A1A] md:text-5xl lg:text-6xl">
              Proyekmu, dibikin mudah aja.
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-[#666]">
              Jasa gambar arsitektur, analisa struktur, dan manajemen konstruksi
              — transparan dari awal, berbasis AHSP dan SNI.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi proyek.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#C53B3B] px-8 py-4 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Konsultasikan Proyek
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A]/15 px-8 py-[14px] text-sm font-semibold text-[#1A1A1A] transition hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
              >
                Lihat harga lengkap
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
            <p className="mt-6 text-xs tracking-wide text-[#aaa]">
              Via @jururancang_mahaksa · Berbasis SNI + AHSP
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {featureChips.map((chip, i) => (
              <div
                key={chip}
                className="flex items-center gap-3 rounded-xl border border-black/[0.08] bg-white px-5 py-4 text-sm font-semibold text-[#1A1A1A] shadow-sm"
              >
                {chipIcons[i]}
                {chip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tabs */}
      <div id="pricing" className="bg-[#F8F5F0]">
        <div className="mx-auto max-w-5xl px-6 pb-8 pt-16 text-center">
          <h2 className="text-3xl font-black text-[#1A1A1A] sm:text-4xl">
            Harga Layanan
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#666]">
            Tiga layanan utama, transparan dari awal. Pilih sesuai kebutuhan proyekmu.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3 px-6">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                activeTab === i
                  ? "bg-[#C53B3B] text-white"
                  : "border border-black/20 text-[#666] hover:border-black/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">
                  {tabHeaders[activeTab].title}
                </h3>
                <p className="mt-2 text-sm text-[#888]">
                  {tabHeaders[activeTab].sub}
                </p>
              </div>

              {activeTab === 0 && (
                <div className="grid gap-6 md:grid-cols-3">
                  {jasaGambarCards.map((card) => (
                    <Card key={card.tier} card={card} />
                  ))}
                </div>
              )}

              {activeTab === 1 && (
                <div className="grid gap-6 md:grid-cols-3">
                  {analisaStrukturCards.map((card) => (
                    <Card key={card.tier} card={card} />
                  ))}
                </div>
              )}

              {activeTab === 2 && <RenovasiTab />}

              <p className="mt-8 text-center text-xs text-[#aaa]">
                {tabFooterNotes[activeTab]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
