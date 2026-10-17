import type { ReactNode } from "react";
import { floorGeometry, isFacadeOpening } from "@/lib/denah/geometry";
import { FLOOR_H, PEIL, isOpen, type Plan } from "@/lib/denah/types";
import { FONT, INK, S, THIN, fmt, type Translate } from "./draw";
import { PLAN_M, titleBlock } from "./PlanSvg";

// Tampak depan bergaya gambar presentasi (acuan board barumahID "Seri Mahaksa"): dinding putih, panel kayu,
// roster, kaca berkusen gelap, atap genteng gelap, kanopi carport dengan mobil, tanaman, dan langit lembut.
// Tetap ada peil dan ukuran lebar seperti gambar kerja.

const OVER = 0.6;
const WALL = "#f7f5f1";

export function roofHeight(plan: Plan) {
  const W = plan.brief.landW;
  if (plan.brief.roof === "datar") return 1;
  const h = (W / 2 + OVER) * Math.tan((30 * Math.PI) / 180);
  return plan.brief.roof === "perisai" ? h * 0.8 : h;
}

export function elevationSize(plan: Plan) {
  const top = PEIL + plan.floors.length * FLOOR_H + roofHeight(plan);
  return { w: 220 + plan.brief.landW * S + 90, h: 120 + (top + 0.3) * S + 150 + PLAN_M.title, top };
}

export default function ElevationSvg({
  plan,
  t,
  lang,
  dims = true,
  svgRef,
  className,
  idPrefix = "e",
}: {
  plan: Plan;
  t: Translate;
  lang: string;
  dims?: boolean;
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
  idPrefix?: string;
}) {
  const id = (n: string) => `${idPrefix}-${n}`;
  const W = plan.brief.landW;
  const size = elevationSize(plan);
  const groundY = 120 + (size.top + 0.3) * S;
  const X = (x: number) => 220 + x * S;
  const Z = (z: number) => groundY - z * S;
  const nF = plan.floors.length;
  const zt = PEIL + nF * FLOOR_H;
  const geoms = plan.floors.map((_, f) => floorGeometry(plan, f));
  const els: ReactNode[] = [];

  // Langit dan pohon latar
  els.push(<rect key="sky" x={0} y={0} width={size.w} height={groundY} fill={`url(#${id("langit")})`} />);
  [
    [-1.1, 1.3],
    [W + 1.1, 1.1],
  ].forEach(([tx, k], i) => {
    const cx = X(tx);
    els.push(
      <g key={`tr${i}`}>
        <rect x={cx - 6} y={Z(2.4 * k)} width={12} height={2.4 * k * S} fill="#6b4a32" />
        {[
          [0, 3.4, 1.2],
          [-0.6, 2.9, 0.9],
          [0.6, 2.9, 0.9],
          [0, 4.2, 0.85],
        ].map(([dx, dz, r], j) => (
          <circle key={j} cx={cx + dx * S * k} cy={Z(dz * k)} r={r * S * k} fill={`url(#${id("daun")})`} />
        ))}
      </g>,
    );
  });

  // Badan bangunan
  els.push(<rect key="body" x={X(0)} y={Z(zt)} width={W * S} height={zt * S} fill={WALL} stroke={INK} strokeWidth={2.5} />);
  els.push(<rect key="plint" x={X(0)} y={Z(PEIL)} width={W * S} height={PEIL * S} fill="#8f8a83" />);

  // Panel kayu di ruang depan paling kiri (lantai teratas)
  const topG = geoms[nF - 1];
  const frontRoom = topG.rooms.filter((r) => !isOpen(r.type) && r.type !== "void").sort((a, b) => a.y - b.y || a.x - b.x)[0];
  if (frontRoom) {
    const base = PEIL + (nF - 1) * FLOOR_H;
    const cw = Math.min(frontRoom.w, 2.4);
    els.push(<rect key="clad" x={X(frontRoom.x + 0.05)} y={Z(base + FLOOR_H - 0.2)} width={(cw - 0.05) * S} height={(FLOOR_H - 0.2) * S} fill={`url(#${id("kayu")})`} stroke="#6e4d31" strokeWidth={1.5} />);
  }
  for (let f = 1; f < nF; f++) {
    const z = PEIL + f * FLOOR_H;
    els.push(<rect key={`slab${f}`} x={X(-0.08)} y={Z(z)} width={(W + 0.16) * S} height={0.2 * S} fill="#e9e5de" stroke={INK} strokeWidth={1.8} />);
  }

  // Pintu dan jendela yang menghadap jalan
  geoms.forEach((g, f) => {
    const base = PEIL + f * FLOOR_H;
    g.openings
      .filter((o) => o.kind !== "open" && isFacadeOpening(g, o))
      .forEach((o, i) => {
        const room = g.rooms.find((r) => r.id === o.room);
        if (!room) return;
        const x = X(o.s);
        const w = (o.e - o.s) * S;
        if (o.kind === "window") {
          const sill = room.type === "km" ? 1.5 : 0.7;
          const head = 2.4;
          const h = (head - sill) * S;
          els.push(
            <g key={`w${f}-${i}`}>
              <rect x={x - 5} y={Z(base + head) - 5} width={w + 10} height={h + 10} fill="#2f3236" />
              <rect x={x} y={Z(base + head)} width={w} height={h} fill={`url(#${id("kaca")})`} />
              <line x1={x + w / 2} y1={Z(base + head)} x2={x + w / 2} y2={Z(base + sill)} stroke="#2f3236" strokeWidth={3} />
              <line x1={x} y1={Z(base + head - 0.5)} x2={x + w} y2={Z(base + head - 0.5)} stroke="#2f3236" strokeWidth={3} />
              <path d={`M${x + 6} ${Z(base + head) + 6}l${w * 0.35} 0l${-w * 0.25} ${h * 0.6}l${-w * 0.1} 0z`} fill="#ffffff" opacity={0.25} />
            </g>,
          );
        } else {
          const head = 2.4;
          const double = o.kind === "main" && o.e - o.s >= 1.1;
          els.push(
            <g key={`d${f}-${i}`}>
              <rect x={x - 5} y={Z(base + head) - 5} width={w + 10} height={head * S + 5} fill="#2f3236" />
              <rect x={x} y={Z(base + head)} width={w} height={head * S} fill={`url(#${id("pintu")})`} />
              {double && <line x1={x + w / 2} y1={Z(base + head)} x2={x + w / 2} y2={Z(base)} stroke="#4a3220" strokeWidth={2} />}
              <rect x={x + (double ? w / 2 - 16 : w - 20)} y={Z(base + 1.1)} width={10} height={4} fill="#d8c08a" />
              {double && <rect x={x + w / 2 + 6} y={Z(base + 1.1)} width={10} height={4} fill="#d8c08a" />}
            </g>,
          );
        }
      });
  });

  // Panel roster di samping pintu utama
  const entry = geoms[0].openings.find((o) => o.kind === "main");
  if (entry) {
    const rx = Math.min(W - 1, entry.e + 0.35);
    if (rx > entry.e) els.push(<rect key="roster" x={X(rx)} y={Z(3.1)} width={0.9 * S} height={(3.1 - PEIL) * S} fill={`url(#${id("roster")})`} stroke="#8a857c" strokeWidth={1.5} />);
  }

  // Kanopi carport dan teras, mobil, balkon
  let cx = 0;
  plan.floors[0][0].forEach((c, i) => {
    if (c.type === "carport" || c.type === "teras") {
      const balconyAbove = nF > 1 && plan.floors[1][0].some((b) => b.type === "balkon");
      const zc = c.type === "teras" && balconyAbove ? PEIL + FLOOR_H : 3.0;
      els.push(
        <g key={`k${i}`}>
          <rect x={X(cx)} y={Z(zc + 0.18)} width={c.w * S} height={0.18 * S} fill="#e2ddd5" stroke={INK} strokeWidth={1.6} />
          <rect x={X(cx)} y={Z(zc)} width={c.w * S} height={0.35 * S} fill="#000" opacity={0.08} />
          {[cx + 0.1, cx + c.w - 0.22].map((px) => (
            <rect key={px} x={X(px)} y={Z(zc)} width={0.12 * S} height={zc * S} fill="#2f3236" />
          ))}
        </g>,
      );
      if (c.type === "carport" && c.w >= 2.6) {
        const carW = Math.min(4.3, c.w - 0.4);
        const x0 = cx + (c.w - carW) / 2;
        els.push(<g key={`car${i}`}>{carSide(x0, carW, X, Z)}</g>);
      }
    }
    cx += c.w;
  });
  if (nF > 1) {
    let bx = 0;
    plan.floors[1][0].forEach((c, i) => {
      if (c.type === "balkon") {
        const z0 = PEIL + FLOOR_H + 0.2;
        els.push(
          <g key={`b${i}`}>
            <rect x={X(bx)} y={Z(z0 + 1)} width={c.w * S} height={1 * S} fill="#bcd3dd" opacity={0.45} />
            <line x1={X(bx)} y1={Z(z0 + 1)} x2={X(bx + c.w)} y2={Z(z0 + 1)} stroke="#2f3236" strokeWidth={4} />
            {Array.from({ length: Math.floor(c.w / 0.9) + 1 }, (_, k) => (
              <line key={k} x1={X(bx + k * 0.9)} y1={Z(z0)} x2={X(bx + k * 0.9)} y2={Z(z0 + 1)} stroke="#2f3236" strokeWidth={2.5} />
            ))}
          </g>,
        );
      }
      bx += c.w;
    });
  }

  // Atap
  const rh = roofHeight(plan);
  if (plan.brief.roof === "datar") {
    els.push(
      <g key="roof">
        <rect x={X(0)} y={Z(zt + 0.9)} width={W * S} height={0.9 * S} fill={WALL} stroke={INK} strokeWidth={2.5} />
        <rect x={X(-0.08)} y={Z(zt + 1)} width={(W + 0.16) * S} height={0.12 * S} fill="#3a3d41" />
      </g>,
    );
  } else {
    const ridge = plan.brief.roof === "perisai" ? W * 0.18 : 0;
    const pts = [
      [X(-OVER), Z(zt)],
      [X(W / 2 - ridge), Z(zt + rh)],
      [X(W / 2 + ridge), Z(zt + rh)],
      [X(W + OVER), Z(zt)],
    ];
    els.push(
      <g key="roof">
        <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={`url(#${id("genteng")})`} stroke="#1f2124" strokeWidth={3} strokeLinejoin="round" />
        <rect x={X(-OVER)} y={Z(zt)} width={(W + 2 * OVER) * S} height={0.2 * S} fill="#2a2c30" />
        <rect x={X(0)} y={Z(zt) + 0.2 * S} width={W * S} height={0.3 * S} fill="#000" opacity={0.1} />
      </g>,
    );
  }

  // Tanah dan tanaman di depan
  els.push(<rect key="tanah" x={0} y={Z(0)} width={size.w} height={0.25 * S} fill="#9bbd7a" />);
  els.push(<line key="tanah-garis" x1={0} y1={Z(0)} x2={size.w} y2={Z(0)} stroke={INK} strokeWidth={3} />);
  for (let k = 0; k < Math.floor(W / 1.6); k += 2) {
    const sx = X(0.5 + k * 1.6);
    els.push(
      <g key={`semak${k}`}>
        {[-14, 0, 14].map((dx) => (
          <circle key={dx} cx={sx + dx} cy={Z(0.32)} r={16} fill="#6f9a4a" />
        ))}
      </g>,
    );
  }

  // Peil dan ukuran
  if (dims) {
    const levels = [0, PEIL, ...plan.floors.slice(1).map((_, i) => PEIL + (i + 1) * FLOOR_H), zt, zt + rh];
    levels.forEach((z, i) => {
      const y = Z(z);
      els.push(
        <g key={`lv${i}`}>
          <line x1={X(-1.9)} y1={y} x2={X(-0.15)} y2={y} stroke="#b9b5ae" strokeWidth={1} />
          <path d={`M${X(-1.75)} ${y}l-9 -14h18z`} fill="#ffffff" stroke={INK} strokeWidth={1.6} />
          <text x={X(-1.55)} y={y - 6} fontSize={14} fill={INK}>
            {z === 0 ? "±0,00" : `+${fmt(z)}`}
          </text>
        </g>,
      );
    });
    const yd = Z(0) + 70;
    els.push(
      <g key="dimw">
        <line x1={X(0)} y1={yd} x2={X(W)} y2={yd} stroke={THIN} strokeWidth={1.2} />
        {[0, W].map((x) => (
          <line key={x} x1={X(x) - 7} y1={yd + 7} x2={X(x) + 7} y2={yd - 7} stroke={INK} strokeWidth={1.6} />
        ))}
        <text x={X(W / 2)} y={yd - 8} fontSize={14} textAnchor="middle" fill={INK}>
          {fmt(W)}
        </text>
      </g>,
    );
  }

  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size.w} ${size.h}`} width={size.w} height={size.h} fontFamily={FONT} className={className} style={{ background: "#ffffff" }}>
      <defs>
        <linearGradient id={id("langit")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dfe9f1" />
          <stop offset="100%" stopColor="#f7f5f0" />
        </linearGradient>
        <radialGradient id={id("daun")} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#8fbf63" />
          <stop offset="75%" stopColor="#5d8f40" />
          <stop offset="100%" stopColor="#4a7834" />
        </radialGradient>
        <linearGradient id={id("kaca")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8fb4c6" />
          <stop offset="100%" stopColor="#3f5966" />
        </linearGradient>
        <linearGradient id={id("pintu")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a5f3c" />
          <stop offset="100%" stopColor="#a87a52" />
        </linearGradient>
        <pattern id={id("kayu")} width="18" height="60" patternUnits="userSpaceOnUse">
          <rect width="18" height="60" fill="#a7774d" />
          <rect x="16" width="2" height="60" fill="#7c5536" />
          <path d="M5 8V30M11 34V54" stroke="#93653f" strokeWidth="1" />
        </pattern>
        <pattern id={id("roster")} width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill="#ece8e1" />
          <rect x="4" y="4" width="14" height="14" fill="#3b3a37" />
          <circle cx="11" cy="11" r="4" fill="#ece8e1" />
        </pattern>
        <pattern id={id("genteng")} width="40" height="22" patternUnits="userSpaceOnUse">
          <rect width="40" height="22" fill="#45494f" />
          <rect y="18" width="40" height="4" fill="#2f3236" />
          <path d="M20 0V18" stroke="#34373b" strokeWidth="2" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={size.w} height={size.h} fill="#ffffff" />
      {els}
      {titleBlock(size, t("TAMPAK DEPAN"), `${t("Atap {atap}", { atap: t(roofName(plan)) })} · ${t("{n} lantai", { n: nF })}`, t, lang)}
    </svg>
  );
}

/** Mobil tampak samping sederhana */
function carSide(x0: number, len: number, X: (x: number) => number, Z: (z: number) => number) {
  const L = len;
  const body = `M${X(x0)} ${Z(0.45)}L${X(x0)} ${Z(0.85)}Q${X(x0 + 0.1)} ${Z(0.95)} ${X(x0 + L * 0.2)} ${Z(0.98)}L${X(x0 + L * 0.32)} ${Z(1.4)}L${X(x0 + L * 0.72)} ${Z(1.42)}L${X(x0 + L * 0.85)} ${Z(1.0)}Q${X(x0 + L)} ${Z(0.95)} ${X(x0 + L)} ${Z(0.75)}L${X(x0 + L)} ${Z(0.45)}Z`;
  const glass = `M${X(x0 + L * 0.34)} ${Z(1.34)}L${X(x0 + L * 0.7)} ${Z(1.36)}L${X(x0 + L * 0.81)} ${Z(1.0)}L${X(x0 + L * 0.25)} ${Z(1.0)}Z`;
  return (
    <>
      <ellipse cx={X(x0 + L / 2)} cy={Z(0.02)} rx={(L / 2) * S} ry={8} fill="#000" opacity={0.18} />
      <path d={body} fill="#f3f3f1" stroke="#55595e" strokeWidth={2} />
      <path d={glass} fill="#3a4a55" />
      <line x1={X(x0 + L * 0.53)} y1={Z(1.36)} x2={X(x0 + L * 0.53)} y2={Z(1.0)} stroke="#f3f3f1" strokeWidth={4} />
      {[0.2, 0.8].map((k) => (
        <g key={k}>
          <circle cx={X(x0 + L * k)} cy={Z(0.33)} r={0.33 * S} fill="#1f2022" />
          <circle cx={X(x0 + L * k)} cy={Z(0.33)} r={0.16 * S} fill="#9aa0a6" />
        </g>
      ))}
    </>
  );
}

const roofName = (plan: Plan) => (plan.brief.roof === "pelana" ? "pelana" : plan.brief.roof === "perisai" ? "perisai" : "dak datar");
