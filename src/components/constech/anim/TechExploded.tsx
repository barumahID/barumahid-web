"use client";

import { useRef } from "react";
import { MotionConfig, motion, useInView } from "framer-motion";
import { IsoBox, TONES, boxCorners, pathOf, proj, viewBoxOf, type Box, type V3 } from "./iso";

// Visual sinematik di bawah peta proyek (/layanan/contech): model 3D bangunan yang terurai per komponen
// (pondasi, lantai 1, lantai 2, atap) lalu menyatu lagi, dengan nuansa AR: sudut bidik, garis pindai, label komponen.

interface Layer {
  name: string;
  boxes: Box[];
  roof?: boolean;
  offset: number; // geser vertikal (px) saat terurai
  anchor: V3; // titik label
}

const ring = (z: number): Box[] => [
  { x: 0, y: 0, z, w: 6, d: 0.12, h: 2 },
  { x: 0, y: 0, z, w: 0.12, d: 5, h: 2 },
  { x: 5.88, y: 0, z, w: 0.12, d: 5, h: 2 },
  { x: 0, y: 4.88, z, w: 6, d: 0.12, h: 2 },
];

const LAYERS: Layer[] = [
  { name: "Pondasi", boxes: [{ x: -0.3, y: -0.3, z: 0, w: 6.6, d: 5.6, h: 0.35 }], offset: 22, anchor: [6.3, 2.5, 0.2] },
  { name: "Lantai 1", boxes: [{ x: 0, y: 0, z: 0.35, w: 6, d: 5, h: 0.15 }, ...ring(0.5)], offset: 0, anchor: [6, 2.5, 1.5] },
  { name: "Lantai 2", boxes: [{ x: 0, y: 0, z: 2.5, w: 6, d: 5, h: 0.15 }, ...ring(2.65)], offset: -62, anchor: [6, 2.5, 3.6] },
  { name: "Atap", boxes: [], roof: true, offset: -132, anchor: [6.3, 2.5, 5.3] },
];

const ROOF_BACK: V3[] = [[-0.3, -0.3, 4.65], [6.3, -0.3, 4.65], [6.3, 2.5, 6], [-0.3, 2.5, 6]];
const ROOF_FRONT: V3[] = [[-0.3, 5.3, 4.65], [6.3, 5.3, 4.65], [6.3, 2.5, 6], [-0.3, 2.5, 6]];
const ROOF_END: V3[] = [[6.3, -0.3, 4.65], [6.3, 5.3, 4.65], [6.3, 2.5, 6]];

const GRID: V3[][] = [
  ...Array.from({ length: 11 }, (_, i): V3[] => [[-2 + i, -2, 0], [-2 + i, 7, 0]]),
  ...Array.from({ length: 10 }, (_, i): V3[] => [[-2, -2 + i, 0], [8, -2 + i, 0]]),
];

const LABEL_X = proj([9, -1.5, 0])[0];

const VIEWBOX = viewBoxOf(
  [...boxCorners({ x: -2, y: -2, z: 0, w: 10, d: 9, h: 0 }), [-0.3, 2.5, 6], [9, -1.5, 0]],
  { t: 160, r: 110, b: 10, l: 10 },
);

const CYCLE = { duration: 9, repeat: Infinity, ease: "easeInOut" as const, times: [0, 0.3, 0.62, 0.9, 1] };

export default function TechExploded() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_70%_80%_at_50%_60%,#1d1d1d,#0f0f0f)]"
      >
        {/* Bingkai bidik ala AR */}
        {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c) => (
          <span key={c} className={`pointer-events-none absolute h-6 w-6 border-white/40 ${c}`} aria-hidden="true" />
        ))}
        <p className="pointer-events-none absolute left-8 top-7 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
          Model 3D · barumahID
        </p>
        {/* Garis pindai */}
        {inView && <span className="scan-line pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true" />}

        <svg viewBox={VIEWBOX} className="mx-auto block h-auto w-full max-w-[760px] px-4 pb-2 pt-10" role="img" aria-label="Animasi model 3D bangunan yang terurai menjadi pondasi, lantai 1, lantai 2, dan atap">
          {GRID.map((l, i) => (
            <path key={i} d={pathOf(l, false)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" fill="none" />
          ))}
          {LAYERS.map((layer, k) => {
            const [ax, ay] = proj(layer.anchor);
            return (
              <motion.g
                key={layer.name}
                animate={inView ? { y: [0, layer.offset, layer.offset, 0, 0] } : { y: 0 }}
                transition={inView ? { ...CYCLE, delay: 0 } : { duration: 0.4 }}
              >
                {layer.boxes.map((b, i) => (
                  <IsoBox key={i} box={b} tone={k === LAYERS.length - 2 ? TONES.glassRed : TONES.glass} on mode="fade" />
                ))}
                {layer.roof && (
                  <g strokeLinejoin="round">
                    <path d={pathOf(ROOF_BACK)} fill="rgba(197,59,59,0.12)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    <path d={pathOf(ROOF_END)} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                    <path d={pathOf(ROOF_FRONT)} fill="rgba(197,59,59,0.3)" stroke="#E27070" strokeWidth="1.2" />
                  </g>
                )}
                {/* Label komponen (disembunyikan di HP karena terlalu kecil) */}
                <g className="max-sm:hidden">
                  <path d={`M${ax + 6} ${ay}L${LABEL_X - 8} ${ay}`} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
                  <circle cx={ax + 4} cy={ay} r="2.4" fill="#E27070" />
                  <text x={LABEL_X} y={ay + 4} fontSize="13" fontWeight="700" letterSpacing="1.5" fill="rgba(255,255,255,0.75)" fontFamily="var(--font-montserrat), sans-serif">
                    {layer.name.toUpperCase()}
                  </text>
                </g>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </MotionConfig>
  );
}
