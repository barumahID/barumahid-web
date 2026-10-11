"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ProjectCity } from "@/data/projects";

// Globe titik (stippled) untuk jejak proyek di /layanan/contech. Arahan user: peta bisa di-zoom seperti
// Google Earth, referensi visual "AtomicGlobe" (Framer), dibuat ulang sendiri dengan canvas 2D + proyeksi ortografis.
// - Daratan: titik dari public/data/globe-dots.json (scripts/gen-globe-dots.mjs). Indonesia selalu digambar
//   dengan titik rapat dan lebih terang supaya jadi fokus; negara lain lebih jarang dan redup.
// - Geser untuk memutar (dengan inersia). Zoom: tombol +/−, Ctrl/⌘ + scroll, atau dua jari di HP.
// - Titik merah = kota proyek, cincin putih putus-putus = Base barumahID dan VO. Nama muncul saat disorot/diketuk.

export interface GlobeOffice {
  label: string;
  lat: number;
  lon: number;
}

interface Marker {
  id: string;
  title: string;
  sub: string;
  lat: number;
  lon: number;
  office: boolean;
}

interface Points {
  sinLat: Float32Array;
  cosLat: Float32Array;
  sinLon: Float32Array;
  cosLon: Float32Array;
  n: number;
}

const RAD = Math.PI / 180;
const HOME = { lambda: 113, phi: -2, zoom: 1.25 };
const MIN_ZOOM = 0.85;
const MAX_ZOOM = 7;

function toPoints(flat: number[]): Points {
  const n = flat.length / 2;
  const p: Points = { sinLat: new Float32Array(n), cosLat: new Float32Array(n), sinLon: new Float32Array(n), cosLon: new Float32Array(n), n };
  for (let i = 0; i < n; i++) {
    const lat = flat[i * 2] / 100;
    const lon = flat[i * 2 + 1] / 100;
    p.sinLat[i] = Math.sin(lat * RAD);
    p.cosLat[i] = Math.cos(lat * RAD);
    p.sinLon[i] = Math.sin(lon * RAD);
    p.cosLon[i] = Math.cos(lon * RAD);
  }
  return p;
}

export default function ProjectGlobe({ cities, offices }: { cities: ProjectCity[]; offices: GlobeOffice[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<Marker | null>(null);
  const [hint, setHint] = useState(false);

  // Semua keadaan globe di ref supaya animasi tidak memicu render React tiap frame
  const s = useRef({
    lambda: HOME.lambda,
    phi: HOME.phi,
    zoom: 0.95,
    targetZoom: HOME.zoom,
    vx: 0,
    vy: 0,
    dragging: false,
    interacted: false,
    global: null as Points | null,
    detail: null as Points | null,
    screen: [] as { m: Marker; x: number; y: number }[],
    hoverId: "",
    pointers: new Map<number, { x: number; y: number }>(),
    pinchDist: 0,
    last: { x: 0, y: 0 },
    homing: false,
  });

  const markers: Marker[] = [
    ...cities.map((c) => ({
      id: c.id,
      title: c.name,
      sub: c.province,
      lat: c.lat,
      lon: c.lon,
      office: false,
    })),
    ...offices.map((o) => ({ id: `office-${o.label}`, title: o.label, sub: "Kantor barumahID", lat: o.lat, lon: o.lon, office: true })),
  ];
  const markersRef = useRef(markers);
  useEffect(() => {
    markersRef.current = markers;
  });

  const zoomBy = useCallback((f: number) => {
    const st = s.current;
    st.interacted = true;
    st.targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, st.targetZoom * f));
  }, []);

  const goHome = useCallback(() => {
    const st = s.current;
    st.homing = true;
    st.targetZoom = HOME.zoom;
    st.vx = st.vy = 0;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const st = s.current;
    let raf = 0;
    let visible = false;
    let loaded = false;
    let w = 0, h = 0, dpr = 1;
    let lastFrame = 0;
    const start = performance.now();

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const load = () => {
      if (loaded) return;
      loaded = true;
      fetch("/data/globe-dots.json")
        .then((r) => r.json())
        .then((d: { global: number[]; detail: number[] }) => {
          st.global = toPoints(d.global);
          st.detail = toPoints(d.detail);
        })
        .catch(() => {});
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // Gerak globe pelan, 30 fps sudah cukup halus dan jauh lebih hemat (terutama di HP)
      if (now - lastFrame < 32) return;
      lastFrame = now;

      // Gerak: ayun pelan di sekitar Indonesia sampai pengguna berinteraksi, inersia setelah digeser
      if (st.homing) {
        st.lambda += (HOME.lambda - st.lambda) * 0.08;
        st.phi += (HOME.phi - st.phi) * 0.08;
        if (Math.abs(HOME.lambda - st.lambda) < 0.05 && Math.abs(HOME.phi - st.phi) < 0.05) {
          st.homing = false;
          st.interacted = false;
        }
      } else if (!st.interacted && !reduce) {
        st.lambda = HOME.lambda + Math.sin((now - start) / 5200) * 16;
      } else if (!st.dragging && (Math.abs(st.vx) > 0.01 || Math.abs(st.vy) > 0.01)) {
        st.lambda -= (st.vx * 0.25) / st.zoom;
        st.phi = Math.max(-75, Math.min(75, st.phi + (st.vy * 0.25) / st.zoom));
        st.vx *= 0.92;
        st.vy *= 0.92;
      }
      st.zoom += (st.targetZoom - st.zoom) * 0.12;

      const W = w * dpr, H = h * dpr;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.42 * st.zoom;

      // Bola: gelap dengan cahaya tepi tipis
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      g.addColorStop(0, "#232323");
      g.addColorStop(1, "#121212");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      const sinP = Math.sin(st.phi * RAD), cosP = Math.cos(st.phi * RAD);
      const sinL = Math.sin(st.lambda * RAD), cosL = Math.cos(st.lambda * RAD);
      const size = Math.max(1.1, 1.25 * Math.sqrt(st.zoom)) * dpr;
      // Titik Indonesia (grid 0,2 derajat): ukurannya mengikuti jarak antar titik supaya tidak menyatu
      const gridPx = R * 0.2 * RAD;
      const detailSize = Math.max(0.7 * dpr, Math.min(size, gridPx * 0.62));
      const backAlpha = st.zoom < 1.6 ? 0.07 : 0;

      const plot = (p: Points, front: string, dot: number) => {
        ctx.fillStyle = front;
        const half = dot / 2;
        for (let i = 0; i < p.n; i++) {
          const cosDl = p.cosLon[i] * cosL + p.sinLon[i] * sinL;
          const sinDl = p.sinLon[i] * cosL - p.cosLon[i] * sinL;
          const cosc = sinP * p.sinLat[i] + cosP * p.cosLat[i] * cosDl;
          if (cosc <= 0) continue;
          const x = cx + R * p.cosLat[i] * sinDl;
          const y = cy - R * (cosP * p.sinLat[i] - sinP * p.cosLat[i] * cosDl);
          if (x < -4 || y < -4 || x > W + 4 || y > H + 4) continue;
          ctx.fillRect(x - half, y - half, dot, dot);
        }
      };
      const plotBack = (p: Points) => {
        ctx.fillStyle = `rgba(255,255,255,${backAlpha})`;
        for (let i = 0; i < p.n; i++) {
          const cosDl = p.cosLon[i] * cosL + p.sinLon[i] * sinL;
          const sinDl = p.sinLon[i] * cosL - p.cosLon[i] * sinL;
          const cosc = sinP * p.sinLat[i] + cosP * p.cosLat[i] * cosDl;
          if (cosc > 0) continue;
          const x = cx + R * p.cosLat[i] * sinDl;
          const y = cy - R * (cosP * p.sinLat[i] - sinP * p.cosLat[i] * cosDl);
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      };

      if (st.global) {
        if (backAlpha > 0) plotBack(st.global);
        plot(st.global, "rgba(255,255,255,0.4)", size);
      }
      if (st.detail) plot(st.detail, "rgba(255,255,255,0.82)", detailSize);

      // Penanda
      const screen: { m: Marker; x: number; y: number }[] = [];
      const t = (now - start) / 1000;
      for (const m of markersRef.current) {
        const la = m.lat * RAD, lo = m.lon * RAD;
        const dl = lo - st.lambda * RAD;
        const cosc = sinP * Math.sin(la) + cosP * Math.cos(la) * Math.cos(dl);
        if (cosc <= 0.02) continue;
        const x = cx + R * Math.cos(la) * Math.sin(dl);
        const y = cy - R * (cosP * Math.sin(la) - sinP * Math.cos(la) * Math.cos(dl));
        screen.push({ m, x: x / dpr, y: y / dpr });
        const k = Math.min(1.6, Math.sqrt(st.zoom)) * dpr;
        if (m.office) {
          ctx.setLineDash([3 * dpr, 2.5 * dpr]);
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.lineWidth = 1.6 * dpr;
          ctx.beginPath();
          ctx.arc(x, y, 8 * k, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          if (!reduce) {
            const ph = (t * 0.8 + (m.lat + m.lon) * 0.13) % 1;
            ctx.strokeStyle = `rgba(226,112,112,${0.6 * (1 - ph)})`;
            ctx.lineWidth = 1.2 * dpr;
            ctx.beginPath();
            ctx.arc(x, y, (4 + ph * 10) * k, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.fillStyle = st.hoverId === m.id ? "#ffffff" : "#C53B3B";
          ctx.beginPath();
          ctx.arc(x, y, 3.6 * k, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#C53B3B";
          ctx.lineWidth = 1.5 * dpr;
          ctx.stroke();
        }
      }
      st.screen = screen;

      // Tooltip ikut posisi penanda yang sedang disorot
      const tip = tipRef.current;
      if (tip) {
        const hit = screen.find((p) => p.m.id === st.hoverId);
        if (hit) {
          tip.style.opacity = "1";
          tip.style.transform = `translate(${hit.x}px, ${hit.y - 14}px) translate(-50%, -100%)`;
        } else {
          tip.style.opacity = "0";
        }
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) {
          load();
          if (!raf) raf = requestAnimationFrame(draw);
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(wrap);

    // Zoom dengan Ctrl/⌘ + scroll (scroll biasa tetap menggulir halaman, muncul petunjuk)
    let hintTimer: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        st.interacted = true;
        st.targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, st.targetZoom * Math.exp(-e.deltaY * 0.0025)));
      } else {
        setHint(true);
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => setHint(false), 1400);
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("wheel", onWheel);
      clearTimeout(hintTimer);
    };
  }, [reduce]);

  const pick = (x: number, y: number) => {
    let best: { m: Marker; d: number } | null = null;
    for (const p of s.current.screen) {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < 16 && (!best || d < best.d)) best = { m: p.m, d };
    }
    return best?.m ?? null;
  };

  const local = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const st = s.current;
    const p = local(e);
    st.pointers.set(e.pointerId, p);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (st.pointers.size === 2) {
      const [a, b] = Array.from(st.pointers.values());
      st.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    st.dragging = true;
    st.homing = false;
    st.last = p;
    st.vx = st.vy = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    const p = local(e);
    if (st.dragging && st.pointers.has(e.pointerId)) {
      st.pointers.set(e.pointerId, p);
      if (st.pointers.size === 2) {
        const [a, b] = Array.from(st.pointers.values());
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (st.pinchDist > 0) st.targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, st.targetZoom * (d / st.pinchDist)));
        st.pinchDist = d;
        st.interacted = true;
        return;
      }
      const dx = p.x - st.last.x;
      const dy = p.y - st.last.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.5) st.interacted = true;
      st.lambda -= (dx * 0.25) / st.zoom;
      st.phi = Math.max(-75, Math.min(75, st.phi + (dy * 0.25) / st.zoom));
      st.vx = dx;
      st.vy = dy;
      st.last = p;
      return;
    }
    const m = pick(p.x, p.y);
    if ((m?.id ?? "") !== st.hoverId) {
      st.hoverId = m?.id ?? "";
      setHover(m);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const st = s.current;
    st.pointers.delete(e.pointerId);
    if (st.pointers.size < 2) st.pinchDist = 0;
    if (st.pointers.size === 0) {
      st.dragging = false;
      // Ketukan tanpa geser: pilih penanda (untuk HP)
      const p = local(e);
      const m = pick(p.x, p.y);
      st.hoverId = m?.id ?? "";
      setHover(m);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_80%_80%_at_50%_45%,#1b1b1b,#0d0d0d)]">
      <div ref={wrapRef} className="relative h-[420px] md:h-[560px]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
          role="img"
          aria-label={`Globe interaktif dengan ${cities.length} kota proyek barumahID, serta Base barumahID dan VO`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={() => {
            if (!s.current.dragging) {
              s.current.hoverId = "";
              setHover(null);
            }
          }}
          onDoubleClick={() => zoomBy(1.8)}
        />
        {/* Nama kota/kantor saat disorot */}
        <div ref={tipRef} className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150" aria-live="polite">
          {hover && (
            <div className="whitespace-nowrap rounded-xl bg-white px-3 py-2 text-center shadow-lg">
              <p className="text-[13px] font-extrabold text-brand-dark">{hover.title}</p>
              <p className="text-[11px] font-medium text-brand-gray">{hover.sub}</p>
            </div>
          )}
        </div>
        {/* Petunjuk zoom (muncul saat scroll biasa di atas globe) */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-[14px] font-semibold text-white transition-opacity duration-300 ${
            hint ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          Tekan Ctrl (atau ⌘) sambil scroll untuk zoom
        </div>
      </div>

      {/* Keterangan dan kontrol */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-white/55">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-red" aria-hidden="true" />
            Lokasi proyek atau kota klien
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-white" aria-hidden="true" />
            Base &amp; VO barumahID
          </span>
          <span className="hidden md:inline">Geser untuk memutar, Ctrl + scroll untuk zoom</span>
          <span className="md:hidden">Geser untuk memutar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Perbesar"
            onClick={() => zoomBy(1.6)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[18px] font-bold text-white/80 transition-colors hover:border-white/40 hover:text-white"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Perkecil"
            onClick={() => zoomBy(1 / 1.6)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[18px] font-bold text-white/80 transition-colors hover:border-white/40 hover:text-white"
          >
            −
          </button>
          <button
            type="button"
            onClick={goHome}
            className="ml-1 rounded-full border border-white/15 px-3.5 py-2 text-[12px] font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
          >
            Fokus Indonesia
          </button>
        </div>
      </div>
    </div>
  );
}
