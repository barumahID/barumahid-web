"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";

// Pembanding sebelum-sesudah untuk gambar & modelling (referensi visual "Side By Side Slider" dari user, dibuat ulang).
// - Mouse: garis pembagi mengikuti kursor dengan gerak halus. Klik untuk lompat, klik dua kali untuk kembali ke tengah.
// - Sentuh: geser dengan jari. Keyboard: panah kiri-kanan saat pegangan fokus.
// - Beberapa pasangan gambar bisa dipilih lewat tab. Saat pertama terlihat, garis bergeser sebentar sebagai petunjuk.

export interface ComparePair {
  id: string;
  tab: string;
  before: { src: string; alt: string; label: string };
  after: { src: string; alt: string; label: string };
}

const START = 50;

export default function SplitCompare({ pairs }: { pairs: ComparePair[] }) {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(START);
  const boxRef = useRef<HTMLDivElement>(null);
  const target = useRef(START);
  const current = useRef(START);
  const raf = useRef(0);
  const dragging = useRef(false);
  const inView = useInView(boxRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const pair = pairs[active];

  // Gerak halus menuju posisi target
  const glide = () => {
    cancelAnimationFrame(raf.current);
    const step = () => {
      const diff = target.current - current.current;
      current.current += Math.abs(diff) < 0.05 ? diff : diff * 0.18;
      setPos(current.current);
      if (Math.abs(target.current - current.current) > 0.05) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const jumpTo = (v: number) => {
    target.current = current.current = Math.max(0, Math.min(100, v));
    setPos(current.current);
  };

  const fromClient = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    return r ? ((clientX - r.left) / r.width) * 100 : START;
  };

  // Petunjuk gerak sekali saat pertama terlihat
  useEffect(() => {
    if (!inView || reduce) return;
    const seq = [72, 28, START];
    let i = 0;
    const timer = setInterval(() => {
      target.current = seq[i++];
      glide();
      if (i >= seq.length) clearInterval(timer);
    }, 550);
    return () => clearInterval(timer);
  }, [inView, reduce]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

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
                jumpTo(START);
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
          if (e.pointerType !== "mouse") {
            dragging.current = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }
          jumpTo(fromClient(e.clientX));
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") {
            target.current = Math.max(0, Math.min(100, fromClient(e.clientX)));
            glide();
          } else if (dragging.current) {
            jumpTo(fromClient(e.clientX));
          }
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onDoubleClick={() => {
          target.current = START;
          glide();
        }}
      >
        <Image key={pair.after.src} src={pair.after.src} alt={pair.after.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image key={pair.before.src} src={pair.before.src} alt={pair.before.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" draggable={false} />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-brand-dark/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
          {pair.before.label}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-dark">
          {pair.after.label}
        </span>

        {/* Garis dan pegangan bulat */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_14px_rgba(0,0,0,0.4)]" style={{ left: `${pos}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Geser untuk membandingkan ${pair.before.label} dan ${pair.after.label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") jumpTo(current.current - 5);
            if (e.key === "ArrowRight") jumpTo(current.current + 5);
          }}
          className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/25 text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm"
          style={{ left: `${pos}%` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] text-brand-gray">Arahkan kursor (atau geser di HP) untuk membandingkan. Klik dua kali untuk kembali ke tengah.</p>
    </div>
  );
}
