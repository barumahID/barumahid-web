import type { ReactNode } from "react";
import { floorGeometry, isFacadeOpening } from "@/lib/denah/geometry";
import { FLOOR_H, PEIL, type Plan } from "@/lib/denah/types";
import { FONT, INK, S, THIN, fmt, type Translate } from "./draw";
import { PLAN_M, titleBlock } from "./PlanSvg";

// Tampak depan konsep: dinding depan tiap lantai, pintu dan jendela yang menghadap jalan, kanopi carport/teras,
// railing balkon, dan atap (pelana, perisai, atau dak datar), lengkap dengan peil dan ukuran lebar.

const OVER = 0.6;
const WALL = "#fbfaf8";

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
}: {
  plan: Plan;
  t: Translate;
  lang: string;
  dims?: boolean;
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
}) {
  const W = plan.brief.landW;
  const size = elevationSize(plan);
  const groundY = 120 + (size.top + 0.3) * S;
  const X = (x: number) => 220 + x * S;
  const Z = (z: number) => groundY - z * S;
  const nF = plan.floors.length;
  const zt = PEIL + nF * FLOOR_H;
  const els: ReactNode[] = [];

  // Tanah
  els.push(
    <g key="ground">
      <line x1={X(-1.2)} y1={Z(0)} x2={X(W + 1.2)} y2={Z(0)} stroke={INK} strokeWidth={5} />
      {Array.from({ length: Math.ceil((W + 2.4) / 0.3) }, (_, i) => (
        <line key={i} x1={X(-1.2 + i * 0.3)} y1={Z(0) + 4} x2={X(-1.2 + i * 0.3) - 18} y2={Z(0) + 22} stroke={THIN} strokeWidth={1} />
      ))}
    </g>,
  );

  // Badan bangunan
  els.push(<rect key="body" x={X(0)} y={Z(zt)} width={W * S} height={zt * S} fill={WALL} stroke={INK} strokeWidth={3} />);
  els.push(<line key="peil" x1={X(0)} y1={Z(PEIL)} x2={X(W)} y2={Z(PEIL)} stroke={INK} strokeWidth={2} />);
  for (let f = 1; f < nF; f++) {
    const z = PEIL + f * FLOOR_H;
    els.push(<rect key={`slab${f}`} x={X(-0.05)} y={Z(z)} width={(W + 0.1) * S} height={0.18 * S} fill="#efeae2" stroke={INK} strokeWidth={2} />);
  }

  // Bukaan yang menghadap jalan
  plan.floors.forEach((_, f) => {
    const g = floorGeometry(plan, f);
    const base = PEIL + f * FLOOR_H;
    g.openings
      .filter((o) => o.kind !== "open" && isFacadeOpening(g, o))
      .forEach((o, i) => {
        const room = g.rooms.find((r) => r.id === o.room);
        if (!room) return;
        const x = X(o.s);
        const w = (o.e - o.s) * S;
        if (o.kind === "window") {
          const sill = room.type === "km" ? 1.5 : 0.9;
          const head = 2.2;
          els.push(
            <g key={`w${f}-${i}`}>
              <rect x={x} y={Z(base + head)} width={w} height={(head - sill) * S} fill="#dfe7ec" stroke={INK} strokeWidth={2.4} />
              <line x1={x + w / 2} y1={Z(base + head)} x2={x + w / 2} y2={Z(base + sill)} stroke={INK} strokeWidth={1.6} />
              <line x1={x} y1={Z(base + head - 0.45)} x2={x + w} y2={Z(base + head - 0.45)} stroke={INK} strokeWidth={1.6} />
              <rect x={x - 6} y={Z(base + sill)} width={w + 12} height={6} fill={INK} />
            </g>,
          );
        } else {
          const head = 2.25;
          const double = o.kind === "main" && o.e - o.s >= 1.1;
          els.push(
            <g key={`d${f}-${i}`}>
              <rect x={x} y={Z(base + head)} width={w} height={head * S} fill="#e6dacb" stroke={INK} strokeWidth={2.4} />
              {double && <line x1={x + w / 2} y1={Z(base + head)} x2={x + w / 2} y2={Z(base)} stroke={INK} strokeWidth={1.6} />}
              <rect x={x + (double ? w / 2 - 14 : w - 18)} y={Z(base + 1.05)} width={8} height={3} fill={INK} />
              {double && <rect x={x + w / 2 + 6} y={Z(base + 1.05)} width={8} height={3} fill={INK} />}
            </g>,
          );
        }
      });
  });

  // Kanopi carport dan teras di lantai 1, balkon di lantai 2
  const front0 = plan.floors[0][0];
  let cx = 0;
  front0.forEach((c, i) => {
    if (c.type === "carport" || c.type === "teras") {
      const balconyAbove = nF > 1 && plan.floors[1][0].some((b) => b.type === "balkon");
      const zc = c.type === "teras" && balconyAbove ? PEIL + FLOOR_H : 3.05;
      els.push(
        <g key={`k${i}`}>
          <rect x={X(cx)} y={Z(zc)} width={c.w * S} height={0.18 * S} fill="#efeae2" stroke={INK} strokeWidth={2} />
          {[cx + 0.08, cx + c.w - 0.08].map((px) => (
            <rect key={px} x={X(px) - 7} y={Z(zc)} width={14} height={zc * S} fill={WALL} stroke={INK} strokeWidth={1.8} />
          ))}
        </g>,
      );
    }
    cx += c.w;
  });
  if (nF > 1) {
    let bx = 0;
    plan.floors[1][0].forEach((c, i) => {
      if (c.type === "balkon") {
        const z0 = PEIL + FLOOR_H + 0.18;
        els.push(
          <g key={`b${i}`}>
            <line x1={X(bx)} y1={Z(z0 + 1)} x2={X(bx + c.w)} y2={Z(z0 + 1)} stroke={INK} strokeWidth={3} />
            {Array.from({ length: Math.floor(c.w / 0.12) + 1 }, (_, k) => (
              <line key={k} x1={X(bx + k * 0.12)} y1={Z(z0)} x2={X(bx + k * 0.12)} y2={Z(z0 + 1)} stroke={THIN} strokeWidth={1.2} />
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
        <rect x={X(0)} y={Z(zt + 0.9)} width={W * S} height={0.9 * S} fill={WALL} stroke={INK} strokeWidth={3} />
        <rect x={X(-0.08)} y={Z(zt + 1)} width={(W + 0.16) * S} height={0.1 * S} fill="#d9d1c6" stroke={INK} strokeWidth={2} />
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
    const lines: ReactNode[] = [];
    for (let z = zt + 0.35; z < zt + rh - 0.1; z += 0.35) {
      const k = (z - zt) / rh;
      const xl = -OVER + (W / 2 - ridge + OVER) * k;
      const xr = W + OVER - (W / 2 - ridge + OVER) * k;
      lines.push(<line key={z} x1={X(xl)} y1={Z(z)} x2={X(xr)} y2={Z(z)} stroke="#b7aa99" strokeWidth={1.2} />);
    }
    els.push(
      <g key="roof">
        <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="#e8ddd0" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        {lines}
        <line x1={X(-OVER)} y1={Z(zt) + 8} x2={X(W + OVER)} y2={Z(zt) + 8} stroke={INK} strokeWidth={5} />
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
          <line x1={X(-1.6)} y1={y} x2={X(-0.15)} y2={y} stroke="#b9b5ae" strokeWidth={1} />
          <path d={`M${X(-1.45)} ${y}l-9 -14h18z`} fill="none" stroke={INK} strokeWidth={1.6} />
          <text x={X(-1.25)} y={y - 6} fontSize={14} fill={INK}>
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
      <rect x={0} y={0} width={size.w} height={size.h} fill="#ffffff" />
      {els}
      {titleBlock(size, t("TAMPAK DEPAN"), `${t("Atap {atap}", { atap: t(roofName(plan)) })} · ${t("{n} lantai", { n: nF })}`, t, lang)}
    </svg>
  );
}

const roofName = (plan: Plan) => (plan.brief.roof === "pelana" ? "pelana" : plan.brief.roof === "perisai" ? "perisai" : "dak datar");
