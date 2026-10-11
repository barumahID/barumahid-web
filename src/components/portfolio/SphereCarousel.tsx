"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Bola foto 3D untuk portofolio pilihan (referensi visual "Sphere carousel" dari user, dibuat ulang dengan CSS 3D).
// Kartu foto tersebar merata di permukaan bola (spiral Fibonacci), bola berputar pelan dan bisa digeser
// ke segala arah (dengan inersia). Kartu di belakang memudar. Keterangan jasa dan proyek dari kartu yang
// sedang paling depan tampil di sisi kiri.

export interface SphereItem {
  src: string;
  alt: string;
  title: string;
  service: string;
}

export interface SphereService {
  name: string;
  body: string;
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

export default function SphereCarousel({ items, services }: { items: SphereItem[]; services: SphereService[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [front, setFront] = useState(0);
  const [radius, setRadius] = useState(220);
  const st = useRef({ rx: -12, ry: 0, vx: 0, vy: 0, dragging: false, lx: 0, ly: 0, front: 0 });
  const n = items.length;

  // Posisi tiap kartu di permukaan bola (vektor satuan)
  const points = Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * GOLDEN;
    return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setRadius(Math.max(110, Math.min(r.width * 0.5, r.height) * 0.36));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const s = st.current;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!s.dragging) {
        if (Math.abs(s.vx) > 0.01 || Math.abs(s.vy) > 0.01) {
          s.ry += s.vx;
          s.rx = Math.max(-70, Math.min(70, s.rx - s.vy));
          s.vx *= 0.94;
          s.vy *= 0.94;
        } else if (!reduce) {
          s.ry += 0.12;
        }
      }
      if (ballRef.current) ballRef.current.style.transform = `translateZ(${-radius}px) rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      // Kedalaman tiap kartu setelah bola diputar: atur pudar dan cari kartu paling depan
      const ax = (s.rx * Math.PI) / 180, ay = (s.ry * Math.PI) / 180;
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      let best = 0, bestZ = -2;
      for (let i = 0; i < n; i++) {
        const p = points[i];
        const z1 = -p.x * sy + p.z * cy; // putar Y
        const z2 = p.y * sx + z1 * cx; // putar X
        const card = cardRefs.current[i];
        if (card) card.style.opacity = (0.25 + 0.75 * ((z2 + 1) / 2)).toFixed(3);
        if (z2 > bestZ) {
          bestZ = z2;
          best = i;
        }
      }
      if (best !== s.front) {
        s.front = best;
        setFront(best);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame);
      else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // points dihitung ulang tiap render dari n yang sama, cukup bergantung pada n
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, radius, reduce]);

  const item = items[front];
  const service = services.find((x) => x.name === item.service);
  // Dibulatkan supaya HTML server dan browser sama persis (hindari hydration mismatch)
  const cardW = Math.round(radius * 0.62);
  const cardH = Math.round(cardW * 1.25);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0B0B0F]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />
      <div className="relative grid lg:grid-cols-12">
        {/* Keterangan jasa dari kartu paling depan */}
        <div className="relative z-10 order-2 px-6 pb-8 lg:order-1 lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:py-12 lg:pl-12 lg:pr-0" aria-live="polite">
          <div className="flex flex-wrap gap-2">
            {services.map((sv) => (
              <span
                key={sv.name}
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-500 ${
                  sv.name === item.service ? "bg-brand-red text-white" : "bg-white/[0.06] text-white/45"
                }`}
              >
                {sv.name}
              </span>
            ))}
          </div>
          <p key={item.service} className="mt-6 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-tight tracking-tight text-white">
            {item.service}
          </p>
          {service && <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">{service.body}</p>}
          <p className="mt-6 text-[13px] font-semibold text-white/80">
            <span className="text-brand-red">●</span> {item.title}
          </p>
          <p className="mt-6 text-[12px] text-white/40">Geser bola untuk melihat proyek lain.</p>
        </div>

        {/* Bola foto */}
        <div
          ref={wrapRef}
          className="relative order-1 h-[380px] cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-[520px] lg:order-2 lg:col-span-7"
          style={{ perspective: `${radius * 4}px` }}
          onPointerDown={(e) => {
            const s = st.current;
            s.dragging = true;
            s.lx = e.clientX;
            s.ly = e.clientY;
            s.vx = s.vy = 0;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const s = st.current;
            if (!s.dragging) return;
            const dx = e.clientX - s.lx, dy = e.clientY - s.ly;
            s.lx = e.clientX;
            s.ly = e.clientY;
            s.ry += dx * 0.3;
            s.rx = Math.max(-70, Math.min(70, s.rx - dy * 0.3));
            s.vx = dx * 0.3;
            s.vy = dy * 0.3;
          }}
          onPointerUp={() => (st.current.dragging = false)}
          onPointerCancel={() => (st.current.dragging = false)}
        >
          <div ref={ballRef} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
            {items.map((it, i) => {
              const p = points[i];
              const lon = ((Math.atan2(p.x, p.z) * 180) / Math.PI).toFixed(2);
              const lat = ((Math.asin(p.y) * 180) / Math.PI).toFixed(2);
              return (
                <div
                  key={it.src}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute overflow-hidden rounded-xl border border-white/20 bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  style={{
                    width: cardW,
                    height: cardH,
                    left: -Math.round(cardW / 2),
                    top: -Math.round(cardH / 2),
                    transform: `rotateY(${lon}deg) rotateX(${-lat}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "visible",
                  }}
                >
                  <Image src={it.src} alt={it.alt} fill sizes="200px" className="object-cover" draggable={false} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
