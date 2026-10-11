"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Galeri cincin 3D untuk portofolio pilihan (referensi visual "Orbyt Gallery" dari user, dibuat ulang).
// Kartu foto mengelilingi cincin yang berputar pelan; kartu di belakang mengecil dan memudar.
// Geser untuk memutar (dengan inersia), berhenti saat disorot, klik kartu untuk membawanya ke depan.
// Keterangan proyek yang sedang di depan tampil di bawah cincin.

export interface OrbitItem {
  src: string;
  alt: string;
  title: string;
  tag: string;
}

const SPEED = 14; // derajat per detik
const DEPTH_SCALE = 0.32;
const DEPTH_FADE = 0.6;
const TILT = 0.16; // seberapa jauh kartu belakang naik (perspektif cincin miring)

export default function OrbitGallery({ items }: { items: OrbitItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [front, setFront] = useState(0);
  const [size, setSize] = useState({ w: 220, h: 280, r: 360 });

  const st = useRef({ angle: 0, target: null as number | null, vel: 0, dragging: false, hover: false, lastX: 0, moved: 0, front: 0 });
  const n = items.length;
  const step = 360 / n;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      const cw = w < 640 ? 150 : 220;
      setSize({ w: cw, h: Math.round(cw * 1.28), r: Math.min(w * 0.42, ((cw * n) / (2 * Math.PI)) * 1.25) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const s = st.current;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (s.target !== null) {
        const diff = s.target - s.angle;
        s.angle += diff * 0.12;
        if (Math.abs(diff) < 0.1) s.target = null;
      } else if (!s.dragging) {
        if (Math.abs(s.vel) > 0.05) {
          s.angle += s.vel;
          s.vel *= 0.94;
        } else if (!s.hover && !reduce) {
          s.angle -= SPEED * dt;
        }
      }
      let best = 0;
      let bestZ = -2;
      for (let i = 0; i < n; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const a = ((s.angle + i * step) * Math.PI) / 180;
        const x = Math.sin(a) * size.r;
        const z = Math.cos(a); // -1 (belakang) .. 1 (depan)
        const t = (z + 1) / 2;
        const scale = 1 - DEPTH_SCALE * (1 - t);
        const y = -(1 - t) * size.r * TILT;
        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        card.style.opacity = (1 - DEPTH_FADE * (1 - t)).toFixed(3);
        card.style.zIndex = String(Math.round(t * 100));
        if (z > bestZ) {
          bestZ = z;
          best = i;
        }
      }
      if (best !== s.front) {
        s.front = best;
        setFront(best);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [n, step, size, reduce]);

  const bringToFront = (i: number) => {
    const s = st.current;
    // sudut terdekat yang membuat kartu i berada di depan (sin = 0, cos = 1)
    const want = -i * step;
    const k = Math.round((s.angle - want) / 360);
    s.target = want + k * 360;
    s.vel = 0;
  };

  const item = items[front];

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ height: size.h * 1.75 }}
        onMouseEnter={() => (st.current.hover = true)}
        onMouseLeave={() => (st.current.hover = false)}
        onPointerDown={(e) => {
          const s = st.current;
          s.dragging = true;
          s.lastX = e.clientX;
          s.moved = 0;
          s.target = null;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const s = st.current;
          if (!s.dragging) return;
          const dx = e.clientX - s.lastX;
          s.lastX = e.clientX;
          s.moved += Math.abs(dx);
          s.angle += dx * 0.25;
          s.vel = dx * 0.25;
        }}
        onPointerUp={() => (st.current.dragging = false)}
        onPointerCancel={() => (st.current.dragging = false)}
      >
        {/* Bayangan lantai cincin */}
        <div className="pointer-events-none absolute left-1/2 top-[62%] h-16 w-[70%] -translate-x-1/2 rounded-[50%] bg-brand-dark/10 blur-2xl" aria-hidden="true" />
        {items.map((it, i) => (
          <button
            key={it.src}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            type="button"
            onClick={() => {
              if (st.current.moved < 6) bringToFront(i);
            }}
            aria-label={`Tampilkan ${it.title}`}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-white bg-white shadow-[0_24px_50px_-24px_rgba(20,20,20,0.55)] will-change-transform"
            // posisi awal terpusat; setelah itu transform diatur tiap frame oleh animasi
            style={{ width: size.w, height: size.h, transform: "translate(-50%, -50%)" }}
          >
            <Image src={it.src} alt={it.alt} fill sizes="220px" className="object-cover" draggable={false} />
          </button>
        ))}
      </div>

      {/* Keterangan proyek yang sedang di depan */}
      <div className="mt-2 text-center" aria-live="polite">
        <span className="inline-flex rounded-full bg-brand-red/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-red">{item.tag}</span>
        <p className="mt-3 text-[clamp(1.2rem,2.2vw,1.6rem)] font-extrabold tracking-tight text-brand-dark">{item.title}</p>
        <p className="mt-2 text-[13px] text-brand-gray">Geser untuk memutar, klik foto untuk melihatnya di depan.</p>
      </div>
    </div>
  );
}
