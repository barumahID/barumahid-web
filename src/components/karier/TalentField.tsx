"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Latar hero halaman Karier (referensi visual hero "Social Media Studio" dari user, dibuat ulang dengan canvas).
// Kerumunan orang dilihat dari atas, abu-abu, berjalan pelan. Kursor memancarkan cincin sinyal merah; orang yang
// terkena cincin berubah warna (warna segmen barumahID) lalu pudar lagi. Klik = cincin besar. Tanpa kursor (HP),
// cincin muncul sendiri sesekali. Hanya beranimasi saat terlihat. Reduced motion: kerumunan diam, tanpa cincin.

interface Person {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  lit: number;
  color: string;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  max: number;
  speed: number;
}

const PALETTE = ["197,59,59", "226,112,112", "194,94,32", "74,170,112", "88,150,222", "245,242,237"];
const RED = "197,59,59";

export default function TalentField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return;

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, gap = 46;
    let people: Person[] = [];
    const rings: Ring[] = [];
    const pointer = { x: 0, y: 0, inside: false, emit: 0, idle: 0 };

    const build = () => {
      gap = w < 640 ? 40 : 46;
      people = [];
      for (let y = gap * 0.5; y < h + gap; y += gap) {
        for (let x = gap * 0.5; x < w + gap; x += gap) {
          const a = Math.random() * Math.PI * 2;
          const sp = 3 + Math.random() * 6;
          people.push({
            x: x + (Math.random() - 0.5) * gap * 0.7,
            y: y + (Math.random() - 0.5) * gap * 0.7,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            rot: a,
            lit: 0,
            color: RED,
          });
        }
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      build();
      draw();
    };

    // Orang dari atas: bahu (elips) searah jalan + kepala (lingkaran) sedikit di depan
    const body = (p: Person) => {
      const s = gap / 46;
      ctx.moveTo(p.x + 7.6 * s, p.y);
      ctx.ellipse(p.x, p.y, 5 * s, 7.6 * s, p.rot, 0, Math.PI * 2);
    };
    const head = (p: Person) => {
      const s = gap / 46;
      const hx = p.x + Math.cos(p.rot) * 1.8 * s;
      const hy = p.y + Math.sin(p.rot) * 1.8 * s;
      ctx.moveTo(hx + 3.6 * s, hy);
      ctx.arc(hx, hy, 3.6 * s, 0, Math.PI * 2);
    };

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      // Orang yang belum terjangkau: satu path abu-abu
      ctx!.beginPath();
      for (const p of people) if (p.lit < 0.02) body(p);
      ctx!.fillStyle = "rgba(255,255,255,0.13)";
      ctx!.fill();
      ctx!.beginPath();
      for (const p of people) if (p.lit < 0.02) head(p);
      ctx!.fillStyle = "rgba(255,255,255,0.22)";
      ctx!.fill();
      // Orang yang terjangkau sinyal: berwarna, pudar pelan
      for (const p of people) {
        if (p.lit < 0.02) continue;
        const a = 0.13 + p.lit * 0.75;
        ctx!.beginPath();
        body(p);
        ctx!.fillStyle = `rgba(${p.color},${a})`;
        ctx!.fill();
        ctx!.beginPath();
        head(p);
        ctx!.fillStyle = `rgba(${p.color},${Math.min(1, a + 0.15)})`;
        ctx!.fill();
      }
      // Cincin sinyal
      for (const r of rings) {
        const k = 1 - r.r / r.max;
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${RED},${0.55 * k})`;
        ctx!.lineWidth = 2 + 10 * k;
        ctx!.stroke();
      }
      // Penanda kursor
      if (pointer.inside && !reduce) {
        ctx!.beginPath();
        ctx!.arc(pointer.x, pointer.y, 22, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${RED},0.85)`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${RED},0.95)`;
        ctx!.fill();
      }
    }

    const emit = (x: number, y: number, max: number, speed = 240) => rings.push({ x, y, r: 0, max, speed });

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      // Orang berjalan pelan, keluar tepi = masuk dari sisi seberang
      for (const p of people) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -gap) p.x += w + gap * 2;
        else if (p.x > w + gap) p.x -= w + gap * 2;
        if (p.y < -gap) p.y += h + gap * 2;
        else if (p.y > h + gap) p.y -= h + gap * 2;
        if (p.lit > 0) p.lit = Math.max(0, p.lit - dt * 0.28);
      }
      // Cincin dari kursor; tanpa kursor, cincin muncul sendiri sesekali
      if (pointer.inside) {
        pointer.emit -= dt;
        if (pointer.emit <= 0) {
          emit(pointer.x, pointer.y, 200);
          pointer.emit = 0.9;
        }
      } else {
        pointer.idle -= dt;
        if (pointer.idle <= 0) {
          const p = people[Math.floor(Math.random() * people.length)];
          if (p) emit(p.x, p.y, 240);
          pointer.idle = 2.4;
        }
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        const prev = r.r;
        r.r += r.speed * dt;
        for (const p of people) {
          const d = Math.hypot(p.x - r.x, p.y - r.y);
          if (d >= prev - 4 && d <= r.r + 4 && p.lit < 0.6) {
            p.lit = 1;
            p.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
          }
        }
        if (r.r >= r.max) rings.splice(i, 1);
      }
      draw();
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.idle = 1.2;
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      emit(p.x, p.y, Math.max(w, h) * 0.6, 420);
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
    if (!reduce) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
