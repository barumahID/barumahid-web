"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Latar garis cahaya (referensi visual "Light Streak BG" dari user, dibuat ulang dengan canvas, warna barumahID).
// Garis melengkung (bezier) datang dari kiri dan kanan lalu menyatu di satu titik fokus (inti orbit Astro Mahaksa).
// Kilatan cahaya berjalan di sepanjang garis, garis bergeser pelan, kursor memberi parallax, tepi diberi vinyet.
// Hanya beranimasi saat terlihat. Reduced motion: digambar sekali, diam.

interface Streak {
  side: 1 | -1;
  y0: number;
  bend: number;
  color: string;
  speed: number;
  phase: number;
  width: number;
}

const COLORS = ["197,59,59", "245,242,237", "226,112,112", "197,59,59", "245,242,237"];

export default function LightStreaks({ count = 16, className = "" }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let seed = 23;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const streaks: Streak[] = Array.from({ length: count }, (_, i) => ({
      side: i % 5 < 3 ? -1 : 1,
      y0: rnd(),
      bend: (rnd() - 0.5) * 0.5,
      color: COLORS[i % COLORS.length],
      speed: 0.05 + rnd() * 0.07,
      phase: rnd(),
      width: 0.6 + rnd() * 1.1,
    }));

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, time = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (reduce) draw();
    };

    // Titik fokus mengikuti posisi orbit: kanan di desktop (kolom 7 dari 12), tengah di HP
    const focal = () => (w >= 1024 ? { x: w * 0.66, y: h * 0.4 } : { x: w * 0.5, y: h * 0.52 });

    const curve = (s: Streak) => {
      const f = focal();
      const drift = Math.sin(time * 0.25 + s.phase * 6) * h * 0.03;
      const sx = s.side < 0 ? -w * 0.05 : w * 1.05;
      const sy = s.y0 * h + drift;
      const px = mouse.x * 18 * (s.side < 0 ? 1 : -1);
      const py = mouse.y * 14;
      return [
        { x: sx, y: sy },
        { x: sx + (f.x - sx) * 0.38 + px, y: sy + h * s.bend + py },
        { x: f.x - (f.x - sx) * 0.22 + px * 0.5, y: f.y + (sy - f.y) * 0.18 + py * 0.5 },
        { x: f.x, y: f.y },
      ];
    };

    const at = (p: { x: number; y: number }[], t: number) => {
      const u = 1 - t;
      return {
        x: u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x,
        y: u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y,
      };
    };

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineCap = "round";
      for (const s of streaks) {
        const p = curve(s);
        // Garis: lapisan lebar redup (cahaya) + garis tipis
        for (const [lw, a] of [
          [s.width * 6, 0.025],
          [s.width, 0.12],
        ] as const) {
          ctx!.beginPath();
          ctx!.moveTo(p[0].x, p[0].y);
          ctx!.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
          ctx!.strokeStyle = `rgba(${s.color},${a})`;
          ctx!.lineWidth = lw;
          ctx!.stroke();
        }
        if (reduce) continue;
        // Kilatan yang berjalan menuju titik fokus
        const head = (time * s.speed + s.phase) % 1;
        const tail = 0.12;
        const N = 14;
        for (let k = 0; k < N; k++) {
          const t0 = head - (tail * k) / N;
          const t1 = head - (tail * (k + 1)) / N;
          if (t1 < 0) break;
          const a0 = at(p, t0), a1 = at(p, t1);
          const fade = 1 - k / N;
          ctx!.beginPath();
          ctx!.moveTo(a0.x, a0.y);
          ctx!.lineTo(a1.x, a1.y);
          ctx!.strokeStyle = `rgba(${s.color},${0.55 * fade * fade})`;
          ctx!.lineWidth = s.width * (1.6 + fade);
          ctx!.stroke();
        }
        const hp = at(p, head);
        const g = ctx!.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 10);
        g.addColorStop(0, `rgba(${s.color},0.55)`);
        g.addColorStop(1, `rgba(${s.color},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(hp.x - 10, hp.y - 10, 20, 20);
      }
      // Vinyet tepi
      const v = ctx!.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, "rgba(11,11,15,0)");
      v.addColorStop(1, "rgba(11,11,15,0.75)");
      ctx!.fillStyle = v;
      ctx!.fillRect(0, 0, w, h);
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      time += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      mouse.tx = inside ? ((e.clientX - r.left) / r.width - 0.5) * 2 : 0;
      mouse.ty = inside ? ((e.clientY - r.top) / r.height - 0.5) * 2 : 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      if (reduce) return;
      if (e.isIntersecting && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [count, reduce]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
