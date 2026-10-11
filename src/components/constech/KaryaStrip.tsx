"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import type { Karya } from "@/data/contech";

// Strip karya desain rumah dan analisa struktur (arahan user Okt 2026): bergeser sendiri pelan, bisa digeser
// dengan mouse atau jari, dan tombol panah. Semua gambar setinggi sama, lebarnya mengikuti rasio asli
// supaya proporsional dan tidak terpotong. Tanpa bingkai supaya rapat.
// Daftar digandakan supaya geseran tidak pernah habis (posisi dibungkus ke setengah panjang track).

const GAP = 16; // sama dengan gap-4
const SPEED = 0.45; // px per frame

export default function KaryaStrip({ items, label }: { items: Karya[]; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const st = useRef({ x: 0, v: 0, target: null as number | null, dragging: false, lastX: 0, hover: false, half: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const s = st.current;
    let raf = 0;

    const measure = () => {
      s.half = (track.scrollWidth + GAP) / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!s.dragging) {
        if (s.target !== null) {
          s.x += (s.target - s.x) * 0.12;
          if (Math.abs(s.target - s.x) < 0.5) s.target = null;
        } else if (Math.abs(s.v) > 0.05) {
          s.x += s.v;
          s.v *= 0.94;
        } else if (!s.hover && !reduce) {
          s.x += SPEED;
        }
      }
      if (s.half > 0) {
        if (s.x >= s.half) {
          s.x -= s.half;
          if (s.target !== null) s.target -= s.half;
        } else if (s.x < 0) {
          s.x += s.half;
          if (s.target !== null) s.target += s.half;
        }
      }
      track.style.transform = `translate3d(${-s.x}px,0,0)`;
    };

    // Hanya bergerak saat terlihat di layar
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame);
      else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(wrap);

    // Geser horizontal dengan trackpad (scroll vertikal tetap menggulir halaman)
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      s.target = null;
      s.v = 0;
      s.x += e.deltaX;
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("wheel", onWheel);
    };
  }, [reduce]);

  const step = (dir: 1 | -1) => {
    const s = st.current;
    const w = wrapRef.current?.clientWidth ?? 600;
    s.v = 0;
    s.target = (s.target ?? s.x) + dir * Math.max(240, w * 0.5);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="type-micro text-brand-red">{label}</p>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => step(d)}
              aria-label={d < 0 ? "Karya sebelumnya" : "Karya berikutnya"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark transition-colors hover:border-brand-dark hover:bg-brand-dark hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={wrapRef}
        className="mt-5 cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]"
        role="region"
        aria-label={label}
        onMouseEnter={() => (st.current.hover = true)}
        onMouseLeave={() => (st.current.hover = false)}
        onPointerDown={(e) => {
          const s = st.current;
          s.dragging = true;
          s.lastX = e.clientX;
          s.v = 0;
          s.target = null;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const s = st.current;
          if (!s.dragging) return;
          const dx = e.clientX - s.lastX;
          s.lastX = e.clientX;
          s.x -= dx;
          s.v = -dx;
        }}
        onPointerUp={() => (st.current.dragging = false)}
        onPointerCancel={() => (st.current.dragging = false)}
      >
        <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
          {[...items, ...items].map((k, i) => (
            <figure
              key={`${k.src}-${i}`}
              aria-hidden={i >= items.length || undefined}
              className="relative h-[200px] shrink-0 overflow-hidden rounded-2xl bg-white md:h-[280px]"
              style={{ aspectRatio: `${k.w} / ${k.h}` }}
            >
              <Image src={k.src} alt={i < items.length ? k.alt : ""} fill sizes="(min-width: 768px) 640px, 420px" className="object-cover" draggable={false} />
              <figcaption className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-brand-dark/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                <span className={`h-1.5 w-1.5 rounded-full ${k.tag === "Desain rumah" ? "bg-white" : "bg-brand-red"}`} aria-hidden="true" />
                {k.tag} · {k.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
