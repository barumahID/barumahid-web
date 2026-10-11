"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { DIVISIONS, type DivisionId, type Unit } from "@/data/semesta";
import { useT } from "@/i18n/LangProvider";

// Semesta Mahaksa: inti PT berupa bola partikel bercahaya (terinspirasi "Selene Particle Moon") dengan simbol PT,
// dikelilingi tiga cincin orbit miring, satu per divisi (INDITEK, BLUPRIM, MAHAKSA), seperti orbit atom.
// Unit usaha berupa logo yang bergerak di cincinnya, tersambung ke inti lewat garis cahaya berisi partikel
// mengalir (terinspirasi "SphereNetwork"). Dibuat ulang sendiri dengan canvas 2D + DOM, warna barumahID.
// - Arahan user: logo saja, sedikit tulisan. Nama dan progres muncul saat disorot, detail di panel samping.
// - Saat pertama terlihat: partikel berkumpul jadi bola dan orbit membesar (intro sinematik).
// - Berputar pelan, bisa digeser (inersia), kursor memberi parallax, berhenti saat logo disorot.
// - Hanya berjalan saat terlihat. Reduced motion: posisi diam, tanpa partikel mengalir.

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const MOON_POINTS = 1100;
const R_MOON = 0.27;
const DEG = Math.PI / 180;

// Bidang orbit tiap divisi: jari-jari, kemiringan, arah, dan kecepatan unit di cincinnya
const RINGS: Record<DivisionId, { r: number; incl: number; az: number; speed: number; offset: number }> = {
  mahaksa: { r: 0.62, incl: 14 * DEG, az: 0, speed: 0.1, offset: 0.4 },
  bluprim: { r: 0.98, incl: -24 * DEG, az: 35 * DEG, speed: 0.06, offset: 1.2 },
  inditek: { r: 0.82, incl: 58 * DEG, az: -50 * DEG, speed: 0.08, offset: 2.4 },
};

const COLOR = Object.fromEntries(DIVISIONS.map((d) => [d.id, d.color])) as Record<DivisionId, string>;

function easeOut(p: number) {
  return 1 - Math.pow(1 - p, 3);
}

// Titik di cincin: lingkaran di bidang xz, dimiringkan (sumbu X) lalu diputar arahnya (sumbu Y)
function ringPoint(div: DivisionId, th: number) {
  const g = RINGS[div];
  const x = g.r * Math.cos(th);
  const z0 = g.r * Math.sin(th);
  const y = -z0 * Math.sin(g.incl);
  const z1 = z0 * Math.cos(g.incl);
  return { x: x * Math.cos(g.az) + z1 * Math.sin(g.az), y, z: -x * Math.sin(g.az) + z1 * Math.cos(g.az) };
}

export default function SemestaOrbit({
  units,
  core,
  selected,
  onSelect,
}: {
  units: Unit[];
  core: string;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const t = useT();
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const st = useRef({ yaw: 0.5, vyaw: 0, dragging: false, lastX: 0, hover: "", selected, mx: 0, my: 0, intro: 0, orbit: 0 });

  useEffect(() => {
    st.current.selected = selected;
  }, [selected]);

  // Sudut awal tiap unit di cincin divisinya (merata)
  const angles = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of DIVISIONS) {
      const list = units.filter((u) => u.division === d.id);
      list.forEach((u, i) => m.set(u.id, RINGS[d.id].offset + (i / list.length) * Math.PI * 2));
    }
    return m;
  }, [units]);

  // Titik bola partikel (spiral Fibonacci) + posisi acak awal untuk animasi berkumpul
  const moon = useMemo(() => {
    const pts = new Float32Array(MOON_POINTS * 6);
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < MOON_POINTS; i++) {
      const y = 1 - ((i + 0.5) / MOON_POINTS) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * GOLDEN;
      pts[i * 6] = Math.cos(th) * r;
      pts[i * 6 + 1] = y;
      pts[i * 6 + 2] = Math.sin(th) * r;
      const a = rnd() * Math.PI * 2, b = Math.acos(2 * rnd() - 1), d = 2.2 + rnd() * 2.5;
      pts[i * 6 + 3] = d * Math.sin(b) * Math.cos(a);
      pts[i * 6 + 4] = d * Math.cos(b);
      pts[i * 6 + 5] = d * Math.sin(b) * Math.sin(a);
    }
    return pts;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;
    const s = st.current;
    if (reduce) s.intro = 1;
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    let last = 0;
    let time = 0;

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

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!reduce) time += dt;
      if (s.intro < 1) s.intro = Math.min(1, s.intro + dt / 1.8);
      const pIntro = easeOut(s.intro);

      // Putaran: sendiri pelan, inersia setelah digeser, berhenti saat logo disorot
      const paused = !!s.hover;
      if (!s.dragging) {
        if (Math.abs(s.vyaw) > 0.0002) {
          s.yaw += s.vyaw;
          s.vyaw *= 0.94;
        } else if (!reduce && !paused) {
          s.yaw += dt * 0.08;
        }
      }
      if (!reduce && !paused) s.orbit += dt;
      const tilt = 0.3 + s.my * 0.12;
      const yaw = s.yaw + s.mx * 0.25;
      const cy0 = Math.cos(yaw), sy0 = Math.sin(yaw), ct = Math.cos(tilt), stl = Math.sin(tilt);

      const W = w * dpr, H = h * dpr;
      const cx = W / 2, cy = H / 2;
      const S = Math.min(W * 0.42, H * 0.44) * (0.78 + 0.22 * pIntro);
      const proj = (x: number, y: number, z: number) => {
        const x1 = x * cy0 + z * sy0;
        const z1 = -x * sy0 + z * cy0;
        const y2 = y * ct - z1 * stl;
        const z2 = y * stl + z1 * ct;
        const k = 3 / (3 - z2);
        return { sx: cx + x1 * S * k, sy: cy - y2 * S * k, z: z2 };
      };

      ctx.clearRect(0, 0, W, H);

      // Cahaya inti
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.8);
      glow.addColorStop(0, `rgba(197,59,59,${0.3 * pIntro})`);
      glow.addColorStop(0.45, `rgba(197,59,59,${0.09 * pIntro})`);
      glow.addColorStop(1, "rgba(197,59,59,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Tiga cincin orbit divisi
      ctx.lineWidth = 1.1 * dpr;
      ctx.setLineDash([3 * dpr, 6 * dpr]);
      for (const d of DIVISIONS) {
        ctx.beginPath();
        for (let i = 0; i <= 140; i++) {
          const p0 = ringPoint(d.id, (i / 140) * Math.PI * 2);
          const p = proj(p0.x, p0.y, p0.z);
          if (i === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = `rgba(${d.color},${0.28 * pIntro})`;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Garis ke tiap unit + partikel mengalir dua arah
      const screen = new Map<string, { sx: number; sy: number; z: number }>();
      units.forEach((u, i) => {
        const g = RINGS[u.division];
        const p0 = ringPoint(u.division, (angles.get(u.id) ?? 0) + s.orbit * g.speed);
        const p = proj(p0.x, p0.y, p0.z);
        screen.set(u.id, p);
        const d = (p.z + 1) / 2;
        const active = s.hover === u.id || s.selected === u.id;
        const col = COLOR[u.division];
        const dx = p.sx - cx, dy = p.sy - cy;
        const len = Math.hypot(dx, dy) || 1;
        const mxp = cx + dx / 2 - (dy / len) * len * 0.14;
        const myp = cy + dy / 2 + (dx / len) * len * 0.14;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(mxp, myp, p.sx, p.sy);
        ctx.strokeStyle = `rgba(${col},${(active ? 0.8 : 0.08 + 0.26 * d) * pIntro})`;
        ctx.lineWidth = (active ? 1.6 : 1) * dpr;
        ctx.stroke();
        if (!reduce) {
          for (let k = 0; k < 2; k++) {
            const tt = (time * (u.status === "berjalan" ? 0.3 : 0.18) + i * 0.37 + k * 0.5) % 1;
            const it = k === 0 ? tt : 1 - tt;
            const bx = (1 - it) * (1 - it) * cx + 2 * (1 - it) * it * mxp + it * it * p.sx;
            const by = (1 - it) * (1 - it) * cy + 2 * (1 - it) * it * myp + it * it * p.sy;
            ctx.beginPath();
            ctx.arc(bx, by, (active ? 2.2 : 1.5) * dpr, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${col},${(0.3 + 0.6 * d) * pIntro})`;
            ctx.fill();
          }
        }
      });

      // Bola partikel inti: berkumpul saat intro, berputar sendiri
      const myaw = time * 0.22;
      const mc = Math.cos(myaw), ms = Math.sin(myaw);
      for (let i = 0; i < MOON_POINTS; i++) {
        const o = i * 6;
        const x = moon[o], z = moon[o + 2];
        const yb = moon[o + 1];
        const xr = x * mc + z * ms;
        const zr = -x * ms + z * mc;
        const xx = xr * R_MOON * pIntro + moon[o + 3] * R_MOON * (1 - pIntro);
        const yy = yb * R_MOON * pIntro + moon[o + 4] * R_MOON * (1 - pIntro);
        const zz = zr * R_MOON * pIntro + moon[o + 5] * R_MOON * (1 - pIntro);
        const y2 = yy * ct - zz * stl;
        const z2 = yy * stl + zz * ct;
        const k = 3 / (3 - z2);
        const px = cx + xx * S * k, py = cy - y2 * S * k;
        const front = z2 >= 0;
        const d = (z2 / R_MOON + 1) / 2;
        const a = front ? 0.22 + 0.7 * d : 0.06;
        const size = (front ? 1.5 : 1) * dpr;
        ctx.fillStyle = d < 0.62 && front ? `rgba(226,140,130,${a})` : `rgba(245,242,237,${a})`;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }

      // Posisikan logo unit (DOM) sesuai proyeksi
      units.forEach((u) => {
        const el = nodeRefs.current.get(u.id);
        const p = screen.get(u.id);
        if (!el || !p) return;
        const d = (p.z + 1) / 2;
        const scale = (0.74 + 0.38 * d) * (s.hover === u.id ? 1.15 : 1);
        el.style.transform = `translate(${p.sx / dpr}px, ${p.sy / dpr}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = ((0.35 + 0.65 * d) * pIntro).toFixed(3);
        el.style.zIndex = String(Math.round(d * 100) + (s.hover === u.id || s.selected === u.id ? 100 : 0));
      });
      if (coreRef.current) {
        coreRef.current.style.transform = `translate(${cx / dpr}px, ${cy / dpr}px) translate(-50%, -50%) scale(${(0.8 + 0.2 * pIntro).toFixed(3)})`;
        coreRef.current.style.opacity = pIntro.toFixed(3);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [units, angles, moon, reduce]);

  return (
    <div
      ref={wrapRef}
      className="relative h-[400px] cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-[560px]"
      role="group"
      aria-label={core}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        const s = st.current;
        s.dragging = true;
        s.lastX = e.clientX;
        s.vyaw = 0;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const s = st.current;
        const r = e.currentTarget.getBoundingClientRect();
        s.mx = ((e.clientX - r.left) / r.width - 0.5) * 2 * 0.3;
        s.my = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!s.dragging) return;
        const dx = e.clientX - s.lastX;
        s.lastX = e.clientX;
        s.yaw += dx * 0.006;
        s.vyaw = dx * 0.006;
      }}
      onPointerUp={() => (st.current.dragging = false)}
      onPointerCancel={() => (st.current.dragging = false)}
      onPointerLeave={() => {
        st.current.mx = 0;
        st.current.my = 0;
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Inti: simbol PT di tengah bola partikel */}
      <div ref={coreRef} className="pointer-events-none absolute left-0 top-0 opacity-0" aria-hidden="true">
        <Image src="/brand/logo-pt-mark-white.webp" alt="" width={105} height={160} className="h-14 w-auto drop-shadow-[0_4px_18px_rgba(11,11,15,0.9)] md:h-[72px]" />
      </div>

      {units.map((u) => {
        const running = u.status === "berjalan";
        const size = running ? 48 : 38;
        const r = size / 2 + 4;
        const c = 2 * Math.PI * r;
        const col = COLOR[u.division];
        const isSel = selected === u.id;
        return (
          <button
            key={u.id}
            ref={(el) => {
              if (el) nodeRefs.current.set(u.id, el);
              else nodeRefs.current.delete(u.id);
            }}
            type="button"
            onClick={() => onSelect(u.id)}
            onPointerEnter={() => (st.current.hover = u.id)}
            onPointerLeave={() => (st.current.hover = "")}
            onFocus={() => (st.current.hover = u.id)}
            onBlur={() => (st.current.hover = "")}
            aria-pressed={isSel}
            aria-label={`${u.name}, ${running ? t("Berjalan") : t("Ide")} ${u.progress}%`}
            className="group absolute left-0 top-0 opacity-0 outline-none"
          >
            <span className="relative block" style={{ width: (r + 3) * 2, height: (r + 3) * 2 }}>
              {/* Cincin progres */}
              <svg className="absolute inset-0" viewBox={`0 0 ${(r + 3) * 2} ${(r + 3) * 2}`} aria-hidden="true">
                <circle cx={r + 3} cy={r + 3} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" />
                <circle
                  cx={r + 3}
                  cy={r + 3}
                  r={r}
                  fill="none"
                  stroke={`rgb(${col})`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.max((c * u.progress) / 100, 3)} ${c}`}
                  transform={`rotate(-90 ${r + 3} ${r + 3})`}
                />
              </svg>
              {/* Logo, atau inisial kalau logonya belum ada */}
              <span
                className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full transition-shadow ${
                  u.logo ? "bg-white" : "bg-[#16161B]"
                } ${isSel ? "shadow-[0_0_0_3px_rgba(255,255,255,0.9)]" : "group-hover:shadow-[0_0_0_2px_rgba(255,255,255,0.6)]"}`}
                style={{ width: size, height: size, border: u.logo ? undefined : `1px solid rgba(${col},0.6)` }}
              >
                {u.logo ? (
                  <Image src={u.logo} alt="" width={80} height={80} className="h-[72%] w-[72%] object-contain" />
                ) : (
                  <span className="text-[11px] font-black tracking-tight" style={{ color: `rgb(${col})` }}>
                    {u.initials}
                  </span>
                )}
              </span>
            </span>
            {/* Nama dan progres hanya saat disorot atau difokus */}
            <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-brand-dark opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {u.name} · {u.progress}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
