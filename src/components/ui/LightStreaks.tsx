"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Latar garis cahaya yang halus, pengganti grid (referensi visual "Light Streak BG", dibuat ulang dengan canvas).
// Garis diagonal tipis sejajar seperti grid, sesekali kilatan cahaya pendek lewat pelan di salah satu garis.
// Sengaja redup supaya tidak menabrak isi di atasnya (arahan user). Hanya beranimasi saat terlihat.
// Reduced motion: garisnya saja, diam.

const ANGLE = -0.42; // radian, miring naik ke kanan
const GAP = 64;
const COLORS = ["245,242,237", "245,242,237", "197,59,59"];

interface Flare {
  line: number;
  s: number;
  speed: number;
  len: number;
  color: string;
  wait: number;
}

export default function LightStreaks({ flares = 6, className = "" }: { flares?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const d = { x: Math.cos(ANGLE), y: Math.sin(ANGLE) };
    const n = { x: -d.y, y: d.x };
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0;
    let oMin = 0, sMin = 0, sMax = 0, lines = 0;

    const spawn = (f: Flare, first = false) => {
      f.line = Math.floor(Math.random() * lines);
      f.len = 110 + Math.random() * 120;
      f.speed = 70 + Math.random() * 80;
      f.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      f.s = first ? sMin + Math.random() * (sMax - sMin) : sMin - f.len;
      f.wait = first ? 0 : Math.random() * 2.5;
    };
    const list: Flare[] = Array.from({ length: flares }, () => ({ line: 0, s: 0, speed: 0, len: 0, color: COLORS[0], wait: 0 }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // Rentang garis yang menutup seluruh kanvas (proyeksi keempat sudut ke arah garis dan normalnya)
      const corners = [[0, 0], [w, 0], [0, h], [w, h]];
      const on = corners.map(([x, y]) => x * n.x + y * n.y);
      const od = corners.map(([x, y]) => x * d.x + y * d.y);
      oMin = Math.min(...on);
      lines = Math.ceil((Math.max(...on) - oMin) / GAP) + 1;
      sMin = Math.min(...od);
      sMax = Math.max(...od);
      list.forEach((f) => spawn(f, true));
      draw();
    };

    const point = (line: number, s: number) => {
      const o = oMin + line * GAP;
      return { x: n.x * o + d.x * s, y: n.y * o + d.y * s };
    };

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = "rgba(255,255,255,0.035)";
      ctx!.beginPath();
      for (let k = 0; k < lines; k++) {
        const a = point(k, sMin);
        const b = point(k, sMax);
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
      }
      ctx!.stroke();
      if (reduce) return;
      // Kilatan: gradasi dari ekor (transparan) ke kepala, redup
      for (const f of list) {
        if (f.wait > 0) continue;
        const head = point(f.line, f.s);
        const tail = point(f.line, f.s - f.len);
        const g = ctx!.createLinearGradient(tail.x, tail.y, head.x, head.y);
        g.addColorStop(0, `rgba(${f.color},0)`);
        g.addColorStop(1, `rgba(${f.color},0.28)`);
        ctx!.strokeStyle = g;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(tail.x, tail.y);
        ctx!.lineTo(head.x, head.y);
        ctx!.stroke();
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      for (const f of list) {
        if (f.wait > 0) {
          f.wait -= dt;
          continue;
        }
        f.s += f.speed * dt;
        if (f.s - f.len > sMax) spawn(f);
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
  }, [flares, reduce]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
