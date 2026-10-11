"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Alat bantu animasi 3D isometrik (SVG + framer-motion) untuk halaman ConTech.
// Koordinat 3D (x, y, z) dalam "unit", z ke atas. Proyeksi isometrik 30 derajat.

export type V3 = [number, number, number];

const COS30 = Math.cos(Math.PI / 6);
export const UNIT = 30;

export function proj([x, y, z]: V3): [number, number] {
  return [(x - y) * COS30 * UNIT, ((x + y) * 0.5 - z) * UNIT];
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export function pathOf(points: V3[], close = true): string {
  const d = points
    .map((p, i) => {
      const [x, y] = proj(p);
      return `${i ? "L" : "M"}${r1(x)} ${r1(y)}`;
    })
    .join("");
  return close ? `${d}Z` : d;
}

export interface Box {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

/** Tiga sisi yang terlihat dari sudut isometrik: sisi depan-kiri (y+d), sisi depan-kanan (x+w), dan atas. */
export function boxPaths({ x, y, z, w, d, h }: Box) {
  const t = z + h;
  return {
    left: pathOf([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]]),
    right: pathOf([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]]),
    top: pathOf([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]]),
  };
}

export function boxCorners({ x, y, z, w, d, h }: Box): V3[] {
  return [
    [x, y, z], [x + w, y, z], [x, y + d, z], [x + w, y + d, z],
    [x, y, z + h], [x + w, y, z + h], [x, y + d, z + h], [x + w, y + d, z + h],
  ];
}

export function viewBoxOf(points: V3[], pad: { t: number; r: number; b: number; l: number }): string {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    const [x, y] = proj(p);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return `${r1(minX - pad.l)} ${r1(minY - pad.t)} ${r1(maxX - minX + pad.l + pad.r)} ${r1(maxY - minY + pad.t + pad.b)}`;
}

export interface Tone {
  top: string;
  left: string;
  right: string;
  stroke: string;
  sw?: number;
}

// Palet senada situs: krem/beton, merah brand, dan kaca gelap untuk latar hitam.
export const TONES = {
  concrete: { top: "#F6F2EC", right: "#E2DAD0", left: "#CFC5B8", stroke: "#8C8278", sw: 0.8 },
  concreteDark: { top: "#E7E0D6", right: "#C9BFB2", left: "#B3A89B", stroke: "#7A7066", sw: 0.8 },
  wall: { top: "#FFFFFF", right: "#F1ECE5", left: "#E6DED4", stroke: "#9A9086", sw: 0.8 },
  wire: { top: "rgba(255,255,255,0.92)", right: "rgba(243,238,231,0.78)", left: "rgba(230,223,213,0.78)", stroke: "#6B6159", sw: 0.9 },
  red: { top: "#E27070", right: "#C53B3B", left: "#A02E2E", stroke: "#7E2222", sw: 0.8 },
  glass: { top: "rgba(255,255,255,0.07)", right: "rgba(255,255,255,0.035)", left: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.6)", sw: 1 },
  glassRed: { top: "rgba(197,59,59,0.28)", right: "rgba(197,59,59,0.16)", left: "rgba(197,59,59,0.1)", stroke: "#E27070", sw: 1.2 },
} satisfies Record<string, Tone>;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Kotak 3D. `mode`: "drop" = turun sambil muncul, "grow" = tumbuh dari bawah (ekstrusi), "fade" = muncul di tempat.
 * `on` false = disembunyikan (dipakai saat animasi diulang dari awal).
 */
export function IsoBox({ box, tone, on, mode = "drop", delay = 0 }: { box: Box; tone: Tone; on: boolean; mode?: "drop" | "grow" | "fade"; delay?: number }) {
  const full = boxPaths(box);
  const sides = ["left", "right", "top"] as const;
  const style = { stroke: tone.stroke, strokeWidth: tone.sw ?? 1, strokeLinejoin: "round" as const };
  if (mode === "grow") {
    const flat = boxPaths({ ...box, h: 0.001 });
    return (
      <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: on ? 0.2 : 0.35, delay: on ? delay : 0 }}>
        {sides.map((k) => (
          <motion.path
            key={k}
            initial={false}
            animate={{ d: on ? full[k] : flat[k] }}
            transition={{ duration: on ? 0.75 : 0.35, delay: on ? delay : 0, ease: EASE }}
            fill={tone[k]}
            {...style}
          />
        ))}
      </motion.g>
    );
  }
  return (
    <motion.g
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: mode === "drop" ? -28 : 0 }}
      transition={{ duration: on ? 0.6 : 0.35, delay: on ? delay : 0, ease: EASE }}
    >
      {sides.map((k) => (
        <path key={k} d={full[k]} fill={tone[k]} {...style} />
      ))}
    </motion.g>
  );
}

/** Garis 3D yang "tergambar" (pathLength). Garis putus-putus hanya memudar. */
export function IsoLine({
  points,
  on,
  stroke,
  sw = 1.4,
  dash,
  delay = 0,
  close = false,
  duration = 0.9,
  opacity = 1,
}: {
  points: V3[];
  on: boolean;
  stroke: string;
  sw?: number;
  dash?: string;
  delay?: number;
  close?: boolean;
  duration?: number;
  opacity?: number;
}) {
  const d = pathOf(points, close);
  const t = { duration: on ? duration : 0.3, delay: on ? delay : 0, ease: "easeInOut" as const };
  if (dash) {
    return (
      <motion.path d={d} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash} initial={false} animate={{ opacity: on ? opacity : 0 }} transition={t} />
    );
  }
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{ pathLength: on ? 1 : 0, opacity: on ? opacity : 0 }}
      transition={t}
    />
  );
}

/**
 * Urutan langkah animasi: 0..steps, tahan sebentar di akhir, lalu ulang dari awal.
 * Hanya berjalan saat terlihat di layar. Kalau pengguna memilih kurangi animasi, langsung tampil lengkap.
 */
export function useSequence(steps: number, stepMs: number, holdMs: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (reduce || !inView) return;
    let s = -1;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      s = s >= steps ? -1 : s + 1;
      setStep(s);
      timer = setTimeout(tick, s === steps ? holdMs : s === -1 ? 900 : stepMs);
    };
    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
  }, [reduce, inView, steps, stepMs, holdMs]);

  return { ref, step: reduce ? steps : step };
}

/** Label tahapan di bawah animasi; tahap aktif ditandai titik merah. */
export function StageCaptions({ stages, step, dark = false }: { stages: { label: string; at: number }[]; step: number; dark?: boolean }) {
  const active = stages.reduce((acc, s, i) => (step >= s.at ? i : acc), -1);
  return (
    <ol className="flex flex-wrap justify-center gap-x-5 gap-y-2" aria-hidden="true">
      {stages.map((s, i) => (
        <li
          key={s.label}
          className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-500 ${
            i <= active ? (dark ? "text-white" : "text-brand-dark") : dark ? "text-white/30" : "text-brand-dark/30"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              i === active ? "bg-brand-red" : i < active ? (dark ? "bg-white/70" : "bg-brand-dark/60") : dark ? "bg-white/20" : "bg-brand-dark/20"
            }`}
          />
          {s.label}
        </li>
      ))}
    </ol>
  );
}
