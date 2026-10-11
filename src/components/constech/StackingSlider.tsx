"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Slider kartu bertumpuk (referensi visual "StackingSlider" dari user, dibuat ulang).
// Kartu yang sudah lewat bergeser ke kiri dan menumpuk di belakang kartu aktif, kartu berikutnya berjajar di kanan.
// Navigasi: tombol panah, geser (swipe), dan putar otomatis pelan (berhenti saat disorot, mati kalau reduced motion).

export interface StackSlide {
  src: string;
  alt: string;
  title: string;
  tag: string;
}

const GAP = 20;
const MAX_STACK = 4;

export default function StackingSlider({ slides }: { slides: StackSlide[] }) {
  const [index, setIndex] = useState(0);
  const [cardW, setCardW] = useState(420);
  const [stackStep, setStackStep] = useState(18);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const startX = useRef<number | null>(null);
  const inView = useInView(wrapRef, { amount: 0.4 });
  const reduce = useReducedMotion();
  const n = slides.length;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      setCardW(Math.min(440, Math.round(w * (w < 640 ? 0.8 : 0.42))));
      setStackStep(w < 640 ? 8 : 18);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Putar otomatis
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => {
      if (!hovered.current) setIndex((i) => (i + 1) % n);
    }, 4200);
    return () => clearInterval(t);
  }, [inView, reduce, n]);

  const go = (d: number) => setIndex((i) => Math.max(0, Math.min(n - 1, i + d)));
  const cardH = Math.round(cardW * 0.72);
  const stacked = Math.min(index, MAX_STACK);

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(90deg,#000_80%,transparent)]"
        style={{ height: cardH + 92 }}
        onMouseEnter={() => (hovered.current = true)}
        onMouseLeave={() => (hovered.current = false)}
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          if (dx < -40) go(1);
          if (dx > 40) go(-1);
          startX.current = null;
        }}
      >
        {slides.map((s, i) => {
          const depth = index - i;
          const x = i < index ? Math.max(0, stacked - depth) * stackStep : stacked * stackStep + (i - index) * (cardW + GAP);
          const scale = i < index ? 1 - Math.min(depth, MAX_STACK) * 0.035 : 1;
          return (
            <motion.article
              key={s.src}
              className="absolute left-0 top-0 overflow-hidden rounded-3xl border border-brand-dark/10 bg-white shadow-[0_20px_50px_-30px_rgba(20,20,20,0.5)]"
              style={{ width: cardW, zIndex: i, transformOrigin: "left center" }}
              initial={false}
              animate={{ x, scale, filter: i < index ? "brightness(0.92)" : "brightness(1)" }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
              aria-hidden={i !== index}
            >
              <div className="relative bg-white" style={{ height: cardH }}>
                <Image src={s.src} alt={s.alt} fill sizes="(min-width: 640px) 440px, 80vw" className="object-cover" draggable={false} />
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <p className="text-[15px] font-extrabold leading-snug text-brand-dark">{s.title}</p>
                <span className="shrink-0 rounded-full bg-brand-cream px-3 py-1 text-[11px] font-bold text-brand-dark">{s.tag}</span>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex gap-2">
          {[
            { d: -1, label: "Sebelumnya", path: "M15 6l-6 6 6 6" },
            { d: 1, label: "Berikutnya", path: "M9 6l6 6-6 6" },
          ].map((b) => {
            const disabled = (b.d < 0 && index === 0) || (b.d > 0 && index === n - 1);
            return (
              <button
                key={b.label}
                type="button"
                aria-label={b.label}
                disabled={disabled}
                onClick={() => go(b.d)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-dark/15 bg-white text-brand-dark transition-colors hover:border-brand-dark hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-brand-dark"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={b.path} />
                </svg>
              </button>
            );
          })}
        </div>
        <p className="text-[13px] font-bold tabular-nums text-brand-dark" aria-live="polite">
          {String(index + 1).padStart(2, "0")} <span className="text-brand-mute">/ {String(n).padStart(2, "0")}</span>
        </p>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-brand-dark/10">
          <div className="h-full rounded-full bg-brand-red transition-all duration-500" style={{ width: `${((index + 1) / n) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
