"use client";

import { useState } from "react";
import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import ChannelIcon from "@/components/icons/ChannelIcon";
import { GAMBAR_FEATURES, PRICE_NOTE, STRUKTUR_FEATURES, TIERS, formatRupiah } from "@/data/pricing";
import { JURURANCANG, waLink } from "@/data/site";

// Paket harga ringkas (arahan user Okt 2026: partner Jururancang dan paket harga dibuat compact).
// Satu kartu: logo dan kontak partner di atas, satu pilihan paket Basic/Plus/Pro untuk dua jasa sekaligus,
// angka harga berputar saat ganti paket, isi paket berupa chip, lalu ajakan chat admin WhatsApp di bawah.

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function Rolling({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <span className="inline-flex tabular-nums leading-none" aria-label={text}>
      {chars.map((ch, i) => {
        const pos = chars.length - i; // posisi dari kanan supaya kolom angka stabil
        if (!/\d/.test(ch)) {
          return (
            <span key={`s${pos}`} aria-hidden="true">
              {ch}
            </span>
          );
        }
        return (
          <span key={`d${pos}`} className="relative inline-block overflow-hidden" aria-hidden="true">
            <span className="invisible">{ch}</span>
            <motion.span
              className="absolute left-0 top-0 flex flex-col"
              initial={false}
              animate={{ y: `-${Number(ch)}em` }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
            >
              {DIGITS.map((d) => (
                <span key={d} className="block h-[1em]">
                  {d}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

const pill =
  "inline-flex items-center gap-1.5 rounded-full border border-brand-dark/15 px-3 py-1.5 text-[12.5px] font-semibold text-brand-dark transition-colors";

export default function PricingTerrace({ partnerTitle }: { partnerTitle: string }) {
  const [tier, setTier] = useState(0);
  const t = TIERS[tier];
  const pro = t.id === "pro";
  const pick = (i: number) => setTier(Math.max(0, Math.min(TIERS.length - 1, i)));

  const services = [
    { title: "Gambar & Modelling", rate: t.gambar, features: GAMBAR_FEATURES, extra: t.gambarExtra },
    { title: "Desain & Analisa Struktur", rate: t.struktur, features: STRUKTUR_FEATURES, extra: t.strukturExtra },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="rounded-3xl border border-brand-dark/10 bg-white p-5 md:p-7">
        {/* Partner: logo, nama, kontak */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Image src={JURURANCANG.logo.src} alt={`Logo ${JURURANCANG.name}`} width={JURURANCANG.logo.w} height={JURURANCANG.logo.h} className="h-12 w-auto md:h-14" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">{partnerTitle}</p>
              <p className="mt-1 text-[17px] font-extrabold tracking-tight text-brand-dark md:text-[19px]">{JURURANCANG.name}</p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            <li>
              <a href={`mailto:${JURURANCANG.email}`} title={JURURANCANG.email} className={`${pill} hover:border-brand-dark hover:bg-brand-dark hover:text-white`}>
                <ChannelIcon id="email" size={14} />
                <span className="hidden xl:inline">{JURURANCANG.email}</span>
                <span className="xl:hidden">Email</span>
              </a>
            </li>
            <li>
              <a
                href={waLink("Halo Jururancang, saya dari website barumahID. Saya mau tanya jasa gambar atau analisa struktur.", JURURANCANG.wa)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pill} hover:border-[#1FA855] hover:bg-[#1FA855] hover:text-white`}
              >
                <ChannelIcon id="whatsapp" size={14} />
                WA {JURURANCANG.waLabel}
              </a>
            </li>
            <li>
              <a href={JURURANCANG.instagram} target="_blank" rel="noopener noreferrer" className={`${pill} hover:border-brand-dark hover:bg-brand-dark hover:text-white`}>
                <ChannelIcon id="instagram" size={14} />
                {JURURANCANG.igHandle}
              </a>
            </li>
            <li>
              {JURURANCANG.website ? (
                <a href={JURURANCANG.website} target="_blank" rel="noopener noreferrer" className={`${pill} hover:border-brand-dark hover:bg-brand-dark hover:text-white`}>
                  <GlobeIcon />
                  Website
                </a>
              ) : (
                <span className={`${pill} cursor-default border-dashed text-brand-mute`}>
                  <GlobeIcon />
                  Website segera hadir
                </span>
              )}
            </li>
          </ul>
        </div>

        {/* Pilihan paket, berlaku untuk dua jasa sekaligus */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-brand-dark/10 pt-6">
          <div
            className="flex rounded-full bg-brand-cream p-1"
            role="tablist"
            aria-label="Pilih paket"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") pick(tier + 1);
              if (e.key === "ArrowLeft") pick(tier - 1);
            }}
          >
            {TIERS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={i === tier}
                tabIndex={i === tier ? 0 : -1}
                onClick={() => pick(i)}
                className={`relative rounded-full px-5 py-2 text-[13px] font-bold transition-colors ${i === tier ? "text-white" : "text-brand-dark/70 hover:text-brand-dark"}`}
              >
                {i === tier && (
                  <motion.span
                    layoutId="paket-pill"
                    className={`absolute inset-0 rounded-full ${x.id === "pro" ? "bg-brand-red" : "bg-brand-dark"}`}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{x.name}</span>
              </button>
            ))}
          </div>
          <p className="text-[13px] font-semibold text-brand-gray">Maksimal {t.maxDays} hari kerja</p>
          {pro && <span className="rounded-full bg-brand-red/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-red">Paling lengkap</span>}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {services.map((sv) => (
            <article key={sv.title} className={`flex flex-col rounded-2xl bg-brand-cream p-4 transition-shadow md:p-5 ${pro ? "ring-1 ring-brand-red/40" : ""}`}>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-gray">{sv.title}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight text-brand-dark">
                  <Rolling text={formatRupiah(sv.rate)} />
                  <span className="ml-1 text-[13px] font-semibold text-brand-gray">/m²</span>
                </p>
                <a
                  href={waLink(`Halo Jururancang, saya dari website barumahID. Saya mau pesan paket ${sv.title} ${t.name}.`, JURURANCANG.wa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-dark px-4 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-red"
                >
                  Pesan {t.name}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1 md:mt-4 md:gap-1.5" aria-label={`Isi paket ${sv.title} ${t.name}`}>
                {sv.features.map((f) => (
                  <li key={f} className="rounded-full bg-white px-2 py-0.5 text-[11.5px] font-medium text-brand-dark/80 md:px-2.5 md:py-1 md:text-[12px]">
                    {f}
                  </li>
                ))}
                {sv.extra && <li className="rounded-full bg-brand-red px-2 py-0.5 text-[11.5px] font-semibold text-white md:px-2.5 md:py-1 md:text-[12px]">+ {sv.extra}</li>}
              </ul>
            </article>
          ))}
        </div>

        {/* Catatan harga dan ajakan chat admin WhatsApp */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[12.5px] leading-relaxed text-brand-gray">* {PRICE_NOTE}</p>
          <a
            href={waLink("Halo barumahID, saya mau tanya paket jasa gambar atau analisa struktur.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#1FA855] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#178a45] sm:self-auto"
          >
            <ChannelIcon id="whatsapp" size={16} />
            Lebih nyaman lewat WhatsApp? Chat admin
          </a>
        </div>
      </div>
    </MotionConfig>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
    </svg>
  );
}
