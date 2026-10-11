"use client";

import { motion } from "framer-motion";
import { IsoBox, IsoLine, StageCaptions, TONES, proj, useSequence, viewBoxOf, type Box, type V3 } from "./iso";

// Animasi "gambar kerja sampai hitungan struktur" (bagian gambar & struktur di /layanan/contech):
// denah tergambar -> dinding tumbuh jadi model 3D -> rangka kolom-balok dengan warna analisa -> panah beban.

const PLAN: V3[][] = [
  [[0, 0, 0], [8, 0, 0], [8, 6, 0], [0, 6, 0], [0, 0, 0]],
  [[3.2, 0, 0], [3.2, 6, 0]],
  [[3.2, 3.4, 0], [8, 3.4, 0]],
];
const DIMS: V3[][] = [
  [[0, 7, 0], [8, 7, 0]],
  [[0, 6.75, 0], [0, 7.25, 0]],
  [[3.2, 6.75, 0], [3.2, 7.25, 0]],
  [[8, 6.75, 0], [8, 7.25, 0]],
  [[9, 0, 0], [9, 6, 0]],
  [[8.75, 0, 0], [9.25, 0, 0]],
  [[8.75, 6, 0], [9.25, 6, 0]],
];

const WALLS: Box[] = [
  { x: 0, y: 0, z: 0, w: 8, d: 0.2, h: 3 },
  { x: 0, y: 0, z: 0, w: 0.2, d: 6, h: 3 },
  { x: 3.1, y: 0.2, z: 0, w: 0.2, d: 5.6, h: 3 },
  { x: 3.3, y: 3.3, z: 0, w: 4.5, d: 0.2, h: 3 },
  { x: 7.8, y: 0, z: 0, w: 0.2, d: 6, h: 3 },
  { x: 0, y: 5.8, z: 0, w: 8, d: 0.2, h: 3 },
];

// Rangka struktur dengan warna seperti hasil analisa (biru aman, kuning sedang, merah paling besar gayanya)
const BLUE = "#1A5C9A", AMBER = "#D99A1E", RED = "#C53B3B";
const COLUMN_POS: [number, number][] = [[0, 0], [3.2, 0], [8, 0], [0, 6], [3.2, 6], [8, 6], [8, 3.4], [3.2, 3.4]];
const FRAME: { pts: V3[]; color: string }[] = [
  ...COLUMN_POS.map(([x, y]) => ({ pts: [[x, y, 0], [x, y, 3]] as V3[], color: BLUE })),
  { pts: [[0, 0, 3], [8, 0, 3]], color: BLUE },
  { pts: [[0, 6, 3], [8, 6, 3]], color: AMBER },
  { pts: [[0, 0, 3], [0, 6, 3]], color: BLUE },
  { pts: [[8, 0, 3], [8, 6, 3]], color: AMBER },
  { pts: [[3.2, 0, 3], [3.2, 6, 3]], color: RED },
  { pts: [[3.2, 3.4, 3], [8, 3.4, 3]], color: RED },
];
const LOADS: V3[] = [[3.2, 1.2, 3], [3.2, 4.6, 3], [5.6, 3.4, 3]];

const VIEWBOX = viewBoxOf([[0, 0, 0], [9.3, 0, 0], [0, 7.3, 0], [9, 7.2, 0], [0, 0, 4.4], [8, 0, 4.4]], { t: 20, r: 26, b: 24, l: 20 });

const STAGES = [
  { label: "Denah", at: 0 },
  { label: "Model 3D", at: 1 },
  { label: "Analisa struktur", at: 2 },
];

function Label({ at, text, on }: { at: V3; text: string; on: boolean }) {
  const [x, y] = proj(at);
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="13"
      fontWeight="700"
      fill={RED}
      fontFamily="var(--font-montserrat), sans-serif"
      initial={false}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: 0.4, delay: on ? 0.5 : 0 }}
    >
      {text}
    </motion.text>
  );
}

export default function BlueprintModel() {
  const { ref, step } = useSequence(3, 1250, 2800);
  return (
    <div ref={ref} className="relative">
      <div className="blueprint-paper relative overflow-hidden rounded-3xl border border-brand-dark/10 p-4 md:p-6">
        <svg viewBox={VIEWBOX} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label="Animasi denah rumah yang berubah menjadi model 3D, lalu dianalisa strukturnya">
          {/* Denah dan garis ukur */}
          {PLAN.map((p, i) => (
            <IsoLine key={`p-${i}`} points={p} on={step >= 0} stroke="#141414" sw={1.6} delay={i * 0.25} duration={1} />
          ))}
          {DIMS.map((p, i) => (
            <IsoLine key={`d-${i}`} points={p} on={step >= 0} stroke={RED} sw={0.9} delay={0.6 + i * 0.05} duration={0.5} />
          ))}
          <Label at={[4, 7.7, 0]} text="8,00 m" on={step >= 0} />
          <Label at={[9.8, 3, 0]} text="6,00 m" on={step >= 0} />

          {/* Dinding tumbuh jadi model 3D */}
          {WALLS.map((b, i) => (
            <IsoBox key={`w-${i}`} box={b} tone={TONES.wire} on={step >= 1} mode="grow" delay={i * 0.1} />
          ))}

          {/* Rangka struktur dan hasil analisa */}
          {FRAME.map((f, i) => (
            <IsoLine key={`f-${i}`} points={f.pts} on={step >= 2} stroke={f.color} sw={2.6} delay={i * 0.06} duration={0.6} />
          ))}
          {LOADS.map((p, i) => {
            const top: V3 = [p[0], p[1], p[2] + 1.1];
            return (
              <g key={`l-${i}`}>
                <IsoLine points={[top, [p[0], p[1], p[2] + 0.12]]} on={step >= 3} stroke={RED} sw={1.4} delay={i * 0.12} duration={0.4} />
                <IsoLine
                  points={[[p[0] - 0.18, p[1] - 0.18, p[2] + 0.4], [p[0], p[1], p[2] + 0.12], [p[0] + 0.18, p[1] + 0.18, p[2] + 0.4]]}
                  on={step >= 3}
                  stroke={RED}
                  sw={1.4}
                  delay={0.3 + i * 0.12}
                  duration={0.3}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-4">
        <StageCaptions stages={STAGES} step={step} />
      </div>
    </div>
  );
}
