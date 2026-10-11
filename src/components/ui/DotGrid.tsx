"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Latar titik interaktif (referensi visual "Dot Grid Background" dari user, dibuat ulang dengan canvas).
// Titik di dekat kursor membesar, menyala ke arah merah barumahID, dan berputar kecil di bidang 3D acak seperti
// orbit atom. Saat kursor pergi, putarannya melambat dan titik kembali ke tempatnya (ease-out).
// Animasi hanya berjalan saat ada interaksi dan bagian ini terlihat; selebihnya gambar diam (hemat baterai).
// Reduced motion dan layar sentuh: titik diam tanpa interaksi.

interface Dot {
  x: number;
  y: number;
  f: number;
  phase: number;
  tilt: number;
  spin: number;
  orbit: number;
}

export default function DotGrid({
  spacing = 26,
  dot = 1.3,
  radius = 170,
  hoverScale = 2.4,
  color = "245,242,237",
  accent = "226,112,112",
  className = "",
}: {
  spacing?: number;
  dot?: number;
  radius?: number;
  hoverScale?: number;
  color?: string;
  accent?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let dots: Dot[] = [];
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let time = 0;
    let last = 0;
    const cursor = { x: -9999, y: -9999, inside: false };

    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const build = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      dots = [];
      const cols = Math.ceil(r.width / spacing) + 1;
      const rows = Math.ceil(r.height / spacing) + 1;
      const ox = (r.width - (cols - 1) * spacing) / 2;
      const oy = (r.height - (rows - 1) * spacing) / 2;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++)
          dots.push({
            x: ox + i * spacing,
            y: oy + j * spacing,
            f: 0,
            phase: rnd() * Math.PI * 2,
            tilt: rnd() * Math.PI,
            spin: 0.9 + rnd() * 1.4,
            orbit: spacing * (0.35 + rnd() * 0.55),
          });
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        let x = d.x, y = d.y;
        if (d.f > 0.001) {
          const a = d.phase + time * d.spin;
          x += Math.cos(a) * d.orbit * d.f;
          y += Math.sin(a) * Math.cos(d.tilt) * d.orbit * d.f;
        }
        const size = dot * (1 + d.f * (hoverScale - 1));
        const alpha = 0.16 + d.f * 0.75;
        ctx.fillStyle = d.f > 0.35 ? `rgba(${accent},${alpha})` : `rgba(${color},${alpha})`;
        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, size * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      time += dt;
      let active = false;
      for (const d of dots) {
        let target = 0;
        if (cursor.inside) {
          const dist = Math.hypot(d.x - cursor.x, d.y - cursor.y);
          if (dist < radius) {
            const t = 1 - dist / radius;
            target = t * t * (3 - 2 * t);
          }
        }
        // Masuk cepat, keluar pelan (ease-out)
        d.f += (target - d.f) * (target > d.f ? 0.18 : 0.05);
        if (d.f > 0.002 || target > 0) active = true;
      }
      draw();
      if (active && visible) raf = requestAnimationFrame(step);
      else {
        raf = 0;
        last = 0;
      }
    };

    const wake = () => {
      if (!raf && visible && !reduce) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x >= -radius && y >= -radius && x <= r.width + radius && y <= r.height + radius;
      cursor.x = x;
      cursor.y = y;
      if (inside || cursor.inside) {
        cursor.inside = inside;
        wake();
      }
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    io.observe(canvas);
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [spacing, dot, radius, hoverScale, color, accent, reduce]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
