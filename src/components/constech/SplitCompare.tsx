"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Pembanding geser dua gambar (referensi visual "Split Image Compare" dari user, dibuat ulang).
// Geser garis tengah dengan mouse/jari, atau tombol panah saat fokus. Saat pertama terlihat, garisnya
// bergeser sebentar sebagai petunjuk. Beberapa pasangan bisa dipilih lewat tab.

export interface ComparePair {
  id: string;
  tab: string;
  before: { src: string; alt: string; label: string };
  after: { src: string; alt: string; label: string };
}

export default function SplitCompare({ pairs }: { pairs: ComparePair[] }) {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const inView = useInView(boxRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const pair = pairs[active];

  // Petunjuk gerak sekali saat pertama terlihat
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(50, [70, 30, 50], { duration: 1.8, ease: "easeInOut", onUpdate: (v) => setPos(v) });
    return () => c.stop();
  }, [inView, reduce]);

  const setFromClient = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div>
      {pairs.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Pilih contoh">
          {pairs.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => {
                setActive(i);
                setPos(50);
              }}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                i === active ? "bg-brand-dark text-white" : "border border-brand-dark/15 text-brand-dark hover:border-brand-dark"
              }`}
            >
              {p.tab}
            </button>
          ))}
        </div>
      )}
      <div
        ref={boxRef}
        className="relative aspect-[16/9] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl border border-brand-dark/10 bg-white shadow-[0_24px_60px_-36px_rgba(20,20,20,0.45)]"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setFromClient(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClient(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <Image key={pair.after.src} src={pair.after.src} alt={pair.after.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image key={pair.before.src} src={pair.before.src} alt={pair.before.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-brand-dark/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
          {pair.before.label}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-dark">
          {pair.after.label}
        </span>

        {/* Garis dan pegangan */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]" style={{ left: `${pos}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Geser untuk membandingkan ${pair.before.label} dan ${pair.after.label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((v) => Math.max(0, v - 5));
            if (e.key === "ArrowRight") setPos((v) => Math.min(100, v + 5));
          }}
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-lg"
          style={{ left: `${pos}%` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
