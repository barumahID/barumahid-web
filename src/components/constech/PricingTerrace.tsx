"use client";

import { useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import { GAMBAR_FEATURES, PRICE_NOTE, STRUKTUR_FEATURES, TIERS, formatRupiah } from "@/data/pricing";
import { JURURANCANG, waLink } from "@/data/site";

// Kartu harga interaktif (referensi visual "Terrace" dari user, dibuat ulang sesuai pricelist barumahID).
// - Tiap kartu jasa punya tab Basic / Plus / Pro (klik, panah kiri-kanan, atau geser di HP).
// - Pengganti saklar bulanan/tahunan: "Harga per m²" atau "Estimasi total" untuk luas bangunan yang diisi.
// - Angka harga berputar seperti penghitung, cahaya mengikuti kursor, centang fitur tergambar saat ganti paket.

type Kind = "gambar" | "struktur";
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

function Check({ delay, highlight }: { delay: number; highlight?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill={highlight ? "rgba(197,59,59,0.18)" : "rgba(255,255,255,0.08)"} />
      <motion.path
        d="M6 10.5l2.6 2.6L14 7.5"
        stroke={highlight ? "#E27070" : "#ffffff"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay }}
      />
    </svg>
  );
}

function PriceCard({ kind, title, mode, area }: { kind: Kind; title: string; mode: "m2" | "total"; area: number }) {
  const [tier, setTier] = useState(0);
  const cardRef = useRef<HTMLElement>(null);
  const startX = useRef<number | null>(null);
  const t = TIERS[tier];
  const rate = kind === "gambar" ? t.gambar : t.struktur;
  const extra = kind === "gambar" ? t.gambarExtra : t.strukturExtra;
  const features = kind === "gambar" ? GAMBAR_FEATURES : STRUKTUR_FEATURES;
  const pro = t.id === "pro";
  const price = formatRupiah(mode === "m2" ? rate : rate * area);
  const message =
    `Halo Jururancang, saya dari website barumahID. Saya mau pesan paket ${title} ${t.name}` +
    (mode === "total" ? ` untuk bangunan sekitar ${area} m².` : ".");

  const pick = (i: number) => setTier(Math.max(0, Math.min(TIERS.length - 1, i)));

  return (
    <article
      ref={cardRef}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] border bg-[#161618] p-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] transition-[transform,border-color] duration-300 hover:-translate-y-1 md:p-9 ${
        pro ? "border-brand-red/50" : "border-white/10 hover:border-white/20"
      }`}
      onMouseMove={(e) => {
        const r = cardRef.current?.getBoundingClientRect();
        if (!r || !cardRef.current) return;
        cardRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        cardRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        if (dx < -40) pick(tier + 1);
        if (dx > 40) pick(tier - 1);
        startX.current = null;
      }}
    >
      {/* Cahaya mengikuti kursor, rona merah tipis untuk paket Pro */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,0px),rgba(255,255,255,0.08),transparent_45%)]" />
      {pro && <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-red/15 to-transparent" />}

      <div className="relative flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">{title}</p>
        {pro && <span className="rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Paling lengkap</span>}
      </div>

      {/* Tab paket */}
      <div
        className="relative mt-5 flex rounded-full bg-white/[0.06] p-1"
        role="tablist"
        aria-label={`Paket ${title}`}
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
            className={`relative flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${i === tier ? "text-brand-dark" : "text-white/65 hover:text-white"}`}
          >
            {i === tier && <motion.span layoutId={`tab-${kind}`} className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="relative">{x.name}</span>
          </button>
        ))}
      </div>

      {/* Harga */}
      <div className="relative mt-8">
        <p className="text-[clamp(2.4rem,4.6vw,3.4rem)] font-semibold tracking-tight text-white">
          <Rolling text={price} />
        </p>
        <p className="mt-2 text-[14px] text-white/55">
          {mode === "m2" ? "per m² luas bangunan" : `estimasi untuk ${area} m²`} · maksimal {t.maxDays} hari kerja
        </p>
      </div>

      <a
        href={waLink(message, JURURANCANG.wa)}
        target="_blank"
        rel="noopener noreferrer"
        className={`group/btn relative mt-7 flex items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-[14px] font-bold transition-shadow ${
          pro ? "bg-white text-brand-dark hover:shadow-[0_0_0_4px_rgba(255,255,255,0.15)]" : "bg-white/10 text-white hover:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
        }`}
      >
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-[420%]" />
        <span className="relative">Pesan paket {t.name}</span>
        <span className="relative transition-transform group-hover/btn:translate-x-1" aria-hidden="true">
          →
        </span>
      </a>

      {/* Fitur, centang tergambar ulang saat ganti paket */}
      <div className="relative mt-8 border-t border-white/10 pt-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/45">Termasuk</p>
        <ul key={`${kind}-${tier}`} className="mt-4 space-y-3">
          {features.map((f, i) => (
            <li key={f} className="flex gap-3 text-[14.5px] leading-snug text-white/85">
              <Check delay={i * 0.06} />
              {f}
            </li>
          ))}
          {extra && (
            <li className="flex gap-3 text-[14.5px] font-semibold leading-snug text-white">
              <Check delay={features.length * 0.06} highlight />
              {extra}
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}

export default function PricingTerrace() {
  const [mode, setMode] = useState<"m2" | "total">("m2");
  const [area, setArea] = useState(100);
  const setA = (v: number) => setArea(Math.max(20, Math.min(1000, Math.round(v || 0))));

  return (
    <MotionConfig reducedMotion="user">
      <div className="rounded-[32px] bg-[#0B0B0C] px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-[clamp(2rem,4.4vw,3.2rem)] font-semibold tracking-tight text-white">Paket harga</h3>
          <p className="mt-3 text-[15px] text-white/60">Pilih paket sesuai kebutuhan. Mau tahu kira-kira totalnya? Isi luas bangunanmu.</p>

          {/* Pengganti saklar bulanan/tahunan */}
          <LayoutGroup id="mode-harga">
            <div className="mx-auto mt-7 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1" role="tablist" aria-label="Cara tampil harga">
              {[
                { id: "m2" as const, label: "Harga per m²" },
                { id: "total" as const, label: "Estimasi total" },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === o.id}
                  onClick={() => setMode(o.id)}
                  className={`relative rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${mode === o.id ? "text-brand-dark" : "text-white/70 hover:text-white"}`}
                >
                  {mode === o.id && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{o.label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          {mode === "total" && (
            <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="luas-bangunan" className="text-[13px] font-semibold text-white/75">
                  Luas bangunan
                </label>
                <div className="flex items-center gap-1.5">
                  <button type="button" aria-label="Kurangi 10 m²" onClick={() => setA(area - 10)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 hover:border-white/40">
                    −
                  </button>
                  <input
                    id="luas-bangunan"
                    type="number"
                    inputMode="numeric"
                    min={20}
                    max={1000}
                    value={area}
                    onChange={(e) => setA(Number(e.target.value))}
                    className="w-20 rounded-lg border border-white/15 bg-transparent px-2 py-1.5 text-center text-[15px] font-bold text-white"
                  />
                  <span className="text-[13px] text-white/60">m²</span>
                  <button type="button" aria-label="Tambah 10 m²" onClick={() => setA(area + 10)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 hover:border-white/40">
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={5}
                value={Math.min(area, 500)}
                onChange={(e) => setA(Number(e.target.value))}
                aria-label="Geser luas bangunan"
                className="rto-slider mt-4 w-full accent-brand-red"
              />
            </div>
          )}
        </div>

        <div className="mx-auto mt-12 grid max-w-[980px] gap-6 md:grid-cols-2">
          <PriceCard kind="gambar" title="Gambar & Modelling" mode={mode} area={area} />
          <PriceCard kind="struktur" title="Desain & Analisa Struktur" mode={mode} area={area} />
        </div>
        <p className="mx-auto mt-8 max-w-[980px] text-center text-[13px] text-white/50">* {PRICE_NOTE}</p>
      </div>
    </MotionConfig>
  );
}
