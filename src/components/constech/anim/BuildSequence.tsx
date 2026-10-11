"use client";

import { motion } from "framer-motion";
import { IsoBox, IsoLine, StageCaptions, TONES, boxCorners, pathOf, proj, useSequence, viewBoxOf, type Box, type V3 } from "./iso";

// Animasi proses membangun rumah dua lantai (bagian "Layanan unggulan" di /layanan/contech):
// lahan -> pondasi -> kolom -> plat lantai -> kolom lantai 2 -> plat atap -> dinding -> atap. Lalu diulang.
// Crane di belakang dengan beban yang berayun pelan.

const COLS_X = [0, 3.9, 7.65];
const COLS_Y = [0, 5.65];
const columns = (z: number): Box[] => COLS_Y.flatMap((y) => COLS_X.map((x) => ({ x, y, z, w: 0.35, d: 0.35, h: 2.4 })));

const FOUNDATION: Box = { x: -0.3, y: -0.3, z: 0, w: 8.6, d: 6.6, h: 0.4 };
const SLAB_1: Box = { x: -0.2, y: -0.2, z: 2.8, w: 8.4, d: 6.4, h: 0.3 };
const SLAB_2: Box = { x: -0.2, y: -0.2, z: 5.5, w: 8.4, d: 6.4, h: 0.3 };
const walls = (z: number): Box[] => [
  { x: 0, y: 5.75, z, w: 7.75, d: 0.25, h: 2.4 },
  { x: 7.75, y: 0, z, w: 0.25, d: 6, h: 2.4 },
];
// Jendela dan pintu di dua sisi yang terlihat (bidang y = 6 dan x = 8)
const openingsY = (z: number, door: boolean): V3[][] => [
  [[1, 6.01, z + 0.9], [2.4, 6.01, z + 0.9], [2.4, 6.01, z + 2], [1, 6.01, z + 2]],
  [[4.6, 6.01, z + 0.9], [6, 6.01, z + 0.9], [6, 6.01, z + 2], [4.6, 6.01, z + 2]],
  ...(door ? [[[2.9, 6.01, z], [3.7, 6.01, z], [3.7, 6.01, z + 2], [2.9, 6.01, z + 2]] as V3[]] : []),
];
const openingsX = (z: number): V3[][] => [
  [[8.01, 1.2, z + 0.9], [8.01, 2.6, z + 0.9], [8.01, 2.6, z + 2], [8.01, 1.2, z + 2]],
  [[8.01, 3.4, z + 0.9], [8.01, 4.8, z + 0.9], [8.01, 4.8, z + 2], [8.01, 3.4, z + 2]],
];

const ROOF_BACK: V3[] = [[-0.5, -0.5, 5.8], [8.5, -0.5, 5.8], [8.5, 3, 7.6], [-0.5, 3, 7.6]];
const ROOF_FRONT: V3[] = [[-0.5, 6.5, 5.8], [8.5, 6.5, 5.8], [8.5, 3, 7.6], [-0.5, 3, 7.6]];
const GABLE: V3[] = [[8, 0, 5.8], [8, 6, 5.8], [8, 3, 7.34]];
const ROOF_EDGE: V3[] = [[8.5, -0.5, 5.8], [8.5, 3, 7.6], [8.5, 6.5, 5.8]];

// Crane di belakang bangunan
const CX = 11, CY = -1.6, CTOP = 11.5;
const CRANE_LINES: V3[][] = [
  [[CX, CY, 0], [CX, CY, CTOP]],
  [[CX + 0.6, CY, 0], [CX + 0.6, CY, CTOP]],
  ...Array.from({ length: 10 }, (_, i): V3[] => [[CX, CY, i * 1.15], [CX + 0.6, CY, (i + 1) * 1.15]]),
  [[CX + 0.3, CY, CTOP], [1.6, CY, CTOP]],
  [[CX + 0.3, CY, CTOP], [14.6, CY, CTOP]],
  [[CX + 0.3, CY, CTOP + 1.6], [1.6, CY, CTOP]],
  [[CX + 0.3, CY, CTOP + 1.6], [14.6, CY, CTOP]],
  [[CX + 0.3, CY, CTOP], [CX + 0.3, CY, CTOP + 1.6]],
];
const COUNTERWEIGHT: Box = { x: 13.6, y: CY - 0.4, z: CTOP - 0.7, w: 0.9, d: 0.8, h: 0.6 };
const TROLLEY: V3 = [4.6, CY, CTOP];
const LOAD: Box = { x: 3.7, y: CY - 0.15, z: 8.4, w: 1.8, d: 0.3, h: 0.3 };

const GROUND: V3[][] = [
  ...Array.from({ length: 11 }, (_, i): V3[] => [[-1 + i, -1, 0], [-1 + i, 7, 0]]),
  ...Array.from({ length: 9 }, (_, i): V3[] => [[-1, -1 + i, 0], [9, -1 + i, 0]]),
];

const VIEWBOX = viewBoxOf(
  [...boxCorners(FOUNDATION), [-1, 7, 0], [9, -1, 0], [-1, -1, 0], [14.6, CY, CTOP], [1.6, CY, CTOP], [CX + 0.3, CY, CTOP + 1.6], [-0.5, 6.5, 5.8]],
  { t: 14, r: 14, b: 18, l: 14 },
);

const STAGES = [
  { label: "Pondasi", at: 1 },
  { label: "Kolom", at: 2 },
  { label: "Plat lantai", at: 3 },
  { label: "Dinding", at: 6 },
  { label: "Atap", at: 7 },
];

export default function BuildSequence() {
  const { ref, step } = useSequence(7, 850, 2800);
  const [tx, ty] = proj(TROLLEY);
  return (
    <div ref={ref} className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-brand-dark/10 bg-gradient-to-b from-white to-brand-cream-warm p-4 md:p-6">
        <svg viewBox={VIEWBOX} className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label="Animasi tahapan membangun rumah dua lantai: pondasi, kolom, plat lantai, dinding, dan atap">
          {/* Crane */}
          <g opacity={step >= 0 ? 1 : 0} style={{ transition: "opacity 0.6s" }}>
            {CRANE_LINES.map((l, i) => (
              <path key={i} d={pathOf(l, false)} fill="none" stroke="#6B6159" strokeWidth={i < 2 ? 1.6 : 0.8} strokeLinecap="round" />
            ))}
            <IsoBox box={COUNTERWEIGHT} tone={TONES.concreteDark} on={step >= 0} mode="fade" />
            <g className="crane-swing" style={{ transformOrigin: `${tx}px ${ty}px`, transformBox: "view-box" }}>
              <path d={pathOf([TROLLEY, [4.6, CY, 8.7]], false)} stroke="#6B6159" strokeWidth="0.8" fill="none" />
              <IsoBox box={LOAD} tone={TONES.red} on={step >= 0} mode="fade" />
            </g>
          </g>

          {/* Lahan */}
          {GROUND.map((l, i) => (
            <IsoLine key={i} points={l} on={step >= 0} stroke="#8C8278" sw={0.6} opacity={0.35} delay={i * 0.02} duration={0.6} />
          ))}
          <IsoLine points={[[-1, -1, 0], [9, -1, 0], [9, 7, 0], [-1, 7, 0]]} close on={step >= 0} stroke="#C53B3B" sw={1} dash="5 4" opacity={0.8} />

          <IsoBox box={FOUNDATION} tone={TONES.concreteDark} on={step >= 1} />
          {columns(0.4).map((b, i) => (
            <IsoBox key={`c1-${i}`} box={b} tone={TONES.concrete} on={step >= 2} mode="grow" delay={i * 0.06} />
          ))}
          <IsoBox box={SLAB_1} tone={TONES.concrete} on={step >= 3} />
          {columns(3.1).map((b, i) => (
            <IsoBox key={`c2-${i}`} box={b} tone={TONES.concrete} on={step >= 4} mode="grow" delay={i * 0.06} />
          ))}
          <IsoBox box={SLAB_2} tone={TONES.concrete} on={step >= 5} />

          {/* Dinding, jendela, pintu */}
          {[...walls(0.4), ...walls(3.1)].map((b, i) => (
            <IsoBox key={`w-${i}`} box={b} tone={TONES.wall} on={step >= 6} mode="grow" delay={i * 0.08} />
          ))}
          <motion.g initial={false} animate={{ opacity: step >= 6 ? 1 : 0 }} transition={{ duration: 0.5, delay: step >= 6 ? 0.6 : 0 }}>
            {[...openingsY(0.4, true), ...openingsY(3.1, false), ...openingsX(0.4), ...openingsX(3.1)].map((o, i) => (
              <path key={i} d={pathOf(o)} fill="#46505A" opacity="0.85" />
            ))}
          </motion.g>

          {/* Atap merah, seperti logo barumahID */}
          <motion.g
            initial={false}
            animate={step >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: step >= 7 ? 0.7 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <path d={pathOf(ROOF_BACK)} fill="#8E2626" stroke="#7E2222" strokeWidth="0.8" />
            <path d={pathOf(GABLE)} fill="#F1ECE5" stroke="#9A9086" strokeWidth="0.8" />
            <path d={pathOf(ROOF_FRONT)} fill="#C53B3B" stroke="#7E2222" strokeWidth="0.8" />
            <path d={pathOf(ROOF_EDGE, false)} fill="none" stroke="#7E2222" strokeWidth="1.2" />
          </motion.g>
        </svg>
      </div>
      <div className="mt-4">
        <StageCaptions stages={STAGES} step={step} />
      </div>
    </div>
  );
}
