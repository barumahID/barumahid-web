"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Latar bergerak hero halaman RTO (arahan user Okt 2026). Ceritanya: butir "setoran" melambung dari bawah ke garis
// rumah di kanan, lalu rumah terisi pelan seperti saldo DP yang terkumpul. Butir hanya lewat di separuh kanan supaya
// tidak melintasi teks hero. Di layar sempit rumahnya kecil di pojok kanan bawah, di bawah tombol hero. Penuh = garis rumah menyala merah sebentar,
// lalu mulai lagi. Sengaja redup supaya teks hero tetap terbaca (di HP lebih redup lagi). Hanya beranimasi saat
// terlihat. Reduced motion: rumah setengah terisi, diam.

const CREAM = "245,242,237";
const RED = "197,59,59";

interface Drop {
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x1: number;
  y1: number;
  t: number;
  dur: number;
  r: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  age: number;
}

const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
const bez = (a: number, c: number, b: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

export default function RtoHeroMotion({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, time = 0;
    // Geometri rumah
    let S = 0, cx = 0, by = 0, left = 0, right = 0, top = 0, apex = 0, fade = 1, maxDrops = 30, wide = true;
    let level = reduce ? 0.6 : 0;
    let phase: "fill" | "full" | "drain" = "fill";
    let phaseT = 0, fillAlpha = 1, spawnIn = 0;
    const drops: Drop[] = [];
    const ripples: Ripple[] = [];

    const surfaceY = () => by - level * (by - apex);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      wide = w >= 900;
      S = wide ? Math.min(h * 0.55, w * 0.26) : Math.min(w * 0.28, 92);
      cx = w * (wide ? 0.8 : 0.82);
      by = wide ? h * 0.84 : h - 12;
      left = cx - S / 2;
      right = cx + S / 2;
      top = by - S * 0.52;
      apex = by - S * 0.98;
      fade = wide ? 1 : 0.7;
      maxDrops = wide ? 30 : 10;
      drops.length = 0;
      ripples.length = 0;
      draw();
    };

    const housePath = () => {
      ctx!.beginPath();
      ctx!.moveTo(left, by);
      ctx!.lineTo(left, top);
      ctx!.lineTo(cx, apex);
      ctx!.lineTo(right, top);
      ctx!.lineTo(right, by);
      ctx!.closePath();
    };

    const spawn = () => {
      const x0 = Math.min(w - 4, Math.max(w * 0.55, cx + (Math.random() * 2.2 - 1.3) * S));
      const y0 = h * (0.95 + Math.random() * 0.1);
      const x1 = left + S * (0.15 + Math.random() * 0.7);
      const y1 = Math.max(surfaceY(), top + S * 0.05) + Math.random() * S * 0.06;
      drops.push({
        x0,
        y0,
        x1,
        y1,
        cx: (x0 + x1) / 2 + (Math.random() - 0.5) * S * 0.3,
        cy: Math.min(y0, y1) - (wide ? h * (0.1 + Math.random() * 0.12) : S * (0.4 + Math.random() * 0.5)),
        t: 0,
        dur: 2.6 + Math.random() * 2.2,
        r: 1 + Math.random() * 1.3,
        color: Math.random() < 0.28 ? RED : CREAM,
      });
    };

    function draw() {
      const c = ctx!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      if (!S) return;

      // Garis tanah putus-putus
      c.setLineDash([3, 7]);
      c.strokeStyle = `rgba(${CREAM},${0.12 * fade})`;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(cx - S * 1.4, by + 0.5);
      c.lineTo(Math.min(w, cx + S * 0.95), by + 0.5);
      c.stroke();
      c.setLineDash([]);

      // Isi rumah (saldo DP), permukaannya bergelombang pelan
      if (level > 0.001 && fillAlpha > 0.01) {
        c.save();
        housePath();
        c.clip();
        const sy = surfaceY();
        const amp = Math.max(1.2, S * 0.008) * (phase === "fill" ? 1 : 0.4);
        const g = c.createLinearGradient(0, apex, 0, by);
        g.addColorStop(0, `rgba(${RED},${0.24 * fillAlpha * fade})`);
        g.addColorStop(1, `rgba(${RED},${0.07 * fillAlpha * fade})`);
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(left - 2, by + 2);
        for (let x = left - 2; x <= right + 2; x += 6) c.lineTo(x, sy + Math.sin(x * 0.045 + time * 2.2) * amp);
        c.lineTo(right + 2, by + 2);
        c.closePath();
        c.fill();
        c.strokeStyle = `rgba(${CREAM},${0.22 * fillAlpha * fade})`;
        c.lineWidth = 1;
        c.beginPath();
        for (let x = left - 2; x <= right + 2; x += 6) {
          const y = sy + Math.sin(x * 0.045 + time * 2.2) * amp;
          if (x === left - 2) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
        c.restore();
      }

      // Garis rumah: bayangan cetak biru tipis, lalu garis utama (menyala merah saat penuh)
      const glow = phase === "full" ? Math.sin(Math.min(1, phaseT / 1.6) * Math.PI) : 0;
      const o = S * 0.07;
      c.lineJoin = "round";
      c.strokeStyle = `rgba(${CREAM},${0.06 * fade})`;
      c.lineWidth = 1;
      c.save();
      c.translate(S * 0.035, -S * 0.035);
      housePath();
      c.stroke();
      c.restore();
      c.strokeStyle = glow > 0 ? `rgba(${RED},${(0.25 + 0.55 * glow) * fade})` : `rgba(${CREAM},${0.24 * fade})`;
      c.shadowColor = `rgba(${RED},${0.8 * glow})`;
      c.shadowBlur = 22 * glow;
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(left, by);
      c.lineTo(left, top);
      c.moveTo(left - o, top + o * 0.62);
      c.lineTo(cx, apex);
      c.lineTo(right + o, top + o * 0.62);
      c.moveTo(right, top);
      c.lineTo(right, by);
      c.stroke();
      c.shadowBlur = 0;
      // Pintu dan jendela
      c.strokeStyle = `rgba(${CREAM},${0.16 * fade})`;
      c.lineWidth = 1.2;
      c.strokeRect(cx - S * 0.2, by - S * 0.27, S * 0.14, S * 0.27);
      c.strokeRect(cx + S * 0.06, top + S * 0.12, S * 0.16, S * 0.13);

      // Butir setoran dengan ekor pendek
      for (const d of drops) {
        const te = ease(Math.min(1, d.t));
        const tt = ease(Math.max(0, Math.min(1, d.t) - 0.07));
        const x = bez(d.x0, d.cx, d.x1, te);
        const y = bez(d.y0, d.cy, d.y1, te);
        const a = Math.min(1, d.t * 4) * fade;
        c.strokeStyle = `rgba(${d.color},${0.22 * a})`;
        c.lineWidth = d.r * 1.4;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(bez(d.x0, d.cx, d.x1, tt), bez(d.y0, d.cy, d.y1, tt));
        c.lineTo(x, y);
        c.stroke();
        c.fillStyle = `rgba(${d.color},${0.75 * a})`;
        c.beginPath();
        c.arc(x, y, d.r, 0, Math.PI * 2);
        c.fill();
      }

      // Riak kecil saat butir masuk
      for (const rp of ripples) {
        const k = rp.age / 0.7;
        c.strokeStyle = `rgba(${CREAM},${0.35 * (1 - k) * fade})`;
        c.lineWidth = 1;
        c.beginPath();
        const rx = 2 + k * Math.min(16, S * 0.12);
        c.ellipse(rp.x, rp.y, rx, rx * 0.32, 0, 0, Math.PI * 2);
        c.stroke();
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      time += dt;

      if (phase === "fill") {
        spawnIn -= dt;
        if (spawnIn <= 0 && drops.length < maxDrops) {
          spawn();
          spawnIn = 0.1 + Math.random() * 0.16;
        }
      }
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.t += dt / d.dur;
        if (d.t >= 1) {
          drops.splice(i, 1);
          if (phase === "fill") {
            ripples.push({ x: d.x1, y: surfaceY(), age: 0 });
            level = Math.min(1, level + (wide ? 1 / 70 : 1 / 40));
            if (level >= 1) {
              phase = "full";
              phaseT = 0;
            }
          }
        }
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].age += dt;
        if (ripples[i].age >= 0.7) ripples.splice(i, 1);
      }
      if (phase === "full") {
        phaseT += dt;
        if (phaseT >= 1.6) {
          phase = "drain";
          phaseT = 0;
        }
      } else if (phase === "drain") {
        phaseT += dt;
        fillAlpha = Math.max(0, 1 - phaseT / 1.1);
        if (phaseT >= 1.1) {
          phase = "fill";
          level = 0;
          fillAlpha = 1;
        }
      }
      draw();
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

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
